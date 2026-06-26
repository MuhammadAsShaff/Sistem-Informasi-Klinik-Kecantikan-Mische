/* 
 * =========================================================================
 * IMAGE CONVERTER (MESIN CUCI CETAK FOTO)
 * =========================================================================
 * Fungsi ini bertugas sebagai "Tukang Cuci Foto". 
 * Terkadang pelanggan mengupload foto dengan format aneh-aneh (seperti PNG transparan, 
 * WEBP, dsb) yang mungkin ukurannya besar atau tidak didukung oleh database server.
 * 
 * Fungsi ini akan mengambil foto apapun, memberikan "kertas latar belakang putih", 
 * lalu mencetaknya ulang menjadi format standar (JPEG/JPG) yang rapi, ringan, dan aman.
 */

export const convertToJPEG = (file) => {
  return new Promise((resolve) => {
    
    // 1. Cek Dulu: Apakah yang di-upload beneran file gambar/foto?
    // Kalau dia malah nge-upload dokumen PDF atau Video, langsung kembalikan saja 
    // file mentah aslinya (jangan diapa-apain).
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    // 2. Siapkan "Mesin Scanner Pembaca Foto"
    const reader = new FileReader();
    
    // 3. Ketika fotonya selesai di-scan/dibaca...
    reader.onload = (event) => {
      const img = new Image(); // Siapkan wadah foto kosong
      
      img.onload = () => {
        // 4. Siapkan "Kertas Gambar Kosong" (Canvas) sebesar ukuran foto aslinya
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        // 5. Siapkan Kuas Gambar
        const ctx = canvas.getContext('2d');
        
        // 6. Warnai seluruh kertas kosong tadi dengan cat warna Putih (#FFFFFF). 
        // Kenapa? Karena kalau foto aslinya transparan (misal PNG logo tanpa background),
        // nanti saat diubah paksa ke JPG akan berubah jadi hitam legam. Makanya kita alasi putih dulu.
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 7. Tempelkan/Lukis foto asli pelanggan tepat di atas kertas yang sudah dialasi putih tadi
        ctx.drawImage(img, 0, 0);
        
        // 8. Cetak Ulang! (Simpan hasil gabungan tadi menjadi file foto baru berformat JPEG)
        // Angka 0.9 di bawah artinya Kualitas foto diset ke 90% (supaya ukurannya lebih ringan tapi tetap tajam)
        canvas.toBlob((blob) => {
          if (blob) {
            // Buat wujud file baru, lalu potong nama ekstensi aslinya dan ganti namanya jadi berakhiran .jpg
            const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(newFile); // Selesai! Berikan hasil cetakan foto JPG ini ke halaman web untuk dikirim ke server.
          } else {
            // Kalau tiba-tiba mesin cetaknya macet (gagal ubah jadi blob), kembalikan saja foto aslinya
            resolve(file);
          }
        }, 'image/jpeg', 0.9);
      };
      
      // Kalau file gambarnya rusak/corrupt saat mau dilukis, ya sudah kembalikan foto aslinya saja
      img.onerror = () => resolve(file);
      
      // Memasukkan hasil scan-an file ke dalam wadah foto untuk memicu img.onload di atas
      img.src = event.target.result;
    };
    
    // Kalau mesin scanner-nya rusak/gagal baca, kembalikan foto aslinya
    reader.onerror = () => resolve(file);
    
    // Tombol Start: Mulai jalankan mesin scanner untuk membaca file foto dari komputer/HP pelanggan!
    reader.readAsDataURL(file);
  });
};
