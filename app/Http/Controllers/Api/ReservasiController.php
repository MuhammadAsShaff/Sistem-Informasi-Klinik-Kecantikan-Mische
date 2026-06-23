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
            // latest() mengurutkan dari yang paling baru dibuat. paginate(10) membagi data jadi 10 baris per halaman.
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
     * Melakukan pembuatan reservasi oleh admin untuk customer (terutama bagi customer yang langsung datang ke klinik tanpa aplikasi).
     */
    public function createReservationAdmin(Request $request)
    {
        try {
            // Menyiapkan custom pesan error agar bahasa mudah dipahami user
            $pesanEror = [
                'idUser.exists' => 'Customer tidak ditemukan di sistem.',
                'namaCustomer.required_without' => 'Nama customer wajib diisi jika bukan member.',
                'nomorWa.required_without' => 'Nomor WA wajib diisi jika bukan member.',
                'kategoriReservasi.required' => 'Kategori reservasi wajib diisi.',
                'jenisReservasi.required' => 'Jenis reservasi wajib diisi.',
                'tanggalReservasi.required' => 'Tanggal reservasi wajib diisi.',
                'tanggalReservasi.date' => 'Format tanggal reservasi tidak valid.',
                'idDokter.required' => 'Dokter wajib dipilih.',
                'idDokter.exists' => 'Dokter yang dipilih tidak ditemukan di sistem.',
                'idJadwal.required' => 'Jadwal waktu wajib dipilih.',
                'idJadwal.exists' => 'Jadwal yang dipilih tidak valid.'
            ];

            // Validasi Input: 'required_without:idUser' artinya Admin harus mengisi Nama manual JIKA user tersebut belum terdaftar (bukan member)
            $validator = Validator::make($request->all(), [
                'idUser' => 'nullable|exists:user,idUser',
                'namaCustomer' => 'required_without:idUser|string|max:60',
                'nomorWa' => 'required_without:idUser|string|max:16',
                'kategoriReservasi' => 'required|string|max:60',
                'jenisReservasi' => 'required|string|max:60',
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

            // Mengecek apakah jadwal (Tanggal + Jam) sudah di-booking orang lain untuk Dokter yang sama
            // Kita mengecek status 'Menunggu' atau 'Dikonfirmasi' karena kalau 'Batal' berarti jam tersebut kosong lagi
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

            // Jika Admin menginputkan ID User (Customer terdaftar), maka data nama & no WA ditarik otomatis dari Database User
            if ($request->idUser) {
                $user = \App\Models\User::find($request->idUser);
                $namaCustomer = $user->nama;
                $nomorWa = $user->nomorWa;
            }

            // Menyimpan Data Reservasi
            $reservasi = Reservasi::create([
                'namaCustomer' => $namaCustomer, 
                'nomorWa' => $nomorWa,   
                'kategoriReservasi' => $request->kategoriReservasi,
                'jenisReservasi' => $request->jenisReservasi,
                'tanggalReservasi' => $request->tanggalReservasi,
                'status' => $request->status ?? 'Dikonfirmasi', // Admin biasa langsung konfirmasi (Bypass verifikasi)
                'idUser' => $request->idUser, // Akan bernilai null jika tidak diisi (Tamu walk-in)
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
     * Mengambil daftar reservasi khusus milik customer yang sedang login di aplikasi.
     */
    public function getCustomerReservations()
    {
        try {
            // Memastikan siapa yang sedang menggunakan aplikasi dengan mengecek Token JWT
            $user = auth('api')->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sesi Anda telah kedaluwarsa atau tidak valid. Silakan login kembali.'
                ], 401);
            }

            // Memanggil data reservasi yang 'idUser'-nya cocok dengan ID user login
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
     * Menampilkan informasi lebih rinci untuk 1 tiket reservasi tertentu (Misal di klik "Lihat Detail")
     */
    public function getDetailReservationCustomer($idReservasi)
    {
        try {
            $user = auth('api')->user();

            // Memastikan bahwa Reservasi yang dipanggil benar-benar milik user tersebut (Keamanan Data)
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
     * Melakukan pemesanan tiket reservasi secara mandiri oleh customer lewat aplikasi/web.
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
                'kategoriReservasi.required' => 'Kategori reservasi wajib dipilih.',
                'jenisReservasi.required' => 'Jenis reservasi wajib dipilih.',
                'tanggalReservasi.required' => 'Tanggal reservasi wajib dipilih.',
                'tanggalReservasi.date' => 'Format tanggal reservasi tidak valid.',
                'idDokter.required' => 'Dokter wajib dipilih.',
                'idDokter.exists' => 'Dokter yang dipilih tidak ditemukan di sistem.',
                'idJadwal.required' => 'Jadwal waktu wajib dipilih.',
                'idJadwal.exists' => 'Jadwal yang dipilih tidak valid.'
            ];

            $validator = Validator::make($request->all(), [
                'kategoriReservasi' => 'required|string|max:60',
                'jenisReservasi' => 'required|string|max:60',
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

            // Jika bentrok, tolak pemesanan dan minta customer cari jam lain
            if ($cekBentrokan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Jadwal dokter pada waktu tersebut sudah penuh dipesan.'
                ], 400);
            }

            // Pembuatan Reservasi Baru
            $reservasi = Reservasi::create([
                'namaCustomer' => $user->nama, // Nama otomatis ditarik dari profil akun (tidak bisa dipalsukan)
                'nomorWa' => $user->nomorWa,   
                'kategoriReservasi' => $request->kategoriReservasi,
                'jenisReservasi' => $request->jenisReservasi,
                'tanggalReservasi' => $request->tanggalReservasi,
                'status' => 'Menunggu', // Default state ketika baru membuat pesanan, butuh verifikasi Admin Klinik
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
     * Mengubah jadwal (reschedule) reservasi secara mandiri (Khusus Customer). 
     * Aturan Bisnis: Reschedule Hanya bisa dilakukan 1 kali untuk mencegah spam.
     */
    public function rescheduleReservationCustomer(Request $request, $idReservasi)
    {
        try {
            $user = auth('api')->user();

            $pesanEror = [
                'kategoriReservasi.required' => 'Kategori reservasi wajib diisi.',
                'jenisReservasi.required' => 'Jenis reservasi wajib diisi.',
                'tanggalReservasi.required' => 'Tanggal reservasi wajib diisi.',
                'tanggalReservasi.date' => 'Format tanggal reservasi tidak valid.',
                'idDokter.required' => 'Dokter wajib dipilih.',
                'idDokter.exists' => 'Dokter yang dipilih tidak ditemukan.',
                'idJadwal.required' => 'Jadwal wajib dipilih.',
                'idJadwal.exists' => 'Jadwal yang dipilih tidak valid.'
            ];

            $validator = Validator::make($request->all(), [
                'kategoriReservasi' => 'required|string|max:60',
                'jenisReservasi' => 'required|string|max:60',
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

            // Pastikan reservasi ini ada dan benar milik user yang request
            $reservasi = Reservasi::where('idReservasi', $idReservasi)
                                  ->where('idUser', $user->idUser)
                                  ->first();

            if (!$reservasi) {
                return response()->json([
                    'success' => false,
                    'message' => 'Reservasi tidak ditemukan atau bukan milik Anda.'
                ], 404);
            }

            // Validasi Aturan Bisnis: apakah sudah pernah di-reschedule sebelumnya?
            // is_rescheduled adalah tipe boolean (1/0)
            if ($reservasi->is_rescheduled) {
                return response()->json([
                    'success' => false,
                    'message' => 'Perubahan jadwal hanya bisa dilakukan maksimal 1 kali.'
                ], 403);
            }

            // Validasi Aturan Bisnis: Jangan izinkan ubah jadwal kalau statusnya sudah Selesai atau Dibatalkan
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
                                     ->where('idReservasi', '!=', $idReservasi) // kecualikan jadwal saya sendiri dari pengecekan
                                     ->exists();

            if ($cekBentrokan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Jadwal dokter pada waktu tersebut sudah penuh dipesan.'
                ], 400);
            }

            // Update status string agar Admin sadar bahwa customer ini habis meminta pindah jadwal
            if ($reservasi->status === 'Menunggu') {
                $reservasi->status = 'Menunggu Merubah Jadwal';
            } elseif ($reservasi->status === 'Dikonfirmasi') {
                $reservasi->status = 'Dikonfirmasi Merubah Jadwal';
            }

            // Timpa jadwal lama dengan jadwal yang baru dipilih
            $reservasi->kategoriReservasi = $request->kategoriReservasi;
            $reservasi->jenisReservasi = $request->jenisReservasi;
            $reservasi->tanggalReservasi = $request->tanggalReservasi;
            $reservasi->idDokter = $request->idDokter;
            $reservasi->idJadwal = $request->idJadwal;
            
            // Flag/Tandai bahwa jatah ganti jadwal sudah terpakai
            $reservasi->is_rescheduled = true; 
            
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
     * Admin mengubah status reservasi (Menunggu -> Dikonfirmasi -> Selesai)
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

            // findOrFail akan memunculkan Error 404 otomatis jika ID tidak ditemukan di database
            $reservasi = Reservasi::findOrFail($idReservasi);
            $reservasi->status = $request->status;
            $reservasi->save();

            return response()->json([
                'success' => true,
                'message' => 'Status reservasi berhasil diperbarui.',
                'data' => $reservasi
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Tangkapan otomatis jika findOrFail gagal
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
     * Menghapus data reservasi sepenuhnya (Khusus Admin).
     */
    public function deleteReservation($idReservasi)
    {
        try {
            $reservasi = Reservasi::findOrFail($idReservasi);
            
            // Hapus record dari database
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
