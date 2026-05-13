<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Kegiatan;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class KegiatanController extends Controller
{
    /**
     * Tampil Kegiatan Publik
     * 
     * Mengambil daftar semua kegiatan terbaru untuk ditampilkan di halaman publik.
     */
    public function getPublicKegiatan()
    {
        try {
            // Urutkan dari kegiatan terbaru
            $kegiatan = Kegiatan::orderBy('tanggalKegiatan', 'desc')->get();

            if ($kegiatan->isEmpty()) {
                return response()->json(['success' => false, 'message' => 'Tidak ada data kegiatan yang tersedia.'], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil daftar kegiatan (public)',
                'data' => $kegiatan
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Terjadi kesalahan sistem', 'error' => $e->getMessage()], 500);
        }
    }


 
    /**
     * Tampil Semua Kegiatan
     * 
     * Mengambil daftar lengkap seluruh kegiatan klinik (Khusus Admin).
     */
    public function getAllKegiatan()
    {
        try {
            $kegiatan = Kegiatan::orderBy('tanggalKegiatan', 'desc')->get();

            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil seluruh data kegiatan (admin)',
                'data' => $kegiatan
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Terjadi kesalahan sistem', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Tambah Kegiatan Baru
     * 
     * Menambahkan data kegiatan baru beserta upload foto (Khusus Admin).
     */
    public function createKegiatan(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'namaKegiatan' => 'required|string|max:60',
                'deskripsi' => 'required|string',
                'tanggalKegiatan' => 'required|date',
                'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Input data tidak valid',
                    'errors' => $validator->errors()->toArray()
                ], 400);
            }

            $data = $request->only(['namaKegiatan', 'deskripsi', 'tanggalKegiatan']);

            // Proses unggah foto jika ada
            if ($request->hasFile('foto')) {
                $fotoPath = $request->file('foto')->store('kegiatan', 'public');
                $data['foto'] = $fotoPath;
            } else {
                $data['foto'] = 'kegiatan/default.png'; // Fallback gambar default agar tidak error NOT NULL di DB
            }

            $kegiatan = Kegiatan::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Kegiatan baru berhasil ditambahkan',
                'data' => $kegiatan
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Gagal menambah kegiatan', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Edit Kegiatan
     * 
     * Memperbarui informasi kegiatan atau mengganti foto lama dengan yang baru (Khusus Admin).
     */
    public function updateKegiatan(Request $request, $idKegiatan)
    {
        try {
            $kegiatan = Kegiatan::findOrFail($idKegiatan);

            $validator = Validator::make($request->all(), [
                'namaKegiatan' => 'sometimes|required|string|max:60',
                'deskripsi' => 'sometimes|required|string',
                'tanggalKegiatan' => 'sometimes|required|date',
                'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Input data tidak valid',
                    'errors' => $validator->errors()->toArray()
                ], 400);
            }

            $updateData = $request->only(['namaKegiatan', 'deskripsi', 'tanggalKegiatan']);

            // Jika ada foto baru yang diunggah
            if ($request->hasFile('foto')) {
                // Hapus foto lama jika ada
                if ($kegiatan->foto && Storage::disk('public')->exists($kegiatan->foto)) {
                    Storage::disk('public')->delete($kegiatan->foto);
                }
                
                // Simpan foto baru
                $fotoPath = $request->file('foto')->store('kegiatan', 'public');
                $updateData['foto'] = $fotoPath;
            }

            $kegiatan->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Data kegiatan berhasil diperbarui',
                'data' => $kegiatan
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Kegiatan tidak ditemukan'], 404);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Gagal memperbarui kegiatan', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Hapus Kegiatan
     * 
     * Menghapus data kegiatan secara permanen beserta file fotonya dari server (Khusus Admin).
     */
    public function deleteKegiatan($idKegiatan)
    {
        try {
            $kegiatan = Kegiatan::findOrFail($idKegiatan);

            // Bersihkan file foto dari server agar tidak jadi sampah
            if ($kegiatan->foto && Storage::disk('public')->exists($kegiatan->foto)) {
                Storage::disk('public')->delete($kegiatan->foto);
            }

            $kegiatan->delete();

            // Menggunakan 200 OK karena jika 204 JSON body tidak akan muncul di dokumentasi/response
            return response()->json([
                'success' => true,
                'message' => 'Kegiatan berhasil dihapus'
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Kegiatan tidak ditemukan'], 404);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Gagal menghapus kegiatan', 'error' => $e->getMessage()], 500);
        }
    }
}
