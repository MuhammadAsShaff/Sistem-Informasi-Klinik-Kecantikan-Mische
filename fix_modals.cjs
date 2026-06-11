const fs = require('fs');
const path = require('path');

const files = [
  'src/view/admin/KelolaUser/page/ModalHapusUser.jsx',
  'src/view/admin/KelolaTestimoni/page/ModalHapus.jsx',
  'src/view/admin/KelolaReservasi/page/ModalHapus.jsx',
  'src/view/admin/KelolaPromo/page/ModalHapusPromo.jsx',
  'src/view/admin/KelolaProfilKlinik/page/ModalHapusPengaturan.jsx',
  'src/view/admin/KelolaProfilKlinik/page/ModalHapusKegiatan.jsx',
  'src/view/admin/KelolaProfilDokter/page/ModalHapusDokter.jsx',
  'src/view/admin/KelolaProduk/page/ModalHapusProduk.jsx',
  'src/view/admin/KelolaPenjualan/page/ModalHapus.jsx',
  'src/view/admin/KelolaKategoriProduk/page/ModalHapusKategori.jsx',
  'src/view/admin/KelolaJadwalReservasiTreatment/page/ModalHapusJadwal.jsx'
];

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Extract question
  let questionMatch = content.match(/<h[23][^>]*>[\s\n]*(Apakah Anda yakin[^<]+)[\s\n]*<\/h[23]>/i) || content.match(/(Apakah Anda yakin[^<]+)/i);
  let question = questionMatch ? questionMatch[1].trim() : 'Apakah Anda yakin ingin menghapus data ini?';
  
  // Try to find the exact function passed for "Ya, Hapus" or similar
  // Looking at the props of the component
  let propsMatch = content.match(/(?:const|function)\s+\w+\s*(?:=\s*)?\(\s*\{\s*([^}]+)\s*\}\s*\)/);
  let confirmFunc = 'onConfirm';
  if (propsMatch) {
    let props = propsMatch[1].split(',').map(p => p.trim());
    if (props.includes('onDelete')) confirmFunc = 'onDelete';
    else if (props.includes('onConfirm')) confirmFunc = 'onConfirm';
    else if (props.includes('handleDelete')) confirmFunc = 'handleDelete';
    else if (props.includes('handleHapus')) confirmFunc = 'handleHapus';
  }

  // Ensure onClose is passed or exists
  
  const newReturn = `  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 text-center shadow-xl">
        
        {/* Warning Icon */}
        <div className="mx-auto w-20 h-20 border-4 border-gray-400 rounded-full flex items-center justify-center mb-6">
          <span className="text-gray-400 text-5xl font-bold">!</span>
        </div>

        {/* Title */}
        <h2 className="text-[22px] text-gray-500 font-medium mb-8">
          ${question}
        </h2>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button 
            onClick={${confirmFunc}}
            className="bg-[#56BC36] hover:bg-[#45a025] text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Ya, Hapus
          </button>
          <button 
            onClick={onClose}
            className="bg-white border border-gray-200 text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Tidak, Batalkan
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default`;

  // Replace everything from `return (` or `return(` to the end before export default
  content = content.replace(/return\s*\([\s\S]*?;\s*};?\s*export default/m, newReturn);
  
  fs.writeFileSync(fullPath, content);
  console.log('Fixed', file, 'with', confirmFunc, 'and question:', question);
});
