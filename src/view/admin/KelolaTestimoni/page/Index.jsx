import React, { useState } from "react";
import Tabel from "./Tabel";
import ModalTambah from "./ModalTambah";
import ModalEdit from "./ModalEdit";
import ModalHapus from "./ModalHapus";
import Pagination from "../../components/Pagination";
import { useFetchTestimoni } from "../hooks/useFetchTestimoni";
import ToastAlert from "@/view/components/ToastAlert";

export default function KelolaTestimoni() {
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHapusOpen, setIsHapusOpen] = useState(false);
  
  const [selectedData, setSelectedData] = useState(null);
  
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const [searchTerm, setSearchTerm] = useState('');
  const { testimoni, isLoading, refetch } = useFetchTestimoni();

  const filteredTestimoni = testimoni.filter(item => 
    (item.namaTester?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (item.deskripsi?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (item.jenisTestimoni?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredTestimoni.length / ITEMS_PER_PAGE);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const paginatedTestimoni = filteredTestimoni.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEdit = (item) => {
    setSelectedData(item);
    setIsEditOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedData(item);
    setIsHapusOpen(true);
  };

  // Modals handle API calls internally and call refetch, so we only need to pass refetch and showToast

  return (
    <div className="p-8 bg-[#F8F9FA] min-h-screen animate-in fade-in duration-700">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-6 font-poppins">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-2 gap-4">
          <div>
            <h1 className="text-3xl font-medium text-black tracking-tight mb-2">Testimoni Customer</h1>
            <p className="text-gray-800 text-[11px] max-w-3xl">
              Halaman ini menampilkan dan mengelola Testimoni Customer yang tersedia di klinik.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="flex items-center">
              <input 
                type="text"
                placeholder="Cari..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#f3f4f6] text-sm px-4 py-2 outline-none w-48 lg:w-64 border border-transparent focus:border-gray-300"
              />
              <button className="bg-[#56BC36] hover:bg-[#469e2c] p-2 transition-colors text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>
            </div>

            {/* Tambah Button */}
            <button 
              onClick={() => setIsTambahOpen(true)}
              className="bg-[#56BC36] hover:bg-[#469e2c] text-white text-sm py-2 px-3 shadow-sm hover:shadow transition-all flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          </div>
        </div>

        <div>
          <Tabel
            isLoading={isLoading}
            data={paginatedTestimoni}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
          />

          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </div>

        <ModalTambah
          isOpen={isTambahOpen}
          onClose={() => setIsTambahOpen(false)}
          refetch={refetch}
          showToast={showToast}
        />

        <ModalEdit
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          data={selectedData}
          refetch={refetch}
          showToast={showToast}
        />

        <ModalHapus
          isOpen={isHapusOpen}
          onClose={() => setIsHapusOpen(false)}
          data={selectedData}
          refetch={refetch}
          showToast={showToast}
        />

        {toast && (
          <ToastAlert
            isOpen={true}
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}
