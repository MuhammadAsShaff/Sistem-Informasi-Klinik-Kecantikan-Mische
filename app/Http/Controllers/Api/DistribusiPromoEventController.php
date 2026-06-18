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
     * Menampilkan daftar customer untuk dipilih saat distribusi
     */
    public function getCustomers(Request $request)
    {
        $query = User::where('role', 'customer');

        // Jika ada input pencarian dari frontend
        if ($request->has('search') && $request->search != '') {
            $query->where('nama', 'like', '%' . $request->search . '%');
        }

        $customers = $query->get(['idUser', 'nama', 'nomorWa', 'email']);
        
        return response()->json([
            'status' => 'success',
            'data' => $customers
        ], 200);
    }

    /**
     * Mendistribusikan Promo via WhatsApp
     */
    public function distributePromo(Request $request, FonnteService $fonnte)
    {
        $validator = Validator::make($request->all(), [
            'idPromo' => 'required|exists:promo,idPromo',
            'type' => 'required|in:all,selected',
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
        
        // Dapatkan data target (nomor WA & Nama)
        $targets = $this->getTargetData($request);

        if (empty($targets)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tidak ada nomor WhatsApp tujuan yang valid.'
            ], 400);
        }

        // Format target Fonnte (nomor|nama)
        $formattedTargets = [];
        foreach ($targets as $t) {
            $formattedTargets[] = $t['nomorWa'] . '|' . $t['nama'];
        }
        $targetString = implode(',', $formattedTargets);

        // Susun pesan Promo dengan Personalisasi {name}
        $message = "Halo {name}! 🌟\n\n";
        $message .= "Ada kabar gembira nih untuk kamu dari Mische Clinic!\n";
        $message .= "🎉 *{$promo->namaPromo}* 🎉\n\n";
        $message .= "_{$promo->deskripsi}_\n\n";
        
        $message .= "📌 *Detail Promo:*\n";
        $message .= "🔸 Jenis Promo: {$promo->jenisPromo}\n";
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

        // Kirim menggunakan Fonnte
        $result = $fonnte->sendMessage($targetString, $message);

        return response()->json([
            'status' => 'success',
            'message' => 'Distribusi promo berhasil diproses.',
            'fonnte_response' => $result
        ], 200);
    }

    /**
     * Mendistribusikan Event/Kegiatan via WhatsApp
     */
    public function distributeEvent(Request $request, FonnteService $fonnte)
    {
        $validator = Validator::make($request->all(), [
            'idKegiatan' => 'required|exists:kegiatan,idKegiatan',
            'type' => 'required|in:all,selected',
            'customer_ids' => 'required_if:type,selected|array',
            'customer_ids.*' => 'exists:user,idUser'
        ], [
            'idKegiatan.required' => 'Event/Kegiatan wajib dipilih.',
            'idKegiatan.exists' => 'Event/Kegiatan tidak valid.',
            'type.required' => 'Tipe distribusi wajib diisi (all/selected).',
            'customer_ids.required_if' => 'Customer wajib dipilih jika tipe distribusi adalah selected.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()
            ], 422);
        }

        $kegiatan = Kegiatan::find($request->idKegiatan);
        
        // Dapatkan data target (nomor WA & Nama)
        $targets = $this->getTargetData($request);

        if (empty($targets)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tidak ada nomor WhatsApp tujuan yang valid.'
            ], 400);
        }

        // Format target Fonnte (nomor|nama)
        $formattedTargets = [];
        foreach ($targets as $t) {
            $formattedTargets[] = $t['nomorWa'] . '|' . $t['nama'];
        }
        $targetString = implode(',', $formattedTargets);

        // Susun pesan Event dengan Personalisasi {name}
        $message = "Halo {name}! ✨\n\n";
        $message .= "Mische Clinic punya acara spesial nih, dan kami sangat ingin kamu hadir!\n\n";
        $message .= "🎟️ *{$kegiatan->namaKegiatan}* 🎟️\n\n";
        $message .= "_{$kegiatan->deskripsi}_\n\n";
        
        $message .= "📌 *Detail Acara:*\n";
        $message .= "📅 Tanggal: {$kegiatan->tanggalKegiatan}\n";
        $message .= "📍 Lokasi: Klinik Mische (Atau lokasi yang ditentukan)\n\n";
        
        $message .= "Jangan sampai kelewatan ya, pastikan kamu catat tanggalnya! Sampai jumpa di sana! 👋\n\n";
        $message .= "Salam Hangat,\n*Mische Clinic*";

        // Kirim menggunakan Fonnte
        $result = $fonnte->sendMessage($targetString, $message);

        return response()->json([
            'status' => 'success',
            'message' => 'Distribusi event berhasil diproses.',
            'fonnte_response' => $result
        ], 200);
    }

    /**
     * Helper untuk mengambil data target (WA & Nama) berdasarkan tipe distribusi
     */
    private function getTargetData(Request $request)
    {
        $query = User::where('role', 'customer')
                     ->whereNotNull('nomorWa')
                     ->where('nomorWa', '!=', '');

        if ($request->type === 'selected' && $request->has('customer_ids')) {
            $query->whereIn('idUser', $request->customer_ids);
        }

        return $query->get(['nomorWa', 'nama'])->toArray();
    }
}
