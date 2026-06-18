import { endpoints } from "@/core/api/endpoints";
import { useFetchWithCache } from "@/core/hooks/useFetchWithCache";

export function useFetchPublicJadwal(tanggal, idDokter) {
  const params = new URLSearchParams();
  if (tanggal) params.append("tanggal", tanggal);
  if (idDokter) params.append("idDokter", idDokter);
  const queryString = params.toString() ? `?${params.toString()}` : "";
  
  const url = `${endpoints.customer.schedules}${queryString}`;

  // Use short TTL for schedules since they can change frequently
  const { data, isLoading, mutate } = useFetchWithCache(url);

  let dataJadwal = [];
  if (data) {
     // Handle both paginated and flat array responses
     dataJadwal = data.data || data;
     if (!Array.isArray(dataJadwal)) dataJadwal = [];
  }

  return {
    dataJadwal,
    isLoading,
    fetchJadwal: mutate, // provide mutate as fetchJadwal for backwards compatibility
  };
}
