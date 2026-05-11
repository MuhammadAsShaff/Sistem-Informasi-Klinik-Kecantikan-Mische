import React, { useState } from 'react';
import Header from './Header';
import PengaturanTentangKami from './PengaturanTentangKami';
import GaleriKegiatan from './GaleriKegiatan';
import ModalHapusPengaturan from './ModalHapusPengaturan';
import ModalTambahKegiatanBaru from './ModalTambahKegiatanBaru';
import ModalEditKegiatan from './ModalPerbaruiKegiatan';
import ModalHapusKegiatan from './ModalHapusKegiatan';

const KelolaProfilKlinik = () => {
  const [isModalHapusPengaturanOpen, setIsModalHapusPengaturanOpen] = useState(false);
  const [isModalTambahKegiatanOpen, setIsModalTambahKegiatanOpen] = useState(false);
  const [isModalEditKegiatanOpen, setIsModalEditKegiatanOpen] = useState(false);
  const [isModalHapusKegiatanOpen, setIsModalHapusKegiatanOpen] = useState(false);

  return (
    <div className="p-8 bg-[#f4f6f9] min-h-screen font-sans">
      <Header />
      
      <PengaturanTentangKami 
        onHapusClick={() => setIsModalHapusPengaturanOpen(true)} 
      />
      
      <GaleriKegiatan 
        onTambahClick={() => setIsModalTambahKegiatanOpen(true)}
        onPerbaruiClick={(id) => setIsModalEditKegiatanOpen(true)}
        onHapusClick={(id) => setIsModalHapusKegiatanOpen(true)}
      />

      <ModalHapusPengaturan 
        isOpen={isModalHapusPengaturanOpen} 
        onClose={() => setIsModalHapusPengaturanOpen(false)} 
      />
      
      <ModalTambahKegiatanBaru 
        isOpen={isModalTambahKegiatanOpen} 
        onClose={() => setIsModalTambahKegiatanOpen(false)} 
      />
      
      <ModalEditKegiatan 
        isOpen={isModalEditKegiatanOpen} 
        onClose={() => setIsModalEditKegiatanOpen(false)} 
      />

      <ModalHapusKegiatan 
        isOpen={isModalHapusKegiatanOpen} 
        onClose={() => setIsModalHapusKegiatanOpen(false)} 
      />
    </div>
  );
};

export default KelolaProfilKlinik;
