<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    /**
     * Middleware Pengecekan Peran (Role) Dinamis
     * Mengecek identitas jwt dan mencocokkan perannya
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        try {
            // auth('api')->check() akan memvalidasi Token secara mendalam (termasuk ngecek Blacklist)
            if (!auth('api')->check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token Anda tidak valid atau sudah kadaluarsa (Logout).'
                ], 401);
            }

            $user = auth('api')->user();
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Sesi Token Anda ditolak oleh server (Mungkin sudah Logout).',
                'error' => $e->getMessage()
            ], 401);
        }

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki token otentikasi!'
            ], 401);
        }

        // 2. Cek apakah pengguna memiliki Role yang diizinkan (jika parameter roles diisi)
        if (!empty($roles) && !in_array($user->role, $roles)) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak: Anda tidak memiliki izin untuk masuk ke halaman ini.'
            ], 403); // HTTP 403 singkatan dari Forbidden/Diharamkan
        }

        // Jika lolos ujian di atas, baru biarkan jalankan script Controller nya!
        return $next($request);
    }
}
