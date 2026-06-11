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
        
        // Dapatkan nomor WA target
        $targetNumbers = $this->getTargetNumbers($request);

        if (empty($targetNumbers)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tidak ada nomor WhatsApp tujuan yang valid.'
            ], 400);
        }

        // Susun pesan Promo
        $message = "Halo Sahabat Mische!\n\n";
        $message .= "🎉 *Info Promo Menarik: {$promo->namaPromo}* 🎉\n\n";
        $message .= "{$promo->deskripsi}\n\n";
        
        if ($promo->kode) {
            $message .= "Gunakan Kode: *{$promo->kode}*\n";
        }
        if ($promo->diskon) {
            $message .= "Diskon: Rp " . number_format($promo->diskon, 0, ',', '.') . "\n";
        }
        $message .= "Periode: {$promo->tanggalMulai} s/d {$promo->tanggalSelesai}\n\n";
        $message .= "Yuk buruan klaim promonya sebelum kehabisan! Hubungi kami untuk informasi lebih lanjut.";

        // Kirim menggunakan Fonnte (bisa multiple targets dipisah koma)
        $targetString = implode(',', $targetNumbers);
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
        
        // Dapatkan nomor WA target
        $targetNumbers = $this->getTargetNumbers($request);

        if (empty($targetNumbers)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tidak ada nomor WhatsApp tujuan yang valid.'
            ], 400);
        }

        // Susun pesan Event
        $message = "Halo Sahabat Mische!\n\n";
        $message .= "✨ *Info Event Terkini: {$kegiatan->namaKegiatan}* ✨\n\n";
        $message .= "{$kegiatan->deskripsi}\n\n";
        $message .= "Tanggal Pelaksanaan: {$kegiatan->tanggalKegiatan}\n\n";
        $message .= "Jangan lewatkan event seru ini! Kami tunggu kehadiranmu ya.";

        // Kirim menggunakan Fonnte
        $targetString = implode(',', $targetNumbers);
        $result = $fonnte->sendMessage($targetString, $message);

        return response()->json([
            'status' => 'success',
            'message' => 'Distribusi event berhasil diproses.',
            'fonnte_response' => $result
        ], 200);
    }

    /**
     * Helper untuk mengambil nomor WA berdasarkan tipe distribusi
     */
    private function getTargetNumbers(Request $request)
    {
        $query = User::where('role', 'customer')->whereNotNull('nomorWa')->where('nomorWa', '!=', '');

        if ($request->type === 'selected' && $request->has('customer_ids')) {
            $query->whereIn('idUser', $request->customer_ids);
        }

        return $query->pluck('nomorWa')->toArray();
    }
}
