export function useEditEvent(refetch) {
  const editEvent = (id, updatedData) => {
    try {
      const stored = localStorage.getItem('mische_events');
      if (!stored) return { success: false, message: "Data tidak ditemukan." };
      
      const events = JSON.parse(stored);
      const index = events.findIndex(e => e.id === id);
      
      if (index === -1) return { success: false, message: "Event tidak ditemukan." };
      
      events[index] = { ...events[index], ...updatedData };
      localStorage.setItem('mische_events', JSON.stringify(events));
      
      refetch();
      return { success: true, message: "Event ini berhasil diperbarui!" };
    } catch (error) {
      console.error("Gagal memperbarui event:", error);
      return { success: false, message: "Gagal memperbarui event." };
    }
  };

  return { editEvent };
}
