<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AlamatCustomer;
use Illuminate\Support\Facades\Validator;

class AlamatCustomerController extends Controller
{
    /**
     * getCustomerAddresses
     * 
     * Menampilkan daftar alamat yang disimpan oleh Customer yang sedang login.
     */
    public function getCustomerAddresses()
    {
        // Mengambil ID User dari token JWT yang dikirim dari Frontend
        $idUser = auth('api')->user()->idUser;
        
        // Tarik semua data alamat milik user tersebut
        $alamat = AlamatCustomer::where('idUser', $idUser)->get();

        return response()->json([
            'status' => 'success',
            'data' => $alamat
        ], 200);
    }

    /**
     * createAddress
     * 
     * Menambahkan alamat pengiriman baru untuk Customer yang sedang login.
     */
    public function createAddress(Request $request)
    {
        $idUser = auth('api')->user()->idUser;

        // 1. Cek Limitasi Maksimal Alamat (Aturan Bisnis: Maksimal 3 alamat per akun)
        $jumlahAlamat = AlamatCustomer::where('idUser', $idUser)->count();
        if ($jumlahAlamat >= 3) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda sudah mencapai batas maksimal 3 alamat.'
            ], 400); // 400 Bad Request
        }

        // 2. Validasi kelengkapan form input alamat
        $validator = Validator::make($request->all(), [
            'namaPenerima' => 'required|string|max:255',
            'nomorHp' => 'required|string|max:20',
            'detailAlamat' => 'required|string',
            'provinceId' => 'required|string',
            'cityId' => 'required|string',
            'districtId' => 'nullable|string',
            'kodePos' => 'required|string'
        ], [
            // Pesan Error Bahasa Indonesia yang Ramah Pengguna
            'namaPenerima.required' => 'Nama penerima wajib diisi.',
            'nomorHp.required' => 'Nomor HP wajib diisi.',
            'detailAlamat.required' => 'Detail alamat wajib diisi.',
            'provinceId.required' => 'Provinsi wajib dipilih.',
            'cityId.required' => 'Kota/Kabupaten wajib dipilih.',
            'kodePos.required' => 'Kode pos wajib diisi.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()
            ], 422); // 422 Unprocessable Entity
        }

        $data = $request->all();
        // Sisipkan ID User otomatis agar alamat ini terikat ke akunnya, bukan akun orang lain
        $data['idUser'] = $idUser;

        // 3. Simpan ke Database
        $alamat = AlamatCustomer::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Alamat berhasil ditambahkan',
            'data' => $alamat
        ], 201);
    }

    /**
     * updateAddress
     * 
     * Mengedit atau memperbarui rincian alamat yang sudah ada.
     */
    public function updateAddress(Request $request, $id)
    {
        $idUser = auth('api')->user()->idUser;
        
        // Validasi Ekstra: Pastikan alamat yang diedit BENAR-BENAR milik user yang sedang login! (Mencegah IDOR attack)
        $alamat = AlamatCustomer::where('idUser', $idUser)->where('id', $id)->first();

        if (!$alamat) {
            return response()->json([
                'status' => 'error',
                'message' => 'Alamat tidak ditemukan atau bukan milik Anda'
            ], 404);
        }

        // Validasi input
        $validator = Validator::make($request->all(), [
            'namaPenerima' => 'required|string|max:255',
            'nomorHp' => 'required|string|max:20',
            'detailAlamat' => 'required|string',
            'provinceId' => 'required|string',
            'cityId' => 'required|string',
            'districtId' => 'nullable|string',
            'kodePos' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()
            ], 422);
        }

        // Terapkan perubahan
        $alamat->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Alamat berhasil diperbarui',
            'data' => $alamat
        ], 200);
    }

    /**
     * deleteAddress
     * 
     * Menghapus salah satu alamat pengiriman.
     */
    public function deleteAddress($id)
    {
        $idUser = auth('api')->user()->idUser;
        
        // Pengecekan keamanan ganda: Hanya boleh menghapus alamat miliknya sendiri
        $alamat = AlamatCustomer::where('idUser', $idUser)->where('id', $id)->first();

        if (!$alamat) {
            return response()->json([
                'status' => 'error',
                'message' => 'Alamat tidak ditemukan atau bukan milik Anda'
            ], 404);
        }

        $alamat->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Alamat berhasil dihapus'
        ], 200);
    }
}
