<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Testimoni;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class TestimoniController extends Controller
{
    /**
     * getAllTestimonials
     * 
     * Mengambil daftar testimoni (Admin)
     */
    public function getAllTestimonials()
    {
        try {
            $testimoni = Testimoni::latest()->get();
            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil semua testimoni.',
                'data' => $testimoni
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data testimoni.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * getPublicTestimonials
     * 
     * Mengambil daftar testimoni untuk publik/customer
     */
    public function getPublicTestimonials()
    {
        try {
            $testimoni = Testimoni::latest()->get();
            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil list testimoni publik.',
                'data' => $testimoni
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data testimoni.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * getTestimoniById
     * 
     * Mengambil detail testimoni berdasarkan ID
     */
    public function getTestimoniById($idTestimoni)
    {
        try {
            $testimoni = Testimoni::find($idTestimoni);
            
            if (!$testimoni) {
                return response()->json([
                    'success' => false,
                    'message' => 'Testimoni tidak ditemukan.'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil detail testimoni.',
                'data' => $testimoni
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil detail testimoni.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * createTestimoni
     * 
     * Menambahkan testimoni baru (Admin)
     */
    public function createTestimoni(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'namaTester' => 'required|string|max:20',
                'jenisTestimoni' => 'required|string|max:60',
                'deskripsi' => 'required|string',
                'tanggalTreatment' => 'required|date',
                'buktiFoto' => 'required|image|mimes:jpeg,png,jpg|max:4000'
            ], [
                'namaTester.required' => 'Nama tester wajib diisi.',
                'namaTester.max' => 'Nama tester maksimal 20 karakter.',
                'jenisTestimoni.required' => 'Jenis testimoni wajib diisi.',
                'deskripsi.required' => 'Deskripsi testimoni wajib diisi.',
                'tanggalTreatment.required' => 'Tanggal treatment wajib diisi.',
                'tanggalTreatment.date' => 'Format tanggal tidak valid.',
                'buktiFoto.required' => 'Bukti foto wajib diunggah.',
                'buktiFoto.image' => 'File harus berupa gambar.',
                'buktiFoto.mimes' => 'Format gambar yang diperbolehkan adalah jpeg, png, atau jpg.',
                'buktiFoto.max' => 'Ukuran gambar maksimal 4MB.'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Terdapat kesalahan pada inputan Anda.',
                    'errors' => $validator->errors()
                ], 400);
            }

            $dataToInsert = $request->all();
            if ($request->hasFile('buktiFoto')) {
                $file = $request->file('buktiFoto');
                $filename = time() . '_' . uniqid() . '.webp';
                
                $manager = new ImageManager(new Driver());
                $image = $manager->read($file->getPathname());
                $webpData = $image->toWebp(80)->toString();
                
                Storage::disk('public')->put('testimoni/' . $filename, $webpData);
                $dataToInsert['buktiFoto'] = 'testimoni/' . $filename;
            }

            $testimoni = Testimoni::create($dataToInsert);

            return response()->json([
                'success' => true,
                'message' => 'Testimoni berhasil ditambahkan.',
                'data' => $testimoni
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan testimoni.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * updateTestimoni
     * 
     * Memperbarui testimoni yang ada (Admin)
     */
    public function updateTestimoni(Request $request, $idTestimoni)
    {
        try {
            $testimoni = Testimoni::find($idTestimoni);
            if (!$testimoni) {
                return response()->json([
                    'success' => false,
                    'message' => 'Testimoni tidak ditemukan.'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'namaTester' => 'required|string|max:20',
                'jenisTestimoni' => 'required|string|max:60',
                'deskripsi' => 'required|string',
                'tanggalTreatment' => 'required|date',
                'buktiFoto' => 'nullable|image|mimes:jpeg,png,jpg|max:4000'
            ], [
                'namaTester.required' => 'Nama tester wajib diisi.',
                'namaTester.max' => 'Nama tester maksimal 20 karakter.',
                'jenisTestimoni.required' => 'Jenis testimoni wajib diisi.',
                'deskripsi.required' => 'Deskripsi testimoni wajib diisi.',
                'tanggalTreatment.required' => 'Tanggal treatment wajib diisi.',
                'tanggalTreatment.date' => 'Format tanggal tidak valid.',
                'buktiFoto.image' => 'File harus berupa gambar.',
                'buktiFoto.mimes' => 'Format gambar yang diperbolehkan adalah jpeg, png, atau jpg.',
                'buktiFoto.max' => 'Ukuran gambar maksimal 4MB.'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Terdapat kesalahan pada inputan Anda.',
                    'errors' => $validator->errors()
                ], 400);
            }

            $dataToUpdate = $request->except(['buktiFoto']);
            
            if ($request->hasFile('buktiFoto')) {
                if ($testimoni->buktiFoto) {
                    Storage::disk('public')->delete($testimoni->buktiFoto);
                }
                $file = $request->file('buktiFoto');
                $filename = time() . '_' . uniqid() . '.webp';
                
                $manager = new ImageManager(new Driver());
                $image = $manager->read($file->getPathname());
                $webpData = $image->toWebp(80)->toString();
                
                Storage::disk('public')->put('testimoni/' . $filename, $webpData);
                $dataToUpdate['buktiFoto'] = 'testimoni/' . $filename;
            }

            $testimoni->update($dataToUpdate);

            return response()->json([
                'success' => true,
                'message' => 'Testimoni berhasil diperbarui.',
                'data' => $testimoni
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui testimoni.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * deleteTestimoni
     * 
     * Menghapus testimoni (Admin)
     */
    public function deleteTestimoni($idTestimoni)
    {
        try {
            $testimoni = Testimoni::find($idTestimoni);
            if (!$testimoni) {
                return response()->json([
                    'success' => false,
                    'message' => 'Testimoni tidak ditemukan.'
                ], 404);
            }

            if ($testimoni->buktiFoto) {
                Storage::disk('public')->delete($testimoni->buktiFoto);
            }
            
            $testimoni->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Testimoni berhasil dihapus.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus testimoni.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
