import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import SearchBar from "./SearchBar";
import Tabel from "./Tabel";
import Pagination from "./Pagination";
import ModalTambahUser from "./ModalTambahUser";
import ModalPerbaruiUser from "./ModalPerbaruiUser";
import ModalHapusUser from "./ModalHapusUser";
import ToastAlert from "../../components/ToastAlert";

export default function KelolaUser() {
  const [dataUser, setDataUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk Paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [startIndex, setStartIndex] = useState(1);

  // State untuk Modal
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHapusOpen, setIsHapusOpen] = useState(false);

  // State untuk Toast Alert
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ isOpen: true, message, type });
  };

  // --- 1. GET ALL USERS ---
  const fetchUsers = async (page = 1) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:8000/api/admin/users?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("Respon API /users:", response.data); // Untuk melihat bentuk data asli di Inspect Element > Console

      // Menyesuaikan dengan struktur data paginasi dari Laravel
      // Laravel membungkusnya dua kali: response.data (success, message, data)
      // Di dalam data ada paginasi: data.current_page, data.data (array user)
      if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
        setDataUser(response.data.data.data);
        setCurrentPage(response.data.data.current_page || 1);
        setLastPage(response.data.data.last_page || 1);
        setStartIndex(response.data.data.from || 1);
      } else if (response.data && Array.isArray(response.data.data)) {
        setDataUser(response.data.data);
      } else if (Array.isArray(response.data)) {
        setDataUser(response.data);
      } else {
        setDataUser([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  // Fungsi untuk mengganti halaman
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  // --- 2. CREATE USER ---
  const handleTambahSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://127.0.0.1:8000/api/admin/users', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast("User berhasil ditambahkan!");
      setIsTambahOpen(false);
      fetchUsers(currentPage); // Refresh data tabel di halaman saat ini
    } catch (error) {
      console.error("Gagal menambah user:", error);
      let errorMessage = "Gagal menambahkan user. Silakan coba lagi.";
      if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors)[0][0];
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      showToast(errorMessage, "error");
    }
  };

  // --- 3. UPDATE USER ---
  const handleEditSubmit = async (formData) => {
    if (!selectedUser) return;
    try {
      const token = localStorage.getItem('token');
      // Perhatikan: Menggunakan idUser, bukan id
      const idUser = selectedUser.idUser || selectedUser.id;
      await axios.put(`http://127.0.0.1:8000/api/admin/users/${idUser}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast("Data user berhasil diperbarui!");
      setIsEditOpen(false);
      fetchUsers(currentPage); // Refresh data
    } catch (error) {
      console.error("Gagal memperbarui user:", error);
      let errorMessage = "Gagal memperbarui data user.";
      if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors)[0][0];
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      showToast(errorMessage, "error");
    }
  };

  // --- 4. DELETE USER ---
  const confirmDelete = async () => {
    if (!selectedUser) return;
    try {
      const token = localStorage.getItem('token');
      // Perhatikan: Menggunakan idUser, bukan id
      const idUser = selectedUser.idUser || selectedUser.id;
      await axios.delete(`http://127.0.0.1:8000/api/admin/users/${idUser}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast("User berhasil dihapus!");
      setIsHapusOpen(false);
      
      // Jika menghapus data terakhir di suatu halaman (selain halaman 1), mundur 1 halaman
      if (dataUser.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchUsers(currentPage); // Refresh data
      }
    } catch (error) {
      console.error("Gagal menghapus user:", error);
      let errorMessage = "Terjadi kesalahan saat menghapus user.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      showToast(errorMessage, "error");
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsHapusOpen(true);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER DAN SEARCH */}
      <div className="flex flex-col gap-2">
        <Header />
        <SearchBar onOpenTambah={() => setIsTambahOpen(true)} />
      </div>

      {/* TABLE DATA */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20 text-gray-500 font-bold">
          Mengambil data dari server...
        </div>
      ) : (
        <Tabel 
          data={dataUser} 
          startIndex={startIndex}
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}

      {/* PAGINATION */}
      <Pagination 
        currentPage={currentPage} 
        lastPage={lastPage} 
        onPageChange={handlePageChange} 
      />

      {/* MODALS */}
      <ModalTambahUser 
        isOpen={isTambahOpen} 
        onClose={() => setIsTambahOpen(false)} 
        onSubmit={handleTambahSubmit}
      />
      
      <ModalPerbaruiUser 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        userData={selectedUser}
        onSubmit={handleEditSubmit}
      />

      <ModalHapusUser 
        isOpen={isHapusOpen} 
        onClose={() => setIsHapusOpen(false)} 
        onConfirm={confirmDelete}
      />

      {/* TOAST NOTIFICATION */}
      <ToastAlert 
        isOpen={toast.isOpen} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, isOpen: false })} 
      />
    </div>
  );
}
