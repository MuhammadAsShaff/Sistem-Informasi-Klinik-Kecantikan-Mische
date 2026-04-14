<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class JwtFromCookie
{
    /**
     * Middleware Buatan Kustom (Non-Bawaan Laravel)
     * Fungsi utama: Menangkap JWT Token pengguna yang tersimpan di Cookie (dari interaksi browser Web) 
     * lalu memindahkannya menyerupai Header (Authorization: Bearer) supaya dikenali otomatis oleh JWT-AUTH.
     */
    public function handle(Request $request, Closure $next)
    {
        // 1. Cek apakah di proses request ini pengunjung tidak memiliki Header Authorization (contoh: bukan dari Postman)
        if (!$request->bearerToken()) {
            
            // 2. Jika tidak ada di Header, coba bongkar Cookie dan cari apakah ada token di dalamnya
            $cookieName = env('JWT_COOKIE', 'jwt_token');
            $token = $request->cookie($cookieName);

            // 3. Jika ternyata token ketemu di dalam Cookie, secara cerdik suntikkan/tambahkan ke Request Headers
            // Sehingga package jwt-auth tetap membaca token ini seolah-olah ia dikirim lewat Header Bearer!
            if (!empty($token)) {
                $request->headers->set('Authorization', 'Bearer ' . $token);
            }
        }

        // Lanjutkan request ke tahap berikutnya (Middleware lain lalu ke Controller)
        return $next($request);
    }
}
