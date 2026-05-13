<?php

use App\Http\Controllers\Api\AutentikasiController;
use App\Http\Controllers\Api\ProfilCustomerController;
use App\Http\Controllers\Api\ProfilePerusahaanController;
use App\Http\Controllers\Api\KelolaUserController;
use App\Http\Controllers\Api\JadwalReservasiController;
use App\Http\Controllers\Api\ProfilAdminController;
use App\Http\Controllers\Api\KegiatanController;
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

    Route::get('activities', [KegiatanController::class, 'getPublicKegiatan'])->name('customer.activities');

    Route::prefix('profile')->middleware(['role:customer'])->group(function () {
        Route::get('/', [ProfilCustomerController::class, 'getProfileCustomer'])->name('customer.profile');
        Route::put('/', [ProfilCustomerController::class, 'updateProfileCustomer'])->name('customer.updateProfile');
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
    // Prefix turunan: /api/admin/activities/...
    // ----------------------------------------
    Route::prefix('activities')->group(function () {
        Route::get('/', [KegiatanController::class, 'getAllKegiatan'])->name('admin.activities');
        Route::post('/', [KegiatanController::class, 'createKegiatan'])->name('admin.createActivity');
        Route::post('/{idKegiatan}', [KegiatanController::class, 'updateKegiatan'])->name('admin.updateActivity'); // Gunakan POST + _method=PUT via form-data jika ada upload file dari frontend
        Route::delete('/{idKegiatan}', [KegiatanController::class, 'deleteKegiatan'])->name('admin.deleteActivity');
    });
});