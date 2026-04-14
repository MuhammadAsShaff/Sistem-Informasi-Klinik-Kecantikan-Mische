<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
class AutentikasiController extends Controller
{
    public function registerUser(Request $request)
    {
        $pesanEror = [
            'nama.required' => 'Kolom nama lengkap tidak boleh kosong.',
            'email.required' => 'Email wajib diisi!',
            'email.email' => 'Format penulisan email tidak valid.',
            'email.unique' => 'Email ini sudah telanjur terdaftar, silakan pilih email lain.',
            'nomorWa.required' => 'Pastikan menyertakan nomor WhatsApp.',
            'alamat.required' => 'Tolong sebutkan alamat lengkapmu.',
            'password.required' => 'Sayang sekali, password adalah akses yang diwajibkan.',
            'password.min' => 'Kata sandi jauh terlalu pendek! (Minimal 8 karakter)',
            'password.mixed' => 'Pastikan kata sandimu menantang dengan menyisipkan huruf BESAR (A-Z) dan kecil (a-z).'
        ];

        // Validasi batasan tipe data pada input yang dikirim Client
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:60',
            'alamat' => 'required|string|max:60',
            'jenisKelamin' => 'required|string|max:12',
            'tanggalLahir' => 'required|date',
            'role' => 'required|string|max:12',
            'email' => 'required|email|unique:user,email|max:20',
            'nomorWa' => 'required|string|max:16',
            'password' => ['required', 'string', \Illuminate\Validation\Rules\Password::min(8)->mixedCase()]
        ], $pesanEror);

        if ($validator->fails()) {
            return response()->json([
                'code' => 400,
                'success' => false,
                'message' => 'Ada kesalahan pada input data.',
                'errors' => $validator->errors()
            ], 400);
        }

        // Simpan data
        try {
            $user = User::create([
                'nama' => $request->nama,
                'alamat' => $request->alamat,
                'jenisKelamin' => $request->jenisKelamin,
                'tanggalLahir' => $request->tanggalLahir,
                'role' => $request->role,
                'email' => $request->email,
                'nomorWa' => $request->nomorWa,
                'password' => Hash::make($request->password)
            ]);

            return response()->json([
                'code' => 201,
                'success' => true,
                'message' => 'Registrasi berhasil!',
                'data' => $user
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'code' => 500,
                'success' => false,
                'message' => 'Registrasi gagal! Terjadi kesalahan pada server.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function loginUser(Request $request)
    {
        // Validasi Input agar tidak Crash 500 bila kosong
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Email dan Password wajib diisi.',
                'errors' => $validator->errors()
            ], 400);
        }

        $credentials = $request->only('email', 'password');

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password yang Anda masukkan salah.',
            ], 401);
        }

        $cookieName = env('JWT_COOKIE', 'jwt_token');
        $isSecure = app()->environment('production');
        $cookie = cookie(
            $cookieName,
            $token,
            auth('api')->factory()->getTTL(),
            '/',
            null,
            $isSecure,
            true,
            false,
            'Lax'
        );

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil!',
            'token' => $token,
            'type' => 'Bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
        ])->withCookie($cookie);
    }

    public function logoutUser(Request $request)
    {
        try {
            $cookieName = env('JWT_COOKIE', 'jwt_token');
            // Coba ambil token dari Header Authorization ATAU dari cookie yang tersimpan
            $token = $request->bearerToken() ?: $request->cookie($cookieName);

            if ($token) {
                // Hancurkan token menggunakan object guard API
                auth('api')->setToken($token)->logout();
            }

            return response()->json([
                'success' => true,
                'message' => 'Logout berhasil'
            ])->withCookie(cookie()->forget($cookieName));

        } catch (\Exception $e) {
            \Log::error($e);
            return response()->json([
                'success' => false,
                'message' => 'Sesi invalid atau gagal logout.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getUserProfile(Request $request)
    {
        try {
            $cookieName = env('JWT_COOKIE', 'jwt_token');
            // Sedot token dari penyimpanan Header ataupun Cookie
            $token = $request->bearerToken() ?: $request->cookie($cookieName);

            if (!$token) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akses ditolak. Anda belum login.'
                ], 401);
            }

            // Gunakan token tersebut untuk menguraikan identitas pengguna dari database
            $user = auth('api')->setToken($token)->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sesi telah kedaluwarsa atau token tidak valid.'
                ], 401);
            }

            return response()->json([
                'success' => true,
                'message' => 'Profil pengguna berhasil didapatkan.',
                'data' => $user
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Kesalahan saat memeriksa otentikasi.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function resetPassword(Request $request)
    {
        try {
            $cookieName = env('JWT_COOKIE', 'jwt_token');
            // Coba ambil token dari Header Authorization ATAU dari cookie
            $token = $request->bearerToken() ?: $request->cookie($cookieName);

            // 1. Wajib Login (Pengecekan Token)
            if (!$token) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akses ditolak. Anda belum memasukkan Token JWT. Harap tambahkan di Authorization: Bearer <token>'
                ], 401);
            }

            // Gunakan instance JWT Guard untuk mengecek status auth
            $user = auth('api')->setToken($token)->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token Anda tidak valid, sudah kedaluwarsa (expired), atau akun telah dihapus. Silakan login kembali untuk mendapatkan token baru.'
                ], 401);
            }

            // 2. Validasi Inputan Sesuai Ketentuan Ketat (Harus 8 Karakter & Huruf Besar/Kecil)
            $pesanEror = [
                'password_lama.required' => 'Mohon ketikkan sandi lama Anda.',
                'password_baru.required' => 'Sandi baru wajib diisi.',
                'password_baru.min' => 'Sandi baru terlalu pendek! (Minimal 8 karakter)',
                'password_baru.mixed' => 'Sandi baru harus memuat setidaknya kata huruf Kapital (A-Z) dan huruf kecil (a-z).'
            ];

            $validator = Validator::make($request->all(), [
                'password_lama' => 'required|string',
                'password_baru' => ['required', 'string', \Illuminate\Validation\Rules\Password::min(8)->mixedCase()]
            ], $pesanEror);

            if ($validator->fails()) {
                return response()->json([
                    'code' => 400,
                    'success' => false,
                    'message' => 'Ada kesalahan pada input sandi.',
                    'errors' => $validator->errors()
                ], 400);
            }

            // 3. Pengecekan Keamanan Ekstra: Apakah Sandi Lama-nya Akurat?
            if (!Hash::check($request->password_lama, $user->password)) {
                return response()->json([
                    'code' => 400,
                    'success' => false,
                    'message' => 'Pembaruan gagal. Password lama yang Anda ketikkan salah.'
                ], 400);
            }

            // 4. Sukses: Ubah dan Enkripsi (Hash) Sandi Baru ke Database
            $user->password = Hash::make($request->password_baru);
            $user->save();

            return response()->json([
                'code' => 200,
                'success' => true,
                'message' => 'Selamat! Password Anda berhasil diperbarui.'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Kesalahan saat mereset password.',
                'error' => $e->getMessage(),
                'isi_token_yang_ditangkap' => $token ?? 'TIDAK ADA'
            ], 500);
        }
    }

}
