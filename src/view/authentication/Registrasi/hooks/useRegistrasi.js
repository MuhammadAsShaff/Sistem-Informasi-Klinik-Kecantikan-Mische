import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

// ─── ALAT BANTU PENGECEK KEAMANAN SANDI ───────────────────────────────────────
// Cetakan standar gembok: Wajib minimal 8 guratan, mencampur ukiran kapital (A-Z) dan ukiran kecil (a-z)
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

// ─── KERTAS FORMULIR BARU (KOSONG) ───────────────────────────────────────────
// Template lembaran kertas bersih yang akan disodorkan kepada tamu pendaftar baru
const INITIAL_FORM = {
  nama: "",
  email: "",
  nomorWa: "",
  alamat: "",
  jenisKelamin: "",
  tanggalLahir: "",
  password: "",
  confirmPassword: "",
};

/**
 * =========================================================================
 * MANDOR KEPALA BAGIAN PENDAFTARAN (useRegistrasi)
 * =========================================================================
 * Ibarat seorang petugas cekatan di meja registrasi warga baru, bertugas:
 * 1. Menjaga laci arsip penyimpan isian biodata tamu.
 * 2. Mengawasi pena tamu saat menulis: jika menulis nomor WhatsApp, Mandor langsung menghapus huruf/simbol agar tersisa angka murni.
 * 3. Mengukur kekokohan sandi rahasia dan mencocokkan ulangan ketikan sandi di kolom kedua.
 * 4. Mengirim kurir membawa map formulir ke loket Laravel `/auth/register`.
 */
export function useRegistrasi() {
  // Penunjuk jalan untuk memandu tamu setelah resmi terdaftar
  const navigate = useNavigate();

  // ─── LACI PENGUMUMAN NOTIFIKASI (TOAST) ─────────────────────────────────────
  // Papan tulisan melayang untuk memberi selamat atau menegur tamu
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });
  // Tuas cepat untuk mengibarkan papan notifikasi
  const showToast = (message, type = "success") => setToast({ isOpen: true, message, type });

  // ─── LACI ARSIP ISIAN FORMULIR ──────────────────────────────────────────────
  // Laci utama penyimpan seluruh catatan di lembar kertas pendaftaran
  const [formData, setFormData] = useState(INITIAL_FORM);
  // Tuas penyingkap tirai penutup kolom password pertama
  const [showPassword, setShowPassword] = useState(false); 
  // Tuas penyingkap tirai penutup kolom ulangan password kedua
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 

  /**
   * ─── PENGAMAT GURATAN PENA TAMU (handleChange) ─────────────────────────────
   * Aktif berkedip seketika setiap kali ujung pena tamu menggores salah satu kotak isian.
   */
  const handleChange = (e) => {
    // Mengidentifikasi nama kotak isian dan tulisan baru yang digoreskan
    const { name, value } = e.target;
    
    // Aturan Kedisiplinan Khusus: Jika kotak yang ditulis adalah "nomorWa" (Nomor WhatsApp)
    if (name === "nomorWa") {
      // Mandor langsung menyapu bersih semua coretan selain angka murni (regex \D)
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, "") }));
    } else {
      // Untuk kotak isian lain (nama, alamat, dll.), simpan tulisan apa adanya ke dalam laci arsip
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /**
   * ─── TUGAS EKSEKUSI PENDAFTARAN UTAMA (handleSubmit) ───────────────────────
   * Ditekan ketika tamu selesai mengisi formulir dan menyodorkan kertasnya.
   */
  const handleSubmit = async (e) => {
    // Menolak tradisi usang browser yang gemar memuat ulang pekarangan gedung
    e.preventDefault(); 

    // 1. Sidak Kekuatan Gembok: Pastikan sandi rahasia mematuhi standar (campuran huruf besar-kecil & minimal 8 karakter)
    if (!PASSWORD_REGEX.test(formData.password)) {
      // Kirim teguran melayang jika sandi teramat lemah
      showToast("Password minimal 8 karakter dan harus mengandung huruf besar dan kecil!", "error");
      return; // Tolak dokumen, jangan kirim ke kurir
    }
    
    // 2. Sidak Kecocokan Sandi: Pastikan tulisan di kolom sandi pertama sama persis dengan kolom sandi kedua
    if (formData.password !== formData.confirmPassword) {
      // Kirim teguran melayang jika sandi tidak selaras
      showToast("Konfirmasi password tidak cocok!", "error");
      return; // Tolak dokumen
    }

    try {
      // Menggunting dan memisahkan kolom 'confirmPassword' dari map, karena kantor pusat Laravel hanya butuh field 'password'
      const { confirmPassword, ...payload } = formData;
      
      // Mengutus kurir Axios berlari membawa map bersih (payload) ke loket pendaftaran pusat
      const res = await axiosClient.post(endpoints.auth.register, payload);

      // Jika kantor pusat memberi stempel persetujuan pendaftaran (success: true)
      if (res.data.success) {
        // Angkat plang pengumuman selamat "Registrasi Berhasil!"
        showToast("Registrasi berhasil!", "success");
        // Beri waktu 1000 milidetik (1 detik) bagi tamu untuk membaca plang, lalu giring ke Pintu Masuk (Login)
        setTimeout(() => navigate("/login"), 1000);
      }
    } catch (error) {
      // ─── LOKET PUSAT MENOLAK MAP FORMULIR ──────────────────────────────────
      let errorMsg = "Registrasi gagal. Coba lagi.";
      
      // Mengorek isi map tolakan dari server pusat (misalnya: alamat email sudah pernah dipakai orang lain)
      if (error.response?.data?.errors) {
        // Mengutip omelan pertama dari staf pemeriksa di pusat Laravel
        errorMsg = Object.values(error.response.data.errors)[0][0];
      } else if (error.response?.data?.message) {
        // Jika alasan tolakan tercantum di kertas surat umum
        errorMsg = error.response.data.message;
      }
      // Kibarkan papan notifikasi merah berisi teguran/omelan tersebut
      showToast(errorMsg, "error");
    }
  };

  // Serahkan kunci laci arsip dan seluruh tuas kendali kepada Meja Formulir (RegistrasiForm.jsx)
  return {
    formData,
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    handleChange,
    handleSubmit,
    toast,
    setToast
  };
}

