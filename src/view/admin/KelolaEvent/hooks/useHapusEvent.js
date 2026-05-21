export function useHapusEvent(refetch) {
  const hapusEvent = (id) => {
    try {
      const stored = localStorage.getItem('mische_events');
      if (!stored) return { success: false, message: "Data tidak ditemukan." };
      
      const events = JSON.parse(stored);
      const filtered = events.filter(e => e.id !== id);
      
      localStorage.setItem('mische_events', JSON.stringify(filtered));
      
      refetch();
      return { success: true, message: "Event ini berhasil di hapus!" };
    } catch (error) {
      console.error("Gagal menghapus event:", error);
      return { success: false, message: "Gagal menghapus event." };
    }
  };

  return { hapusEvent };
}
