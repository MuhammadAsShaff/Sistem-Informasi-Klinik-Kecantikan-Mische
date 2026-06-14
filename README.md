# Mische Beauty Clinic - Backend API

![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php&logoColor=white)
![JWT](https://img.shields.io/badge/JWT_Auth-Tymon-black?style=for-the-badge&logo=jsonwebtokens)
![PHPUnit](https://img.shields.io/badge/PHPUnit-Testing-3776AB?style=for-the-badge&logo=php)
![Midtrans](https://img.shields.io/badge/Midtrans-Payment-blue?style=for-the-badge)

Selamat datang di repositori resmi **Backend API Mische Beauty Clinic**. Sistem ini dibangun menggunakan arsitektur *RESTful API* berbasis Laravel yang tangguh, diamankan dengan *JSON Web Tokens (JWT)*, dan dirancang khusus untuk memenuhi kebutuhan administrasi, reservasi, serta layanan *e-commerce* klinik estetika modern.

## 🚀 Fitur Utama & Integrasi Eksternal

- **Otentikasi JWT Berkeamanan Tinggi**: Token disimpan di dalam *Cookie* (Session Cookie) atau diakses via *Bearer Token*, dilengkapi proteksi *Brute-Force Rate Limiting*.
- **Integrasi Midtrans (Payment Gateway)**: Memproses transaksi pembayaran produk secara instan, lengkap dengan penerimaan *Webhook Notification* untuk *update* status otomatis.
- **Integrasi RajaOngkir**: Menghitung tarif pengiriman ke seluruh Indonesia secara dinamis langsung dari API kurir lokal.
- **Integrasi Fonnte (WhatsApp Gateway)**: Mengirimkan kode OTP registrasi dan notifikasi status pesanan/reservasi secara otomatis ke nomor WhatsApp pelanggan.
- **Manajemen Hak Akses (Role-Based)**: Pemisahan rute ketat antara `Public`, `Customer`, dan `Admin` menggunakan *Middleware Custom*.
- **Dokumentasi Otomatis (Scramble)**: Seluruh *endpoint* API terdokumentasi dengan rapi dan interaktif (OAS 3.0) tanpa perlu anotasi manual.
- **Uji Kualitas Berlapis (Feature Testing)**: Dilindungi oleh lebih dari 100 *PHPUnit Tests* yang berjalan dalam *Database In-Memory* guna mencegah kebocoran *bug*.

## 📂 Struktur Modul

1. **Autentikasi & Pengguna**: Register (dengan verifikasi OTP WhatsApp), Login, Logout, dan Manajemen Profil.
2. **Klinik & Informasi Publik**: Manajemen Profil Perusahaan, Event/Kegiatan, Testimoni, Promo, dan Kategori Produk.
3. **Layanan Medis**: Pengelolaan Profil Dokter dan Sistem **Reservasi Jadwal Dokter** secara waktu nyata (*real-time*).
4. **E-Commerce (Penjualan Produk)**: 
   - Katalog Produk dan Manajemen Stok.
   - Manajemen Alamat Pengiriman (Maks 3 alamat per *Customer*).
   - *Checkout* pesanan dengan integrasi tarif RajaOngkir.
   - Sinkronisasi pembayaran dengan Midtrans.
5. **Pelaporan (Reporting)**: Ekspor dan rekapitulasi data penjualan serta reservasi (Khusus Admin).

---

## 🛠️ Persyaratan Sistem

- **PHP**: `^8.2` atau lebih baru
- **Composer**: `^2.0`
- **Database**: MySQL / MariaDB (Untuk produksi) & SQLite (Tertanam untuk Testing otomatis)
- **Ekstensi PHP**: `pdo_sqlite`, `fileinfo`, `mbstring`, `openssl`, `curl`

---

## ⚙️ Panduan Instalasi (Development)

1. **Kloning Repositori**
   ```bash
   git clone <url-repo-anda> mische-backend
   cd mische-backend
   ```

2. **Instalasi Dependensi**
   ```bash
   composer install
   ```

3. **Konfigurasi Environment**
   Salin file konfigurasi lalu sesuaikan isi kredensial *database* serta *API Keys* (RajaOngkir, Midtrans, Fonnte) Anda.
   ```bash
   cp .env.example .env
   ```

4. **Generate App Key & JWT Secret**
   ```bash
   php artisan key:generate
   php artisan jwt:secret
   ```

5. **Migrasi dan *Seeding* Database**
   Perintah ini akan membangun tabel dan mengisinya dengan *Dummy Data* lengkap.
   ```bash
   php artisan migrate:fresh --seed
   ```

6. **Tautkan Folder Penyimpanan Foto**
   ```bash
   php artisan storage:link
   ```

7. **Jalankan Server Lokal**
   ```bash
   php artisan serve
   ```
   *Sistem kini dapat diakses melalui `http://127.0.0.1:8000`*

---

## 📖 Dokumentasi API (Scramble)

Seluruh rute (*endpoint*) API, beserta parameter, skema database, dan contoh *Response* dapat Anda eksplorasi secara interaktif di:

👉 **`http://127.0.0.1:8000/docs/api`**

---

## 🧪 Pengujian Otomatis (Testing)

Proyek ini menjunjung tinggi standar kualitas. Eksekusi pengujian otomatis untuk memastikan seluruh fungsi berjalan sempurna:

```bash
php artisan test
```

*Seluruh pengujian berjalan terisolasi di dalam SQLite In-Memory, sehingga dijamin tidak akan merusak data MySQL Anda.*

---
*Didesain dan dikembangkan dengan ❤️ untuk Mische Beauty Clinic.*
