<?php

use App\Http\Controllers\Api\AutentikasiController;
use App\Http\Controllers\ProfileKlinikController;
use Illuminate\Http\Request;
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
    Route::get('clinic', [ProfileKlinikController::class, 'getPublicProfile'])->name('customer.clinic');
});

// ============================================
// AREA ADMINISTRATOR (Hanya Boleh Diakses Admin Ber-Token)
// Prefix: /api/admin/...
// ============================================
Route::prefix('admin')->middleware(['admin'])->group(function () {

    // ----------------------------------------
    // RUTE KELOLA USER (Staff, Pasien, dll)
    // Prefix turunan: /api/admin/users/...
    // ----------------------------------------
    Route::prefix('users')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\KelolaUserController::class, 'getAllUsers'])->name('admin.users');
        Route::put('/{idUser}', [\App\Http\Controllers\Api\KelolaUserController::class, 'updateUser'])->name('admin.updateUser');
        Route::delete('/{idUser}', [\App\Http\Controllers\Api\KelolaUserController::class, 'deleteUser'])->name('admin.deleteUser');
        Route::post('/{idUser}', [\App\Http\Controllers\Api\KelolaUserController::class, 'createUser'])->name('admin.createUser');
    });

    // ----------------------------------------
    // RUTE KELOLA PROFIL KLINIK Mische
    // Prefix turunan: /api/admin/clinic/...
    // ----------------------------------------
    Route::prefix('clinic')->group(function () {
        Route::get('/', [ProfileKlinikController::class, 'getProfile'])->name('admin.clinic');
        Route::put('/{idProfile}', [ProfileKlinikController::class, 'updateProfile'])->name('admin.updateProfile');
        Route::delete('/{idProfile}', [ProfileKlinikController::class, 'deleteProfile'])->name('admin.deleteProfile');
        Route::post('/{idProfile}', [ProfileKlinikController::class, 'createProfile'])->name('admin.createProfile');
    });


});