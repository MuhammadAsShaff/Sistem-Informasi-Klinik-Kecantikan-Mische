import { useState } from "react";

export const useTabelProfilDokter = (onStatusChange) => {
  const [expandedDescId, setExpandedDescId] = useState(null);

  const handleStatusSelect = (id, newStatus) => {
    onStatusChange(id, newStatus);
  };

  const toggleExpand = (id) => {
    setExpandedDescId((prev) => (prev === id ? null : id));
  };

  return {
    expandedDescId,
    handleStatusSelect,
    toggleExpand,
  };
};
