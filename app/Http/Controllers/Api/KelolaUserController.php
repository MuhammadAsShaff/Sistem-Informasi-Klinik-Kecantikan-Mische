<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\AlamatCustomer;

class KelolaUserController extends Controller
{
    /**
     * Tampil Semua Pengguna
     * 
     * Mengambil daftar seluruh pengguna terdaftar (Khusus Admin).
     */
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

    /**
     * Tampil Pengguna Spesifik
     * 
     * Mengambil detail satu pengguna berdasarkan ID (Khusus Admin).
     */
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

    /**
     * Tambah Pengguna Baru
     * 
     * Mendaftarkan pengguna atau admin baru ke dalam sistem (Khusus Admin).
     */
    public function createUser(Request $request)
    {
        $pesanEror = [
            'nama.required' => 'Nama lengkap wajib diisi.',
            'jenisKelamin.required' => 'Jenis kelamin harus dipilih.',
            'tanggalLahir.required' => 'Tanggal lahir wajib diisi.',
            'role.required' => 'Role pengguna wajib ditentukan.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email ini sudah terdaftar sebelumnya.',
            'nomorWa.required' => 'Nomor WhatsApp wajib diisi.',
            'password.required' => 'Password tidak boleh kosong.',
            'password.min' => 'Password minimal terdiri dari 8 karakter.',
            'password.mixed' => 'Pastikan kata sandimu menantang dengan menyisipkan huruf BESAR (A-Z) dan kecil (a-z).'
        ];

        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:60',
            'jenisKelamin' => 'required|string|max:12',
            'tanggalLahir' => 'required|date',
            'role' => 'required|string|max:12',
            'email' => 'required|email|unique:user,email|max:50',
            'nomorWa' => 'required|string|max:16',
            'password' => ['required', 'string', \Illuminate\Validation\Rules\Password::min(8)->mixedCase()]
        ], $pesanEror);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Mohon periksa kembali inputan Anda',
                'errors' => $validator->errors()
            ], 400);
        }

        DB::beginTransaction();
        try {
            // Menghemat kueri dan sangat aman (Mass Assignment)
            $user = User::create([
                'nama' => $request->nama,
                'jenisKelamin' => $request->jenisKelamin,
                'tanggalLahir' => $request->tanggalLahir,
                'role' => $request->role,
                'email' => $request->email,
                'nomorWa' => $request->nomorWa,
                'password' => Hash::make($request->password)
            ]);

            // Jika role customer dan terdapat input alamat
            if ($user->role === 'customer' && $request->filled('provinceId')) {
                $alamat = AlamatCustomer::create([
                    'idUser' => $user->idUser,
                    'namaPenerima' => $user->nama,
                    'nomorHp' => $user->nomorWa,
                    'provinceId' => $request->provinceId,
                    'cityId' => $request->cityId,
                    'districtId' => $request->kecamatan, // map dari request->kecamatan
                    'kodePos' => $request->kodePos,
                    'detailAlamat' => $request->detailAlamat
                ]);

                // Set alamat ini sebagai alamat utama
                $user->update(['idAlamatUtama' => $alamat->id]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Akun userr baru berhasil ditambahkan',
                'data' => $user->load('alamatUtama')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem saat mendaftarkan user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Edit Pengguna
     * 
     * Memperbarui informasi profil dari pengguna tertentu (Khusus Admin).
     */
    public function updateUser(Request $request, $idUser)
    {
        DB::beginTransaction();
        try {
            $user = User::findOrFail($idUser);

            $pesanEror = [
                'nama.required' => 'Nama lengkap wajib diisi.',
                'jenisKelamin.required' => 'Jenis kelamin harus dipilih.',
                'tanggalLahir.required' => 'Tanggal lahir wajib diisi.',
                'role.required' => 'Role pengguna wajib ditentukan.',
                'email.required' => 'Email wajib diisi.',
                'email.email' => 'Format email tidak valid.',
                'email.unique' => 'Email ini sudah terdaftar oleh pengguna lain.',
                'nomorWa.required' => 'Nomor WhatsApp wajib diisi.',
                'password.min' => 'Password minimal terdiri dari 8 karakter.',
                'password.mixed' => 'Pastikan kata sandimu menantang dengan menyisipkan huruf BESAR (A-Z) dan kecil (a-z).'
            ];

            $validator = Validator::make($request->all(), [
                'nama' => 'sometimes|string|max:60',
                'jenisKelamin' => 'sometimes|string|max:12',
                'tanggalLahir' => 'sometimes|date',
                'role' => 'sometimes|string|max:12',
                'email' => 'sometimes|email|unique:user,email,' . $user->idUser . ',idUser',
                'nomorWa' => 'sometimes|string|max:16',
                'password' => ['nullable', 'string', \Illuminate\Validation\Rules\Password::min(8)->mixedCase()]
            ], $pesanEror);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ada format inputan yang kurang tepat',
                    'errors' => $validator->errors()
                ], 400);
            }

            // Pisahkan password dari data regular
            $dataToUpdate = $request->except(['password', 'alamat_lengkap']);

            // Re-hash sandi jika ternyata diganti
            if ($request->filled('password')) {
                $dataToUpdate['password'] = Hash::make($request->password);
            }

            $user->update($dataToUpdate);

            // Jika ada payload alamat_lengkap untuk disinkronisasi
            if ($user->role === 'customer' && $request->has('alamat_lengkap')) {
                $payloadAlamat = $request->alamat_lengkap;
                
                // Ambil ID yang dianggap data lama/asli (di bawah 1 juta)
                $realIds = collect($payloadAlamat)
                    ->pluck('id')
                    ->filter(function ($id) {
                        return $id && $id < 1000000;
                    })->toArray();

                // Hapus alamat lama milik user ini yang TIDAK dikirim lagi dari frontend
                AlamatCustomer::where('idUser', $user->idUser)
                    ->whereNotIn('id', $realIds)
                    ->delete();

                $idUtamaBaru = null;

                // Looping untuk Insert / Update
                foreach ($payloadAlamat as $item) {
                    $isNew = (!isset($item['id']) || $item['id'] > 1000000);

                    if ($isNew) {
                        // Insert Alamat Baru
                        $alamatBaru = AlamatCustomer::create([
                            'idUser' => $user->idUser,
                            'namaPenerima' => $item['namaPenerima'] ?? $user->nama,
                            'nomorHp' => $item['nomorHp'] ?? $user->nomorWa,
                            'provinceId' => $item['provinceId'] ?? null,
                            'cityId' => $item['cityId'] ?? null,
                            'districtId' => $item['kecamatan'] ?? null,
                            'kodePos' => $item['kodePos'] ?? null,
                            'detailAlamat' => $item['detailAlamat'] ?? null
                        ]);

                        if (isset($item['is_utama']) && $item['is_utama']) {
                            $idUtamaBaru = $alamatBaru->id;
                        }
                    } else {
                        // Update Alamat Lama
                        $alamatLama = AlamatCustomer::find($item['id']);
                        if ($alamatLama && $alamatLama->idUser == $user->idUser) {
                            $alamatLama->update([
                                'namaPenerima' => $item['namaPenerima'] ?? $alamatLama->namaPenerima,
                                'nomorHp' => $item['nomorHp'] ?? $alamatLama->nomorHp,
                                'provinceId' => $item['provinceId'] ?? $alamatLama->provinceId,
                                'cityId' => $item['cityId'] ?? $alamatLama->cityId,
                                'districtId' => $item['kecamatan'] ?? $alamatLama->districtId,
                                'kodePos' => $item['kodePos'] ?? $alamatLama->kodePos,
                                'detailAlamat' => $item['detailAlamat'] ?? $alamatLama->detailAlamat
                            ]);

                            if (isset($item['is_utama']) && $item['is_utama']) {
                                $idUtamaBaru = $alamatLama->id;
                            }
                        }
                    }
                }

                // Update idAlamatUtama di tabel user
                if ($idUtamaBaru) {
                    $user->update(['idAlamatUtama' => $idUtamaBaru]);
                } else if ($request->has('alamat_lengkap') && empty($request->alamat_lengkap)) {
                    // Jika semua dihapus
                    $user->update(['idAlamatUtama' => null]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Data user sukses diperbarui',
                'data' => $user->load('alamats')
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'User yang mau diedit tidak ditemukan'], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Gagal memperbarui data', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Hapus Pengguna
     * 
     * Menghapus data pengguna secara permanen dari sistem (Khusus Admin).
     */
    public function deleteUser($idUser)
    {
        try {
            $user = User::findOrFail($idUser);
            $user->delete();

            // Sesuai standar REST API (204 No Content)
            return response()->noContent();
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Data itu sudah dihapus atau tidak ditemukan'], 404);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Terjadi kendala saat menyingkirkan user', 'error' => $e->getMessage()], 500);
        }
    }
}
