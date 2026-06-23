<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class ProfilAdminController extends Controller
{
    /**
     * getProfileAdmin
     * 
     * Mengambil data profil milik Admin yang saat ini sedang login secara mandiri berdasarkan Token JWT.
     */
    public function getProfileAdmin(Request $request)
    {
        try {
            $user = auth()->user();

            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil data profil admin',
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem saat mengambil data profil admin',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * updateProfileAdmin
     * 
     * Memperbarui profil (Nama, Email, WhatsApp, Password) milik Admin yang saat ini sedang login.
     * Tidak memerlukan ID di parameter URL karena merujuk pada token auth()->user() sendiri (Keamanan berlapis).
     */
    public function updateProfileAdmin(Request $request)
    {
        try {
            $user = auth()->user();

            $pesanEror = [
                'nama.required' => 'Nama lengkap wajib diisi.',
                'alamat.required' => 'Alamat tidak boleh kosong.',
                'jenisKelamin.required' => 'Jenis kelamin harus dipilih.',
                'tanggalLahir.required' => 'Tanggal lahir wajib diisi.',
                'email.required' => 'Email wajib diisi.',
                'email.email' => 'Format email tidak valid.',
                'email.unique' => 'Email ini sudah terdaftar oleh pengguna lain.',
                'nomorWa.required' => 'Nomor WhatsApp wajib diisi.',
                'password.min' => 'Password minimal terdiri dari 8 karakter.',
                'password.mixed' => 'Pastikan kata sandimu menantang dengan menyisipkan huruf BESAR (A-Z) dan kecil (a-z).'
            ];

            // Validasi input. Khusus untuk rule 'unique:user,email', kita memberi PENGECUALIAN untuk idUser milik admin itu sendiri
            $validator = Validator::make($request->all(), [
                'nama' => 'required|string|max:60',
                
                'jenisKelamin' => 'required|string|max:12',
                'tanggalLahir' => 'required|date',
                'email' => 'required|email|max:50|unique:user,email,' . $user->idUser . ',idUser',
                'nomorWa' => 'required|string|max:16',
                // Password nullable: Artinya kalau form password dikosongkan, berarti admin tidak berniat mengganti password lamanya.
                'password' => ['nullable', 'string', \Illuminate\Validation\Rules\Password::min(8)->mixedCase()]
            ], $pesanEror);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Mohon periksa kembali inputan Anda',
                    'errors' => $validator->errors()
                ], 400);
            }

            // Siapkan variabel penampung pembaruan data tanpa melibatkan perubahan ROLE (Mencegah Admin tidak sengaja mengubah role jadi Customer)
            $updateData = [
                'nama' => $request->nama,
                'alamat' => $request->alamat,
                'jenisKelamin' => $request->jenisKelamin,
                'tanggalLahir' => $request->tanggalLahir,
                'email' => $request->email,
                'nomorWa' => $request->nomorWa,
            ];

            // Jika ada payload password yang diisi, berarti dia ingin mengganti password lamanya (Maka harus di hash)
            if ($request->filled('password')) {
                $updateData['password'] = Hash::make($request->password);
            }

            $user->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Profil Admin berhasil diperbarui',
                'data' => $user
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Profil admin yang mau diedit tidak ditemukan'], 404);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Gagal memperbarui data', 'error' => $e->getMessage()], 500);
        }
    }
}
