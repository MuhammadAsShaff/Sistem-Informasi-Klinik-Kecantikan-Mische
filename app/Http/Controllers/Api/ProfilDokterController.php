<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProfilDokter;
use Illuminate\Support\Facades\Validator;

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
                'foto.required' => 'Foto wajib diunggah/diisi.',
                'email.required' => 'Email wajib diisi.',
                'email.email' => 'Format email tidak valid.',
                'email.unique' => 'Email ini sudah digunakan oleh dokter lain.',
                'deskripsi.required' => 'Deskripsi dokter wajib diisi.'
            ];

            $validator = Validator::make($request->all(), [
                'nama' => 'required|string|max:60',
                'foto' => 'required|string', // bisa url/path, atau gunakan mimes jika file
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

            $dokter = ProfilDokter::create([
                'nama' => $request->nama,
                'foto' => $request->foto,
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
                'foto.required' => 'Foto wajib diunggah/diisi.',
                'email.required' => 'Email wajib diisi.',
                'email.email' => 'Format email tidak valid.',
                'email.unique' => 'Email ini sudah digunakan oleh dokter lain.',
                'deskripsi.required' => 'Deskripsi dokter wajib diisi.'
            ];

            $validator = Validator::make($request->all(), [
                'nama' => 'required|string|max:60',
                'foto' => 'required|string', 
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

            $dokter->nama = $request->nama;
            $dokter->foto = $request->foto;
            $dokter->email = $request->email;
            $dokter->deskripsi = $request->deskripsi;
            $dokter->save();

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
}
