import { useState, useEffect } from "react";

export function useFetchPromo() {
  const [dataPromo, setDataPromo] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchPromo = () => {
    setIsLoading(true);
    let docs = [];
    try {
      const stored = localStorage.getItem("mische_promos");
      if (stored) {
        docs = JSON.parse(stored);
      } else {
        // Data dummy awal jika kosong
        docs = [
          {
            id: 1,
            nama: "Promo Lebaran",
            jenisPromo: "Diskon Persen",
            kodePromo: "LEBARAN20",
            diskon: "20%",
            deskripsi: "Diskon 20% untuk semua treatment",
            tanggalMulai: "2024-04-01",
            tanggalSelesai: "2024-04-15",
            minimalTransaksi: "500000",
            status: "Aktif",
            kategoriProduk: "",
            produk: ""
          }
        ];
        localStorage.setItem("mische_promos", JSON.stringify(docs));
      }
    } catch (e) {
      console.error("Gagal parse data promo dari localStorage, mereset...", e);
      docs = [];
      localStorage.setItem("mische_promos", JSON.stringify(docs));
    }
    setDataPromo(docs);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPromo();
  }, []);

  // Filter berdasarkan pencarian
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = dataPromo.filter(
      (item) =>
        item.nama.toLowerCase().includes(query) ||
        item.kodePromo.toLowerCase().includes(query) ||
        item.jenisPromo.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  }, [searchQuery, dataPromo]);

  return {
    dataPromo: filteredData,
    searchQuery,
    setSearchQuery,
    isLoading,
    fetchPromo,
  };
}
