<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProfilDokter;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ProfilDokterController extends Controller
{
    /**
     * getAllDoctors
     * 
     * Mengambil daftar dokter (Admin)
     */
    public function getAllDoctors()
    {
        try {
            $dokters = ProfilDokter::latest()->paginate(10);
            
            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil data dokter.',
                'data' => $dokters
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data dokter.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * getPublicDoctors
     * 
     * Menampilkan data dokter pada halaman customer (Customer)
     */
    public function getPublicDoctors()
    {
        try {
            $dokters = ProfilDokter::latest()->get();
            
            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil profil dokter untuk publik.',
                'data' => $dokters
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil profil dokter.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * getDoctorById
     * 
     * Mengambil data dokter berdasarkan id (Customer)
     */
    public function getDoctorById($idDokter)
    {
        try {
            $dokter = ProfilDokter::find($idDokter);

            if (!$dokter) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data dokter tidak ditemukan.'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil data dokter.',
                'data' => $dokter
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data dokter.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * createDoctor
     * 
     * Menambahkan data dokter (Admin)
     */
    public function createDoctor(Request $request)
    {
        try {
            $pesanEror = [
                'nama.required' => 'Nama dokter wajib diisi.',
                'nama.max' => 'Nama maksimal 60 karakter.',
                'foto.required' => 'Foto wajib diunggah.',
                'foto.image' => 'File harus berupa gambar.',
                'foto.mimes' => 'Format gambar yang diperbolehkan adalah jpeg, png, atau jpg.',
                'foto.max' => 'Ukuran gambar maksimal 4MB.',
                'email.required' => 'Email wajib diisi.',
                'email.email' => 'Format email tidak valid.',
                'email.unique' => 'Email ini sudah digunakan oleh dokter lain.',
                'deskripsi.required' => 'Deskripsi dokter wajib diisi.'
            ];

            $validator = Validator::make($request->all(), [
                'nama' => 'required|string|max:60',
                'foto' => 'required|image|mimes:jpeg,png,jpg|max:4000',
                'email' => 'required|email|unique:profilDokter,email',
                'deskripsi' => 'required|string'
            ], $pesanEror);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ada kesalahan pada form tambah dokter.',
                    'errors' => $validator->errors()
                ], 400);
            }

            $fotoPath = null;
            if ($request->hasFile('foto')) {
                $file = $request->file('foto');
                $filename = $file->hashName();
                Storage::disk('public')->put('profil_dokter/' . $filename, file_get_contents($file->getPathname()));
                $fotoPath = 'profil_dokter/' . $filename;
            }

            $dokter = ProfilDokter::create([
                'nama' => $request->nama,
                'foto' => $fotoPath,
                'email' => $request->email,
                'deskripsi' => $request->deskripsi
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Berhasil menambahkan data dokter.',
                'data' => $dokter
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan data dokter.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * updateDoctor
     * 
     * Memperbarui data dokter berdasarkan id (Admin)
     */
    public function updateDoctor(Request $request, $idDokter)
    {
        try {
            $dokter = ProfilDokter::find($idDokter);

            if (!$dokter) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data dokter tidak ditemukan.'
                ], 404);
            }

            $pesanEror = [
                'nama.required' => 'Nama dokter wajib diisi.',
                'nama.max' => 'Nama maksimal 60 karakter.',
                'foto.image' => 'File harus berupa gambar.',
                'foto.mimes' => 'Format gambar yang diperbolehkan adalah jpeg, png, atau jpg.',
                'foto.max' => 'Ukuran gambar maksimal 4MB.',
                'email.required' => 'Email wajib diisi.',
                'email.email' => 'Format email tidak valid.',
                'email.unique' => 'Email ini sudah digunakan oleh dokter lain.',
                'deskripsi.required' => 'Deskripsi dokter wajib diisi.'
            ];

            $validator = Validator::make($request->all(), [
                'nama' => 'required|string|max:60',
                'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:4000',
                'email' => 'required|email|unique:profilDokter,email,' . $idDokter . ',idDokter',
                'deskripsi' => 'required|string'
            ], $pesanEror);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ada kesalahan pada form ubah dokter.',
                    'errors' => $validator->errors()
                ], 400);
            }

            $dataToUpdate = [
                'nama' => $request->nama,
                'email' => $request->email,
                'deskripsi' => $request->deskripsi
            ];

            if ($request->hasFile('foto')) {
                if ($dokter->foto) {
                    Storage::disk('public')->delete($dokter->foto);
                }
                $file = $request->file('foto');
                $filename = $file->hashName();
                Storage::disk('public')->put('profil_dokter/' . $filename, file_get_contents($file->getPathname()));
                $dataToUpdate['foto'] = 'profil_dokter/' . $filename;
            }
            
            $dokter->update($dataToUpdate);

            return response()->json([
                'success' => true,
                'message' => 'Berhasil memperbarui data dokter.',
                'data' => $dokter
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui data dokter.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * deleteDoctor
     * 
     * Menghapus data dokter berdasarkan id (Admin)
     */
    public function deleteDoctor($idDokter)
    {
        try {
            $dokter = ProfilDokter::find($idDokter);

            if (!$dokter) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data dokter tidak ditemukan.'
                ], 404);
            }

            if ($dokter->foto) {
                Storage::disk('public')->delete($dokter->foto);
            }
            $dokter->delete();

            return response()->json([
                'success' => true,
                'message' => 'Data dokter berhasil dihapus.'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus data dokter.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * updateStatus
     * 
     * Mengubah status ketersediaan dokter (Admin)
     */
    public function updateStatus(Request $request, $idDokter)
    {
        try {
            $dokter = ProfilDokter::find($idDokter);
            if (!$dokter) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data dokter tidak ditemukan.'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'status' => 'required|in:Tersedia,Tidak Tersedia'
            ], [
                'status.required' => 'Status wajib diisi.',
                'status.in' => 'Status hanya boleh Tersedia atau Tidak Tersedia.'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Terdapat kesalahan pada inputan Anda.',
                    'errors' => $validator->errors()
                ], 400);
            }

            $dokter->update([
                'status' => $request->status
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Status dokter berhasil diubah menjadi ' . $request->status,
                'data' => $dokter
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengubah status dokter.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
