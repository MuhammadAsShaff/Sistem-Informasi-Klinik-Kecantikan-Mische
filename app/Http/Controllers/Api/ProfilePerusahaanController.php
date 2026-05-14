<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProfilPerusahaan;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

// Perbaikan nama class menyesuaikan nama file (wajib PSR-4)
class ProfilePerusahaanController extends Controller
{
    /**
     * Tampil Profil Lengkap (Admin)
     * 
     * Mengambil data profil perusahaan beserta seluruh strukturnya (Khusus Admin).
     */
    public function getProfile()
    {
        $profil = ProfilPerusahaan::first();

        if (!$profil) {
            return response()->json([
                'success' => false,
                'message' => 'Data profil perusahaan belum dibuat.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Berhasil mengambil profil perusahaan (Admin)',
            'data' => $profil
        ], 200);
    }

    /**
     * Tampil Profil (Publik)
     * 
     * Mengambil profil perusahaan untuk ditampilkan di Landing Page publik.
     */
    public function getPublicProfile()
    {
        $profil = ProfilPerusahaan::first();

        if (!$profil) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada data profil yang tersedia.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Berhasil mengambil profil perusahaan (public)',
            'data' => $profil
        ], 200);
    }

    /**
     * Tambah Profil Baru
     * 
     * Membuat data profil perusahaan baru jika sebelumnya kosong (Khusus Admin).
     */
    public function createProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'visi' => 'required|string',
            'misi' => 'required|string',
            'fotoPerusahaan' => 'required|image|mimes:jpeg,png,jpg|max:4000', // Benar-benar file gambar. Maks 2MB
            'deskripsiPerusahaan' => 'required|string',
            'nomorCustomerService' => 'required|string|max:16',
            'jamBuka' => 'required|date_format:H:i',
            'jamTutup' => 'required|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Mohon periksa kembali inputan',
                'error' => $validator->errors(),
            ], 400);
        }

        try {
            $fotoPath = null;
            // Jika ada payload FILE masuk dengan nama field 'fotoPerusahaan'
            if ($request->hasFile('fotoPerusahaan')) {
                $file = $request->file('fotoPerusahaan');

                // BYPASS Windows/Laragon real_path bug
                $filename = $file->hashName(); // Buat nama file unik acak
                Storage::disk('public')->put('profil_perusahaan/' . $filename, file_get_contents($file->getPathname()));

                $fotoPath = 'profil_perusahaan/' . $filename;
            }

            $profilPerusahaan = ProfilPerusahaan::create([
                'visi' => $request->visi,
                'misi' => $request->misi,
                'fotoPerusahaan' => $fotoPath, // Simpan path lokasi foto ke dalam table database
                'deskripsiPerusahaan' => $request->deskripsiPerusahaan,
                'nomorCustomerService' => $request->nomorCustomerService,
                'jamBuka' => $request->jamBuka,
                'jamTutup' => $request->jamTutup,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Berhasil menambahkan data profil',
                'data' => $profilPerusahaan,
            ], 201); // 201 Created code
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem saat menambahkan profil',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Edit Profil Perusahaan
     * 
     * Mengubah visi, misi, deskripsi, atau logo perusahaan (Khusus Admin).
     */
    public function updateProfile(Request $request, $idProfile) // Menangkap parameter dari URL /admin/clinic/{idProfile}
    {
        try {
            $profilPerusahaan = ProfilPerusahaan::findOrFail($idProfile);

            $validator = Validator::make($request->all(), [
                'visi' => 'required|string',
                'misi' => 'required|string',
                'fotoPerusahaan' => 'nullable|image|mimes:jpeg,png,jpg|max:4000', // Boleh kosong jika tidak mau ganti jepretan foto
                'deskripsiPerusahaan' => 'required|string',
                'nomorCustomerService' => 'required|string|max:16',
                'jamBuka' => 'required|date_format:H:i',
                'jamTutup' => 'required|date_format:H:i',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Mohon periksa kembali inputan',
                    'error' => $validator->errors(),
                ], 400);
            }

            // Keranjang penampung data teks biasa (selain foto)
            $dataToUpdate = [
                'visi' => $request->visi,
                'misi' => $request->misi,
                'deskripsiPerusahaan' => $request->deskripsiPerusahaan,
                'nomorCustomerService' => $request->nomorCustomerService,
                'jamBuka' => $request->jamBuka,
                'jamTutup' => $request->jamTutup,
            ];

            // Jika ada kiriman file foto PERBAIKAN dari Client
            if ($request->hasFile('fotoPerusahaan')) {
                // Sapu bersih/Hapus gambar lama dari Harddisk Server agar tidak menumpuk memenuhi kuota
                if ($profilPerusahaan->fotoPerusahaan) {
                    Storage::disk('public')->delete($profilPerusahaan->fotoPerusahaan);
                }

                $file = $request->file('fotoPerusahaan');

                // BYPASS Windows/Laragon real_path bug
                $filename = $file->hashName();
                Storage::disk('public')->put('profil_perusahaan/' . $filename, file_get_contents($file->getPathname()));

                $dataToUpdate['fotoPerusahaan'] = 'profil_perusahaan/' . $filename;
            }

            $profilPerusahaan->update($dataToUpdate);

            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengubah data profil',
                'data' => $profilPerusahaan,
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Profil yang mau diedit tidak ditemukan'], 404);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Gagal memperbarui data', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Hapus Profil Perusahaan
     * 
     * Menghapus profil perusahaan beserta logo dari server secara permanen (Khusus Admin).
     */
    public function deleteProfile($idProfile) // Langsung ambil parameter dari Route URL
    {
        try {
            $profilPerusahaan = ProfilPerusahaan::findOrFail($idProfile);

            // Perhatian: Karena ini di luar database, hancurkan juga file asli dari Server jika rute datanya dihapus
            if ($profilPerusahaan->fotoPerusahaan) {
                Storage::disk('public')->delete($profilPerusahaan->fotoPerusahaan);
            }

            $profilPerusahaan->delete(); // Perbaikan fatal: panggil dengan object ->delete() (BUKAN ::delete())

            // Sesuai standar REST API, operasi DELETE yang berhasil tidak mengembalikan konten (204)
            return response()->noContent();

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Profil yang mau dihapus tidak ditemukan'], 404);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Gagal menghapus data', 'error' => $e->getMessage()], 500);
        }
    }
}
