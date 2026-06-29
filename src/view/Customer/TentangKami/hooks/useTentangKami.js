import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL, endpoints } from "@/core/api/endpoints";

/**
 * =========================================================================
 * MANDOR JURU BICARA PROFIL KLINIK (useTentangKami)
 * =========================================================================
 * Ibarat juru penerangan di pintu gerbang klinik yang menghafal di luar kepala:
 * 1. Jam buka dan tutup pintu gerbang klinik.
 * 2. Total jumlah dokter aktif yang bersiaga merawat tamu.
 * 3. Piagam sumpah setia berupa Visi, Misi, dan cerita singkat berdirinya Mische.
 */
export function useTentangKami() {
  // ─── KOTAK CATATAN PROFIL & JUMLAH DOKTER ──────────────────────────────────
  // Kotak tempat mencatat seluruh data sejarah, visi, misi, dan gedung klinik Mische
  const [clinicData, setClinicData] = useState(null);
  // Kotak penghitung jumlah dokter aktif yang berjaga di klinik
  const [doctorCount, setDoctorCount] = useState(0);

  // ─── ASISTEN SENSUS MENCATAT DATA KE SERVER ─────────────────────────────────
  // Begitu tamu memasuki area Tentang Kami, asisten ini langsung berlari melakukan pencatatan
  useEffect(() => {
    // Tugas 1: Mengambil catatan sejarah dan jadwal operasional klinik
    const fetchClinicInfo = async () => {
      try {
        // Kurir Axios berangkat ke kantor pusat backend di loket profil klinik
        const res = await axios.get(`${API_BASE_URL}${endpoints.customer.clinic}`);
        // Jika kurir pulang membawa map berisi data klinik yang sah dan tidak kosong
        if (res.data.success && res.data.data && Object.keys(res.data.data).length > 0) {
          // Simpan rapi di dalam kotak catatan utama (clinicData)
          setClinicData(res.data.data);
        }
      } catch (error) {
        // Jika kurir gagal mendapatkan data klinik, tuliskan keluhannya di log
        console.error("Gagal mengambil profil klinik:", error);
      }
    };

    // Tugas 2: Menghitung total jumlah dokter yang terdaftar di klinik
    const fetchDoctorCount = async () => {
      try {
        // Kurir Axios berlari ke loket daftar dokter di server backend
        const res = await axios.get(`${API_BASE_URL}${endpoints.customer.dokter}`);
        // Jika kurir berhasil membawa pulang buku daftar dokter (success: true)
        if (res.data.success && res.data.data) {
          // Hitung berapa jumlah baris nama dokter di dalam buku tersebut, lalu catat di laci (doctorCount)
          setDoctorCount(res.data.data.length || 0);
        }
      } catch (error) {
        // Jika kurir tersesat saat mencari data dokter, catat pesan kesalahannya
        console.error("Gagal mengambil data dokter:", error);
      }
    };

    // Memberi aba-aba agar kedua kurir segera berlari menjalankan tugasnya
    fetchClinicInfo();
    fetchDoctorCount();
  }, []);

  // ─── MERAPIHKAN KATA-KATA & JAM UNTUK DIBACA TAMU (Computed Values) ─────────
  // Mengambil paragraf cerita klinik, jika belum ada tampilkan teks kosong
  const deskripsi = clinicData?.deskripsiPerusahaan || "";
  // Mengambil kalimat sakti cita-cita klinik (Visi)
  const visi = clinicData?.visi || "";
  // Mengambil langkah-langkah nyata pelayanan klinik (Misi)
  const misi = clinicData?.misi || "";

  // Menggabungkan jam buka dan jam tutup menjadi satu papan pengumuman yang elok (Misal: 08:00 - 20:00 WIB)
  const jamOperasional =
    clinicData?.jamBuka && clinicData?.jamTutup
      ? `${clinicData.jamBuka.substring(0, 5)} - ${clinicData.jamTutup.substring(0, 5)} WIB`
      : "";

  // Menyiapkan tautan alamat foto megah gedung klinik dari server penyimpanan
  const imageSrc = clinicData?.fotoPerusahaan
    ? `http://127.0.0.1:8000/storage/${clinicData.fotoPerusahaan}`
    : null; // Jika server belum punya fotonya, serahkan pada panggung untuk memakai lukisan serep lokal

  // ─── MEMBERIKAN CATATAN RAPI KE PETUGAS TAMPILAN ───────────────────────────
  // Menyerahkan seluruh rangkuman sejarah, visi, misi, jam buka, dan jumlah dokter kepada panggung pameran
  return {
    clinicData,     // Objek mentah data klinik
    doctorCount,    // Angka total dokter aktif
    deskripsi,      // Cerita berdirinya klinik
    visi,           // Cita-cita masa depan (Visi)
    misi,           // Langkah pelayanan (Misi)
    jamOperasional, // Waktu pelayanan klinik
    imageSrc,       // Foto resmi gedung klinik
  };
}
