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
use App\Services\MidtransService;

class PenjualanController extends Controller
{
    /**
     * index
     * Menampilkan semua data penjualan (Biasanya digunakan oleh Admin untuk melihat riwayat semua transaksi)
     */
    public function index()
    {
        try {
            // Mengambil semua data dari tabel penjualan sekaligus mengambil relasi ke tabel user, promo, produk, dan alamat agar data tampil lengkap
            $penjualan = Penjualan::with(['user', 'promo', 'detailpenjualan.produk', 'alamat'])->latest()->get();
            
            // Jika berhasil, kirim response JSON dengan status 200 (OK)
            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil semua data penjualan.',
                'data' => $penjualan
            ], 200);
        } catch (\Exception $e) {
            // Jika ada error pada database atau server, tangkap errornya dan kirim response 500 (Server Error)
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data penjualan.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * updateStatus
     * Fungsi bagi Admin untuk mengubah status perjalanan pesanan (Misal dari diproses menjadi dikirim)
     */
    public function updateStatus(Request $request, $idPenjualan)
    {
        try {
            // Memvalidasi bahwa status yang dikirim admin harus salah satu dari daftar enum yang valid
            $validator = Validator::make($request->all(), [
                'orderStatus' => 'required|string|in:pending,diproses,dikirim,selesai,dibatalkan',
                'nomorResi' => 'nullable|string|max:255'
            ], [
                'orderStatus.required' => 'Status penjualan wajib diisi.',
                'orderStatus.in' => 'Status tidak valid.'
            ]);

            // Jika inputan admin tidak memenuhi aturan validasi, tolak dengan status 400 (Bad Request)
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Terdapat kesalahan pada inputan Anda.',
                    'errors' => $validator->errors()
                ], 400);
            }

            // Mencari transaksi penjualan berdasarkan ID yang dilempar dari URL
            $penjualan = Penjualan::find($idPenjualan);

            if (!$penjualan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data penjualan tidak ditemukan.'
                ], 404);
            }

            // Memperbarui hanya field orderStatus di database
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
     * inputResi
     * Fungsi khusus untuk Admin memasukkan nomor resi ekspedisi setelah barang dipaketkan
     */
    public function inputResi(Request $request, $idPenjualan)
    {
        try {
            // Memastikan admin benar-benar mengetikkan nomor resi (tidak boleh kosong)
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

            // Menyiapkan data resi yang akan disimpan
            $updateData = ['nomorResi' => $request->nomorResi];
            
            // Logika otomatis: Jika barang tadinya belum selesai, maka saat diinput resi, statusnya otomatis berubah jadi "dikirim"
            if ($penjualan->orderStatus !== 'selesai') {
                $updateData['orderStatus'] = 'dikirim';
            }

            // Simpan perubahan ke database
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
     * Fungsi bagi Admin untuk menghapus data penjualan secara permanen
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

            // Logika penting: Hapus dulu data anaknya (Detail Penjualan) agar tidak terjadi data yatim/orphan (Relasi Database)
            DetailPenjualan::where('idPenjualan', $idPenjualan)->delete();
            
            // Setelah detailnya dihapus, baru hapus data induknya
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
     * Fungsi bagi Customer untuk melakukan konfirmasi bahwa paket sudah mendarat dengan aman (Selesai)
     */
     public function receiveItem(Request $request, $idPenjualan)
    {
        try {
            // Mengambil ID User dari token JWT yang sedang login saat ini (Keamanan)
            $idUser = auth('api')->user()->idUser;
            
            // Mencari transaksi yang ID-nya cocok dan benar-benar milik User yang sedang login
            $penjualan = Penjualan::where('idUser', $idUser)->where('idPenjualan', $idPenjualan)->first();

            // Jika tidak ketemu, berarti transaksinya milik orang lain atau ID salah
            if (!$penjualan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data penjualan tidak ditemukan atau bukan milik Anda.'
                ], 404);
            }

            // Fitur tambahan: Jika customer ingin membatalkan pesanan (bukan menerima)
            if ($request->action === 'cancel') {
                // Pesanan cuma bisa dibatalkan jika belum dikirim kurir
                if ($penjualan->orderStatus !== 'pending' && $penjualan->orderStatus !== 'diproses') {
                    return response()->json([
                        'success' => false,
                        'message' => 'Hanya pesanan yang belum dikirim yang dapat dibatalkan.'
                    ], 400);
                }

                // Memulai mode Transaksi Database (Mencegah data setengah masuk)
                DB::beginTransaction();
                try {
                    // Update status transaksi jadi batal dan pembayarannya dianggap gagal
                    $penjualan->update(['orderStatus' => 'dibatalkan', 'paymentStatus' => 'failed']);
                    
                    // Kembalikan stok (Restore Stock) karena barangnya tidak jadi dibeli
                    $detailPenjualan = DetailPenjualan::where('idPenjualan', $idPenjualan)->get();
                    foreach ($detailPenjualan as $detail) {
                        $produk = ProdukKlinik::find($detail->idProduk);
                        if ($produk) {
                            $produk->increment('stock', $detail->jumlahProduk);
                        }
                    }

                    // Terapkan semua perubahan di atas ke database secara permanen
                    DB::commit();
                    return response()->json([
                        'success' => true,
                        'message' => 'Pesanan berhasil dibatalkan.'
                    ], 200);
                } catch (\Exception $e) {
                    // Jika ada error di tengah jalan, batalkan semua proses manipulasi stok dan status di atas
                    DB::rollBack();
                    throw $e;
                }
            }

            // Jika requestnya adalah menerima barang, pastikan status barang sudah dikirim oleh admin
            if ($penjualan->orderStatus !== 'dikirim') {
                return response()->json([
                    'success' => false,
                    'message' => 'Barang belum dalam status dikirim.'
                ], 400);
            }

            // Jika lolos validasi, ubah status pesanan menjadi Selesai
            $penjualan->update(['orderStatus' => 'selesai']);

            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengkonfirmasi barang diterima. Terima kasih!',
                'data' => $penjualan
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses permintaan.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * orderProduct
     * Fungsi untuk Beli Langsung (tanpa lewat keranjang)
     */
    public function orderProduct(Request $request, $idProduk)
    {
        // Cek apakah produk yang mau dibeli tersedia di database
        $produk = ProdukKlinik::find($idProduk);
        if (!$produk) {
            return response()->json(['status' => 'error', 'message' => 'Produk tidak ditemukan'], 404);
        }

        // Validasi form pembelian dari customer
        $validator = Validator::make($request->all(), [
            'jumlah' => 'required|integer|min:1',
            'idPromo' => 'required|exists:promo,idPromo'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->errors()], 422);
        }

        $jumlah = $request->jumlah;

        // Mengecek ketersediaan fisik stok produk sebelum uang ditransfer
        if ($produk->stock < $jumlah) {
            return response()->json(['status' => 'error', 'message' => 'Stok produk tidak mencukupi'], 400);
        }

        // Menggunakan Transaksi Database agar tidak terjadi kebocoran stok jika script gagal di tengah jalan
        DB::beginTransaction();
        try {
            // 1. Kurangi stok produk secara langsung
            $produk->decrement('stock', $jumlah);

            // 2. Buat record penjualan induk (Nota / Invoice)
            $totalHarga = $produk->harga * $jumlah;
            $penjualan = Penjualan::create([
                'tanggal' => now(),
                'invoiceNumber' => $this->generateInvoiceNumber(),
                'subtotal' => $totalHarga,
                'shippingCost' => 0, // Default 0 jika ini asumsikan ambil di klinik, atau belum diset
                'shippingCourier' => null,
                'shippingService' => null,
                'total' => $totalHarga,
                'paymentStatus' => 'unpaid',
                'orderStatus' => 'pending',
                'idUser' => auth('api')->user()->idUser, // Siapa yang beli?
                'idPromo' => $request->idPromo
            ]);

            // 3. Buat rincian isi dari nota tersebut (Produk A jumlahnya X)
            DetailPenjualan::create([
                'jumlahProduk' => $jumlah,
                'idPenjualan' => $penjualan->idPenjualan,
                'idProduk' => $produk->idProduk
            ]);

            // Sahkan transaksi
            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Pesanan produk berhasil dibuat',
                'data' => $penjualan
            ], 201);

        } catch (\Exception $e) {
            // Batalkan semua (stok kembali semula) jika error
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memproses pesanan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * checkoutCart
     * Fungsi Checkout Utama (Mengubah isi keranjang menjadi Invoice dan meminta Midtrans Payment Link)
     * Ini fungsi paling kompleks dan paling penting untuk E-Commerce!
     */
    public function checkoutCart(Request $request, MidtransService $midtransService)
    {
        // 1. Memvalidasi bahwa customer mengirimkan data pengiriman yang lengkap
        $validator = Validator::make($request->all(), [
            'idAlamat' => 'required|exists:alamat_customer,id',
            'shippingCourier' => 'required|string',
            'shippingService' => 'required|string',
            'shippingCost' => 'required|numeric|min:0',
            'idPromo' => 'nullable|exists:promo,idPromo',
            'cart_ids' => 'required|array',          // Daftar ID keranjang yang di-ceklis customer
            'cart_ids.*' => 'integer|exists:keranjang,idKeranjang',
            'paymentMethod' => 'nullable|array',     // Misal: ['gopay', 'bca_va']
            'paymentMethod.*' => 'string'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->errors()], 422);
        }

        // 2. Keamanan: Ambil ID Customer dari sesi JWT yang aktif
        $idUser = auth('api')->user()->idUser;

        // 3. Validasi Keamanan: Pastikan alamat yang dikirim adalah milik user tersebut (Bukan hacking ID)
        $alamat = AlamatCustomer::where('id', $request->idAlamat)->where('idUser', $idUser)->first();
        if (!$alamat) {
            return response()->json(['status' => 'error', 'message' => 'Alamat tidak ditemukan atau bukan milik Anda.'], 403);
        }

        // 4. Ambil isi keranjang HANYA yang di-ceklis (cart_ids) dari database
        $keranjangItems = Keranjang::with('produk')->where('idUser', $idUser)->whereIn('idKeranjang', $request->cart_ids)->get();
        
        // Pastikan jumlah item yang ditarik dari DB sama dengan jumlah yang dikirim customer (Mencegah keranjang kosong)
        if ($keranjangItems->isEmpty() || count($keranjangItems) !== count($request->cart_ids)) {
            return response()->json(['status' => 'error', 'message' => 'Beberapa item keranjang tidak valid atau kosong.'], 400);
        }

        // 5. Tahap Kalkulasi Subtotal & Pengecekan Stok per Item di keranjang
        $subtotal = 0;
        foreach ($keranjangItems as $item) {
            if ($item->produk->stock < $item->jumlahProduk) {
                // Jika stok kehabisan saat orang sedang antri checkout
                return response()->json(['status' => 'error', 'message' => 'Stok produk ' . $item->produk->nama . ' tidak mencukupi'], 400);
            }
            // Hitung subtotal berjalan (harga * kuantitas)
            $subtotal += $item->jumlahProduk * $item->produk->harga;
        }

        // 6. Tahap Kalkulasi Promo (Diskon / Gratis Produk)
        $diskon = 0;
        $idProdukBonus = null;
        
        if ($request->idPromo) {
            $promo = Promo::find($request->idPromo);
            
            // Cek apakah belanjaannya cukup untuk syarat promo
            if ($subtotal >= $promo->minimalTransaksi) {
                $jenisPromoLower = strtolower($promo->jenisPromo);
                
                // Jika promo berupa potongan persen
                if ($jenisPromoLower === 'diskon persen' || $jenisPromoLower === 'persen' || $jenisPromoLower === 'persentase') {
                    $diskon = $subtotal * ($promo->diskon / 100);
                } 
                // Jika promo berupa nominal rupiah (contoh: potong Rp 50.000)
                elseif ($jenisPromoLower === 'potongan harga' || $jenisPromoLower === 'nominal') {
                    $diskon = $promo->diskon;
                } 
                // Jika promo berupa produk gratisan (buy 1 get 1 dsb)
                elseif ($jenisPromoLower === 'gratis produk') {
                    if (is_null($promo->idProduk)) {
                        return response()->json(['status' => 'error', 'message' => 'Konfigurasi promo tidak valid.'], 400);
                    }
                    $idProdukBonus = $promo->idProduk; // Simpan ID produk bonus
                    $diskon = 0; // Tidak memotong total bayar uangnya
                } else {
                    $diskon = $promo->diskon; // Fallback aman
                }
            } else {
                // Tolak transaksi jika nilai keranjang di bawah minimal syarat voucher
                return response()->json(['status' => 'error', 'message' => 'Subtotal tidak memenuhi minimal transaksi promo ini.'], 400);
            }
        }

        // 7. Kalkulasi Grand Total = Harga Barang + Ongkir - Voucher Diskon
        $total = $subtotal + $request->shippingCost - $diskon;
        if ($total < 0) $total = 0; // Cegah total minus (Nanti aplikasinya yang utang ke pelanggan)

        // 8. Eksekusi Penyimpanan Database Terpusat (Mencegah data korup)
        DB::beginTransaction();
        try {
            // Buat ID Invoice unik
            $invoiceNumber = $this->generateInvoiceNumber();
            
            // A. Simpan data induk Penjualan
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

            // B. Simpan daftar barang yang dibeli ke tabel Detail Penjualan dan Kurangi Stoknya
            foreach ($keranjangItems as $item) {
                $item->produk->decrement('stock', $item->jumlahProduk);
                DetailPenjualan::create([
                    'jumlahProduk' => $item->jumlahProduk,
                    'idPenjualan' => $penjualan->idPenjualan,
                    'idProduk' => $item->idProduk
                ]);
            }

            // C. Injeksi barang gratisan jika promo Gratis Produk berlaku
            if ($idProdukBonus) {
                // Memanggil spesifik model ProdukKlinik
                $produkBonus = App\Models\ProdukKlinik::find($idProdukBonus);
                // Hanya injeksi jika stok barang bonus masih ada
                if ($produkBonus && $produkBonus->stock >= 1) {
                    $produkBonus->decrement('stock', 1);
                    DetailPenjualan::create([
                        'jumlahProduk' => 1,
                        'idPenjualan' => $penjualan->idPenjualan,
                        'idProduk' => $idProdukBonus
                    ]);
                }
            }

            // D. Bersihkan / Hapus barang yang sudah berhasil di-checkout dari Keranjang User
            Keranjang::whereIn('idKeranjang', $request->cart_ids)->delete();

            // 9. Komunikasi dengan API MIDTRANS untuk mendapatkan Token Pembayaran (Link Bayar)
            $paymentMethods = $request->input('paymentMethod', null);
            // $midtransService adalah class buatan sendiri untuk menyembunyikan kerumitan curl Midtrans
            $snapToken = $midtransService->createSnapToken($invoiceNumber, $total, auth('api')->user(), $paymentMethods);
            
            // Simpan token snap dari Midtrans ke database kita sebagai jejak
            $penjualan->update(['snapToken' => $snapToken]);

            // Jika semua langkah (A-D dan Midtrans) sukses, Patenkan perubahan Database!
            DB::commit();

            // Kembalikan Token tersebut ke Frontend (React) agar frontend bisa memunculkan popup pembayaran
            return response()->json([
                'status' => 'success',
                'message' => 'Checkout berhasil, silakan lakukan pembayaran.',
                'data' => [
                    'penjualan' => $penjualan,
                    'snap_token' => $snapToken
                ]
            ], 201);
            
        } catch (\Exception $e) {
            // Jika tiba-tiba koneksi mati atau Midtrans error, kembalikan stok barang yang sudah sempat dipotong
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat checkout: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * getCustomerOrders
     * Menampilkan riwayat belanjaan khusus untuk customer yang sedang login di HP/Webnya sendiri
     */
    public function getCustomerOrders()
    {
        try {
            // Deteksi siapa yang sedang memanggil API ini berdasarkan Token JWT
            $user = auth('api')->user();

            // Mengambil seluruh data belanjaan dari yang terbaru ('desc'), beserta relasi data terkait
            $orders = Penjualan::with(['detailPenjualan.produk', 'promo', 'alamat'])
                ->where('idUser', $user->idUser)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $orders
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil riwayat pesanan: ' . $e->getMessage()
            ], 500);
        }
    }


    /**
     * Helper untuk membuat nomor invoice unik secara otomatis (Misal: INV-20231225-0001)
     */
    private function generateInvoiceNumber()
    {
        // Ambil tanggal hari ini dalam format Angka nyambung (YYYYMMDD)
        $todayDate = now()->format('Ymd');
        
        // Cari nota terakhir yang dibuat di hari ini
        $lastPenjualan = Penjualan::whereDate('tanggal', now()->toDateString())->latest('idPenjualan')->first();
        
        $sequence = 1; // Mulai dari urutan 1
        
        // Jika hari ini sudah ada nota sebelumnya, ekstrak angkanya dan tambahkan + 1
        if ($lastPenjualan && preg_match('/INV-' . $todayDate . '-(\d+)/', $lastPenjualan->invoiceNumber, $matches)) {
            $sequence = intval($matches[1]) + 1;
        }
        
        // Kembalikan format string dengan padding 0 di kiri (0001, 0002, dst)
        return 'INV-' . $todayDate . '-' . str_pad($sequence, 4, '0', STR_PAD_LEFT);
    }
}

