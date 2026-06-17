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
use App\Http\Controllers\Api\WebhookController;
use Illuminate\Support\Facades\Route;


// ============================================
// AREA AUTENTIKASI (Proses Log Masuk & Daftar)
// Prefix: /api/auth/...
// ============================================
Route::prefix('auth')->group(function () {
    Route::post('/register', [AutentikasiController::class, 'registerUser'])->name('auth.register');

    // Menerapkan Rate Limiter: Maksimal 5x percobaan Login dalam 1 menit (Mencegah Brute Force Password)
    Route::post('/login', [AutentikasiController::class, 'loginUser'])
         ->middleware('throttle:5,1')
         ->name('auth.login');

    Route::post('/logout', [AutentikasiController::class, 'logoutUser'])->name('auth.logout');
    Route::get('/me', [AutentikasiController::class, 'getUserProfile'])->name('auth.me');

    // Menerapkan Rate Limiter: Maksimal 3x percobaan Reset Sandi dalam 1 menit
    Route::post('/reset-password', [AutentikasiController::class, 'resetPassword'])
         ->middleware('throttle:3,1')
         ->name('auth.reset-password');
});

// ============================================
// AREA PUBLIC / CUSTOMER (Bebas Akses Tanpa Login Ketat)
// Prefix: /api/customer/...
// ============================================
Route::prefix('customer')->group(function () {

    Route::get('clinic', [ProfilePerusahaanController::class, 'getPublicProfile'])->name('customer.clinic');
    
    Route::get('schedules', [JadwalReservasiController::class, 'getPublicSchedule'])->name('customer.schedules');

    Route::prefix('doctors')->group(function () {
        Route::get('/', [ProfilDokterController::class, 'getPublicDoctors'])->name('customer.doctors');
        Route::get('/{idDokter}', [ProfilDokterController::class, 'getDoctorById'])->name('customer.doctorById');
    });

    Route::prefix('event')->group(function () {
        Route::get('/', [EventController::class, 'getPublicEvents'])->name('customer.events');
        Route::get('/{idEvent}', [EventController::class, 'getEventById'])->name('customer.eventById');
    });

    Route::prefix('promo')->group(function () {
        Route::get('/', [PromoController::class, 'getPublicPromos'])->name('customer.promos');
    });


    // ----------------------------------------
    // RUTE PRODUK PUBLIC / CUSTOMER
    // ----------------------------------------
    Route::prefix('product')->group(function () {
        Route::get('/', [ProdukKlinikController::class, 'getPublicProducts'])->name('customer.products');
        Route::get('/{idProduk}', [ProdukKlinikController::class, 'getProductById'])->name('customer.productById');
        // Hanya pengguna dengan role customer yang telah login yang bisa order
        Route::post('/{idProduk}/order', [PenjualanController::class, 'orderProduct'])->name('customer.orderProduct')->middleware(['role:customer']); 
    });

    Route::get('kegiatan', [KegiatanController::class, 'getPublicKegiatan'])->name('customer.activities');

    Route::prefix('testimonials')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\TestimoniController::class, 'getPublicTestimonials'])->name('customer.testimonials');
    });

    Route::prefix('profile')->middleware(['role:customer'])->group(function () {
        Route::get('/', [ProfilCustomerController::class, 'getProfileCustomer'])->name('customer.profile');
        Route::put('/', [ProfilCustomerController::class, 'updateProfileCustomer'])->name('customer.updateProfile');
        Route::patch('/alamat-utama', [ProfilCustomerController::class, 'setAlamatUtama'])->name('customer.profile.alamatUtama');
    });

    Route::prefix('alamat')->middleware(['role:customer'])->group(function () {
        Route::get('/', [AlamatCustomerController::class, 'getCustomerAddresses'])->name('customer.alamat.index');
        Route::post('/', [AlamatCustomerController::class, 'createAddress'])->name('customer.alamat.create');
        Route::put('/{id}', [AlamatCustomerController::class, 'updateAddress'])->name('customer.alamat.update');
        Route::delete('/{id}', [AlamatCustomerController::class, 'deleteAddress'])->name('customer.alamat.delete');
    });

    Route::prefix('reservations')->middleware(['role:customer'])->group(function () {
        Route::get('/', [ReservasiController::class, 'getCustomerReservations'])->name('customer.reservations');
        Route::get('/{idReservasi}', [ReservasiController::class, 'getDetailReservationCustomer'])->name('customer.detailReservation');
        Route::post('/', [ReservasiController::class, 'createReservationCustomer'])->name('customer.createReservation');
        Route::put('/{idReservasi}', [ReservasiController::class, 'rescheduleReservationCustomer'])->name('customer.rescheduleReservation');
    });

    // Rute Keranjang (Cart)
    Route::prefix('card')->middleware(['role:customer'])->group(function () {
        Route::get('/', [KeranjangController::class, 'getCart'])->name('customer.getCart');
        Route::post('/', [KeranjangController::class, 'addToCart'])->name('customer.addToCart');
        Route::patch('/{idKeranjang}', [KeranjangController::class, 'updateCart'])->name('customer.updateCart');
        Route::delete('/{idKeranjang}', [KeranjangController::class, 'deleteFromCart'])->name('customer.deleteFromCart');
    });

    // Rute Penjualan Customer
    Route::prefix('penjualan')->middleware(['role:customer'])->group(function () {
        Route::patch('/{idPenjualan}', [PenjualanController::class, 'receiveItem'])->name('customer.receiveItem');
        Route::post('/checkout', [PenjualanController::class, 'checkoutCart'])->name('customer.checkoutCart');
    });

    // Rute RajaOngkir (Customer Cek Ongkir)
    Route::prefix('rajaongkir')->middleware(['role:customer'])->group(function () {
        Route::get('/provinces', [RajaOngkirController::class, 'getProvinces'])->name('customer.rajaongkir.provinces');
        Route::get('/cities', [RajaOngkirController::class, 'getCities'])->name('customer.rajaongkir.cities');
        Route::post('/cost-by-address', [RajaOngkirController::class, 'checkCostByAddress'])->name('customer.rajaongkir.costByAddress');
    });

    // Rute Promo Customer
    Route::prefix('promo')->middleware(['role:customer'])->group(function () {
        Route::post('/check', [PromoController::class, 'checkPromo'])->name('customer.promo.check');
    });
});

