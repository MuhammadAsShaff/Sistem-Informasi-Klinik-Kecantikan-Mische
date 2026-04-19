<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JadwalReservasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JadwalReservasiController extends Controller
{
    /**
     * Mendapatkan semua jadwal reservasi (Untuk Admin)
     */
    public function getAllSchedule()
    {
        try {
            $jadwal = JadwalReservasi::orderBy('jamMulai', 'asc')->get();
            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil semua jadwal reservasi',
                'data' => $jadwal
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil jadwal',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mendapatkan jadwal reservasi untuk Publik (Tampil di Landing Page/Customer)
     */
    public function getPublicSchedule()
    {
        try {
            // Bisa menambahkan filter tertentu jika diperlukan (misal yang masih tersedia)
            $jadwal = JadwalReservasi::orderBy('jamMulai', 'asc')->get();
            
            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil list jadwal reservasi publik',
                'data' => $jadwal
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil jadwal publik',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Membuat jadwal reservasi baru (Hanya Admin)
     */
    public function createSchedule(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'jamMulai' => 'required|date_format:H:i',
            'jamSelesai' => 'required|date_format:H:i'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Format input kurang tepat. Pastikan format jam HH:MM (contoh: 08:00).',
                'errors' => $validator->errors()
            ], 400);
        }
        
        // Logika agar jamSelesai tidak lebih kecil/sama dengan jamMulai
        if(strtotime($request->jamSelesai) <= strtotime($request->jamMulai)) {
            return response()->json([
                'success' => false,
                'message' => 'Jam Selesai harus lebih besar dari Jam Mulai!'
            ], 400);
        }

        try {
            $jadwal = JadwalReservasi::create([
                'jamMulai' => $request->jamMulai,
                'jamSelesai' => $request->jamSelesai
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Jadwal reservasi baru berhasil ditambahkan',
                'data' => $jadwal
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem saat menambahkan jadwal',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mengubah jadwal reservasi (Hanya Admin)
     */
    public function updateSchedule(Request $request, $idJadwal)
    {
        try {
            $jadwal = JadwalReservasi::findOrFail($idJadwal);

            $validator = Validator::make($request->all(), [
                'jamMulai' => 'sometimes|date_format:H:i',
                'jamSelesai' => 'sometimes|date_format:H:i'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Format input kurang tepat. Pastikan format jam HH:MM (contoh: 08:00)',
                    'errors' => $validator->errors()
                ], 400);
            }

            // Validasi Logika agar jamSelesai tidak lebih kecil dari jamMulai
            $jamMulai = $request->jamMulai ?? $jadwal->jamMulai;
            $jamSelesai = $request->jamSelesai ?? $jadwal->jamSelesai;
            
            // Format ulang untuk strtotime
            // Karena dari DB kadang formatnya H:i:s, dari JSON H:i.
            $jamMulai = substr($jamMulai, 0, 5); 
            $jamSelesai = substr($jamSelesai, 0, 5); 

            if(strtotime($jamSelesai) <= strtotime($jamMulai)) {
                 return response()->json([
                    'success' => false,
                    'message' => 'Jam Selesai harus lebih besar dari Jam Mulai!'
                ], 400);
            }

            $jadwal->update([
                'jamMulai' => $jamMulai,
                'jamSelesai' => $jamSelesai
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Jadwal reservasi berhasil diperbarui',
                'data' => $jadwal
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Jadwal tidak ditemukan'], 404);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Gagal memperbarui jadwal', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Menghapus jadwal reservasi permanen (Hanya Admin)
     */
    public function deleteSchedule($idJadwal)
    {
        try {
            $jadwal = JadwalReservasi::findOrFail($idJadwal);
            $jadwal->delete();

            return response()->json([
                'success' => true,
                'message' => 'Jadwal reservasi telah dihapus secara permanen'
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Data jadwal tidak ditemukan'], 404);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Terjadi kendala saat menghapus jadwal', 'error' => $e->getMessage()], 500);
        }
    }
}
