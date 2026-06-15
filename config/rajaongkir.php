<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Supported Shipping Couriers
    |--------------------------------------------------------------------------
    |
    | Ini adalah daftar kurir pengiriman yang aktif di backend Anda.
    | Ketika melakukan pengecekan ongkir berdasarkan alamat customer,
    | sistem akan memanggil API RajaOngkir/Komerce untuk semua kurir berikut,
    | lalu mengembalikan daftar ongkirnya secara lengkap.
    |
    | Kurir yang didukung (tergantung akun Komerce/RajaOngkir Anda):
    | - 'jne'
    | - 'pos'
    | - 'tiki'
    | - 'jnt' (khusus Komerce / RajaOngkir PRO)
    | - 'sicepat' (khusus Komerce / RajaOngkir PRO)
    |
    */
    'supported_couriers' => [
        'jne',
        'pos',
        'tiki',
        'jnt',
    ],
];
