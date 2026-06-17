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
     * Memasukkan atau mengubah nomor resi pesanan
     */
    public function inputResi(Request $request, $idPenjualan)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nomorResi' => 'required|string|max:100'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors'  => $validator->errors()
                ], 400);
            }

            $penjualan = Penjualan::find($idPenjualan);

            if (!$penjualan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Penjualan tidak ditemukan'
                ], 404);
            }

            // Update nomor resi, otomatis set status ke dikirim jika belum dikirim atau selesai
            $updateData = ['nomorResi' => $request->nomorResi];
            if ($penjualan->orderStatus !== 'selesai') {
                $updateData['orderStatus'] = 'dikirim';
            }

            $penjualan->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Nomor resi berhasil disimpan',
                'data'    => $penjualan
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan resi',
                'error'   => $e->getMessage()
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
                'invoiceNumber' => $this->generateInvoiceNumber(),
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
            'idPromo' => 'nullable|exists:promo,idPromo',
            'cart_ids' => 'required|array',
            'cart_ids.*' => 'integer|exists:keranjang,idKeranjang'
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

        // Ambil data keranjang yang dipilih saja
        $keranjangItems = Keranjang::with('produk')->where('idUser', $idUser)->whereIn('idKeranjang', $request->cart_ids)->get();
        if ($keranjangItems->isEmpty() || count($keranjangItems) !== count($request->cart_ids)) {
            return response()->json(['status' => 'error', 'message' => 'Beberapa item keranjang tidak valid atau kosong.'], 400);
        }

        // Kalkulasi Subtotal & Stok
        $subtotal = 0;
        foreach ($keranjangItems as $item) {
            if ($item->produk->stock < $item->jumlahProduk) {
                return response()->json(['status' => 'error', 'message' => 'Stok produk ' . $item->produk->nama . ' tidak mencukupi'], 400);
            }
            $subtotal += $item->jumlahProduk * $item->produk->harga;
        }

        // Kalkulasi Promo (Diskon) & Bonus
        $diskon = 0;
        $idProdukBonus = null;
        if ($request->idPromo) {
            $promo = Promo::find($request->idPromo);
            if ($subtotal >= $promo->minimalTransaksi) {
                $jenisPromoLower = strtolower($promo->jenisPromo);
                if ($jenisPromoLower === 'diskon persen' || $jenisPromoLower === 'persen' || $jenisPromoLower === 'persentase') {
                    $diskon = $subtotal * ($promo->diskon / 100);
                } elseif ($jenisPromoLower === 'potongan harga' || $jenisPromoLower === 'nominal') {
                    $diskon = $promo->diskon;
                } elseif ($jenisPromoLower === 'gratis produk') {
                    if (is_null($promo->idProduk)) {
                        return response()->json(['status' => 'error', 'message' => 'Konfigurasi promo tidak valid.'], 400);
                    }
                    $idProdukBonus = $promo->idProduk;
                    $diskon = 0; // Tidak memotong total bayar
                } else {
                    $diskon = $promo->diskon; // Fallback
                }
            } else {
                return response()->json(['status' => 'error', 'message' => 'Subtotal tidak memenuhi minimal transaksi promo ini.'], 400);
            }
        }

        $total = $subtotal + $request->shippingCost - $diskon;
        if ($total < 0) $total = 0; // Cegah total minus

        DB::beginTransaction();
        try {
            $invoiceNumber = $this->generateInvoiceNumber();
            
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

            // Tambahkan produk bonus jika promo Gratis Produk berlaku
            if ($idProdukBonus) {
                $produkBonus = App\Models\ProdukKlinik::find($idProdukBonus);
                if ($produkBonus && $produkBonus->stock >= 1) {
                    $produkBonus->decrement('stock', 1);
                    DetailPenjualan::create([
                        'jumlahProduk' => 1,
                        'idPenjualan' => $penjualan->idPenjualan,
                        'idProduk' => $idProdukBonus
                    ]);
                }
            }

            // Kosongkan item keranjang yang dipilih saja
            Keranjang::whereIn('idKeranjang', $request->cart_ids)->delete();

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

    /**
     * Helper untuk membuat nomor invoice unik dengan format INV-YYYYMMDD-0001
     */
    private function generateInvoiceNumber()
    {
        $todayDate = now()->format('Ymd');
        $lastPenjualan = Penjualan::whereDate('tanggal', now()->toDateString())->latest('idPenjualan')->first();
        
        $sequence = 1;
        if ($lastPenjualan && preg_match('/INV-' . $todayDate . '-(\d+)/', $lastPenjualan->invoiceNumber, $matches)) {
            $sequence = intval($matches[1]) + 1;
        }
        
        return 'INV-' . $todayDate . '-' . str_pad($sequence, 4, '0', STR_PAD_LEFT);
    }
}
