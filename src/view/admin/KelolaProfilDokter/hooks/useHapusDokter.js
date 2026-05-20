export function useHapusDokter(selectedDokter, onSuccess, showToast) {
  const confirmDelete = async (closeModal) => {
    if (!selectedDokter) return;

    try {
      const stored = localStorage.getItem("mische_doctors");
      let docs = [];
      try {
        docs = stored ? JSON.parse(stored) : [];
      } catch (parseErr) {
        docs = [];
      }
      
      const filtered = docs.filter(
        (doc) => doc.id.toString() !== selectedDokter.id.toString()
      );
      
      localStorage.setItem("mische_doctors", JSON.stringify(filtered));
      
      showToast("Berhasil menghapus profil dokter!", "success");
      if (closeModal) closeModal();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Gagal menghapus dokter:", error);
      showToast("Gagal menghapus profil dokter.", "error");
    }
  };

  const updateStatusDokter = (id, newStatus) => {
    try {
      const stored = localStorage.getItem("mische_doctors");
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
      
      localStorage.setItem("mische_doctors", JSON.stringify(updated));
      showToast(`Status dokter berhasil diubah menjadi ${newStatus}!`, "success");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Gagal mengubah status dokter:", error);
      showToast("Gagal mengubah status dokter.", "error");
    }
  };

  return {
    confirmDelete,
    updateStatusDokter,
  };
}
