<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class ProfilCustomerController extends Controller
{
    /**
     * Tampil Profil Customer
     * 
     * Mengambil data profil milik customer yang sedang login saat ini.
     */
    public function getProfileCustomer(Request $request)
    {

        try {
            $user = auth()->user();

            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil data profil customer',
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem saat mengambil data profil customer',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Edit Profil Customer
     * 
     * Memperbarui profil milik customer yang sedang login saat ini.
     */
    public function updateProfileCustomer(Request $request)
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

            $validator = Validator::make($request->all(), [
                'nama' => 'required|string|max:60',
                'alamat' => 'required|string|max:60',
                'jenisKelamin' => 'required|string|max:12',
                'tanggalLahir' => 'required|date',
                'email' => 'required|email|max:50|unique:user,email,' . $user->idUser . ',idUser',
                'nomorWa' => 'required|string|max:16',
                'password' => ['nullable', 'string', \Illuminate\Validation\Rules\Password::min(8)->mixedCase()]
            ], $pesanEror);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Mohon periksa kembali inputan Anda',
                    'errors' => $validator->errors()
                ], 400);
            }

            // Siapkan variabel penampung pembaruan data tanpa melibatkan role
            $updateData = [
                'nama' => $request->nama,
                'alamat' => $request->alamat,
                'jenisKelamin' => $request->jenisKelamin,
                'tanggalLahir' => $request->tanggalLahir,
                'email' => $request->email,
                'nomorWa' => $request->nomorWa,
            ];

            // Jika ada password yang diisi, berarti dia ingin mengganti password lamanya
            if ($request->filled('password')) {
                $updateData['password'] = Hash::make($request->password);
            }

            $user->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Profil berhasil diperbarui',
                'data' => $user
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Profil yang mau diedit tidak ditemukan'], 404);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Gagal memperbarui data', 'error' => $e->getMessage()], 500);
        }
    }
}
