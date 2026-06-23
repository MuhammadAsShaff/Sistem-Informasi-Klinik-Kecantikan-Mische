<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JadwalReservasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JadwalReservasiController extends Controller
{
   
    /**
     * getAllSchedule
     * 
     * Menarik seluruh master data jadwal jam operasional/reservasi klinik (Khusus Admin).
     */
    public function getAllSchedule()
    {
        try {
            // Urutkan jadwal dari jam paling awal (08:00) ke jam paling akhir
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
     * getPublicSchedule
     * 
     * Mengambil daftar jadwal dokter yang aktif dan belum di-booking (Dilihat oleh Pengunjung/Customer).
     * Jika tanggal dan dokter diisi, sistem akan menandai jam mana yang "Sudah Terisi" (Tidak bisa di-klik).
     */
    public function getPublicSchedule(Request $request)
    {
        try {
            $jadwal = JadwalReservasi::orderBy('jamMulai', 'asc')->get();

            $tanggal = $request->query('tanggal');
            $idDokter = $request->query('idDokter');

            if ($tanggal && $idDokter) {
                // Cari apakah pada hari tersebut dan untuk dokter tersebut, sudah ada jam yang di-booking orang lain?
                // Hanya mengecek yang statusnya "Menunggu" atau "Dikonfirmasi" (Jika "Dibatalkan", berarti jam itu kosong lagi)
                $bookedJadwalIds = \App\Models\Reservasi::where('tanggalReservasi', $tanggal)
                    ->where('idDokter', $idDokter)
                    ->whereIn('status', ['Menunggu', 'Dikonfirmasi'])
                    ->pluck('idJadwal')
                    ->toArray();

                // Ubah (Transform) hasil respons: tambahkan properti "status" (Tersedia / Sudah Terisi) pada setiap jam
                $jadwal->transform(function ($item) use ($bookedJadwalIds) {
                    $item->status = in_array($item->idJadwal, $bookedJadwalIds) ? 'Sudah Terisi' : 'Tersedia';
                    return $item;
                });
            }

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
     * createSchedule
     * 
     * Membuat slot jam reservasi dokter yang baru (Misal: 08:00 sampai 09:00). (Khusus Admin)
     */
    public function createSchedule(Request $request)
    {
        $pesanEror = [
            'jamMulai.required' => 'Jam mulai wajib diisi.',
            'jamMulai.date_format' => 'Format jam mulai harus HH:MM.',
            'jamSelesai.required' => 'Jam selesai wajib diisi.',
            'jamSelesai.date_format' => 'Format jam selesai harus HH:MM.'
        ];

        // Validasi format jam harus pakai H:i (08:00, bukan jam 8 pagi)
        $validator = Validator::make($request->all(), [
            'jamMulai' => 'required|date_format:H:i',
            'jamSelesai' => 'required|date_format:H:i'
        ], $pesanEror);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Format input kurang tepat. Pastikan format jam HH:MM (contoh: 08:00).',
                'errors' => $validator->errors()
            ], 400);
        }

        // Pengecekan Logika Waktu: Mencegah Admin salah ketik. Jam Selesai tidak boleh lebih pagi dari Jam Mulai.
        if (strtotime($request->jamSelesai) <= strtotime($request->jamMulai)) {
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
     * updateSchedule
     * 
     * Mengedit jadwal (jam) yang sudah telanjur dibuat sebelumnya. (Khusus Admin)
     */
    public function updateSchedule(Request $request, $idJadwal)
    {
        try {
            $jadwal = JadwalReservasi::findOrFail($idJadwal);

            $pesanEror = [
                'jamMulai.date_format' => 'Format jam mulai harus HH:MM.',
                'jamSelesai.date_format' => 'Format jam selesai harus HH:MM.'
            ];

            // 'sometimes' berarti validasi ini hanya berjalan JIKA admin mengirimkan data jamMulai. Jika kosong, biarkan yang lama.
            $validator = Validator::make($request->all(), [
                'jamMulai' => 'sometimes|date_format:H:i',
                'jamSelesai' => 'sometimes|date_format:H:i'
            ], $pesanEror);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Format input kurang tepat. Pastikan format jam HH:MM (contoh: 08:00)',
                    'errors' => $validator->errors()
                ], 400);
            }

            // Gabungkan data baru dengan data lama jika admin hanya mengubah salah satu (Jam Mulai saja / Jam Selesai saja)
            $jamMulai = $request->jamMulai ?? $jadwal->jamMulai;
            $jamSelesai = $request->jamSelesai ?? $jadwal->jamSelesai;

            // Memotong format detik (H:i:s menjadi H:i) agar bisa di-convert dan dibandingkan oleh fungsi strtotime PHP
            $jamMulai = substr($jamMulai, 0, 5);
            $jamSelesai = substr($jamSelesai, 0, 5);

            if (strtotime($jamSelesai) <= strtotime($jamMulai)) {
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
     * deleteSchedule
     * 
     * Menghapus slot jam secara permanen (Khusus Admin). 
     * Hati-hati: Jika jam dihapus, reservasi yang terkait mungkin akan crash jika tidak dilindungi oleh foreign key (onDelete).
     */
    public function deleteSchedule($idJadwal)
    {
        try {
            $jadwal = JadwalReservasi::findOrFail($idJadwal);
            $jadwal->delete();

            // Sesuai standar REST API, bila data berhasil dihapus kita kembalikan response 204 No Content
            return response()->noContent();
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['success' => false, 'message' => 'Data jadwal tidak ditemukan'], 404);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Terjadi kendala saat menghapus jadwal', 'error' => $e->getMessage()], 500);
        }
    }
}
