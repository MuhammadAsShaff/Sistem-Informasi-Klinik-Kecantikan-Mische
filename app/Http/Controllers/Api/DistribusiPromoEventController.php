<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use App\Models\Promo;
use App\Models\Kegiatan;
use App\Services\FonnteService;
use Illuminate\Support\Facades\Validator;

class DistribusiPromoEventController extends Controller
{
    /**
     * getCustomers
     * 
     * Menampilkan daftar semua customer (untuk dipilih oleh admin) saat ingin mengirim Broadcast Promo via WhatsApp.
     */
    public function getCustomers(Request $request)
    {
        $query = User::where('role', 'customer');

        // Fitur Filter: Jika admin mengetik nama di kolom pencarian
        if ($request->has('search') && $request->search != '') {
            $query->where('nama', 'like', '%' . $request->search . '%');
        }

        // Hanya mengambil ID, Nama, No WA, dan Email untuk menghemat bandwidth
        $customers = $query->get(['idUser', 'nama', 'nomorWa', 'email']);
        
        return response()->json([
            'status' => 'success',
            'data' => $customers
        ], 200);
    }

    /**
     * distributePromo
     * 
     * FITUR BROADCAST PROMO: Mengirim pesan blast via WhatsApp (menggunakan layanan pihak ke-3 "Fonnte") ke banyak customer sekaligus.
     */
    public function distributePromo(Request $request, FonnteService $fonnte)
    {
        // 1. Validasi Input Admin
        $validator = Validator::make($request->all(), [
            'idPromo' => 'required|exists:promo,idPromo',
            'type' => 'required|in:all,selected', // 'all' = Kirim ke semua orang, 'selected' = Kirim ke orang tertentu saja
            'customer_ids' => 'required_if:type,selected|array',
            'customer_ids.*' => 'exists:user,idUser'
        ], [
            'idPromo.required' => 'Promo wajib dipilih.',
            'idPromo.exists' => 'Promo tidak valid.',
            'type.required' => 'Tipe distribusi wajib diisi (all/selected).',
            'customer_ids.required_if' => 'Customer wajib dipilih jika tipe distribusi adalah selected.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()
            ], 422);
        }

        $promo = Promo::find($request->idPromo);
        
        // 2. Dapatkan data target (nomor WA & Nama) dari Helper Function di bawah
        $targets = $this->getTargetData($request);

