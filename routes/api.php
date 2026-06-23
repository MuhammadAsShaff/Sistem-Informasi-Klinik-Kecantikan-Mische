<?php

use App\Http\Controllers\Api\AutentikasiController;
use App\Http\Controllers\Api\ProfilCustomerController;
use App\Http\Controllers\Api\AlamatCustomerController;
use App\Http\Controllers\Api\ProfilePerusahaanController;
use App\Http\Controllers\Api\KelolaUserController;
use App\Http\Controllers\Api\JadwalReservasiController;
use App\Http\Controllers\Api\ProfilAdminController;
use App\Http\Controllers\Api\ProfilDokterController;
use App\Http\Controllers\Api\KegiatanController;
use App\Http\Controllers\Api\ReservasiController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\PromoController;
use App\Http\Controllers\Api\KategoriProdukController;
use App\Http\Controllers\Api\ProdukKlinikController;
use App\Http\Controllers\Api\DistribusiPromoEventController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\KeranjangController;
use App\Http\Controllers\Api\PenjualanController;
use App\Http\Controllers\Api\RajaOngkirController;
use App\Http\Controllers\Api\MidtransController;
use Illuminate\Support\Facades\Route;

/**
 * ============================================
 * 🔐 AREA AUTENTIKASI (Proses Log Masuk & Daftar)
 * Prefix URL: /api/auth/...
 * ============================================
 */
Route::prefix('auth')->group(function () {
    // [POST] Endpoint untuk pendaftaran akun customer baru
    Route::post('/register', [AutentikasiController::class, 'registerUser'])->name('auth.register');

    // [POST] Endpoint login. Dilengkapi Rate Limiter: Maksimal 5x percobaan Login dalam 1 menit (Mencegah Brute Force Password)
    Route::post('/login', [AutentikasiController::class, 'loginUser'])
         ->middleware('throttle:5,1')
         ->name('auth.login');

    // [POST] Endpoint untuk keluar dari sesi (menghapus token aktif)
    Route::post('/logout', [AutentikasiController::class, 'logoutUser'])->name('auth.logout');
    
    // [GET] Endpoint untuk mengambil data profil user yang sedang login (berdasarkan Bearer Token)
    Route::get('/me', [AutentikasiController::class, 'getUserProfile'])->name('auth.me');

    // [POST] Endpoint reset password. Rate Limiter: Maksimal 3x percobaan Reset Sandi dalam 1 menit
    Route::post('/reset-password', [AutentikasiController::class, 'resetPassword'])
         ->middleware('throttle:3,1')
         ->name('auth.reset-password');
});

/**
 * ============================================
 * 🌍 AREA PUBLIC / CUSTOMER (Bebas Akses atau Role Customer)
 * Prefix URL: /api/customer/...
 * ============================================
 */
