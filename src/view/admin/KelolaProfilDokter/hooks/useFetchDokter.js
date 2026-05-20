import { useState, useEffect } from "react";
import { useDokterData } from "@/view/Customer/TentangDokter/hooks/useDokterData";

export function useFetchDokter() {
  const { doctors } = useDokterData();
  const [dataDokter, setDataDokter] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchDokter = () => {
    setIsLoading(true);
    let docs = [];
    try {
      const stored = localStorage.getItem("mische_doctors");
      if (stored) {
        docs = JSON.parse(stored);
      } else {
        docs = doctors;
        localStorage.setItem("mische_doctors", JSON.stringify(doctors));
      }
    } catch (e) {
      console.error("Gagal parse data dokter dari localStorage, mereset...", e);
      docs = doctors;
      localStorage.setItem("mische_doctors", JSON.stringify(doctors));
    }
    setDataDokter(docs);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDokter();
  }, []);

  // Filter berdasarkan pencarian
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = dataDokter.filter(
      (doc) =>
        doc.name.toLowerCase().includes(query) ||
        (doc.email && doc.email.toLowerCase().includes(query)) ||
        (doc.description && doc.description.toLowerCase().includes(query))
    );
    setFilteredData(filtered);
  }, [searchQuery, dataDokter]);

  return {
    dataDokter: filteredData,
    searchQuery,
    setSearchQuery,
    isLoading,
    fetchDokter,
  };
}