        // Jika kebetulan tidak ada customer yang punya No WA
        if (empty($targets)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tidak ada nomor WhatsApp tujuan yang valid.'
            ], 400);
        }

        // 3. Format Target Sesuai Syarat API Fonnte
        // Fonnte meminta format string: "08123|Budi,08999|Siti" agar fitur greeting {name} berfungsi
        $formattedTargets = [];
        foreach ($targets as $t) {
            $formattedTargets[] = $t['nomorWa'] . '|' . $t['nama'];
        }
        $targetString = implode(',', $formattedTargets);

        // 4. Susun pesan Promo (Copywriting WhatsApp)
        $message = "Halo {name}! 🌟\n\n"; // {name} akan otomatis diganti oleh Fonnte sesuai nama target
        $message .= "Ada kabar gembira nih untuk kamu dari Mische Clinic!\n";
        $message .= "🎉 *{$promo->namaPromo}* 🎉\n\n";
        $message .= "_{$promo->deskripsi}_\n\n";
        
        $message .= "📌 *Detail Promo:*\n";
        $message .= "🔸 Jenis Promo: {$promo->jenisPromo}\n";
        
        // Cuma tambahkan baris Kode Promo jika memang butuh kode
        if ($promo->kode) {
            $message .= "🔸 Kode Promo: *{$promo->kode}*\n";
        }
        if ($promo->diskon) {
            $message .= "🔸 Diskon: Rp " . number_format($promo->diskon, 0, ',', '.') . "\n";
        }
        if ($promo->minimalTransaksi) {
            $message .= "🔸 Min. Transaksi: Rp " . number_format($promo->minimalTransaksi, 0, ',', '.') . "\n";
        }
        
        $statusPromo = $promo->status ? 'Aktif' : 'Tidak Aktif';
        $message .= "🔸 Status: {$statusPromo}\n";
        $message .= "🔸 Periode: {$promo->tanggalMulai} s/d {$promo->tanggalSelesai}\n\n";
        
        $message .= "Tunggu apa lagi? Yuk buruan klaim promonya sebelum kehabisan! 🥰\n\n";
        $message .= "Salam Hangat,\n*Mische Clinic*";

        // 5. Eksekusi Pengiriman menggunakan FonnteService
        $result = $fonnte->sendMessage($targetString, $message);

        return response()->json([
            'status' => 'success',
            'message' => 'Distribusi promo berhasil diproses.',
            'fonnte_response' => $result
        ], 200);
    }

    /**
     * distributeEvent
     * 
     * FITUR BROADCAST EVENT: Mirip seperti broadcast Promo, tapi ini untuk mengirim Undangan Acara.
     */
    public function distributeEvent(Request $request, FonnteService $fonnte)
    {
        $validator = Validator::make($request->all(), [
            'idEvent' => 'required|exists:event,idEvent',
            'type' => 'required|in:all,selected',
            'customer_ids' => 'required_if:type,selected|array',
            'customer_ids.*' => 'exists:user,idUser'
        ], [
            'idEvent.required' => 'Event wajib dipilih.',
            'idEvent.exists' => 'Event tidak valid.',
            'type.required' => 'Tipe distribusi wajib diisi (all/selected).',
            'customer_ids.required_if' => 'Customer wajib dipilih jika tipe distribusi adalah selected.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()
            ], 422);
        }

        $event = \App\Models\Event::find($request->idEvent);
        
        $targets = $this->getTargetData($request);

        if (empty($targets)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tidak ada nomor WhatsApp tujuan yang valid.'
            ], 400);
        }

        $formattedTargets = [];
        foreach ($targets as $t) {
            $formattedTargets[] = $t['nomorWa'] . '|' . $t['nama'];
        }
        $targetString = implode(',', $formattedTargets);

        // Susun pesan Event
        $message = "Halo {name}! ✨\n\n";
        $message .= "Mische Clinic punya acara spesial nih, dan kami sangat ingin kamu hadir!\n\n";
        $message .= "🎟️ *{$event->nama}* 🎟️\n\n";
        $message .= "_{$event->deskripsi}_\n\n";
        
        $message .= "📌 *Detail Acara:*\n";
        // Rapikan format tanggal (Jika cuma sehari, jangan tulis tanggal s/d tanggal)
        if ($event->tanggalMulai == $event->tanggalSelesai) {
            $message .= "📅 Tanggal: {$event->tanggalMulai}\n";
        } else {
            $message .= "📅 Tanggal: {$event->tanggalMulai} s/d {$event->tanggalSelesai}\n";
        }
        $message .= "📍 Lokasi: {$event->lokasi}\n\n";
        
        $message .= "Jangan sampai kelewatan ya, pastikan kamu catat tanggalnya! Sampai jumpa di sana! 👋\n\n";
        $message .= "Salam Hangat,\n*Mische Clinic*";

        $result = $fonnte->sendMessage($targetString, $message);

        return response()->json([
            'status' => 'success',
            'message' => 'Distribusi event berhasil diproses.',
            'fonnte_response' => $result
        ], 200);
    }

    /**
     * getTargetData (Helper Internal)
     * 
     * Fungsi pembantu untuk mengambil nomor WA customer yang tidak kosong.
     */
    private function getTargetData(Request $request)
    {
        // Syarat mutlak: Role Customer, WA Tidak Null, WA Tidak Kosong
        $query = User::where('role', 'customer')
                     ->whereNotNull('nomorWa')
                     ->where('nomorWa', '!=', '');

        // Jika admin memilih opsi 'selected' (centang-centang nama manual)
        if ($request->type === 'selected' && $request->has('customer_ids')) {
            $query->whereIn('idUser', $request->customer_ids);
        }

        return $query->get(['nomorWa', 'nama'])->toArray();
    }
}