Route::prefix('customer')->group(function () {

    // [GET] Menampilkan identitas dan profil klinik ke halaman beranda public
    Route::get('clinic', [ProfilePerusahaanController::class, 'getPublicProfile'])->name('customer.clinic');
    
    // [GET] Menampilkan daftar jadwal (jam) yang tersedia untuk reservasi
    Route::get('schedules', [JadwalReservasiController::class, 'getPublicSchedule'])->name('customer.schedules');

    // -- Rute Publik: DOKTER --
    Route::prefix('doctors')->group(function () {
        // [GET] Ambil semua dokter aktif
        Route::get('/', [ProfilDokterController::class, 'getPublicDoctors'])->name('customer.doctors');
        // [GET] Ambil detail 1 dokter spesifik
        Route::get('/{idDokter}', [ProfilDokterController::class, 'getDoctorById'])->name('customer.doctorById');
    });

    // -- Rute Publik: EVENT --
    Route::prefix('event')->group(function () {
        // [GET] Ambil semua event klinik yang sedang berjalan
        Route::get('/', [EventController::class, 'getPublicEvents'])->name('customer.events');
        // [GET] Detail event spesifik
        Route::get('/{idEvent}', [EventController::class, 'getEventById'])->name('customer.eventById');
    });

    // -- Rute Publik: PROMO --
    Route::prefix('promo')->group(function () {
        // [GET] Daftar banner promo yang sedang aktif
        Route::get('/', [PromoController::class, 'getPublicPromos'])->name('customer.promos');
    });

    // -- Rute Publik: PRODUK --
    Route::prefix('product')->group(function () {
        // [GET] Daftar kategori produk untuk ditampilkan di Tab Filter
        Route::get('/categories', [KategoriProdukController::class, 'getAllCategories'])->name('customer.productCategories');
        // [GET] Daftar semua katalog produk (bisa di-filter berdasarkan kategori dari URL: ?idKategori=X)
        Route::get('/', [ProdukKlinikController::class, 'getPublicProducts'])->name('customer.products');
        // [GET] Halaman detail spesifik satu produk
        Route::get('/{idProduk}', [ProdukKlinikController::class, 'getProductById'])->name('customer.productById');
        
        // [POST] Memesan 1 produk langsung (Beli Langsung). BUTUH LOGIN (role:customer)
        Route::post('/{idProduk}/order', [PenjualanController::class, 'orderProduct'])->name('customer.orderProduct')->middleware(['role:customer']); 
    });

    // [GET] Menampilkan daftar artikel kegiatan / blog Mische
    Route::get('kegiatan', [KegiatanController::class, 'getPublicKegiatan'])->name('customer.activities');

    // -- Rute Publik: TESTIMONI --
    Route::prefix('testimonials')->group(function () {
        // [GET] Menarik daftar ulasan/testimoni dari pelanggan untuk ditampilkan di landing page
        Route::get('/', [\App\Http\Controllers\Api\TestimoniController::class, 'getPublicTestimonials'])->name('customer.testimonials');
    });

    /**
     * ============================================
     * AREA CUSTOMER (WAJIB LOGIN - Bearer Token)
     * Menggunakan middleware 'role:customer'
     * ============================================
     */
    
    // -- Rute Private: PROFIL CUSTOMER --
    Route::prefix('profile')->middleware(['role:customer'])->group(function () {
        Route::get('/', [ProfilCustomerController::class, 'getProfileCustomer'])->name('customer.profile');
        Route::put('/', [ProfilCustomerController::class, 'updateProfileCustomer'])->name('customer.updateProfile');
        // [PATCH] Memilih/mengatur alamat mana yang jadi alamat pengiriman default
        Route::patch('/alamat-utama', [ProfilCustomerController::class, 'setAlamatUtama'])->name('customer.profile.alamatUtama');
    });

    // -- Rute Private: BUKU ALAMAT CUSTOMER --
    Route::prefix('alamat')->middleware(['role:customer'])->group(function () {
        Route::get('/', [AlamatCustomerController::class, 'getCustomerAddresses'])->name('customer.alamat.index');
        Route::post('/', [AlamatCustomerController::class, 'createAddress'])->name('customer.alamat.create');
        Route::put('/{id}', [AlamatCustomerController::class, 'updateAddress'])->name('customer.alamat.update');
        Route::delete('/{id}', [AlamatCustomerController::class, 'deleteAddress'])->name('customer.alamat.delete');
    });

    // -- Rute Private: RESERVASI / JANJI TEMU --
    Route::prefix('reservations')->middleware(['role:customer'])->group(function () {
        // [GET] Histori reservasi milik customer ini saja
        Route::get('/', [ReservasiController::class, 'getCustomerReservations'])->name('customer.reservations');
        // [GET] Detail tiket 1 reservasi
        Route::get('/{idReservasi}', [ReservasiController::class, 'getDetailReservationCustomer'])->name('customer.detailReservation');
        // [POST] Membuat pesanan jadwal dokter baru
        Route::post('/', [ReservasiController::class, 'createReservationCustomer'])->name('customer.createReservation');
        // [PUT] Meminta reschedule (Hanya bisa dilakukan maksimal 1x berdasarkan policy)
        Route::put('/{idReservasi}', [ReservasiController::class, 'rescheduleReservationCustomer'])->name('customer.rescheduleReservation');
    });

    // -- Rute Private: KERANJANG BELANJA (CART) --
    Route::prefix('card')->middleware(['role:customer'])->group(function () {
        Route::get('/', [KeranjangController::class, 'getCart'])->name('customer.getCart'); // Tarik isi keranjang
        Route::post('/', [KeranjangController::class, 'addToCart'])->name('customer.addToCart'); // Tambah barang
        Route::patch('/{idKeranjang}', [KeranjangController::class, 'updateCart'])->name('customer.updateCart'); // Ubah QTY (+/-)
        Route::delete('/{idKeranjang}', [KeranjangController::class, 'deleteFromCart'])->name('customer.deleteFromCart'); // Buang dari keranjang
    });

    // -- Rute Private: TRANSAKSI PENJUALAN --
    Route::prefix('penjualan')->middleware(['role:customer'])->group(function () {
        Route::get('/', [PenjualanController::class, 'getCustomerOrders'])->name('customer.getOrders'); // Histori belanja
        Route::patch('/{idPenjualan}', [PenjualanController::class, 'receiveItem'])->name('customer.receiveItem'); // Konfirmasi paket "Diterima"
        Route::post('/checkout', [PenjualanController::class, 'checkoutCart'])->name('customer.checkoutCart'); // Proses Bayar (Dapat token Midtrans)
        Route::post('/check-status', [MidtransController::class, 'checkStatus'])->name('customer.checkStatus'); // Tarik manual status Midtrans
    });

    // -- Rute Private: CEK ONGKOS KIRIM (RAJAONGKIR) --
    Route::prefix('rajaongkir')->middleware(['role:customer'])->group(function () {
        Route::get('/provinces', [RajaOngkirController::class, 'getProvinces'])->name('customer.rajaongkir.provinces'); // Tarik data provinsi se-Indonesia
        Route::get('/cities', [RajaOngkirController::class, 'getCities'])->name('customer.rajaongkir.cities'); // Tarik kota per provinsi
        Route::post('/cost-by-address', [RajaOngkirController::class, 'checkCostByAddress'])->name('customer.rajaongkir.costByAddress'); // Hitung tarif JNE/JNT/POS berdasarkan ID Alamat Utama
    });

    // -- Rute Private: CEK KUPON PROMO --
    Route::prefix('promo')->middleware(['role:customer'])->group(function () {
        // [POST] Cek apakah kode unik promo valid dan potong total keranjang belanja
        Route::post('/check', [PromoController::class, 'checkPromo'])->name('customer.promo.check');
    });
});

