<?php

use App\Http\Controllers\Api\AutentikasiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'API berjalan dengan baik'
    ]);
});

Route::prefix('auth')->group(function () {
    Route::post('/register', [AutentikasiController::class, 'registerUser'])->name('auth.register');
    Route::post('/login', [AutentikasiController::class, 'loginUser'])->name('auth.login');
    Route::post('/logout', [AutentikasiController::class, 'logoutUser'])->name('auth.logout');
    Route::get('/me', [AutentikasiController::class, 'getUserProfile'])->name('auth.me');
    Route::post('/reset-password', [AutentikasiController::class, 'resetPassword'])->name('auth.reset-password');
});
