export function useTambahEvent(refetch) {
  const tambahEvent = (newEvent) => {
    try {
      const stored = localStorage.getItem('mische_events');
      const events = stored ? JSON.parse(stored) : [];
      
      const newId = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
      const eventToSave = { ...newEvent, id: newId };
      
      events.push(eventToSave);
      localStorage.setItem('mische_events', JSON.stringify(events));
      
      refetch();
      return { success: true, message: "Event ini berhasil ditambahkan!" };
    } catch (error) {
      console.error("Gagal menambah event:", error);
      return { success: false, message: "Gagal menambahkan event." };
    }
  };

  return { tambahEvent };
}
