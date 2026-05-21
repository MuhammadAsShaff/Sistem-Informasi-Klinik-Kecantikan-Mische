<?php

use App\Http\Controllers\Api\AutentikasiController;
use App\Http\Controllers\Api\ProfilCustomerController;
use App\Http\Controllers\Api\ProfilePerusahaanController;
use App\Http\Controllers\Api\KelolaUserController;
use App\Http\Controllers\Api\JadwalReservasiController;
use App\Http\Controllers\Api\ProfilAdminController;
use App\Http\Controllers\Api\ProfilDokterController;
use App\Http\Controllers\Api\KegiatanController;
use App\Http\Controllers\Api\ReservasiController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\PromoController;
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

    Route::get('kegiatan', [KegiatanController::class, 'getPublicKegiatan'])->name('customer.activities');

    Route::prefix('profile')->middleware(['role:customer'])->group(function () {
        Route::get('/', [ProfilCustomerController::class, 'getProfileCustomer'])->name('customer.profile');
        Route::put('/', [ProfilCustomerController::class, 'updateProfileCustomer'])->name('customer.updateProfile');
    });

    Route::prefix('reservations')->middleware(['role:customer'])->group(function () {
        Route::get('/', [ReservasiController::class, 'getCustomerReservations'])->name('customer.reservations');
        Route::get('/{idReservasi}', [ReservasiController::class, 'getDetailReservationCustomer'])->name('customer.detailReservation');
        Route::post('/', [ReservasiController::class, 'createReservationCustomer'])->name('customer.createReservation');
        Route::put('/{idReservasi}', [ReservasiController::class, 'rescheduleReservationCustomer'])->name('customer.rescheduleReservation');
    });
});

// ============================================
// AREA ADMINISTRATOR (Hanya Boleh Diakses Admin Ber-Token)
// Prefix: /api/admin/...
// ============================================
Route::prefix('admin')->middleware(['role:admin'])->group(function () {

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
    // RUTE KELOLA RESERVASI (Admin)
    // ----------------------------------------
    Route::prefix('reservations')->group(function () {
        Route::get('/', [ReservasiController::class, 'getAllReservations'])->name('admin.reservations');
        Route::patch('/{idReservasi}', [ReservasiController::class, 'updateStatusReservationAdmin'])->name('admin.updateStatus');
        Route::delete('/{idReservasi}', [ReservasiController::class, 'deleteReservation'])->name('admin.deleteReservation');
    });
});