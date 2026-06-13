<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AlamatCustomer;
use Illuminate\Support\Facades\Validator;

class AlamatCustomerController extends Controller
{
    /**
     * Menampilkan daftar alamat (Customer)
     */
    public function getCustomerAddresses()
    {
        $idUser = auth('api')->user()->idUser;
        $alamat = AlamatCustomer::where('idUser', $idUser)->get();

        return response()->json([
            'status' => 'success',
            'data' => $alamat
        ], 200);
    }

    /**
     * Menambahkan alamat baru
     */
    public function createAddress(Request $request)
    {
        $idUser = auth('api')->user()->idUser;

        // Cek limit maksimal 3 alamat
        $jumlahAlamat = AlamatCustomer::where('idUser', $idUser)->count();
        if ($jumlahAlamat >= 3) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda sudah mencapai batas maksimal 3 alamat.'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'namaPenerima' => 'required|string|max:255',
            'nomorHp' => 'required|string|max:20',
            'detailAlamat' => 'required|string',
            'provinceId' => 'required|string',
            'cityId' => 'required|string',
            'districtId' => 'nullable|string',
            'kodePos' => 'required|string'
        ], [
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
            ], 422);
        }

        $data = $request->all();
        $data['idUser'] = $idUser;

        $alamat = AlamatCustomer::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Alamat berhasil ditambahkan',
            'data' => $alamat
        ], 201);
    }

    /**
     * Memperbarui alamat
     */
    public function updateAddress(Request $request, $id)
    {
        $idUser = auth('api')->user()->idUser;
        $alamat = AlamatCustomer::where('idUser', $idUser)->where('id', $id)->first();

        if (!$alamat) {
            return response()->json([
                'status' => 'error',
                'message' => 'Alamat tidak ditemukan atau bukan milik Anda'
            ], 404);
        }

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

        $alamat->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Alamat berhasil diperbarui',
            'data' => $alamat
        ], 200);
    }

    /**
     * Menghapus alamat
     */
    public function deleteAddress($id)
    {
        $idUser = auth('api')->user()->idUser;
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
