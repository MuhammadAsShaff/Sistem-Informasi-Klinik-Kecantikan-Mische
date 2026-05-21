<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reservasi;
use Illuminate\Support\Facades\Validator;

class ReservasiController extends Controller
{
    /**
     * getAllReservations
     * 
     * Mengambil seluruh data reservasi. Khusus untuk Admin.
     */
    public function getAllReservations()
    {
        try {
            // Relasi ke tabel user, dokter, dan jadwal agar datanya lengkap saat ditarik
            $reservasi = Reservasi::with(['user', 'dokter', 'jadwal'])->latest()->paginate(10);
            
            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil semua data reservasi.',
                'data' => $reservasi
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data reservasi.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * createReservationAdmin
     * 
     * Melakukan pembuatan reservasi oleh admin untuk customer.
     */
    public function createReservationAdmin(Request $request)
    {
        try {
            $pesanEror = [
                'idUser.exists' => 'Customer tidak ditemukan di sistem.',
                'namaCustomer.required_without' => 'Nama customer wajib diisi jika bukan member.',
                'nomorWa.required_without' => 'Nomor WA wajib diisi jika bukan member.',
                'jenisTreatment.required' => 'Jenis treatment wajib diisi.',
                'tanggalReservasi.required' => 'Tanggal reservasi wajib diisi.',
                'tanggalReservasi.date' => 'Format tanggal reservasi tidak valid.',
                'idDokter.required' => 'Dokter wajib dipilih.',
                'idDokter.exists' => 'Dokter yang dipilih tidak ditemukan di sistem.',
                'idJadwal.required' => 'Jadwal waktu wajib dipilih.',
                'idJadwal.exists' => 'Jadwal yang dipilih tidak valid.'
            ];

            $validator = Validator::make($request->all(), [
                'idUser' => 'nullable|exists:user,idUser',
                'namaCustomer' => 'required_without:idUser|string|max:60',
                'nomorWa' => 'required_without:idUser|string|max:16',
                'jenisTreatment' => 'required|string|max:60',
                'tanggalReservasi' => 'required|date',
                'idDokter' => 'required|exists:profilDokter,idDokter',
                'idJadwal' => 'required|exists:jadwalReservasi,idJadwal',
                'status' => 'nullable|string|in:Menunggu,Dikonfirmasi,Batal,Selesai'
            ], $pesanEror);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ada kesalahan pada form pembuatan reservasi.',
                    'errors' => $validator->errors()
                ], 400);
            }

            // Mengecek apakah jadwal sudah dipakai orang lain
            $cekBentrokan = Reservasi::where('tanggalReservasi', $request->tanggalReservasi)
                                     ->where('idJadwal', $request->idJadwal)
                                     ->where('idDokter', $request->idDokter)
                                     ->whereIn('status', ['Menunggu', 'Dikonfirmasi'])
                                     ->exists();

            if ($cekBentrokan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Jadwal dokter pada waktu tersebut sudah penuh dipesan.'
                ], 400);
            }

            $namaCustomer = $request->namaCustomer;
            $nomorWa = $request->nomorWa;

            if ($request->idUser) {
                $user = \App\Models\User::find($request->idUser);
                $namaCustomer = $user->nama;
                $nomorWa = $user->nomorWa;
            }

            $reservasi = Reservasi::create([
                'namaCustomer' => $namaCustomer, 
                'nomorWa' => $nomorWa,   
                'jenisTreatment' => $request->jenisTreatment,
                'tanggalReservasi' => $request->tanggalReservasi,
                'status' => $request->status ?? 'Dikonfirmasi', // Admin biasa langsung konfirmasi
                'idUser' => $request->idUser, // Akan bernilai null jika tidak diisi
                'idDokter' => $request->idDokter,
                'idJadwal' => $request->idJadwal
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Reservasi berhasil dibuat oleh Admin!',
                'data' => $reservasi
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat reservasi.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * getCustomerReservations
     * 
     * Mengambil daftar reservasi khusus milik customer yang sedang login.
     */
    public function getCustomerReservations()
    {
        try {
            $user = auth('api')->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sesi Anda telah kedaluwarsa atau tidak valid. Silakan login kembali.'
                ], 401);
            }

            $reservasi = Reservasi::with(['dokter', 'jadwal'])
                                  ->where('idUser', $user->idUser)
                                  ->latest()
                                  ->paginate(10);

            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil data reservasi Anda.',
                'data' => $reservasi
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data reservasi.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * getDetailReservationCustomer
     * 
     * Menampilkan detail reservasi customer
     */
    public function getDetailReservationCustomer($idReservasi)
    {
        try {
            $user = auth('api')->user();

            $reservasi = Reservasi::with(['dokter', 'jadwal'])
                                  ->where('idReservasi', $idReservasi)
                                  ->where('idUser', $user->idUser)
                                  ->first();

            if (!$reservasi) {
                return response()->json([
                    'success' => false,
                    'message' => 'Detail reservasi tidak ditemukan atau bukan milik Anda.'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil detail reservasi.',
                'data' => $reservasi
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil detail reservasi.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * createReservationCustomer
     * 
     * Melakukan pemesanan reservasi oleh customer.
     */
    public function createReservationCustomer(Request $request)
    {
        try {
            $user = auth('api')->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sesi Anda telah kedaluwarsa atau tidak valid. Silakan login kembali.'
                ], 401);
            }

            $pesanEror = [
                'jenisTreatment.required' => 'Jenis treatment wajib dipilih.',
                'tanggalReservasi.required' => 'Tanggal reservasi wajib dipilih.',
                'tanggalReservasi.date' => 'Format tanggal reservasi tidak valid.',
                'idDokter.required' => 'Dokter wajib dipilih.',
                'idDokter.exists' => 'Dokter yang dipilih tidak ditemukan di sistem.',
                'idJadwal.required' => 'Jadwal waktu wajib dipilih.',
                'idJadwal.exists' => 'Jadwal yang dipilih tidak valid.'
            ];

            $validator = Validator::make($request->all(), [
                'jenisTreatment' => 'required|string|max:60',
                'tanggalReservasi' => 'required|date',
                'idDokter' => 'required|exists:profilDokter,idDokter',
                'idJadwal' => 'required|exists:jadwalReservasi,idJadwal'
            ], $pesanEror);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ada kesalahan pada form pemesanan reservasi.',
                    'errors' => $validator->errors()
                ], 400);
            }

            // Mengecek apakah di tanggal dan jadwal (waktu) tersebut, dokter tersebut sudah di-booking oleh orang lain
            $cekBentrokan = Reservasi::where('tanggalReservasi', $request->tanggalReservasi)
                                     ->where('idJadwal', $request->idJadwal)
                                     ->where('idDokter', $request->idDokter)
                                     ->whereIn('status', ['Menunggu', 'Dikonfirmasi'])
                                     ->exists();

            if ($cekBentrokan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Jadwal dokter pada waktu tersebut sudah penuh dipesan.'
                ], 400);
            }

            $reservasi = Reservasi::create([
                'namaCustomer' => $user->nama, // Ambil langsung dari profil
                'nomorWa' => $user->nomorWa,   // Ambil langsung dari profil
                'jenisTreatment' => $request->jenisTreatment,
                'tanggalReservasi' => $request->tanggalReservasi,
                'status' => 'Menunggu', // Default state ketika baru membuat pesanan
                'idUser' => $user->idUser,
                'idDokter' => $request->idDokter,
                'idJadwal' => $request->idJadwal
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Pemesanan reservasi berhasil dibuat!',
                'data' => $reservasi
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat reservasi.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * rescheduleReservationCustomer
     * 
     * Mengubah jadwal (reschedule) reservasi (Khusus Customer). Hanya bisa dilakukan 1 kali.
     */
    public function rescheduleReservationCustomer(Request $request, $idReservasi)
    {
        try {
            $user = auth('api')->user();

            $pesanEror = [
                'jenisTreatment.required' => 'Jenis treatment wajib diisi.',
                'tanggalReservasi.required' => 'Tanggal reservasi wajib diisi.',
                'tanggalReservasi.date' => 'Format tanggal reservasi tidak valid.',
                'idDokter.required' => 'Dokter wajib dipilih.',
                'idDokter.exists' => 'Dokter yang dipilih tidak ditemukan.',
                'idJadwal.required' => 'Jadwal wajib dipilih.',
                'idJadwal.exists' => 'Jadwal yang dipilih tidak valid.'
            ];

            $validator = Validator::make($request->all(), [
                'jenisTreatment' => 'required|string|max:60',
                'tanggalReservasi' => 'required|date',
                'idDokter' => 'required|exists:profilDokter,idDokter',
                'idJadwal' => 'required|exists:jadwalReservasi,idJadwal'
            ], $pesanEror);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ada kesalahan pada form perubahan jadwal.',
                    'errors' => $validator->errors()
                ], 400);
            }

            $reservasi = Reservasi::where('idReservasi', $idReservasi)
                                  ->where('idUser', $user->idUser)
                                  ->first();

            if (!$reservasi) {
                return response()->json([
                    'success' => false,
                    'message' => 'Reservasi tidak ditemukan atau bukan milik Anda.'
                ], 404);
            }

            // Validasi apakah sudah pernah reschedule?
            if ($reservasi->is_rescheduled) {
                return response()->json([
                    'success' => false,
                    'message' => 'Perubahan jadwal hanya bisa dilakukan maksimal 1 kali.'
                ], 403);
            }

            // Validasi apakah status masih memungkinkan untuk diubah
            if (!in_array($reservasi->status, ['Menunggu', 'Dikonfirmasi'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Reservasi dengan status ' . $reservasi->status . ' tidak dapat diubah jadwalnya.'
                ], 400);
            }

            // Cek bentrokan jadwal baru
            $cekBentrokan = Reservasi::where('tanggalReservasi', $request->tanggalReservasi)
                                     ->where('idJadwal', $request->idJadwal)
                                     ->where('idDokter', $request->idDokter)
                                     ->whereIn('status', ['Menunggu', 'Dikonfirmasi', 'Menunggu Merubah Jadwal', 'Dikonfirmasi Merubah Jadwal'])
                                     ->where('idReservasi', '!=', $idReservasi) // kecualikan diri sendiri
                                     ->exists();

            if ($cekBentrokan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Jadwal dokter pada waktu tersebut sudah penuh dipesan.'
                ], 400);
            }

            // Update status string
            if ($reservasi->status === 'Menunggu') {
                $reservasi->status = 'Menunggu Merubah Jadwal';
            } elseif ($reservasi->status === 'Dikonfirmasi') {
                $reservasi->status = 'Dikonfirmasi Merubah Jadwal';
            }

            // Update data jadwal
            $reservasi->jenisTreatment = $request->jenisTreatment;
            $reservasi->tanggalReservasi = $request->tanggalReservasi;
            $reservasi->idDokter = $request->idDokter;
            $reservasi->idJadwal = $request->idJadwal;
            $reservasi->is_rescheduled = true; // Tandai sudah diubah jadwalnya
            
            $reservasi->save();

            return response()->json([
                'success' => true,
                'message' => 'Jadwal reservasi Anda berhasil diubah.',
                'data' => $reservasi
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal merubah jadwal reservasi.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * updateStatusReservationAdmin
     * 
     * Mengubah status reservasi (Admin)
     */
    public function updateStatusReservationAdmin(Request $request, $idReservasi)
    {
        try {
            $pesanEror = [
                'status.required' => 'Status wajib diisi.',
                'status.in' => 'Status harus berupa salah satu dari: Menunggu, Dikonfirmasi, Selesai, Dibatalkan.'
            ];

            $validator = Validator::make($request->all(), [
                'status' => 'required|string|in:Menunggu,Dikonfirmasi,Selesai,Dibatalkan'
            ], $pesanEror);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ada kesalahan pada form update status.',
                    'errors' => $validator->errors()
                ], 400);
            }

            $reservasi = Reservasi::findOrFail($idReservasi);
            $reservasi->status = $request->status;
            $reservasi->save();

            return response()->json([
                'success' => true,
                'message' => 'Status reservasi berhasil diperbarui.',
                'data' => $reservasi
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Reservasi tidak ditemukan.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui status reservasi.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * deleteReservation
     * 
     * Menghapus data reservasi (Khusus Admin).
     */
    public function deleteReservation($idReservasi)
    {
        try {
            $reservasi = Reservasi::findOrFail($idReservasi);
            
            $reservasi->delete();

            return response()->json([
                'success' => true,
                'message' => 'Reservasi berhasil dihapus.'
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Reservasi tidak ditemukan.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan pada server saat menghapus.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
