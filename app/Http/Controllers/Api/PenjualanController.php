<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Penjualan;
use App\Models\DetailPenjualan;
use App\Models\Keranjang;
use App\Models\ProdukKlinik;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class PenjualanController extends Controller
{
    /**
     * index
     * Menampilkan data penjualan (Admin)
     */
    public function index()
    {
        try {
            $penjualan = Penjualan::with(['user', 'promo', 'detailpenjualan.produk'])->latest()->get();
            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil semua data penjualan.',
                'data' => $penjualan
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data penjualan.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * updateStatus
     * Mengubah status data penjualan (Admin)
     */
    public function updateStatus(Request $request, $idPenjualan)
    {
        try {
            $validator = Validator::make($request->all(), [
                'orderStatus' => 'required|string|in:pending,diproses,dikirim,selesai,dibatalkan'
            ], [
                'orderStatus.required' => 'Status penjualan wajib diisi.',
                'orderStatus.in' => 'Status tidak valid.'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Terdapat kesalahan pada inputan Anda.',
                    'errors' => $validator->errors()
                ], 400);
            }

            $penjualan = Penjualan::find($idPenjualan);

            if (!$penjualan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data penjualan tidak ditemukan.'
                ], 404);
            }

            $penjualan->update(['orderStatus' => $request->orderStatus]);

            return response()->json([
                'success' => true,
                'message' => 'Status penjualan berhasil diperbarui.',
                'data' => $penjualan
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui status penjualan.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * destroy
     * Menghapus data penjualan (Admin)
     */
    public function destroy($idPenjualan)
    {
        try {
            $penjualan = Penjualan::find($idPenjualan);

            if (!$penjualan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data penjualan tidak ditemukan.'
                ], 404);
            }

            // Hapus relasi detail penjualan terlebih dahulu
            DetailPenjualan::where('idPenjualan', $idPenjualan)->delete();
            $penjualan->delete();

            return response()->json([
                'success' => true,
                'message' => 'Data penjualan berhasil dihapus.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus data penjualan.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * receiveItem
     * Menerima barang (Customer mengubah status dari dikirim menjadi selesai)
     */
    public function receiveItem($idPenjualan)
    {
        try {
            $idUser = auth('api')->user()->idUser;
            $penjualan = Penjualan::where('idUser', $idUser)->where('idPenjualan', $idPenjualan)->first();

            if (!$penjualan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data penjualan tidak ditemukan atau bukan milik Anda.'
                ], 404);
            }

            if ($penjualan->orderStatus !== 'dikirim') {
                return response()->json([
                    'success' => false,
                    'message' => 'Barang belum dalam status dikirim.'
                ], 400);
            }

            $penjualan->update(['orderStatus' => 'selesai']);

            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengkonfirmasi barang diterima. Terima kasih!',
                'data' => $penjualan
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengkonfirmasi barang diterima.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Memesan produk langsung (Customer)
     */
    public function orderProduct(Request $request, $idProduk)
    {
        $produk = ProdukKlinik::find($idProduk);
        if (!$produk) {
            return response()->json(['status' => 'error', 'message' => 'Produk tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'jumlah' => 'required|integer|min:1',
            'idPromo' => 'required|exists:promo,idPromo'
        ], [
            'jumlah.required' => 'Jumlah pesanan wajib diisi.',
            'jumlah.integer' => 'Jumlah pesanan harus berupa angka bulat.',
            'jumlah.min' => 'Jumlah pesanan minimal 1.',
            'idPromo.required' => 'Promo wajib dipilih.',
            'idPromo.exists' => 'Promo yang dipilih tidak valid atau tidak ditemukan.'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->errors()], 422);
        }

        $jumlah = $request->jumlah;

        if ($produk->stock < $jumlah) {
            return response()->json(['status' => 'error', 'message' => 'Stok produk tidak mencukupi'], 400);
        }

        DB::beginTransaction();
        try {
            // Kurangi stok produk
            $produk->decrement('stock', $jumlah);

            // Buat record penjualan
            $totalHarga = $produk->harga * $jumlah;
            $penjualan = Penjualan::create([
                'tanggal' => now(),
                'invoiceNumber' => 'INV-' . time() . '-' . rand(100, 999),
                'subtotal' => $totalHarga,
                'shippingCost' => 0,
                'shippingCourier' => null,
                'shippingService' => null,
                'total' => $totalHarga,
                'paymentStatus' => 'unpaid',
                'orderStatus' => 'pending',
                'idUser' => auth('api')->user()->idUser,
                'idPromo' => $request->idPromo
            ]);

            // Buat record detail penjualan
            DetailPenjualan::create([
                'jumlahProduk' => $jumlah,
                'idPenjualan' => $penjualan->idPenjualan,
                'idProduk' => $produk->idProduk
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Pesanan produk berhasil dibuat',
                'data' => $penjualan
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memproses pesanan: ' . $e->getMessage()
            ], 500);
        }
    }
}
