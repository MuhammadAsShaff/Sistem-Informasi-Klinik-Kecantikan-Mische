import { useState, useEffect } from 'react';

export function usePromoData() {
  const [promos, setPromos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPromos = () => {
      try {
        const stored = localStorage.getItem('mische_promos');
        let data = stored ? JSON.parse(stored) : [];
        
        // Data Dummy agar desain terlihat (6 Item: 4 Aktif, 2 Tidak Aktif)
        if (data.length <= 3) {
          data = [
            {
              id: 1,
              nama: "Promo Lebaran Spesial",
              jenisPromo: "Diskon Persen",
              kategoriProduk: "Skincare",
              produk: "",
              tanggalMulai: "2024-04-01",
              tanggalSelesai: "2024-04-15",
              minimalTransaksi: "500000",
              kodePromo: "LEBARAN20",
              deskripsi: "Ini Adalah Salah Satu Promo Yang Paling Bagus Pada Tahun Ini Dengan Diskon Paling Besar Dan Beberapa Hal Menarik Lainnya Yang Sayang Untuk Dilewatkan. Nikmati berbagai keuntungan dari Mische Aesthetic Clinic.",
              diskon: "20%",
              status: "Aktif"
            },
            {
              id: 2,
              nama: "Promo Akhir Tahun",
              jenisPromo: "Potongan Harga",
              kategoriProduk: "Treatment",
              produk: "Laser Treatment",
              tanggalMulai: "2024-12-01",
              tanggalSelesai: "2024-12-31",
              minimalTransaksi: "1000000",
              kodePromo: "YEAREND50",
              deskripsi: "Promo akhir tahun yang memberikan potongan harga langsung untuk setiap tindakan laser treatment. Jangan sampai ketinggalan promo terbatas ini.",
              diskon: "Rp 50.000",
              status: "Tidak Aktif"
            },
            {
              id: 3,
              nama: "Gratis Facial Wash",
              jenisPromo: "Gratis Produk",
              kategoriProduk: "",
              produk: "Facial Wash",
              tanggalMulai: "2024-05-01",
              tanggalSelesai: "2024-05-30",
              minimalTransaksi: "300000",
              kodePromo: "FREEWASH",
              deskripsi: "Dapatkan gratis Facial Wash untuk setiap pembelian produk Mische Aesthetic Clinic dengan minimal transaksi Rp 300.000. Persediaan terbatas!",
              diskon: "100%",
              status: "Aktif"
            },
            {
              id: 4,
              nama: "Promo Kemerdekaan",
              jenisPromo: "Diskon Persen",
              kategoriProduk: "Semua Kategori",
              produk: "",
              tanggalMulai: "2024-08-01",
              tanggalSelesai: "2024-08-31",
              minimalTransaksi: "150000",
              kodePromo: "MERDEKA45",
              deskripsi: "Rayakan hari kemerdekaan dengan diskon 45% untuk semua perawatan kecantikan di Mische Aesthetic Clinic. Jangan lewatkan kesempatan tampil memukau bulan ini!",
              diskon: "45%",
              status: "Aktif"
            },
            {
              id: 5,
              nama: "Flash Sale Skincare",
              jenisPromo: "Diskon Persen",
              kategoriProduk: "Skincare",
              produk: "Serum Acne",
              tanggalMulai: "2024-06-06",
              tanggalSelesai: "2024-06-08",
              minimalTransaksi: "100000",
              kodePromo: "FLASH66",
              deskripsi: "Dapatkan Serum Acne terbaik kami dengan potongan setengah harga khusus pada Flash Sale 6.6! Stok sangat terbatas, siapa cepat dia dapat.",
              diskon: "50%",
              status: "Tidak Aktif"
            },
            {
              id: 6,
              nama: "Bundling Treatment Glow",
              jenisPromo: "Potongan Harga",
              kategoriProduk: "Treatment",
              produk: "Facial Glow",
              tanggalMulai: "2024-07-01",
              tanggalSelesai: "2024-07-31",
              minimalTransaksi: "750000",
              kodePromo: "GLOWUP",
              deskripsi: "Paket treatment spesial untuk mencerahkan wajah secara maksimal. Dapatkan kulit sehat dan bersinar dengan metode terbaru dari dokter ahli kami.",
              diskon: "Rp 150.000",
              status: "Aktif"
            }
          ];
          localStorage.setItem('mische_promos', JSON.stringify(data));
        }
        setPromos(data);
      } catch (error) {
        console.error("Gagal memuat data promo:", error);
      }
    };

    fetchPromos();
  }, []);

  const filteredPromos = promos.filter(promo => 
    promo.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    promo.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return { promos: filteredPromos, searchQuery, setSearchQuery };
}
