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
     * getPublicKegiatan
     * 
     * Mengambil daftar kegiatan klinik terbaru untuk ditampilkan di Landing Page (Bisa diakses tanpa Login).
     */
    public function getPublicKegiatan()
    {
        try {
            // Urutkan dari kegiatan terbaru berdasarkan tanggal pelaksanaannya
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
     * getAllKegiatan
     * 
     * Mengambil daftar lengkap seluruh kegiatan (Khusus untuk tabel manajemen Admin).
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
     * createKegiatan
     * 
     * Menambahkan data kegiatan (Dokumentasi / Galeri) baru beserta upload foto (Khusus Admin).
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

            // Proses unggah dan Kompresi foto (Menjadi WebP untuk loading web yang lebih ringan)
            if ($request->hasFile('foto')) {
                $file = $request->file('foto');
                $filename = time() . '_' . uniqid() . '.webp';
                
                $manager = new ImageManager(new Driver());
                $image = $manager->decode($file->getPathname());
                $webpData = $image->encodeUsingFileExtension('webp', 80)->toString();
                
                Storage::disk('public')->put('kegiatan/' . $filename, $webpData);
                $data['foto'] = 'kegiatan/' . $filename;
            } else {
                // Fallback gambar default agar tidak error karena kolom foto di DB tidak boleh NULL
                $data['foto'] = 'kegiatan/default.png'; 
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
     * updateKegiatan
     * 
     * Memperbarui/Mengedit teks kegiatan atau mengganti foto lama dengan foto yang baru (Khusus Admin).
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
                // Foto bisa saja nullable karena admin mungkin cuma mau ganti judulnya saja, tidak mau ganti foto
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

            // Proses Penggantian Foto
            if ($request->hasFile('foto')) {
                // 1. Bersihkan foto lama dari folder storage server (agar tidak numpuk jadi file yatim-piatu)
                if ($kegiatan->foto && Storage::disk('public')->exists($kegiatan->foto)) {
                    Storage::disk('public')->delete($kegiatan->foto);
                }
                
                // 2. Upload yang baru
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
     * deleteKegiatan
     * 
     * Menghapus data dokumentasi kegiatan secara permanen beserta file fotonya (Khusus Admin).
     */
    public function deleteKegiatan($idKegiatan)
    {
        try {
            $kegiatan = Kegiatan::findOrFail($idKegiatan);

            // Jangan biarkan gambarnya tersisa di server kalau datanya dihapus!
            if ($kegiatan->foto && Storage::disk('public')->exists($kegiatan->foto)) {
                Storage::disk('public')->delete($kegiatan->foto);
            }

            $kegiatan->delete();

            // Status HTTP 204 No Content untuk aksi hapus yang sukses tanpa data return
            return response()->noContent();

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Kegiatan tidak ditemukan'], 404);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Gagal menghapus kegiatan', 'error' => $e->getMessage()], 500);
        }
    }
}
