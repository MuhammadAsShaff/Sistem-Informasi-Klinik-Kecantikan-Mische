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
     * getAllUsers
     * 
     * Mengambil daftar seluruh pengguna (Bisa difilter menjadi Customer atau Admin di Frontend).
     * Digunakan pada Menu Manajemen Akun di sisi Admin.
     */
    public function getAllUsers()
    {
        try {
            // Mengambil semua data user beserta relasi tabel "Buku Alamat" mereka, dipaginasi 10 per halaman
            $users = User::with(['alamats', 'alamatUtama'])->latest()->paginate(10);

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
     * getUserById
     * 
     * Mengambil detail 1 profil pengguna lengkap beserta susunan alamatnya (Saat Admin mengklik icon Detail).
     */
    public function getUserById($idUser)
    {
        try {
            // findOrFail: Akan otomatis melempar error (Exception) kalau ID yang dicari tidak ada di database
            $user = User::with(['alamats', 'alamatUtama'])->findOrFail($idUser);

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
     * createUser
     * 
     * Menambahkan akun pengguna baru secara manual dari sisi panel Admin.
     * Dapat mendaftarkan Admin Baru, atau mendaftarkan Customer yang datang langsung (Walk-in) ke klinik.
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

        // DB::beginTransaction() digunakan untuk memastikan 2 Tabel (User & Alamat) tersimpan secara atomik.
        // Jika tabel User sukses tapi tabel Alamat gagal, tabel User akan ikut dibatalkan simpannya (Rollback).
        DB::beginTransaction();
        try {
            // 1. Buat Akun Profil Inti
            $user = User::create([
                'nama' => $request->nama,
                'jenisKelamin' => $request->jenisKelamin,
                'tanggalLahir' => $request->tanggalLahir,
                'role' => $request->role,
                'email' => $request->email,
                'nomorWa' => $request->nomorWa,
                // WAJIB: Enkripsi / Acak Password
                'password' => Hash::make($request->password)
            ]);

            // 2. Jika akun yang dibuat adalah Customer, dan Admin mengisi form Alamat lengkap
            if ($user->role === 'customer' && $request->filled('provinceId')) {
                // Simpan Alamat Pertamanya di tabel alamat_customer
                $alamat = AlamatCustomer::create([
                    'idUser' => $user->idUser,
                    'namaPenerima' => $user->nama,
                    'nomorHp' => $user->nomorWa,
                    'provinceId' => $request->provinceId,
                    'cityId' => $request->cityId,
                    'districtId' => $request->kecamatan, // Menyesuaikan input name frontend
                    'kodePos' => $request->kodePos,
                    'detailAlamat' => $request->detailAlamat
                ]);

                // 3. Update profil inti: Jadikan alamat ini sebagai alamat Utama (Centang Hijau Default)
                $user->update(['idAlamatUtama' => $alamat->id]);
            }

            // Sah-kan penyimpanan ke Database
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Akun userr baru berhasil ditambahkan',
                // load('alamatUtama') menarik relasinya sekalian untuk respon balik
                'data' => $user->load('alamatUtama')
            ], 201);
        } catch (\Exception $e) {
            // Batalkan semua query ke DB karena terjadi error
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem saat mendaftarkan user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * updateUser
     * 
     * Mengedit Biodata dan sinkronisasi banyak alamat (Array) dari pengguna tertentu (Khusus Admin).
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
                // Pengecualian unik: Boleh menyamai email miliknya sendiri (Pengecualian ID ini)
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
                // Password boleh kosong, artinya Admin tidak mau mereset password customer
                'password' => ['nullable', 'string', \Illuminate\Validation\Rules\Password::min(8)->mixedCase()]
            ], $pesanEror);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ada format inputan yang kurang tepat',
                    'errors' => $validator->errors()
                ], 400);
            }

            // Pisahkan field password dan alamat_lengkap dari data regular agar tidak error (Keduanya butuh perlakuan khusus)
            $dataToUpdate = $request->except(['password', 'alamat_lengkap']);

            // Jika Admin mereset/mengganti password, maka hash ulang
            if ($request->filled('password')) {
                $dataToUpdate['password'] = Hash::make($request->password);
            }

            // Update profil Biodata dasar
            $user->update($dataToUpdate);

            // =========================================================================
            // SINKRONISASI ALAMAT ARRAY (Logic yang paling canggih di Controller Ini)
            // =========================================================================
            if ($user->role === 'customer' && $request->has('alamat_lengkap')) {
                $payloadAlamat = $request->alamat_lengkap;
                
                // 1. Saring ID alamat yang valid (ID Asli biasanya di bawah 1 juta).
                // Frontend React kadang memberi ID buatan sementara (seperti 123456789) untuk alamat yang baru diketik namun belum disave.
                $realIds = collect($payloadAlamat)
                    ->pluck('id')
                    ->filter(function ($id) {
                        return $id && $id < 1000000;
                    })->toArray();

                // 2. HAPUS ALAMAT: 
                // Jika di DB dia punya 3 alamat, tapi dari Payload Frontend cuma ngirim 2 alamat, 
                // berarti 1 alamat sudah sengaja dihapus oleh Admin di tampilan, kita hapus juga di DB!
                AlamatCustomer::where('idUser', $user->idUser)
                    ->whereNotIn('id', $realIds)
                    ->delete();

                $idUtamaBaru = null;

                // 3. Proses INSERT BARU atau UPDATE LAMA berdasarkan List Payload
                foreach ($payloadAlamat as $item) {
                    $isNew = (!isset($item['id']) || $item['id'] > 1000000);

                    if ($isNew) {
                        // Jika tidak ada ID atau ID-nya jutaan (ID palsu buatan React), berarti ini Alamat Baru!
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

                        // Jika dia dicentang is_utama = true, ingat ID-nya!
                        if (isset($item['is_utama']) && $item['is_utama']) {
                            $idUtamaBaru = $alamatBaru->id;
                        }
                    } else {
                        // Jika ID-nya asli (Angka wajar), berarti ini cuma Update Alamat yang sudah ada!
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

                            // Jika dia dicentang is_utama = true, ingat ID-nya!
                            if (isset($item['is_utama']) && $item['is_utama']) {
                                $idUtamaBaru = $alamatLama->id;
                            }
                        }
                    }
                }

                // 4. Update Siapa Alamat Utamanya (Default Delivery)
                if ($idUtamaBaru) {
                    $user->update(['idAlamatUtama' => $idUtamaBaru]);
                } else if ($request->has('alamat_lengkap') && empty($request->alamat_lengkap)) {
                    // Jika Payload dikirim tapi Array Kosong (Semua alamat dihapus bersih)
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
     * deleteUser
     * 
     * Menghapus Akun secara ekstrim (Permanen) dari Sistem (Hati-hati, histori transaksinya bisa hilang karena cascade delete).
     */
    public function deleteUser($idUser)
    {
        try {
            $user = User::findOrFail($idUser);
            $user->delete();

            // Status 204 berarti Operasi Delete sukses tanpa kembalian pesan json
            return response()->noContent();
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Data itu sudah dihapus atau tidak ditemukan'], 404);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Terjadi kendala saat menyingkirkan user', 'error' => $e->getMessage()], 500);
        }
    }
}
