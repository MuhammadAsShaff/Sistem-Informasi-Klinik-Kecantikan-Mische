<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class KelolaUserController extends Controller
{
    public function getAllUsers()
    {
        try {
            // Mengambil semua data user dengan paginasi 
            $users = User::latest()->paginate(10);
            
            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil semua data user',
                'data' => $users
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getUserById($idUser)
    {
        try {
            // Mencari user langsung ke intinya berdasarkan ID (findOrFail)
            $user = User::findOrFail($idUser);
            
            return response()->json([
                'success' => true,
                'message' => 'Berhasil menemukan user',
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'User dengan ID tersebut tidak ditemukan'
            ], 404);
        }
    }

    public function createUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:60',
            'alamat' => 'required|string|max:60',
            'jenisKelamin' => 'required|string|max:12',
            'tanggalLahir' => 'required|date',
            'role' => 'required|string|max:12',
            'email' => 'required|email|unique:user,email|max:50', // sesuaikan dengan nama tabel if not 'user'
            'nomorWa' => 'required|string|max:16',
            'password' => 'required|min:8'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Mohon periksa kembali inputan Anda',
                'errors' => $validator->errors()
            ], 400);
        }

        try {
            // Menghemat kueri dan sangat aman (Mass Assignment)
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
                'success' => true,
                'message' => 'Akun userr baru berhasil ditambahkan',
                'data' => $user
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem saat mendaftarkan user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateUser(Request $request, $idUser)
    {
        try {
            $user = User::findOrFail($idUser);

            $validator = Validator::make($request->all(), [
                'nama' => 'sometimes|string|max:60',
                'alamat' => 'sometimes|string|max:60',
                'jenisKelamin' => 'sometimes|string|max:12',
                'tanggalLahir' => 'sometimes|date',
                'role' => 'sometimes|string|max:12',
                'email' => 'sometimes|email|unique:user,email,' . $user->id,
                'nomorWa' => 'sometimes|string|max:16',
                // Password tidak wajib diisi saat mode edit
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ada format inputan yang kurang tepat',
                    'errors' => $validator->errors()
                ], 400);
            }

            // Pisahkan password dari data regular
            $dataToUpdate = $request->except('password');
            
            // Re-hash sandi jika ternyata diganti
            if ($request->filled('password')) {
                $dataToUpdate['password'] = Hash::make($request->password);
            }

            $user->update($dataToUpdate);

            return response()->json([
                'success' => true,
                'message' => 'Data user sukses diperbarui',
                'data' => $user
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'User yang mau diedit tidak ditemukan'], 404);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Gagal memperbarui data', 'error' => $e->getMessage()], 500);
        }
    }

    public function deleteUser($idUser)
    {
        try {
            $user = User::findOrFail($idUser);
            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'Satu pengguna telah dihilangkan secara permanen'
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Data itu sudah dihapus atau tidak ditemukan'], 404);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Terjadi kendala saat menyingkirkan user', 'error' => $e->getMessage()], 500);
        }
    }
}