/**
 * ============================================
 * 🛠️ AREA ADMINISTRATOR (Hanya Boleh Diakses Admin)
 * Prefix URL: /api/admin/...
 * Menggunakan middleware JWT dan role:admin
 * ============================================
 */
Route::prefix('admin')->middleware(['role:admin'])->group(function () {

    // -- Rute Admin: DASHBOARD & REPORT EXCEL --
    Route::get('/dashboard', [DashboardController::class, 'getDashboardData'])->name('admin.dashboard'); // Grafik & Statistik ringkasan
    Route::get('/report/penjualan', [ReportController::class, 'exportReportPenjualan'])->name('admin.report.penjualan'); // Download Excel laporan e-commerce
    Route::get('/report/reservasi', [ReportController::class, 'exportReportReservasi'])->name('admin.report.reservasi'); // Download Excel data pendaftaran pasien

    // -- Rute Admin: PROFIL PRIBADI ADMIN --
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfilAdminController::class, 'getProfileAdmin'])->name('admin.profile'); // Lihat profil admin
        Route::put('/', [ProfilAdminController::class, 'updateProfileAdmin'])->name('admin.updateProfile'); // Ubah nama/password admin
    });

    // -- Rute Admin: KELOLA PENGGUNA (CRUD Akun) --
    Route::prefix('users')->group(function () {
        Route::get('/', [KelolaUserController::class, 'getAllUsers'])->name('admin.users'); // List tabel semua pengguna
        Route::post('/', [KelolaUserController::class, 'createUser'])->name('admin.createUser'); // Bikin akun manual (Bisa buat nambah Admin baru)
        Route::put('/{idUser}', [KelolaUserController::class, 'updateUser'])->name('admin.updateUser'); // Edit data user
        Route::delete('/{idUser}', [KelolaUserController::class, 'deleteUser'])->name('admin.deleteUser'); // Hapus (Banned) user
    });

    // -- Rute Admin: IDENTITAS KLINIK (Visi/Misi) --
    Route::prefix('clinic')->group(function () {
        Route::post('/', [ProfilePerusahaanController::class, 'createProfile'])->name('admin.createProfile'); // Bikin (1x seumur hidup)
        Route::get('/', [ProfilePerusahaanController::class, 'getProfile'])->name('admin.clinic'); // Lihat
        Route::put('/{idProfile}', [ProfilePerusahaanController::class, 'updateProfile'])->name('admin.updateProfile'); // Update kontak/jam buka
        Route::delete('/{idProfile}', [ProfilePerusahaanController::class, 'deleteProfile'])->name('admin.deleteProfile'); // Hapus
    });

    // -- Rute Admin: KELOLA DOKTER --
    Route::prefix('doctors')->group(function () {
        Route::get('/', [ProfilDokterController::class, 'getAllDoctors'])->name('admin.doctors'); // Tabel data dokter
        Route::post('/', [ProfilDokterController::class, 'createDoctor'])->name('admin.createDoctor'); // Tambah dokter baru
        Route::put('/{idDokter}', [ProfilDokterController::class, 'updateDoctor'])->name('admin.updateDoctor'); // Ubah spesialisasi/foto
        Route::patch('/{idDokter}/status', [ProfilDokterController::class, 'updateStatus'])->name('admin.updateDoctorStatus'); // Switch On/Off Cuti/Tersedia
        Route::delete('/{idDokter}', [ProfilDokterController::class, 'deleteDoctor'])->name('admin.deleteDoctor'); // Hapus data dokter
    });

    // -- Rute Admin: KELOLA EVENT --
    Route::prefix('event')->group(function () {
        Route::get('/', [EventController::class, 'getAllEvents'])->name('admin.events');
        Route::post('/', [EventController::class, 'createEvent'])->name('admin.createEvent');
        Route::put('/{idEvent}', [EventController::class, 'updateEvent'])->name('admin.updateEvent');
        Route::delete('/{idEvent}', [EventController::class, 'deleteEvent'])->name('admin.deleteEvent');
    });

    // -- Rute Admin: KELOLA PROMO (Kupon Diskon) --
    Route::prefix('promo')->group(function () {
        Route::get('/', [PromoController::class, 'getAllPromos'])->name('admin.promos');
        Route::post('/', [PromoController::class, 'createPromo'])->name('admin.createPromo');
        Route::put('/{idPromo}', [PromoController::class, 'updatePromo'])->name('admin.updatePromo'); // Update json/form
        Route::post('/{idPromo}', [PromoController::class, 'updatePromo']); // Fallback khusus method override FormData (Gambar)
        Route::patch('/{idPromo}/status', [PromoController::class, 'updateStatus'])->name('admin.updatePromoStatus'); // Switch Hidup/Mati Promo
        Route::delete('/{idPromo}', [PromoController::class, 'deletePromo'])->name('admin.deletePromo');
    });

    // -- Rute Admin: KELOLA JADWAL (Slot Waktu Praktek) --
    Route::prefix('schedules')->group(function () {
        Route::get('/', [JadwalReservasiController::class, 'getAllSchedule'])->name('admin.schedules'); // Cek ketersediaan jam
        Route::post('/', [JadwalReservasiController::class, 'createSchedule'])->name('admin.createSchedule'); // Tambah jam praktek
        Route::put('/{idJadwal}', [JadwalReservasiController::class, 'updateSchedule'])->name('admin.updateSchedule');
        Route::delete('/{idJadwal}', [JadwalReservasiController::class, 'deleteSchedule'])->name('admin.deleteSchedule');
    });

    // -- Rute Admin: KELOLA KEGIATAN BLOG --
    Route::prefix('kegiatan')->group(function () {
        Route::get('/', [KegiatanController::class, 'getAllKegiatan'])->name('admin.activities');
        Route::post('/', [KegiatanController::class, 'createKegiatan'])->name('admin.createActivity');
        Route::put('/{idKegiatan}', [KegiatanController::class, 'updateKegiatan'])->name('admin.updateActivity'); 
        Route::delete('/{idKegiatan}', [KegiatanController::class, 'deleteKegiatan'])->name('admin.deleteActivity');
    });

    // -- Rute Admin: KELOLA TESTIMONI --
    Route::prefix('testimonials')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\TestimoniController::class, 'getAllTestimonials'])->name('admin.testimonials');
        Route::get('/{idTestimoni}', [\App\Http\Controllers\Api\TestimoniController::class, 'getTestimoniById'])->name('admin.testimoniById');
        Route::post('/', [\App\Http\Controllers\Api\TestimoniController::class, 'createTestimoni'])->name('admin.createTestimoni');
        Route::put('/{idTestimoni}', [\App\Http\Controllers\Api\TestimoniController::class, 'updateTestimoni'])->name('admin.updateTestimoni');
        Route::delete('/{idTestimoni}', [\App\Http\Controllers\Api\TestimoniController::class, 'deleteTestimoni'])->name('admin.deleteTestimoni');
    });

    // -- Rute Admin: BROADCAST WHATSAPP EMAIL (Distribusi) --
    Route::prefix('distribusi')->group(function () {
        Route::get('/customers', [DistribusiPromoEventController::class, 'getCustomers'])->name('admin.distribusi.customers'); // Ambil target kontak audience
        Route::post('/promo', [DistribusiPromoEventController::class, 'distributePromo'])->name('admin.distribusi.promo'); // Kirim blast promo
        Route::post('/event', [DistribusiPromoEventController::class, 'distributeEvent'])->name('admin.distribusi.event'); // Kirim blast event
    });

    // -- Rute Admin: KELOLA KATEGORI PRODUK --
    Route::prefix('kategori')->group(function () {
        Route::get('/count-products', [KategoriProdukController::class, 'getProductCountByCategory'])->name('admin.categories.countProducts'); // Rekap statistik tiap kategori
        Route::get('/', [KategoriProdukController::class, 'getAllCategories'])->name('admin.categories');
        Route::post('/', [KategoriProdukController::class, 'createCategory'])->name('admin.createCategory');
        Route::put('/{idKategori}', [KategoriProdukController::class, 'updateCategory'])->name('admin.updateCategory');
        Route::delete('/{idKategori}', [KategoriProdukController::class, 'deleteCategory'])->name('admin.deleteCategory');
    });

    // -- Rute Admin: KELOLA PRODUK FISIK --
    Route::prefix('product')->group(function () {
        Route::get('/', [ProdukKlinikController::class, 'getAllProducts'])->name('admin.products');
        Route::post('/', [ProdukKlinikController::class, 'createProduct'])->name('admin.createProduct');
        Route::put('/{idProduk}', [ProdukKlinikController::class, 'updateProduct'])->name('admin.updateProduct');
        Route::patch('/{idProduk}', [ProdukKlinikController::class, 'updateStock'])->name('admin.updateStock'); // Quick edit tambah/kurang stok barang
        Route::delete('/{idProduk}', [ProdukKlinikController::class, 'deleteProduct'])->name('admin.deleteProduct');
    });

    // -- Rute Admin: KELOLA RESERVASI MASUK --
    Route::prefix('reservations')->group(function () {
        Route::get('/', [ReservasiController::class, 'getAllReservations'])->name('admin.reservations'); // Lihat tabel antrean
        Route::post('/', [ReservasiController::class, 'createReservationAdmin'])->name('admin.createReservation'); // Admin menginputkan jadwal untuk tamu walk-in / offline
        Route::patch('/{idReservasi}', [ReservasiController::class, 'updateStatusReservationAdmin'])->name('admin.updateStatus'); // Proses ACC jadwal / Tolak jadwal
        Route::delete('/{idReservasi}', [ReservasiController::class, 'deleteReservation'])->name('admin.deleteReservation'); // Hapus
    });

    // -- Rute Admin: MANAJEMEN PESANAN (E-Commerce) --
    Route::prefix('penjualan')->group(function () {
        Route::get('/', [PenjualanController::class, 'index'])->name('admin.penjualan.index'); // Lihat daftar pesanan masuk dari toko
        Route::patch('/{idPenjualan}', [PenjualanController::class, 'updateStatus'])->name('admin.penjualan.updateStatus'); // Update flow: 'pending' -> 'diproses' -> 'dikirim' -> 'selesai'
        Route::patch('/{idPenjualan}/resi', [PenjualanController::class, 'inputResi'])->name('admin.penjualan.inputResi'); // Menambahkan nomor resi pengiriman JNE
        Route::delete('/{idPenjualan}', [PenjualanController::class, 'destroy'])->name('admin.penjualan.destroy'); // Hapus paksa transaksi
    });
});

/**
 * ============================================
 * 🤖 AREA WEBHOOK (Diakses oleh Robot Eksternal secara Background)
 * Prefix URL: /api/webhook/...
 * ============================================
 */
Route::prefix('webhook')->group(function () {
    // [POST] Endpoint yang dipanggil otomatis oleh server Midtrans ketika ada pembayaran berhasil/gagal
    Route::post('/midtrans', [MidtransController::class, 'midtransNotification'])->name('webhook.midtrans');
});
