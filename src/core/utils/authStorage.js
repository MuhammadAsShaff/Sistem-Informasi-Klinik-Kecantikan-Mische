/**
 * @file authStorage.js
 * @location src/core/utils/authStorage.js
 *
 * Utilitas terpusat untuk semua operasi autentikasi di localStorage.
 *
 * MENGAPA ADA FILE INI?
 * Pola baca/tulis token & user di localStorage tersebar di 7+ file berbeda.
 * File ini menyatukannya agar:
 *   - Kunci storage ("token", "user") hanya didefinisikan SATU KALI
 *   - Perubahan nama kunci cukup diubah di sini saja
 *   - Tidak ada duplikasi try-catch JSON.parse di tiap hook
 *   - Mudah diuji (unit test) secara terisolasi
 *
 * CARA PAKAI (import di hook mana pun):
 *   import { getToken, getUser, saveUser, clearAuth } from '@/core/utils/authStorage';
 */

// ─── Kunci Storage (Single Source of Truth) ───────────────────────────────────
const TOKEN_KEY = "token";
const USER_KEY  = "user";

// ─── Nama Event (untuk reaktivitas antar-komponen) ────────────────────────────
export const AUTH_UPDATED_EVENT = "user-profile-updated";

// ─── READ ──────────────────────────────────────────────────────────────────────

/**
 * Ambil token autentikasi dari localStorage.
 * @returns {string|null} Token JWT atau null jika belum login.
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Ambil & parse data user dari localStorage.
 * @returns {Object|null} Objek user atau null jika tidak ada / JSON rusak.
 */
export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("[authStorage] Gagal membaca data user dari localStorage:", e);
    return null;
  }
}

/**
 * Cek apakah user sedang login (ada token & data user).
 * @returns {boolean}
 */
export function isLoggedIn() {
  return getToken() !== null && getUser() !== null;
}

/**
 * Ambil role user yang sedang login.
 * @returns {string|null} Role (contoh: "admin", "customer") atau null.
 */
export function getUserRole() {
  return getUser()?.role ?? null;
}

/**
 * Cek apakah user yang login adalah admin.
 * @returns {boolean}
 */
export function isAdmin() {
  return getUserRole() === "admin";
}

// ─── WRITE ─────────────────────────────────────────────────────────────────────

/**
 * Simpan token ke localStorage.
 * @param {string} token
 */
export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Simpan data user ke localStorage DAN kirim event reaktivitas
 * agar semua komponen yang mendengarkan (Navbar, Sidebar, dll) langsung update.
 *
 * @param {Object} userData - Objek data user dari response API.
 * @param {boolean} [silent=false] - Jika true, tidak dispatch event (untuk init awal).
 */
export function saveUser(userData, silent = false) {
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
  if (!silent) {
    window.dispatchEvent(new Event(AUTH_UPDATED_EVENT));
  }
}

/**
 * Simpan token & user sekaligus setelah login berhasil.
 * @param {string} token
 * @param {Object} userData
 */
export function saveAuth(token, userData) {
  saveToken(token);
  saveUser(userData, true); // silent=true: dispatch event cukup sekali di bawah
  window.dispatchEvent(new Event(AUTH_UPDATED_EVENT));
}

// ─── DELETE ────────────────────────────────────────────────────────────────────

/**
 * Hapus semua data autentikasi dari localStorage (logout).
 * Dipanggil saat: logout manual, token expired (401), atau sesi rusak.
 */
export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
