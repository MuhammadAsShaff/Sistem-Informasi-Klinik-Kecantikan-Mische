<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureAdminRole
{
    /**
     * Middleware Khusus Admin
     * Mengecek identitas jwt (apakah dia login) & mengecek perannya apakah mutlak bernama 'admin'
     */
    public function handle(Request $request, Closure $next)
    {
        $user = auth('api')->user();

        // 1. Cek apakah ada profil di dalam token JWT
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Anda belum login. Tidak ada token otentikasi!'
            ], 401);
        }

        // 2. Cek ketat jenis otoritasnya (Tolak jika bukan admin)
        if ($user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak: Hanya tingkat Admin yang diizinkan untuk melihat, mengubah, atau masuk ke halaman ini.'
            ], 403); // HTTP 403 singkatan dari Forbidden/Diharamkan
        }

        // Jika lolos kedua ujian di atas, baru biarkan jalankan script Controller nya!
        return $next($request);
    }
}
