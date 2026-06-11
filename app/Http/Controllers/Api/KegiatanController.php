<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Kegiatan;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

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
            $pesanEror = [
                'namaKegiatan.required' => 'Nama kegiatan wajib diisi.',
                'namaKegiatan.max' => 'Nama kegiatan maksimal 60 karakter.',
                'deskripsi.required' => 'Deskripsi kegiatan wajib diisi.',
                'tanggalKegiatan.required' => 'Tanggal kegiatan wajib diisi.',
                'tanggalKegiatan.date' => 'Format tanggal tidak valid.',
                'foto.image' => 'File foto harus berupa gambar.',
                'foto.mimes' => 'Format gambar harus jpeg, png, jpg, atau gif.',
                'foto.max' => 'Ukuran foto maksimal 2MB.',
            ];

            $validator = Validator::make($request->all(), [
                'namaKegiatan' => 'required|string|max:60',
                'deskripsi' => 'required|string',
                'tanggalKegiatan' => 'required|date',
                'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ], $pesanEror);

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
                $file = $request->file('foto');
                $filename = time() . '_' . uniqid() . '.webp';
                
                $manager = new ImageManager(new Driver());
                $image = $manager->decode($file->getPathname());
                $webpData = $image->encodeUsingFileExtension('webp', 80)->toString();
                
                Storage::disk('public')->put('kegiatan/' . $filename, $webpData);
                $data['foto'] = 'kegiatan/' . $filename;
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

            $pesanEror = [
                'namaKegiatan.required' => 'Nama kegiatan wajib diisi.',
                'namaKegiatan.max' => 'Nama kegiatan maksimal 60 karakter.',
                'deskripsi.required' => 'Deskripsi kegiatan wajib diisi.',
                'tanggalKegiatan.required' => 'Tanggal kegiatan wajib diisi.',
                'tanggalKegiatan.date' => 'Format tanggal tidak valid.',
                'foto.image' => 'File foto harus berupa gambar.',
                'foto.mimes' => 'Format gambar harus jpeg, png, jpg, atau gif.',
                'foto.max' => 'Ukuran foto maksimal 2MB.',
            ];

            $validator = Validator::make($request->all(), [
                'namaKegiatan' => 'sometimes|required|string|max:60',
                'deskripsi' => 'sometimes|required|string',
                'tanggalKegiatan' => 'sometimes|required|date',
                'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ], $pesanEror);

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
                
                $file = $request->file('foto');
                $filename = time() . '_' . uniqid() . '.webp';
                
                $manager = new ImageManager(new Driver());
                $image = $manager->decode($file->getPathname());
                $webpData = $image->encodeUsingFileExtension('webp', 80)->toString();
                
                Storage::disk('public')->put('kegiatan/' . $filename, $webpData);
                $updateData['foto'] = 'kegiatan/' . $filename;
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

            // Sesuai standar REST API (204 No Content)
            return response()->noContent();

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Kegiatan tidak ditemukan'], 404);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Gagal menghapus kegiatan', 'error' => $e->getMessage()], 500);
        }
    }
}
