<?php

use App\Http\Controllers\Api\AutentikasiController;
use App\Http\Controllers\Api\ProfilCustomerController;
use App\Http\Controllers\Api\ProfilePerusahaanController;
use App\Http\Controllers\Api\KelolaUserController;
use Illuminate\Support\Facades\Route;

// ============================================
// AREA AUTENTIKASI (Proses Log Masuk & Daftar)
// Prefix: /api/auth/...
// ============================================
Route::prefix('auth')->group(function () {
    Route::post('/register', [AutentikasiController::class, 'registerUser'])->name('auth.register');
    Route::post('/login', [AutentikasiController::class, 'loginUser'])->name('auth.login');
    Route::post('/logout', [AutentikasiController::class, 'logoutUser'])->name('auth.logout');
    Route::get('/me', [AutentikasiController::class, 'getUserProfile'])->name('auth.me');
    Route::post('/reset-password', [AutentikasiController::class, 'resetPassword'])->name('auth.reset-password');
});

// ============================================
// AREA PUBLIC / CUSTOMER (Bebas Akses Tanpa Login Ketat)
// Prefix: /api/customer/...
// ============================================
Route::prefix('customer')->group(function () {
    // Endpoint khusus pasien/publik melihat data Profil Klinik
    Route::get('clinic', [ProfilePerusahaanController::class, 'getPublicProfile'])->name('customer.clinic');

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
});