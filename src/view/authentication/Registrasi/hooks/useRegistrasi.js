import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/core/api/axiosClient";
import { endpoints } from "@/core/api/endpoints";

// REGEX VALIDASI PASSWORD: Wajib minimal 8 karakter, ada huruf besar (A-Z) dan huruf kecil (a-z)
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

// DEFENISI DATA FORM AWAL (KOSONG)
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
 * CUSTOM HOOK: useRegistrasi
 * =========================================================================
 * Hook ini mengelola seluruh logika pendaftaran akun customer baru, meliputi:
 * 1. Penyimpanan input form pendaftaran.
 * 2. Pembersihan input otomatis (misal: nomor WA hanya boleh diisi angka).
 * 3. Validasi kekuatan password & kesesuaian konfirmasi password.
 * 4. Pengiriman request pendaftaran akun ke endpoint Laravel `/auth/register`.
 * 
 * Tidak ada parameter yang dibutuhkan karena semua logic di-handle mandiri.
 */
export function useRegistrasi() {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });
  const showToast = (message, type = "success") => setToast({ isOpen: true, message, type });

  // formData: Menyimpan seluruh objek input pendaftaran sesuai dengan INITIAL_FORM
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false); // Status tampil/sembunyi password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Status tampil/sembunyi konfirmasi password

  /**
   * FUNGSI MENCATAT PERUBAHAN INPUT (onChange)
   * Dipanggil setiap kali customer mengetik di salah satu input form.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Keamanan Khusus: Jika inputnya adalah nomor WhatsApp
    if (name === "nomorWa") {
      // Otomatis hapus karakter non-angka agar data nomor telepon bersih
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, "") }));
    } else {
      // Simpan input lainnya apa adanya ke state
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /**
   * FUNGSI UTAMA: KIRIM PENDAFTARAN (onSubmit)
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Cegah reload halaman

    // 1. Validasi Keamanan: Password harus memenuhi kriteria regex (campuran besar-kecil & min 8)
    if (!PASSWORD_REGEX.test(formData.password)) {
      showToast("Password minimal 8 karakter dan harus mengandung huruf besar dan kecil!", "error");
      return;
    }
    
    // 2. Validasi Keamanan: Password di kolom 1 dan kolom 2 harus sama persis
    if (formData.password !== formData.confirmPassword) {
      showToast("Konfirmasi password tidak cocok!", "error");
      return;
    }

    try {
      // Hapus kolom 'confirmPassword' dari payload karena server backend hanya butuh field 'password'
      const { confirmPassword, ...payload } = formData;
      
      // Kirim data registrasi ke backend Laravel
      const res = await axiosClient.post(endpoints.auth.register, payload);

      // Jika pendaftaran akun berhasil
      if (res.data.success) {
        showToast("Registrasi berhasil!", "success");
        // Beri jeda 1 detik untuk menampilkan notifikasi sukses, lalu alihkan ke halaman login
        setTimeout(() => navigate("/login"), 1000);
      }
    } catch (error) {
      // --- PENANGANAN ERROR JIKA REGISTRASI GAGAL ---
      let errorMsg = "Registrasi gagal. Coba lagi.";
      
      // Jika terjadi error validasi dari server backend (misal email sudah terdaftar)
      if (error.response?.data?.errors) {
        // Ambil rincian pesan kesalahan validasi pertama
        errorMsg = Object.values(error.response.data.errors)[0][0];
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      showToast(errorMsg, "error");
    }
  };

  // Kembalikan semua state & handler agar dapat digunakan di RegistrasiForm.jsx
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
