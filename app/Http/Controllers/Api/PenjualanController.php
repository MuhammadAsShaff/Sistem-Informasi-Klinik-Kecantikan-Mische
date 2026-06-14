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
use App\Models\Promo;
use App\Models\AlamatCustomer;
use Midtrans\Config;
use Midtrans\Snap;

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
                'orderStatus' => 'required|string|in:pending,diproses,dikirim,selesai,dibatalkan',
                'nomorResi' => 'nullable|string|max:255'
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

            $updateData = ['orderStatus' => $request->orderStatus];
            if ($request->has('nomorResi') && $request->orderStatus === 'dikirim') {
                $updateData['nomorResi'] = $request->nomorResi;
            }

            $penjualan->update($updateData);

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

    /**
     * Checkout dari Keranjang Belanja (E-Commerce) dengan Midtrans Snap
     */
    public function checkoutCart(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'idAlamat' => 'required|exists:alamat_customer,id',
            'shippingCourier' => 'required|string',
            'shippingService' => 'required|string',
            'shippingCost' => 'required|numeric|min:0',
            'idPromo' => 'nullable|exists:promo,idPromo'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->errors()], 422);
        }

        $idUser = auth('api')->user()->idUser;

        // Validasi Alamat milik user
        $alamat = AlamatCustomer::where('id', $request->idAlamat)->where('idUser', $idUser)->first();
        if (!$alamat) {
            return response()->json(['status' => 'error', 'message' => 'Alamat tidak ditemukan atau bukan milik Anda.'], 403);
        }

        // Ambil data keranjang
        $keranjangItems = Keranjang::with('produk')->where('idUser', $idUser)->get();
        if ($keranjangItems->isEmpty()) {
            return response()->json(['status' => 'error', 'message' => 'Keranjang Anda kosong.'], 400);
        }

        // Kalkulasi Subtotal & Stok
        $subtotal = 0;
        foreach ($keranjangItems as $item) {
            if ($item->produk->stock < $item->jumlahProduk) {
                return response()->json(['status' => 'error', 'message' => 'Stok produk ' . $item->produk->nama . ' tidak mencukupi'], 400);
            }
            $subtotal += $item->jumlahProduk * $item->produk->harga;
        }

        // Kalkulasi Promo (Diskon)
        $diskon = 0;
        if ($request->idPromo) {
            $promo = Promo::find($request->idPromo);
            if ($subtotal >= $promo->minimalTransaksi) {
                if (strtolower($promo->jenisPromo) === 'persen' || strtolower($promo->jenisPromo) === 'persentase') {
                    $diskon = $subtotal * ($promo->diskon / 100);
                } else {
                    $diskon = $promo->diskon; // nominal
                }
            } else {
                return response()->json(['status' => 'error', 'message' => 'Subtotal tidak memenuhi minimal transaksi promo ini.'], 400);
            }
        }

        $total = $subtotal + $request->shippingCost - $diskon;
        if ($total < 0) $total = 0; // Cegah total minus

        DB::beginTransaction();
        try {
            $invoiceNumber = 'INV-' . time() . '-' . rand(100, 999);
            
            // Simpan ke tabel penjualan
            $penjualan = Penjualan::create([
                'tanggal' => now(),
                'invoiceNumber' => $invoiceNumber,
                'subtotal' => $subtotal,
                'shippingCost' => $request->shippingCost,
                'shippingCourier' => $request->shippingCourier,
                'shippingService' => $request->shippingService,
                'total' => $total,
                'paymentStatus' => 'unpaid',
                'orderStatus' => 'pending',
                'idUser' => $idUser,
                'idPromo' => $request->idPromo,
                'idAlamat' => $request->idAlamat
            ]);

            // Simpan detail penjualan & kurangi stok
            foreach ($keranjangItems as $item) {
                $item->produk->decrement('stock', $item->jumlahProduk);
                DetailPenjualan::create([
                    'jumlahProduk' => $item->jumlahProduk,
                    'idPenjualan' => $penjualan->idPenjualan,
                    'idProduk' => $item->idProduk
                ]);
            }

            // Hapus isi keranjang setelah dipindah ke penjualan
            Keranjang::where('idUser', $idUser)->delete();

            // Set konfigurasi Midtrans
            Config::$serverKey = config('midtrans.server_key');
            Config::$isProduction = config('midtrans.is_production');
            Config::$isSanitized = config('midtrans.is_sanitized');
            Config::$is3ds = config('midtrans.is_3ds');

            // Persiapkan parameter untuk Midtrans Snap
            $params = [
                'transaction_details' => [
                    'order_id' => $invoiceNumber,
                    'gross_amount' => $total,
                ],
                'customer_details' => [
                    'first_name' => auth('api')->user()->nama,
                    'email' => auth('api')->user()->email,
                    'phone' => auth('api')->user()->nomorWa,
                ],
            ];

            // Dapatkan Snap Token dari Midtrans
            $snapToken = Snap::getSnapToken($params);
            
            // Simpan token ke database untuk referensi
            $penjualan->update(['snapToken' => $snapToken]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Checkout berhasil, silakan lakukan pembayaran.',
                'data' => [
                    'penjualan' => $penjualan,
                    'snap_token' => $snapToken
                ]
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat checkout: ' . $e->getMessage()
            ], 500);
        }
    }
}
