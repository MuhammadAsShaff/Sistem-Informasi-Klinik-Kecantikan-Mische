export function useHapusPromo(selectedPromo, onSuccess, showToast) {
  const confirmDelete = async (closeModal) => {
    if (!selectedPromo) return;

    try {
      const stored = localStorage.getItem("mische_promos");
      let docs = [];
      try {
        docs = stored ? JSON.parse(stored) : [];
      } catch (parseErr) {
        docs = [];
      }
      
      const filtered = docs.filter(
        (doc) => doc.id.toString() !== selectedPromo.id.toString()
      );
      
      localStorage.setItem("mische_promos", JSON.stringify(filtered));
      
      showToast("Promo ini berhasil di hapus!", "success");
      if (closeModal) closeModal();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Gagal menghapus promo:", error);
      showToast("Gagal menghapus promo.", "error");
    }
  };

  const updateStatusPromo = (id, newStatus) => {
    try {
      const stored = localStorage.getItem("mische_promos");
      let docs = [];
      try {
        docs = stored ? JSON.parse(stored) : [];
      } catch (parseErr) {
        docs = [];
      }
      
      const updated = docs.map((doc) => {
        if (doc.id.toString() === id.toString()) {
          return { ...doc, status: newStatus };
        }
        return doc;
      });
      
      localStorage.setItem("mische_promos", JSON.stringify(updated));
      showToast(`Status promo berhasil diubah menjadi ${newStatus}!`, "success");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Gagal mengubah status promo:", error);
      showToast("Gagal mengubah status promo.", "error");
    }
  };

  return {
    confirmDelete,
    updateStatusPromo,
  };
}
