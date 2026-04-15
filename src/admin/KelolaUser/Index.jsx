import React, { useState } from "react";
import Header from "./Header";
import SearchBar from "./SearchBar";
import Tabel from "./Tabel";
import Pagination from "./Pagination";
import ModalTambahUser from "./ModalTambahUser";
import ModalPerbaruiUser from "./ModalPerbaruiUser";
import ModalHapusUser from "./ModalHapusUser";

const dummyUsers = [
  { id: 1, nama: "Bintang Muhammad", alamat: "Pekanbaru, Riau", gender: "Laki-laki", birth: "22/10/2002", role: "Admin", email: "Bintang22si@mahasiswa.pcr.ac.id", whatsapp: "081234567890" },
  { id: 2, nama: "Annisa Rahma", alamat: "Jakarta Selatan", gender: "Perempuan", birth: "15/05/1998", role: "Staff", email: "annisa@mail.com", whatsapp: "082133445566" },
  { id: 3, nama: "Rizky Pratama", alamat: "Bandung, Jawa Barat", gender: "Laki-laki", birth: "03/12/2000", role: "Customer", email: "rizky@mail.com", whatsapp: "081122334455" },
  { id: 4, nama: "Dewi Lestari", alamat: "Surabaya, Jawa Timur", gender: "Perempuan", birth: "25/07/1995", role: "Staff", email: "dewi@mail.com", whatsapp: "085566778899" },
  { id: 5, nama: "Fauzan Azhim", alamat: "Medan, Sumatera Utara", gender: "Laki-laki", birth: "10/01/1997", role: "Admin", email: "fauzan@mail.com", whatsapp: "087788990011" },
  { id: 6, nama: "Siti Aminah", alamat: "Yogyakarta", gender: "Perempuan", birth: "18/09/1999", role: "Customer", email: "siti@mail.com", whatsapp: "081992288337" },
  { id: 7, nama: "Budi Santoso", alamat: "Semarang, Jawa Tengah", gender: "Laki-laki", birth: "30/03/1992", role: "Staff", email: "budi@mail.com", whatsapp: "081223344556" },
  { id: 8, nama: "Laras Wati", alamat: "Palembang", gender: "Perempuan", birth: "05/11/2001", role: "Customer", email: "laras@mail.com", whatsapp: "081334455667" },
  { id: 9, nama: "Andi Wijaya", alamat: "Makassar", gender: "Laki-laki", birth: "12/06/1994", role: "Admin", email: "andi@mail.com", whatsapp: "082112233445" },
  { id: 10, nama: "Maya Sofa", alamat: "Denpasar, Bali", gender: "Perempuan", birth: "21/02/1996", role: "Staff", email: "maya@mail.com", whatsapp: "085223344556" }
];

export default function KelolaUser() {
  const [dataUser, setDataUser] = useState(dummyUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // State untuk Modal
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHapusOpen, setIsHapusOpen] = useState(false);

  // Handlers
  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsHapusOpen(true);
  };

  const confirmDelete = () => {
    setDataUser(dataUser.filter(u => u.id !== selectedUser.id));
    setIsHapusOpen(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER DAN SEARCH */}
      <div className="flex flex-col gap-2">
        <Header />
        <SearchBar onOpenTambah={() => setIsTambahOpen(true)} />
      </div>

      {/* TABLE DATA */}
      <Tabel 
        data={dataUser} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      {/* PAGINATION */}
      <Pagination />

      {/* MODALS */}
      <ModalTambahUser 
        isOpen={isTambahOpen} 
        onClose={() => setIsTambahOpen(false)} 
      />
      
      <ModalPerbaruiUser 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        userData={selectedUser}
      />

      <ModalHapusUser 
        isOpen={isHapusOpen} 
        onClose={() => setIsHapusOpen(false)} 
        onConfirm={confirmDelete}
      />
    </div>
  );
}
