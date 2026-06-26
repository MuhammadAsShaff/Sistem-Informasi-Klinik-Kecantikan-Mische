/* 
 * =========================================================================
 * AUTH STORAGE (BRANKAS PENYIMPANAN KTP & TIKET LOGIN)
 * =========================================================================
 * File ini bertugas sebagai "Brankas Rahasia" di dalam browser pengguna (localStorage).
 * Saat pengguna login, kita menyimpan 2 hal penting di sini:
 * 1. Tiket Masuk (Token JWT)
 * 2. KTP Pengguna (Data Profil User)
 * 
 * Kenapa dipisah ke file ini?
 * Agar kalau kita mau mengambil atau mengecek KTP/Tiket dari halaman manapun,
 * kita cukup memanggil fungsi dari file ini, tidak perlu membongkar brankas manual.
 */

// ─── Label Laci Brankas (Agar tidak tertukar) ───────────────────────────────────
const TOKEN_KEY = "token"; // Laci tempat menyimpan Tiket
const USER_KEY  = "user";  // Laci tempat menyimpan KTP

// ─── Alarm Pemberitahuan ────────────────────────────────────────────────────────
// Alarm ini akan berbunyi ke seluruh halaman web jika KTP/Tiket diperbarui (misal habis edit profil)
export const AUTH_UPDATED_EVENT = "user-profile-updated";

// =========================================================================
// 1. FUNGSI MEMBACA ISI BRANKAS (READ)
// =========================================================================

// Mengambil Tiket Masuk (Token)
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// Mengambil KTP (Data Profil) dan menerjemahkannya agar bisa dibaca web
export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw); // Mengubah teks biasa menjadi bentuk objek data
  } catch (e) {
    console.error("[Brankas] KTP rusak atau tidak bisa dibaca:", e);
    return null;
  }
}

// Mengecek apakah orang ini sedang berada di dalam sistem (Sudah Login?)
// Syaratnya: Harus punya Tiket DAN punya KTP di brankas.
// ! : TIDAK
// && : IYA
export function isLoggedIn() {
  return getToken() !== null && getUser() !== null;
}

// Mengecek Jabatan (Role) dari KTP (Misal: admin, atau customer)
//? IF ; mengecek dulu baru ambil
//?? : nilai pengganti kalau kosong, gagal, ataupun blm login
export function getUserRole() {
  return getUser()?.role ?? null;
}

// Mengecek secara spesifik, apakah orang ini adalah Admin?
export function isAdmin() {
  return getUserRole() === "admin";
}

// =========================================================================
// 2. FUNGSI MEMASUKKAN BARANG KE BRANKAS (WRITE)
// =========================================================================

// Menyimpan Tiket baru ke dalam laci
export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

// Menyimpan KTP baru ke dalam laci DAN membunyikan alarm agar semua halaman tahu ada KTP baru
export function saveUser(userData, silent = false) {
  localStorage.setItem(USER_KEY, JSON.stringify(userData)); // Menerjemahkan objek data menjadi teks
  if (!silent) {
    window.dispatchEvent(new Event(AUTH_UPDATED_EVENT)); // Bunyikan alarm!
  }
}

// Fungsi serbaguna: Langsung simpan Tiket dan KTP sekaligus saat baru selesai Login
export function saveAuth(token, userData) {
  saveToken(token);
  saveUser(userData, true); // silent=true agar alarm tidak berbunyi dua kali berturut-turut
  window.dispatchEvent(new Event(AUTH_UPDATED_EVENT)); // Bunyikan alarm 1x saja
}

// =========================================================================
// 3. FUNGSI MENGOSONGKAN BRANKAS (DELETE / LOGOUT)
// =========================================================================

// Membakar/membuang Tiket dan KTP dari brankas (Dipakai saat Logout atau sesi/waktu login habis)
export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
