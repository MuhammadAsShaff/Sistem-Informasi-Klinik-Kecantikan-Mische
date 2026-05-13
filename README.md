# Mische Beauty Clinic - Backend API

![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php&logoColor=white)
![JWT](https://img.shields.io/badge/JWT_Auth-Tymon-black?style=for-the-badge&logo=jsonwebtokens)
![PHPUnit](https://img.shields.io/badge/PHPUnit-Testing-3776AB?style=for-the-badge&logo=php)

Selamat datang di repositori resmi **Backend API Mische Beauty Clinic**. Sistem ini dibangun menggunakan arsitektur *RESTful API* berbasis Laravel yang tangguh, diamankan dengan *JSON Web Tokens (JWT)*, dan dirancang khusus untuk memenuhi kebutuhan administrasi dan layanan klinik estetika modern.

## 🚀 Fitur Utama

- **Otentikasi JWT Berkeamanan Tinggi**: Token disimpan di dalam *Cookie* (Session Cookie) yang otomatis hancur saat *browser* ditutup, dengan masa aktif maksimal 60 menit. Dilengkapi proteksi *Brute-Force Rate Limiting*.
- **Manajemen Hak Akses (Role-Based)**: Pemisahan rute ketat antara `Admin` dan `Customer` menggunakan *Middleware Custom*.
- **Dokumentasi Otomatis (Scramble)**: Seluruh *endpoint* API terdokumentasi dengan rapi dan interaktif (OAS 3.0) tanpa perlu menulis anotasinya secara manual.
- **Manajemen Berkas Terintegrasi**: Mengelola unggahan foto untuk *Profil Perusahaan* dan *Kegiatan* dengan sistem *fallback* cerdas dan auto-cleanup.
- **Uji Kualitas Berlapis (Feature Testing)**: Sistem dilindungi oleh armada *PHPUnit Tests* yang berjalan dalam *Database In-Memory* untuk mencegah kebocoran *bug*.

## 📂 Struktur Modul

1. **Autentikasi**: Register, Login, Logout, Reset Sandi, Cek Sesi.
2. **Kelola User**: CRUD Pasien & Staff (Admin).
3. **Profil Perusahaan**: Manajemen Visi, Misi, Deskripsi panjang (MediumText), Jam Operasional, dan Logo.
4. **Jadwal Reservasi**: Pengelolaan slot waktu kedatangan untuk dokter/terapis.
5. **Kegiatan Klinik**: Pengelolaan berita, seminar, dan acara promosi klinik beserta poster kegiatannya.

---

## 🛠️ Persyaratan Sistem

- **PHP**: `^8.2` atau lebih baru
- **Composer**: `^2.0`
- **Database**: MySQL / MariaDB (Untuk produksi) & SQLite (Tertanam untuk Testing otomatis)
- **Ekstensi PHP**: `pdo_sqlite`, `fileinfo`, `mbstring`, `openssl`

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
   Salin file konfigurasi lalu sesuaikan isi kredensial *database* Anda.
   ```bash
   cp .env.example .env
   ```

4. **Generate App Key & JWT Secret**
   ```bash
   php artisan key:generate
   php artisan jwt:secret
   ```

5. **Migrasi dan *Seeding* Database**
   Perintah ini akan membangun tabel dan mengisinya dengan *Dummy Data* elegan yang sudah disiapkan khusus untuk Mische Clinic.
   ```bash
   php artisan migrate:fresh --seed
   ```

6. **Tautkan Folder Penyimpanan Foto**
   Agar foto yang diunggah dapat diakses dari URL publik.
   ```bash
   php artisan storage:link
   ```

7. **Jalankan Server Lokal**
   ```bash
   php artisan serve
   ```
   *Sistem kini dapat diakses melalui `http://127.0.0.1:8000`*

---

## 📖 Dokumentasi API

Seluruh rute (*endpoint*) API dan format *Request/Response* dapat Anda lihat dan uji coba secara interaktif melalui antarmuka Swagger/Scramble yang tersedia di:

👉 **`http://127.0.0.1:8000/docs/api`**

---

## 🧪 Pengujian Otomatis (Testing)

Proyek ini menjunjung tinggi standar kualitas. Anda dapat memverifikasi integritas seluruh *controller* API dengan mengeksekusi armada penguji:

```bash
php artisan test
```

*Seluruh pengujian berjalan secara terisolasi menggunakan SQLite In-Memory, sehingga tidak akan pernah mengotori atau menghapus data asli di Database Anda.*

---
*Didesain dan dikembangkan dengan ❤️ untuk Mische Beauty Clinic.*
