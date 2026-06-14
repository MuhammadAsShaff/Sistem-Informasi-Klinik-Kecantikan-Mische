<?php

use Dedoc\Scramble\Http\Middleware\RestrictedDocsAccess;

return [
    /*
     * Your API path. By default, all routes starting with this path will be added to the docs.
     * If you need to change this behavior, you can add your custom routes resolver using `Scramble::routes()`.
     */
    'api_path' => 'api',

    /*
     * Your API domain. By default, app domain is used. This is also a part of the default API routes
     * matcher, so when implementing your own, make sure you use this config if needed.
     */
    'api_domain' => null,

    /*
     * The path where your OpenAPI specification will be exported.
     */
    'export_path' => 'api.json',

    'info' => [
        /*
         * API version.
         */
        'version' => env('API_VERSION', '1.0.0'),

        /*
         * Description rendered on the home page of the API documentation (`/docs/api`).
         */
        'description' => 'Selamat datang di Pusat Dokumentasi Resmi **Mische Beauty Clinic API**.

Sistem API ini merupakan fondasi utama bagi seluruh infrastruktur digital Mische Beauty Clinic, dirancang untuk melayani aplikasi pelanggan (Frontend) dan dashboard operasional (Admin) dengan performa tinggi dan keamanan mutakhir.

### 🛡️ Keamanan & Otentikasi
Seluruh rute privat dalam sistem ini dilindungi oleh **Stateless JWT (JSON Web Tokens)**. 
Untuk mengakses rute terlindungi, Anda diwajibkan untuk melakukan otentikasi melalui *endpoint* **Login** terlebih dahulu guna mendapatkan Bearer Token atau Token *Session Cookie*.

### 👥 Hak Akses (Roles)
Sistem ini membagi hak akses secara ketat ke dalam 3 level:
- **Public / Tamu** : Dapat melihat profil perusahaan, daftar kegiatan, daftar produk, promo aktif, testimoni, dan jadwal dokter secara bebas (Tanpa Login).
- **Customer** : Membutuhkan akun *Customer* untuk mengelola profil pribadi, alamat pengiriman (maks 3), memesan produk (Transaksi E-Commerce), dan membuat reservasi dokter.
- **Administrator** : Membutuhkan akun *Admin* untuk mengelola seluruh data operasional klinik secara mutlak (CRUD Produk, Dokter, Promo, Laporan Penjualan, dll).

### 🚀 Fitur Integrasi Eksternal Terkini
1. **RajaOngkir (Shipping)**: API ini terintegrasi penuh dengan RajaOngkir untuk menghitung biaya ongkos kirim secara dinamis berdasarkan provinsi dan kota pengiriman (*Endpoint* `/api/customer/rajaongkir/*`).
2. **Midtrans (Payment Gateway)**: Seluruh transaksi pembayaran menggunakan Midtrans Snap API. Sistem secara otomatis menerima *Webhook Notification* di latar belakang untuk memperbarui status pesanan menjadi `paid` secara *real-time* tanpa perlu aksi manual.
3. **Fonnte (WhatsApp Gateway)**: Mendukung notifikasi WhatsApp otomatis untuk konfirmasi OTP pendaftaran dan konfirmasi reservasi/pesanan melalui Fonnte API.

*Dokumentasi interaktif ini dihasilkan secara otomatis dari Source Code dan mematuhi spesifikasi OpenAPI.*',
    ],

    /*
     * Customize Stoplight Elements UI
     */
    'ui' => [
        /*
         * Define the title of the documentation's website. App name is used when this config is `null`.
         */
        'title' => 'Mische Beauty Clinic - API Docs',

        /*
         * Define the theme of the documentation. Available options are `light`, `dark`, and `system`.
         */
        'theme' => 'light',

        /*
         * Hide the `Try It` feature. Enabled by default.
         */
        'hide_try_it' => false,

        /*
         * Hide the schemas in the Table of Contents. Enabled by default.
         */
        'hide_schemas' => false,

        /*
         * URL to an image that displays as a small square logo next to the title, above the table of contents.
         */
        'logo' => '',

        /*
         * Use to fetch the credential policy for the Try It feature. Options are: omit, include (default), and same-origin
         */
        'try_it_credentials_policy' => 'include',

        /*
         * There are three layouts for Elements:
         * - sidebar - (Elements default) Three-column design with a sidebar that can be resized.
         * - responsive - Like sidebar, except at small screen sizes it collapses the sidebar into a drawer that can be toggled open.
         * - stacked - Everything in a single column, making integrations with existing websites that have their own sidebar or other columns already.
         */
        'layout' => 'responsive',
    ],

    /*
     * The list of servers of the API. By default, when `null`, server URL will be created from
     * `scramble.api_path` and `scramble.api_domain` config variables. When providing an array, you
     * will need to specify the local server URL manually (if needed).
     *
     * Example of non-default config (final URLs are generated using Laravel `url` helper):
     *
     * ```php
     * 'servers' => [
     *     'Live' => 'api',
     *     'Prod' => 'https://scramble.dedoc.co/api',
     * ],
     * ```
     */
    'servers' => null,

    /**
     * Determines how Scramble stores the descriptions of enum cases.
     * Available options:
     * - 'description' – Case descriptions are stored as the enum schema's description using table formatting.
     * - 'extension' – Case descriptions are stored in the `x-enumDescriptions` enum schema extension.
     *
     *    @see https://redocly.com/docs-legacy/api-reference-docs/specification-extensions/x-enum-descriptions
     * - false - Case descriptions are ignored.
     */
    'enum_cases_description_strategy' => 'description',

    /**
     * Determines how Scramble stores the names of enum cases.
     * Available options:
     * - 'names' – Case names are stored in the `x-enumNames` enum schema extension.
     * - 'varnames' - Case names are stored in the `x-enum-varnames` enum schema extension.
     * - false - Case names are not stored.
     */
    'enum_cases_names_strategy' => false,

    /**
     * When Scramble encounters deep objects in query parameters, it flattens the parameters so the generated
     * OpenAPI document correctly describes the API. Flattening deep query parameters is relevant until
     * OpenAPI 3.2 is released and query string structure can be described properly.
     *
     * For example, this nested validation rule describes the object with `bar` property:
     * `['foo.bar' => ['required', 'int']]`.
     *
     * When `flatten_deep_query_parameters` is `true`, Scramble will document the parameter like so:
     * `{"name":"foo[bar]", "schema":{"type":"int"}, "required":true}`.
     *
     * When `flatten_deep_query_parameters` is `false`, Scramble will document the parameter like so:
     *  `{"name":"foo", "schema": {"type":"object", "properties":{"bar":{"type": "int"}}, "required": ["bar"]}, "required":true}`.
     */
    'flatten_deep_query_parameters' => true,

    'middleware' => [
        'web',
        RestrictedDocsAccess::class,
    ],

    'extensions' => [],
];