// ============================================
// AREA ADMINISTRATOR (Hanya Boleh Diakses Admin Ber-Token)
// Prefix: /api/admin/...
// ============================================
Route::prefix('admin')->middleware(['role:admin'])->group(function () {

    // ----------------------------------------
    // RUTE DASHBOARD & REPORT EXCEL
    // ----------------------------------------
    Route::get('/dashboard', [DashboardController::class, 'getDashboardData'])->name('admin.dashboard');
    Route::get('/report/penjualan', [ReportController::class, 'exportReportPenjualan'])->name('admin.report.penjualan');
    Route::get('/report/reservasi', [ReportController::class, 'exportReportReservasi'])->name('admin.report.reservasi');

    // ----------------------------------------
    // RUTE PROFIL ADMIN PRIBADI
    // Prefix turunan: /api/admin/profile/...
    // ----------------------------------------
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfilAdminController::class, 'getProfileAdmin'])->name('admin.profile');
        Route::put('/', [ProfilAdminController::class, 'updateProfileAdmin'])->name('admin.updateProfile');
    });

    // ----------------------------------------
    // RUTE KELOLA USER (Staff, Pasien, dll)
    // Prefix turunan: /api/admin/users/...
    // ----------------------------------------
    Route::prefix('users')->group(function () {
        Route::get('/', [KelolaUserController::class, 'getAllUsers'])->name('admin.users');
        Route::put('/{idUser}', [KelolaUserController::class, 'updateUser'])->name('admin.updateUser');
        Route::delete('/{idUser}', [KelolaUserController::class, 'deleteUser'])->name('admin.deleteUser');
        Route::post('/', [KelolaUserController::class, 'createUser'])->name('admin.createUser');
    });

    // ----------------------------------------
    // RUTE KELOLA PROFIL KLINIK Mische
    // Prefix turunan: /api/admin/clinic/...
    // ----------------------------------------
    Route::prefix('clinic')->group(function () {
        Route::post('/', [ProfilePerusahaanController::class, 'createProfile'])->name('admin.createProfile');
        Route::get('/', [ProfilePerusahaanController::class, 'getProfile'])->name('admin.clinic');
        Route::put('/{idProfile}', [ProfilePerusahaanController::class, 'updateProfile'])->name('admin.updateProfile');
        Route::delete('/{idProfile}', [ProfilePerusahaanController::class, 'deleteProfile'])->name('admin.deleteProfile');
    });

    // ----------------------------------------
    // RUTE KELOLA DOKTER
    // Prefix turunan: /api/admin/doctors/...
    // ----------------------------------------
    Route::prefix('doctors')->group(function () {
        Route::get('/', [ProfilDokterController::class, 'getAllDoctors'])->name('admin.doctors');
        Route::post('/', [ProfilDokterController::class, 'createDoctor'])->name('admin.createDoctor');
        Route::put('/{idDokter}', [ProfilDokterController::class, 'updateDoctor'])->name('admin.updateDoctor');
        Route::patch('/{idDokter}/status', [ProfilDokterController::class, 'updateStatus'])->name('admin.updateDoctorStatus');
        Route::delete('/{idDokter}', [ProfilDokterController::class, 'deleteDoctor'])->name('admin.deleteDoctor');
    });

    // ----------------------------------------
    // RUTE KELOLA EVENT
    // Prefix turunan: /api/admin/event/...
    // ----------------------------------------
    Route::prefix('event')->group(function () {
        Route::get('/', [EventController::class, 'getAllEvents'])->name('admin.events');
        Route::post('/', [EventController::class, 'createEvent'])->name('admin.createEvent');
        Route::put('/{idEvent}', [EventController::class, 'updateEvent'])->name('admin.updateEvent');
        Route::delete('/{idEvent}', [EventController::class, 'deleteEvent'])->name('admin.deleteEvent');
    });

    // ----------------------------------------
    // RUTE KELOLA PROMO
    // Prefix turunan: /api/admin/promo/...
    // ----------------------------------------
    Route::prefix('promo')->group(function () {
        Route::get('/', [PromoController::class, 'getAllPromos'])->name('admin.promos');
        Route::post('/', [PromoController::class, 'createPromo'])->name('admin.createPromo');
        Route::put('/{idPromo}', [PromoController::class, 'updatePromo'])->name('admin.updatePromo');
        Route::delete('/{idPromo}', [PromoController::class, 'deletePromo'])->name('admin.deletePromo');
    });

    // ----------------------------------------
    // RUTE KELOLA JADWAL RESERVASI
    // Prefix turunan: /api/admin/schedules/...
    // ----------------------------------------
    Route::prefix('schedules')->group(function () {
        Route::get('/', [JadwalReservasiController::class, 'getAllSchedule'])->name('admin.schedules');
        Route::post('/', [JadwalReservasiController::class, 'createSchedule'])->name('admin.createSchedule');
        Route::put('/{idJadwal}', [JadwalReservasiController::class, 'updateSchedule'])->name('admin.updateSchedule');
        Route::delete('/{idJadwal}', [JadwalReservasiController::class, 'deleteSchedule'])->name('admin.deleteSchedule');
    });

    // ----------------------------------------
    // RUTE KELOLA KEGIATAN KLINIK
    // Prefix turunan: /api/admin/kegiatan/...
    // ----------------------------------------
    Route::prefix('kegiatan')->group(function () {
        Route::get('/', [KegiatanController::class, 'getAllKegiatan'])->name('admin.activities');
        Route::post('/', [KegiatanController::class, 'createKegiatan'])->name('admin.createActivity');
        Route::put('/{idKegiatan}', [KegiatanController::class, 'updateKegiatan'])->name('admin.updateActivity'); 
        Route::delete('/{idKegiatan}', [KegiatanController::class, 'deleteKegiatan'])->name('admin.deleteActivity');
    });

    // ----------------------------------------
    // RUTE KELOLA TESTIMONI
    // Prefix turunan: /api/admin/testimonials/...
    // ----------------------------------------
    Route::prefix('testimonials')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\TestimoniController::class, 'getAllTestimonials'])->name('admin.testimonials');
        Route::get('/{idTestimoni}', [\App\Http\Controllers\Api\TestimoniController::class, 'getTestimoniById'])->name('admin.testimoniById');
        Route::post('/', [\App\Http\Controllers\Api\TestimoniController::class, 'createTestimoni'])->name('admin.createTestimoni');
        Route::put('/{idTestimoni}', [\App\Http\Controllers\Api\TestimoniController::class, 'updateTestimoni'])->name('admin.updateTestimoni');
        Route::delete('/{idTestimoni}', [\App\Http\Controllers\Api\TestimoniController::class, 'deleteTestimoni'])->name('admin.deleteTestimoni');
    });

    // ----------------------------------------
    // RUTE DISTRIBUSI PROMO & EVENT
    // ----------------------------------------
    Route::prefix('distribusi')->group(function () {
        Route::get('/customers', [DistribusiPromoEventController::class, 'getCustomers'])->name('admin.distribusi.customers');
        Route::post('/promo', [DistribusiPromoEventController::class, 'distributePromo'])->name('admin.distribusi.promo');
        Route::post('/event', [DistribusiPromoEventController::class, 'distributeEvent'])->name('admin.distribusi.event');
    });

    // ----------------------------------------
    // RUTE KELOLA KATEGORI PRODUK
    // ----------------------------------------
    Route::prefix('kategori')->group(function () {
        Route::get('/count-products', [KategoriProdukController::class, 'getProductCountByCategory'])->name('admin.categories.countProducts');
        Route::get('/', [KategoriProdukController::class, 'getAllCategories'])->name('admin.categories');
        Route::post('/', [KategoriProdukController::class, 'createCategory'])->name('admin.createCategory');
        Route::put('/{idKategori}', [KategoriProdukController::class, 'updateCategory'])->name('admin.updateCategory');
        Route::delete('/{idKategori}', [KategoriProdukController::class, 'deleteCategory'])->name('admin.deleteCategory');
    });

    // ----------------------------------------
    // RUTE KELOLA PRODUK
    // ----------------------------------------
    Route::prefix('product')->group(function () {
        Route::get('/', [ProdukKlinikController::class, 'getAllProducts'])->name('admin.products');
        Route::post('/', [ProdukKlinikController::class, 'createProduct'])->name('admin.createProduct');
        Route::put('/{idProduk}', [ProdukKlinikController::class, 'updateProduct'])->name('admin.updateProduct');
        Route::patch('/{idProduk}', [ProdukKlinikController::class, 'updateStock'])->name('admin.updateStock');
        Route::delete('/{idProduk}', [ProdukKlinikController::class, 'deleteProduct'])->name('admin.deleteProduct');
    });

    // ----------------------------------------
    // RUTE KELOLA RESERVASI (Admin)
    // ----------------------------------------
    Route::prefix('reservations')->group(function () {
        Route::get('/', [ReservasiController::class, 'getAllReservations'])->name('admin.reservations');
        Route::post('/', [ReservasiController::class, 'createReservationAdmin'])->name('admin.createReservation');
        Route::patch('/{idReservasi}', [ReservasiController::class, 'updateStatusReservationAdmin'])->name('admin.updateStatus');
        Route::delete('/{idReservasi}', [ReservasiController::class, 'deleteReservation'])->name('admin.deleteReservation');
    });

    // RUTE KELOLA PENJUALAN (Admin)
    Route::prefix('penjualan')->group(function () {
        Route::get('/', [PenjualanController::class, 'index'])->name('admin.penjualan.index');
        Route::patch('/{idPenjualan}', [PenjualanController::class, 'updateStatus'])->name('admin.penjualan.updateStatus');
        Route::patch('/{idPenjualan}/resi', [PenjualanController::class, 'inputResi'])->name('admin.penjualan.inputResi');
        Route::delete('/{idPenjualan}', [PenjualanController::class, 'destroy'])->name('admin.penjualan.destroy');
    });
});

// ============================================
// AREA WEBHOOK (Diakses oleh Sistem Eksternal seperti Midtrans)
// Prefix: /api/webhook/...
// ============================================
Route::prefix('webhook')->group(function () {
    Route::post('/midtrans', [WebhookController::class, 'midtransNotification'])->name('webhook.midtrans');
});

