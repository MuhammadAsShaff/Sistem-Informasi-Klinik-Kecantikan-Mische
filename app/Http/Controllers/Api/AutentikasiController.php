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
    /**
     * registerUser
     * 
     * Mendaftarkan akun customer baru di sistem klinik.
     */
    public function registerUser(Request $request)
    {
        // 1. Pesan Eror Khusus
        // Agar ketika ada input yang salah, sistem mengembalikan pesan Bahasa Indonesia yang ramah, bukan bahasa Inggris kaku dari Laravel.
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

        // 2. Validasi Ketat pada Inputan (Cegah Hacker / Data Sampah)
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:60',
            'jenisKelamin' => 'required|string|max:12',
            'tanggalLahir' => 'required|date',
            'email' => 'required|email|unique:user,email|max:50', // unique:user memastikan email ini belum pernah dipakai di tabel user
            'nomorWa' => 'required|string|max:16',
            'password' => ['required', 'string', \Illuminate\Validation\Rules\Password::min(8)->mixedCase()] // Aturan password kuat
        ], $pesanEror);

        // Jika salah satu dari aturan validasi di atas dilanggar, tolak!
        if ($validator->fails()) {
            return response()->json([
                'code' => 400,
                'success' => false,
                'message' => 'Ada kesalahan pada input data.',
                'errors' => $validator->errors()
            ], 400);
        }

        // 3. Simpan data ke Database
        try {
            $user = User::create([
                'nama' => $request->nama,
                'alamat' => $request->alamat,
                'jenisKelamin' => $request->jenisKelamin,
                'tanggalLahir' => $request->tanggalLahir,
                'role' => 'customer', // Pendaftaran umum otomatis menjadi customer (Admin dibuat manual)
                'email' => $request->email,
                'nomorWa' => $request->nomorWa,
                // WAJIB: Password tidak boleh disimpan mentah, harus dienkripsi menjadi teks acak menggunakan Hash::make()
                'password' => Hash::make($request->password)
            ]);

            return response()->json([
                'code' => 201, // 201 artinya Created (Berhasil Dibuat)
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

    /**
     * loginUser
     * 
     * Melakukan pengecekan email & password, lalu memberikan "Kunci Masuk" bernama JWT Token.
     */
    public function loginUser(Request $request)
    {
        $pesanEror = [
            'email.required' => 'Email wajib diisi untuk masuk.',
            'email.email' => 'Format email tidak valid.',
            'password.required' => 'Kata sandi wajib diisi.',
            'password.min' => 'Password minimal terdiri dari 8 karakter.',
            'password.mixed' => 'Pastikan kata sandimu menantang dengan menyisipkan huruf BESAR (A-Z) dan kecil (a-z).'
        ];

        // Validasi Input
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => ['required', 'string', \Illuminate\Validation\Rules\Password::min(8)->mixedCase()]
        ], $pesanEror);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Email dan Password wajib diisi.',
                'errors' => $validator->errors()
            ], 400);
        }

        // Hanya mengambil email dan password dari form request
        $credentials = $request->only('email', 'password');

        // 1. Coba Melakukan Login (Otomasis mencocokkan password yang di-hash di DB)
        // Jika sukses, auth()->attempt() akan mengembalikan teks panjang yang disebut "Token JWT"
        // Jika gagal (salah password/email), dia akan mengembalikan FALSE
        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password yang Anda masukkan salah.',
            ], 401); // 401 artinya Unauthorized
        }

        // 2. Setting Cookie Keamanan Tinggi
        // Kami mengirim token lewat Cookie agar aman dari pencurian javascript (Serangan XSS).
        $cookieName = env('JWT_COOKIE', 'jwt_token');
        $isSecure = app()->environment('production'); // Secure (https) aktif kalau di tahap produksi
        
        $cookie = cookie(
            $cookieName,
            $token,     // Isi kuncinya
            0,          // Umur: 0 = Session Cookie (Langsung musnah saat browser ditutup)
            '/',
            null,
            $isSecure,  // Secure flag
            true,       // HttpOnly flag (Anti pencurian javascript)
            false,
            'Lax'       // SameSite protection (Anti serangan CSRF dasar)
        );

        // 3. Kembalikan Response beserta Cookie-nya
        return response()->json([
            'success' => true,
            'message' => 'Login berhasil!',
            'token' => $token, // Opsional: Juga kita berikan di body (bisa untuk Postman test/mobile apps)
            'type' => 'Bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
        ])->withCookie($cookie);
    }

    /**
     * logoutUser
     * 
     * Menghapus jejak login (Mencabut izin JWT Token dan menghapus Cookie).
     */
    public function logoutUser(Request $request)
    {
        try {
            // Cek apakah user memang sedang dalam keadaan login?
            if (auth('api')->check()) {
                // Cabut akses / Blacklist Token JWT saat ini agar tidak bisa dipakai lagi (Mencegah maling token)
                auth('api')->logout();
                $pesan = 'Sesi Anda berhasil diakhiri (Logout).';
            } else {
                // Bisa terjadi kalau user klik tombol logout 2 kali berturut-turut dengan cepat
                $pesan = 'Permintaan diterima, namun sesi Anda tampaknya memang sudah tidak aktif.';
            }

            $cookieName = env('JWT_COOKIE', 'jwt_token');

            // forget() digunakan untuk memerintahkan Browser agar segera menghapus file cookie tersebut dari komputer pengguna
            return response()->json([
                'success' => true,
                'message' => $pesan
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

    /**
     * getUserProfile
     * 
     * Menarik detail profil User yang sedang login (Nama, Foto, No HP, dll).
     * Biasanya ini dipanggil setiap kali pindah halaman di Frontend untuk memastikan user masih login.
     */
    public function getUserProfile(Request $request)
    {
        try {
            // Jika token sudah expired / tidak valid
            if (!auth('api')->check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sesi Anda telah kedaluwarsa atau tidak valid. Silakan login kembali.'
                ], 401);
            }

            // auth('api')->user() secara ajaib menerjemahkan Token JWT yang berantakan menjadi data dari tabel User
            $user = auth('api')->user();

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

    /**
     * resetPassword
     * 
     * Fitur ubah kata sandi dari dalam halaman profil saat user sedang login.
     */
    public function resetPassword(Request $request)
    {
        try {
            // Keamanan: Pastikan harus login dulu baru boleh ganti password
            if (!auth('api')->check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sesi Anda telah kedaluwarsa atau tidak valid. Silakan login kembali.'
                ], 401);
            }

            // Ambil identitas user yang mau ganti password
            $user = auth('api')->user();

            $pesanEror = [
                'password_lama.required' => 'Mohon ketikkan sandi lama Anda.',
                'password_baru.required' => 'Sandi baru wajib diisi.',
                'password_baru.min' => 'Sandi baru terlalu pendek! (Minimal 8 karakter)',
                'password_baru.mixed' => 'Sandi baru harus memuat setidaknya kata huruf Kapital (A-Z) dan huruf kecil (a-z).'
            ];

            // 1. Validasi Input form Ganti Password
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

            // 2. Keamanan Ekstra: Cek secara ketat apakah Password Lama yang dia ketik cocok dengan di Database?
            // Hash::check akan mengecek text mentah vs text terenkripsi
            if (!Hash::check($request->password_lama, $user->password)) {
                return response()->json([
                    'code' => 400,
                    'success' => false,
                    'message' => 'Pembaruan gagal. Password lama yang Anda ketikkan salah.'
                ], 400);
            }

            // 3. Ganti passwordnya, dan pastikan DI-ENKRIPSI kembali sebelum disimpan!
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
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
