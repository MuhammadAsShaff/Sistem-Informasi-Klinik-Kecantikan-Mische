<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProfilPerusahaan;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

// Perbaikan nama class menyesuaikan nama file (wajib PSR-4)
class ProfilePerusahaanController extends Controller
{
    /**
     * getProfile
     * 
     * Mengambil data profil perusahaan beserta seluruh strukturnya.
     * Biasanya hanya ada 1 record tunggal di tabel ini. (Khusus Admin).
     */
    public function getProfile()
    {
        // first() akan mengambil baris pertama dari tabel.
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
     * getPublicProfile
     * 
     * Mengambil data dasar perusahaan (Tentang Kami, Jam Buka, No CS, Visi Misi) 
     * untuk ditampilkan di Header/Footer/Halaman About pada Landing Page publik.
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
     * createProfile
     * 
     * Membuat data profil perusahaan baru JIKA sebelumnya masih kosong melompong (Khusus Admin).
     * Biasanya fungsi ini hanya dieksekusi 1 kali seumur hidup aplikasi saat setup awal.
     */
    public function createProfile(Request $request)
    {
        $pesanEror = [
            'visi.required' => 'Visi perusahaan wajib diisi.',
            'misi.required' => 'Misi perusahaan wajib diisi.',
            'fotoPerusahaan.required' => 'Foto/Logo perusahaan wajib diunggah.',
            'fotoPerusahaan.image' => 'File harus berupa gambar.',
            'fotoPerusahaan.mimes' => 'Format gambar yang diperbolehkan adalah jpeg, png, atau jpg.',
            'fotoPerusahaan.max' => 'Ukuran gambar maksimal 4MB.',
            'deskripsiPerusahaan.required' => 'Deskripsi perusahaan wajib diisi.',
            'nomorCustomerService.required' => 'Nomor Customer Service wajib diisi.',
            'nomorCustomerService.max' => 'Nomor Customer Service maksimal 16 karakter.',
            'jamBuka.required' => 'Jam buka wajib diisi.',
            'jamBuka.date_format' => 'Format jam buka harus HH:MM.',
            'jamTutup.required' => 'Jam tutup wajib diisi.',
            'jamTutup.date_format' => 'Format jam tutup harus HH:MM.',
        ];

        $validator = Validator::make($request->all(), [
            'visi' => 'required|string',
            'misi' => 'required|string',
            'fotoPerusahaan' => 'required|image|mimes:jpeg,png,jpg|max:4000', // Benar-benar file gambar. Maks 4MB
            'deskripsiPerusahaan' => 'required|string',
            'nomorCustomerService' => 'required|string|max:16',
            'jamBuka' => 'required|date_format:H:i',
            'jamTutup' => 'required|date_format:H:i',
        ], $pesanEror);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Mohon periksa kembali inputan',
                'error' => $validator->errors(),
            ], 400);
        }

        try {
            // Optimasi dan Penyimpanan File Gambar Logo Perusahaan menjadi WebP
            $fotoPath = null;
            if ($request->hasFile('fotoPerusahaan')) {
                $file = $request->file('fotoPerusahaan');
                $filename = time() . '_' . uniqid() . '.webp';
                
                $manager = new ImageManager(new Driver());
                $image = $manager->decode($file->getPathname());
                $webpData = $image->encodeUsingFileExtension('webp', 80)->toString();
                
                Storage::disk('public')->put('profil_perusahaan/' . $filename, $webpData);
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
     * updateProfile
     * 
     * Mengubah visi, misi, deskripsi, jadwal operasional, atau logo klinik (Khusus Admin).
     */
    public function updateProfile(Request $request, $idProfile) // Menangkap parameter dari URL /admin/clinic/{idProfile}
    {
        try {
            $profilPerusahaan = ProfilPerusahaan::findOrFail($idProfile);

            $pesanEror = [
                'visi.required' => 'Visi perusahaan wajib diisi.',
                'misi.required' => 'Misi perusahaan wajib diisi.',
                'fotoPerusahaan.image' => 'File harus berupa gambar.',
                'fotoPerusahaan.mimes' => 'Format gambar yang diperbolehkan adalah jpeg, png, atau jpg.',
                'fotoPerusahaan.max' => 'Ukuran gambar maksimal 4MB.',
                'deskripsiPerusahaan.required' => 'Deskripsi perusahaan wajib diisi.',
                'nomorCustomerService.required' => 'Nomor Customer Service wajib diisi.',
                'nomorCustomerService.max' => 'Nomor Customer Service maksimal 16 karakter.',
                'jamBuka.required' => 'Jam buka wajib diisi.',
                'jamBuka.date_format' => 'Format jam buka harus HH:MM.',
                'jamTutup.required' => 'Jam tutup wajib diisi.',
                'jamTutup.date_format' => 'Format jam tutup harus HH:MM.',
            ];

            $validator = Validator::make($request->all(), [
                'visi' => 'required|string',
                'misi' => 'required|string',
                'fotoPerusahaan' => 'nullable|image|mimes:jpeg,png,jpg|max:4000',
                'deskripsiPerusahaan' => 'required|string',
                'nomorCustomerService' => 'required|string|max:16',
                'jamBuka' => 'required|date_format:H:i',
                'jamTutup' => 'required|date_format:H:i',
            ], $pesanEror);

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

            // Jika ada kiriman file foto PERBAIKAN / Penggantian Logo dari Admin
            if ($request->hasFile('fotoPerusahaan')) {
                // Sapu bersih/Hapus gambar lama dari Harddisk Server agar tidak menumpuk memenuhi kuota server
                if ($profilPerusahaan->fotoPerusahaan) {
                    Storage::disk('public')->delete($profilPerusahaan->fotoPerusahaan);
                }

                $file = $request->file('fotoPerusahaan');
                $filename = time() . '_' . uniqid() . '.webp';
                
                $manager = new ImageManager(new Driver());
                $image = $manager->decode($file->getPathname());
                $webpData = $image->encodeUsingFileExtension('webp', 80)->toString();
                
                Storage::disk('public')->put('profil_perusahaan/' . $filename, $webpData);
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
     * deleteProfile
     * 
     * Menghapus master data profil perusahaan beserta logo dari server secara permanen (Khusus Admin).
     * SANGAT JARANG DIGUNAKAN.
     */
    public function deleteProfile($idProfile) // Langsung ambil parameter dari Route URL
    {
        try {
            $profilPerusahaan = ProfilPerusahaan::findOrFail($idProfile);

            // Perhatian: Karena ini di luar database, hancurkan juga file aslinya dari folder Server (Storage)
            if ($profilPerusahaan->fotoPerusahaan) {
                Storage::disk('public')->delete($profilPerusahaan->fotoPerusahaan);
            }

            // Perbaikan fatal (sebelumnya ::delete() statis, kini ->delete() pada instans model)
            $profilPerusahaan->delete(); 

            // Sesuai standar REST API, operasi DELETE yang berhasil tidak mengembalikan konten bodi JSON (Status 204)
            return response()->noContent();

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Profil yang mau dihapus tidak ditemukan'], 404);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Gagal menghapus data', 'error' => $e->getMessage()], 500);
        }
    }
}
