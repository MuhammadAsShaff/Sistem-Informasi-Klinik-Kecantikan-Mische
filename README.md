# Sistem Informasi Klinik Kecantikan Mische (Frontend)

Repositori ini berisi kode sumber untuk bagian **Frontend** dari Sistem Informasi Klinik Kecantikan Mische. Aplikasi ini dibangun untuk mempermudah operasional klinik, mengelola jadwal reservasi *treatment* pasien, menampilkan profil perusahaan, galeri kegiatan, serta manajemen data klinik secara terpusat oleh Admin.

Aplikasi ini menggunakan **React (Vite)** dan didesain dengan antarmuka pengguna yang bersih, responsif, dan profesional sesuai standar modern.

---

## 🛠️ Teknologi yang Digunakan

Aplikasi ini dibangun menggunakan *stack* teknologi berikut:

- **Framework & Library Utama**: React 18, Vite (sebagai *build tool*)
- **Styling**: Tailwind CSS, Vanilla CSS
- **UI Components**: Material UI (MUI) `@mui/x-date-pickers` (untuk penentuan jadwal & waktu)
- **State Management & Data Fetching**: React Hooks (`useState`, `useEffect`), Axios
- **Routing**: React Router DOM
- **Manajemen Waktu**: Day.js
- **Ikon**: Lucide React
- **Teks Editor**: React Simple WYSIWYG (untuk deskripsi profil perusahaan)

---

## ✨ Fitur Utama

### 1. Customer Portal (Halaman Publik)
- **Landing Page**: Menampilkan informasi umum klinik.
- **Tentang Kami**: Menampilkan Visi & Misi, Deskripsi Klinik, Jam Operasional, serta Nomor Layanan Pelanggan (CS) yang diambil secara *real-time* dari *backend*.
- **Galeri Kegiatan**: Portofolio gambar dan kegiatan terbaru klinik.
- **Reservasi Treatment**: Pasien dapat melakukan pemilihan jadwal *treatment* yang disesuaikan dengan jam buka klinik.

### 2. Admin Dashboard
- **Kelola Profil Klinik**: 
  - Admin dapat memperbarui foto perusahaan, deskripsi, visi, misi, dan menentukan **Jam Operasional Buka & Tutup**.
  - Pengecekan otomatis batas maksimal ukuran *file* foto (2MB, khusus `jpeg/jpg/png`).
- **Kelola Kegiatan**: Menambah, mengedit, atau menghapus dokumentasi gambar kegiatan klinik yang akan tampil di halaman publik.
- **Kelola Jadwal Reservasi Treatment**:
  - Validasi *real-time* cerdas: Admin tidak dapat membuat jadwal reservasi yang berada di luar batas Jam Operasional klinik.
  - *Conflict Prevention*: Mencegah jadwal yang bertabrakan (waktu yang sudah di-reservasi akan secara otomatis berwarna abu-abu/di-nonaktifkan di *TimePicker*).
- **Manajemen Akun & Pengguna**: Fitur pengelolaan pengguna dan akses ke dalam sistem.

---

## 🚀 Prasyarat Instalasi

Sebelum menjalankan proyek ini secara lokal, pastikan Anda telah menginstal beberapa hal berikut di mesin Anda:
- **Node.js** (Minimal versi 16.x atau lebih baru, direkomendasikan versi 18 LTS)
- **NPM** atau **Yarn** atau **Bun**
- **Sistem Backend (Laravel)** harus sudah dikonfigurasi dan berjalan di *background* (biasanya di `http://127.0.0.1:8000`).

---

## ⚙️ Panduan Instalasi & Menjalankan Aplikasi

1. **Kloning Repositori**
   ```bash
   git clone <url-repositori-frontend>
   cd mische-frontend
   ```

2. **Instalasi Dependensi**
   ```bash
   npm install
   ```

3. **Menjalankan Development Server**
   ```bash
   npm run dev
   ```
   Aplikasi secara otomatis akan berjalan, umumnya di `http://localhost:5173`.

4. **Koneksi dengan API (Backend)**
   Pastikan *base URL* API di semua pemanggilan `axios` telah mengarah ke server Laravel Anda. (*Secara bawaan menggunakan http://127.0.0.1:8000*).

---

## 📂 Struktur Direktori Proyek

Gambaran singkat struktur folder (*simplified*):

```text
mische-frontend/
├── public/                 # Aset statis publik (favicon, logo, dll)
├── src/
│   ├── admin/              # Komponen & Halaman untuk Admin Dashboard
│   │   ├── KelolaProfilKlinik/            # Modul Manajemen Profil Perusahaan
│   │   └── KelolaJadwalReservasiTreatment/# Modul Pembuatan Jadwal Validasi Waktu
│   ├── Customer/           # Komponen & Halaman untuk Publik (User/Pasien)
│   ├── components/         # Komponen yang dapat digunakan ulang (Reusable UI)
│   ├── App.jsx             # Titik masuk utama komponen React & konfigurasi Routing
│   ├── index.css           # Global file styling Tailwind
│   └── main.jsx            # Titik inisialisasi aplikasi
├── index.html              # Template HTML dasar
├── tailwind.config.js      # Konfigurasi Tailwind CSS
└── vite.config.js          # Konfigurasi Vite
```

---

## 🛡️ Catatan Keamanan & Validasi Cerdas

Aplikasi ini dilengkapi dengan beberapa lapisan keamanan dan kenyamanan pada sisi klien (*Client-side Validation*):
- **File Upload**: Seluruh input tipe file dikunci hanya untuk `image/*` dengan batas 2MB. Terdapat notifikasi langsung jika ukuran atau ekstensi salah.
- **Smart TimePicker**: Terintegrasi menggunakan `@mui/x-date-pickers` dengan modifikasi kustom yang mengunci *range* menit dan jam berdasarkan **Jam Operasional Buka/Tutup** dan **Jadwal Bertabrakan**.

---

## 🏗️ Membangun Aplikasi untuk Produksi

Jika Anda ingin *deploy* aplikasi ini (ke server seperti Vercel, Netlify, atau Nginx):

```bash
npm run build
```
Perintah ini akan menghasilkan folder `dist/` yang berisi kumpulan file statis yang siap di-unggah ke server produksi.

---

> **Dibuat dengan ❤️ untuk Sistem Informasi Klinik Mische.**
