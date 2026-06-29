/**
 * =========================================================================
 * ENSIKLOPEDIA GUDANG RINCIAN PERAWATAN (DataJenisPerawatan)
 * =========================================================================
 * Ibarat buku besar ensiklopedia berhias emas di perpustakaan klinik yang mencatat
 * spesifikasi terlengkap, tarif resmi, durasi waktu, dan kegunaan dari puluhan
 * jenis tindakan di Mische Aesthetic Clinic.
 */
import acneImg from '@/assets/images/acne.jpg';
import antiAgingImg from '@/assets/images/anti aging.jpg';
import RefreshFacial from '@/assets/images/Treatment/RefreshFacial.jpg';
import AcneFacial from '@/assets/images/Treatment/AcneFacial.jpg';
import whitteningImg from '@/assets/images/Treatment/BrightenningFacial.jpg';
import BrigtenningFacial from '@/assets/images/Treatment/BrightenningFacial.jpg';
import LuxuryDiamondImg from '@/assets/images/Treatment/Luxury Diamond Oxywhitening with PDT.jpg';
import MicrodiamondImg from '@/assets/images/Treatment/Microdiamond Facial.jpg';
import RefreshHydratingImg from '@/assets/images/Treatment/Refresh Hydrating Facial.jpg';
import FacialDetoxImg from '@/assets/images/Treatment/Facial Detox.jpg';
import UltimateAntiAgingImg from '@/assets/images/Treatment/Ultimate & Anti Aging Facial.jpg';

// Laser Treatment Images
import MischeLipLaserImg from '@/assets/images/Treatment/Mische Lip Laser Rejuvenation.jpg';
import MischeLaserRejuvenationImg from '@/assets/images/Treatment/Mische Laser Rejuvenation.jpg';
import MischeLaserAcneImg from '@/assets/images/Treatment/Mische Laser for Acne.jpg';
import MischeLaserHyperImg from '@/assets/images/Treatment/Mische Laser for Hyperpigmentation.jpg';
import MischeLuminousIPLImg from '@/assets/images/Treatment/Mische Luminous Laser + IPL.jpg';
import MischeLuminousBiolightImg from '@/assets/images/Treatment/Mische Luminous Laser + Biolight.jpg';
import MischeTattooRemovalImg from '@/assets/images/Treatment/Mische Laser Tattoo Removal.jpg';

// Cauter Images
import CauterKecilImg from '@/assets/images/Treatment/Cauter Kecil.jpg';
import CauterSedangImg from '@/assets/images/Treatment/Cauter Sedang.jpg';
import CauterFullfaceImg from '@/assets/images/Treatment/Cauter Full face - Neck.jpg';

// IPL Images
import IPLBrazilianImg from '@/assets/images/Treatment/IPL Brazilian.jpg';
import IPLAcneImg from '@/assets/images/Treatment/IPL Acne Clear Therapy.jpg';
import IPLFaceRejImg from '@/assets/images/Treatment/IPL Face Rejuvenating.jpg';
import IPLGlowskinImg from '@/assets/images/Treatment/IPL Glowskin.jpg';
import IPLRednessImg from '@/assets/images/Treatment/IPL Redness Skin Therapy.jpg';
import IPLHairUnderArmImg from '@/assets/images/Treatment/IPL Hair Removal - Under Arm.jpg';
import IPLHairTanganImg from '@/assets/images/Treatment/IPL Hair Removal - Tangan.jpg';
import IPLHairSeluruhTanganImg from '@/assets/images/Treatment/IPL Hair Removal - Seluruh Tangan.jpg';
import IPLHairKakiImg from '@/assets/images/Treatment/IPL Hair Removal - Kaki.jpg';
import IPLHairSeluruhKakiImg from '@/assets/images/Treatment/IPL Hair Removal - Seluruh Kaki.jpg';
import IPLHairKumisImg from '@/assets/images/Treatment/IPL Hair Removal - Kumis.jpg';
import IPLHairJambangImg from '@/assets/images/Treatment/IPL Hair Removal - Jambang.jpg';

// Weight Management Images
import SlimmingPlusImg from '@/assets/images/Treatment/Slimming System Plus For Abdomen.jpg';
import SlimmingUltimateImg from '@/assets/images/Treatment/Slimming System Ultimate Double Action For Abdomen.jpg';
import CavitationBetisImg from '@/assets/images/Treatment/Body Cavitation - Betis.jpg';
import CavitationBokongImg from '@/assets/images/Treatment/Body Cavitation - Bokong.jpg';
import CavitationPerutImg from '@/assets/images/Treatment/Body Cavitation - Perut & Pinggul.jpg';
import CavitationPahaImg from '@/assets/images/Treatment/Body Cavitation - Paha.jpg';
import CavitationLenganImg from '@/assets/images/Treatment/Body Cavitation - Lengan.jpg';

// Microneedle Treatment System (MTS) Images
import MTSPRPImg from '@/assets/images/Treatment/MTS with PRP + Biolight.jpg';
import MTSAcneImg from '@/assets/images/Treatment/MTS for Acne Scars.jpg';
import PRPFaceComboImg from '@/assets/images/Treatment/PRP Face Combo Glow.jpg';
import SUBSISIImg from '@/assets/images/Treatment/SUBSISI + MTS PRP WITH Biolight.jpg';

// Mesotherapy Images
import MesoflekImg from '@/assets/images/Treatment/Mesoflek.jpg';
import MesoalopeciaImg from '@/assets/images/Treatment/Mesoalopecia.jpg';

// Mische Skin Booster Images
import LumeraImg from '@/assets/images/Treatment/MISCHE LUMERA SKIN BOOSTER.jpg';
import PurevaImg from '@/assets/images/Treatment/PUREVA FRESH SKIN THERAPY.jpg';
import HydraluxeImg from '@/assets/images/Treatment/HYDRALUXE SKIN BOOSTER.jpg';
import CrystaleImg from '@/assets/images/Treatment/CRYSTALE SKIN BOOSTER.jpg';

// Botox Images
import BotoxDetailImg from '@/assets/images/Treatment/Mische Royal Lift (Botox).jpg';

// Other Treatments Images
import TotokWajahImg from '@/assets/images/Treatment/Totok Wajah.jpg';
import OxygenJetImg from '@/assets/images/Treatment/Oxygen Jet.jpg';
import BiolightImg from '@/assets/images/Treatment/Biolight.jpg';
import OxyserumImg from '@/assets/images/Treatment/Oxyserum Infusion.jpg';
import SkinAnalysisImg from '@/assets/images/Treatment/Skin Analysis.jpg';
import MPCImg from '@/assets/images/Treatment/Mische Privilege Card (MPC).jpg';

export const dataJenisPerawatan = [
  // 1. REGULER FACIAL
  {
    id: 1,
    categoryId: 1,
    title: "Refresh Facial",
    duration: 60,
    price: 170000,
    description: "Perawatan wajah dengan tahapan deep cleansing, scrub dan steam serta masker yang bermanfaat untuk mengangkat komedo dan mengurangi minyak berlebih di wajah. Sangat direkomendasikan sebelum melakukan perawatan tindakan dokter, sehingga akan mengoptimalkan masuknya obat dan serum ke dalam jaringan kulit.",
    image: RefreshFacial
  },
  {
    id: 2,
    categoryId: 1,
    title: "Clearing Acne Facial",
    duration: 60,
    price: 215000,
    description: "Perawatan wajah dengan kombinasi infus serum Anti Acne ujntuk mengurangi kelebihan sebum di wajah dan pemberian masker khusus Anti Acne yang berfungsi untuk penanganan jaringan kulit wajah yang berjerawat dan juga sebagai anti inflamasi (peradangan) yang dilakukan dengan tata cara teknik yang tepat.",
    image: AcneFacial
  },
  {
    id: 3,
    categoryId: 1,
    title: "Brightening Facial",
    duration: 60,
    price: 220000,
    description: "Perawatan wajah dengan kombinasi infus serum whitening dan Masker Peel Off Pearl And Milk. Efektif untuk mengurangi pigmentasi yang sudah terbentuk sekaligus menghambat pembentukan pigmen kulit yang baru, sehingga membuat kulit akan tampak lebih cerah, lebih sehat dan kenyal.",
    image: BrigtenningFacial
  },

  // 2. INTENSIVE FACIAL
  {
    id: 4,
    categoryId: 2,
    title: "Luxury Diamond Oxywhitening with PDT",
    duration: 90,
    price: 365000,
    description: "Perawatan kulit wajah dengan tahapan facial terbaik yaitu micropeel, face massage, serum, dan masker. Peel off ditambah dengan PDT & Infusi Oxygen Jet yang berfungsi memberikan kesegaran kulit, meningkatkan kadar air, dan sebagai detoksifikasi.",
    image: LuxuryDiamondImg
  },
  {
    id: 5,
    categoryId: 2,
    title: "Ultimate & Anti Aging Facial",
    duration: 90,
    price: 375000,
    description: "Perawatan kulit wajah dengan problem aging skin seperti kulit kusam dan lelah, warna kulit tidak merata, flek ringan dan kerutan halus.dengan menggunakan microdermabrasi serum anti aging, meso needle, massage dan masker khusus Hard mask yang unik sehingga membuat kulit wajah langsung telihat lebih putih, kencang, elastis dan segar. ditambah dengan infusi Oxygenjet sehingga dapat melembabkan kulit, sebagai detoksifikasi dan memberikan sensasi segar pada kulit wajah.",
    image: UltimateAntiAgingImg
  },
  {
    id: 6,
    categoryId: 2,
    title: "Refresh Hydrating Facial",
    duration: 60,
    price: 610000,
    description: "Teknologo inovatif yang menyediakan tiga perawatan wajah yang efektif secara bersamaan dalam satu perawatan, yaitu eksfoliasi ringan, natural skin oxygenation, dan peremajaan kulit wajah secara intens dengan pemberian infusion yang kaya akan nutrisi penting untuk kulit wajah.",
    image: RefreshHydratingImg
  },
  {
    id: 7,
    categoryId: 2,
    title: "Facial Detox",
    duration: 60,
    price: 335000,
    description: "Perawatan wajah yang bermanfaat untuk mendetoksifikasi wajah dari noda akibat polusi udara atau sisa sisa make-up yang menempel. Selain itu juga bermanfaat untuk menangkal radikal bebas di kulit, sehingga membuat kulit akan tampak lebih cerah, lebih sehat kencang dan kenyal.",
    image: FacialDetoxImg
  },
  {
    id: 8,
    categoryId: 2,
    title: "Microdiamond Facial",
    duration: 60,
    price: 375000,
    description: "Perawatan wajah dengan kombinasi microdiamond, mesoneedle dan ultrasound yang berfungsi meremajakan kulit sel, melembabkan, dan mencerahkan kulit. Selanjutnya wajah akan di massage agar memberikan relaksasi. Kulit wajah akan terasa lebih segar, tekstur kulit lebih halus, pori- pori mengecil, lembab, dan lebih cerah.",
    image: MicrodiamondImg
  },

  // 3. Mische Skin Peel
  {
    id: 9,
    categoryId: 3,
    title: "3 Combine Skin Peel",
    duration: 60,
    price: 480000,
    description: "Chemical Peeling dapat membantu pergantian kulit dengan baik, mengangkat noda hitam, serta merangsang pertumbuhan kulit baru termasuk pembentukan kolagen yang baru, sehingga dapat memperbaiki bekas luka dan jerawat. Chemical Peeling menggunakan asam buah - buahan, BHA (Beta Hydroxil Acid) dan bahan - bahan yang bersifat kaustik untuk menghilangkan lapisan kulit yang terlanjur rusak.",
    image: whitteningImg
  },
  {
    id: 10,
    categoryId: 3,
    title: "3 Combine Skin Peel + IPL",
    duration: 60,
    price: 700000,
    description: "Chemical Peeling dapat memperbaiki bekas luka dan jerawat. Selanjutnya wajah akan diterapi IPL (Intensed Pulsed Light) yang berfungsi untuk memperbaiki kolagen kulit sehingga kulit lebih terasa kenyal, sehat dan merona",
    image: whitteningImg
  },
  {
    id: 11,
    categoryId: 3,
    title: "Body Skin Peel - Betis",
    duration: 60,
    price: 365000,
    description: "Chemical Peeling untuk tubuh bagian betis. (Harga: M 365K | L 475K)",
    image: whitteningImg
  },
  {
    id: 12,
    categoryId: 3,
    title: "Body Skin Peel - Paha",
    duration: 60,
    price: 385000,
    description: "Chemical Peeling untuk tubuh bagian paha. (Harga: M 385K | L 490K)",
    image: whitteningImg
  },
  {
    id: 13,
    categoryId: 3,
    title: "Body Skin Peel - Tangan",
    duration: 60,
    price: 250000,
    description: "Chemical Peeling untuk tubuh bagian tangan. (Harga: M 250K | L 340K)",
    image: whitteningImg
  },
  {
    id: 14,
    categoryId: 3,
    title: "Body Skin Peel - Lengan Kulit",
    duration: 60,
    price: 350000,
    description: "Chemical Peeling untuk tubuh bagian lengan kulit. (Harga: M 350K | L 425K)",
    image: whitteningImg
  },
  {
    id: 15,
    categoryId: 3,
    title: "Body Skin Peel - Punggung",
    duration: 60,
    price: 360000,
    description: "Chemical Peeling untuk tubuh bagian punggung. (Harga: M 360K | L 450K)",
    image: whitteningImg
  },
  {
    id: 16,
    categoryId: 3,
    title: "Body Skin Peel - Leher",
    duration: 60,
    price: 365000,
    description: "Chemical Peeling untuk tubuh bagian leher. (Harga: 365K)",
    image: whitteningImg
  },

  // 4. LASER TREATMENT
  {
    id: 17,
    categoryId: 4,
    title: "Mische Lip Laser Rejuvenation",
    duration: 60,
    price: 625000,
    description: "Perawatan bibir yang berfungsi melembabkan bibir, membuat bibir terlihat lebih cerah dan sehat merona, membuat tekstur bibir menjadi lebih lembut dan kenyal. Hasilnya bisa dirasakan setelah 2 hingga 3 kali treatment.",
    image: MischeLipLaserImg
  },
  {
    id: 18,
    categoryId: 4,
    title: "Mische Laser Rejuvenation",
    duration: 60,
    price: 900000,
    description: "Prosedur laser yang digunakan untuk peremajaan kulit, mengatasi masalah kerutan halus, parut bekas jerawat atau bekas cacar ringan hingga sedang, serta pori-pori kulit yang besar. (Paket: 1.950K/3X)",
    image: MischeLaserRejuvenationImg
  },
  {
    id: 19,
    categoryId: 4,
    title: "Mische Laser for Acne",
    duration: 60,
    price: 875000,
    description: "Prosedur laser yang efektif untuk mengatasi masalah kulit berminyak berjerawat, serta mengatasi jerawat dan komedo yang membandel. (Paket: 1.950K/3X)",
    image: MischeLaserAcneImg
  },
  {
    id: 20,
    categoryId: 4,
    title: "Mische Laser for Hyperpigmentation",
    duration: 60,
    price: 875000,
    description: "Prosedur laser yang digunakan untuk mengatasi masalah Freckles atau bintik-bintik coklat pada kulit wajah yang dapat muncul pada usia muda. (Paket: 1.990K/3X)",
    image: MischeLaserHyperImg
  },
  {
    id: 21,
    categoryId: 4,
    title: "Mische Luminous Laser + IPL",
    duration: 60,
    price: 1225000,
    description: "Tahapan meliputi deep cleansing dan soft peeling. Setelah di laser, wajah akan di aplikasikan serum khusus dengan menggunakan oxygen infusion. Selanjutnya wajah akan diterapi IPL (Intensed Pulsed Light) yang berfungsi untuk memperbaiki kolagen kulit sehingga kulit lebih terasa kenyal, sehat dan merona. (Paket: 2.900K/3X)",
    image: MischeLuminousIPLImg
  },
  {
    id: 22,
    categoryId: 4,
    title: "Mische Luminous Laser + Biolight",
    duration: 60,
    price: 1125000,
    description: "Tahapan meliputi deep cleansing dan soft peeling. Setelah di laser, wajah akan di aplikasikan serum khusus dengan menggunakan oxygen infusion. Selanjutnya di oleskan masker wajah sekaligus terapi penyinaran PDT yang berfungsi untuk penetrasi bahan aktif serum dan masker sampai ke dalam lapisan kulit yang lebih dalam. (Paket: 2.600K/3X)",
    image: MischeLuminousBiolightImg
  },
  {
    id: 23,
    categoryId: 4,
    title: "Mische Laser Tattoo Removal",
    duration: 60,
    price: 1500000,
    description: "Prosedur laser yang dapat memanaskan partikel tinta tato dan membuatnya hancur dari luar. Sehingga partikel tinta akan lebih cepat hancur dan di blok oleh tubuh. Dapat menghilangkan tattoo berwarna, tattoo body, dan tattoo alis. (Harga: 1.500K/Titik)",
    image: MischeTattooRemovalImg
  },

  // 5. Cauter
  {
    id: 24,
    categoryId: 5,
    title: "Cauter Kecil",
    duration: 60,
    price: 450000,
    description: "Cauter treatment adalah prosedur perawatan yang dilakukan untuk menghilangkan berbagai kelainan kulit. Contohnya titik titik hitam pada kulit, milia (lemak dipermukaan kulit), kutil, skintag dan tahi lalat.",
    image: CauterKecilImg
  },
  {
    id: 25,
    categoryId: 5,
    title: "Cauter Sedang",
    duration: 60,
    price: 800000,
    description: "Cauter treatment adalah prosedur perawatan yang dilakukan untuk menghilangkan berbagai kelainan kulit. Contohnya titik titik hitam pada kulit, milia (lemak dipermukaan kulit), kutil, skintag dan tahi lalat.",
    image: CauterSedangImg
  },
  {
    id: 26,
    categoryId: 5,
    title: "Cauter Full face - Neck",
    duration: 60,
    price: 1500000,
    description: "Cauter treatment adalah prosedur perawatan yang dilakukan untuk menghilangkan berbagai kelainan kulit. Contohnya titik titik hitam pada kulit, milia (lemak dipermukaan kulit), kutil, skintag dan tahi lalat.",
    image: CauterFullfaceImg
  },

  // 6. Intense Pulse Light (IPL)
  {
    id: 27,
    categoryId: 6,
    title: "IPL Brazilian",
    duration: 60,
    price: 525000,
    description: "Perawatan wajah dengan efek anti bacterial dari sinar IPL yang efektif mengurangi jerawat atau peradangan dan mengobati jerawat yang membandel. (Paket: 1.225k/3x)",
    image: IPLBrazilianImg
  },
  {
    id: 28,
    categoryId: 6,
    title: "IPL Acne Clear Therapy",
    duration: 60,
    price: 425000,
    description: "Perawatan wajah dengan efek anti bacterial dari sinar IPL yang efektif mengurangi jerawat atau peradangan dan mengobati jerawat yang membandel. (Paket: 1.725k/3x)",
    image: IPLAcneImg
  },
  {
    id: 29,
    categoryId: 6,
    title: "IPL Face Rejuvenating",
    duration: 60,
    price: 425000,
    description: "Perawatan kulit wajah dengan sinar IPL yang berfungsi memperbaiki kinerja kulit, Remodelling Collagen, sehingga kondisi kulit menjadi lebih sehat merona, lebih kenyal, dan meningkatkan kelembaban kulit. (Paket: 1.725k/3x)",
    image: IPLFaceRejImg
  },
  {
    id: 30,
    categoryId: 6,
    title: "IPL Glowskin",
    duration: 60,
    price: 550000,
    description: "Perawatan kulit wajah dengan sinar IPL yang berfungsi merangsang pembentukan kolagen untuk menaikkan tone kulit, glowing instan, memperbaiki warna dan tekstur kulit.",
    image: IPLGlowskinImg
  },
  {
    id: 31,
    categoryId: 6,
    title: "IPL Redness Skin Therapy",
    duration: 60,
    price: 500000,
    description: "Perawatab kulit wajah dengan menggunakan sinar IPL yang berfungsi untuk mengatasi kemerahan pada kulit akibat proses inflamasi atau peradangan jerawat serta mengurangi bruntusan.",
    image: IPLRednessImg
  },
  {
    id: 32,
    categoryId: 6,
    title: "IPL Hair Removal - Under Arm",
    duration: 60,
    price: 450000,
    description: "Teknik perawatan dengan therapy cahaya, sangat efektif membantu memperlambat pertumbuhan jaringan rambut. perawatan ini efektif untuk menghilangkan bulu halus disekitar area tubuh. Hasil: Rambut dan bulu halus akan berkurang dan secara bertahap tidak akan tumbuh kembali, nyaman, tidak menimbulkan alergi kulit, serta tanpa rasa sakit. (Paket: 1.900K)",
    image: IPLHairUnderArmImg
  },
  {
    id: 33,
    categoryId: 6,
    title: "IPL Hair Removal - Tangan",
    duration: 60,
    price: 700000,
    description: "Teknik perawatan dengan therapy cahaya, sangat efektif membantu memperlambat pertumbuhan jaringan rambut. perawatan ini efektif untuk menghilangkan bulu halus disekitar area tubuh. Hasil: Rambut dan bulu halus akan berkurang dan secara bertahap tidak akan tumbuh kembali, nyaman, tidak menimbulkan alergi kulit, serta tanpa rasa sakit. (Paket: 2.950K)",
    image: IPLHairTanganImg
  },
  {
    id: 34,
    categoryId: 6,
    title: "IPL Hair Removal - Seluruh Tangan",
    duration: 60,
    price: 950000,
    description: "Teknik perawatan dengan therapy cahaya, sangat efektif membantu memperlambat pertumbuhan jaringan rambut. perawatan ini efektif untuk menghilangkan bulu halus disekitar area tubuh. Hasil: Rambut dan bulu halus akan berkurang dan secara bertahap tidak akan tumbuh kembali, nyaman, tidak menimbulkan alergi kulit, serta tanpa rasa sakit. (Paket: 4.000K)",
    image: IPLHairSeluruhTanganImg
  },
  {
    id: 35,
    categoryId: 6,
    title: "IPL Hair Removal - Kaki",
    duration: 60,
    price: 100000,
    description: "Teknik perawatan dengan therapy cahaya, sangat efektif membantu memperlambat pertumbuhan jaringan rambut. perawatan ini efektif untuk menghilangkan bulu halus disekitar area tubuh. Hasil: Rambut dan bulu halus akan berkurang dan secara bertahap tidak akan tumbuh kembali, nyaman, tidak menimbulkan alergi kulit, serta tanpa rasa sakit. (Paket: 425K)",
    image: IPLHairKakiImg
  },
  {
    id: 36,
    categoryId: 6,
    title: "IPL Hair Removal - Seluruh Kaki",
    duration: 60,
    price: 950000,
    description: "Teknik perawatan dengan therapy cahaya, sangat efektif membantu memperlambat pertumbuhan jaringan rambut. perawatan ini efektif untuk menghilangkan bulu halus disekitar area tubuh. Hasil: Rambut dan bulu halus akan berkurang dan secara bertahap tidak akan tumbuh kembali, nyaman, tidak menimbulkan alergi kulit, serta tanpa rasa sakit. (Paket: 4.000K)",
    image: IPLHairSeluruhKakiImg
  },
  {
    id: 37,
    categoryId: 6,
    title: "IPL Hair Removal - Kumis",
    duration: 60,
    price: 1900000,
    description: "Teknik perawatan dengan therapy cahaya, sangat efektif membantu memperlambat pertumbuhan jaringan rambut. perawatan ini efektif untuk menghilangkan bulu halus disekitar area tubuh. Hasil: Rambut dan bulu halus akan berkurang dan secara bertahap tidak akan tumbuh kembali, nyaman, tidak menimbulkan alergi kulit, serta tanpa rasa sakit. (Paket: 7.950K)",
    image: IPLHairKumisImg
  },
  {
    id: 38,
    categoryId: 6,
    title: "IPL Hair Removal - Jambang",
    duration: 60,
    price: 400000,
    description: "Teknik perawatan dengan therapy cahaya, sangat efektif membantu memperlambat pertumbuhan jaringan rambut. perawatan ini efektif untuk menghilangkan bulu halus disekitar area tubuh. Hasil: Rambut dan bulu halus akan berkurang dan secara bertahap tidak akan tumbuh kembali, nyaman, tidak menimbulkan alergi kulit, serta tanpa rasa sakit. (Paket: 1.700K)",
    image: IPLHairJambangImg
  },

  // 7. Weight Management Plus For Abdomen
  {
    id: 39,
    categoryId: 7,
    title: "Slimming System Plus For Abdomen",
    duration: 60,
    price: 825000,
    description: "Perawatan kecantikan yang ditujukan untuk mengurangi lemak diarea perut dan membentuk kontur tubuh. Perawatan ini menggunakan teknologi seperti Cavitation, RF dan Vaccum. (Paket: 2.400K/4X)",
    image: SlimmingPlusImg
  },
  {
    id: 40,
    categoryId: 7,
    title: "Slimming System Ultimate Double Action For Abdomen",
    duration: 60,
    price: 975000,
    description: "Perawatan ini menggunakan teknologi seperti Cavitation, RF, Vaccum dan Injection. Indikasi : Lingkar perut berkurang 2-5 cm/1x Treatment, Membantu sirkulasi nutrisi, cairan serta pembuangan zat sisa didalam tubuh lebih lancer, Hasil dapat lang sung terlihat dalam 1x perawatan, Aman dan tidak adfa efek samping. (Paket: 3.000K/4X)",
    image: SlimmingUltimateImg
  },
  {
    id: 41,
    categoryId: 7,
    title: "Body Cavitation - Betis",
    duration: 60,
    price: 645000,
    description: "Sangat efektif dan aman untuk penghaancuran lemak pada area paha, betis, pangkal tangan, bokong dan pinggul. (Paket: 2.000K/4X)",
    image: CavitationBetisImg
  },
  {
    id: 42,
    categoryId: 7,
    title: "Body Cavitation - Bokong",
    duration: 60,
    price: 625000,
    description: "Sangat efektif dan aman untuk penghaancuran lemak pada area paha, betis, pangkal tangan, bokong dan pinggul. (Paket: 1.950K/4X)",
    image: CavitationBokongImg
  },
  {
    id: 43,
    categoryId: 7,
    title: "Body Cavitation - Perut & Pinggul",
    duration: 60,
    price: 615000,
    description: "Sangat efektif dan aman untuk penghaancuran lemak pada area paha, betis, pangkal tangan, bokong dan pinggul. (Paket: 1.850K/4X)",
    image: CavitationPerutImg
  },
  {
    id: 44,
    categoryId: 7,
    title: "Body Cavitation - Paha",
    duration: 60,
    price: 675000,
    description: "Sangat efektif dan aman untuk penghaancuran lemak pada area paha, betis, pangkal tangan, bokong dan pinggul. (Paket: 2.200K/4X)",
    image: CavitationPahaImg
  },
  {
    id: 45,
    categoryId: 7,
    title: "Body Cavitation - Lengan",
    duration: 60,
    price: 625000,
    description: "Sangat efektif dan aman untuk penghaancuran lemak pada area paha, betis, pangkal tangan, bokong dan pinggul. (Paket: 1.950K/4X)",
    image: CavitationLenganImg
  },

  // 8. Microneedle Treatment System (MTS)
  {
    id: 46,
    categoryId: 8,
    title: "MTS with PRP + Biolight",
    duration: 60,
    price: 1725000,
    description: "Perawatan intensif dengan metode PRP (Platelet Rich Plasma) menggunakan sebagian darah pasien untuk dijadikan plasma yang kaya akan pertumbuhan dan mampu membantu regenerasi kulit serta memberikan efek peremajaan sangat direkomendasikan untuk mengurangi kerutan halus, bopeng bekas jerawat, pori - pori besar dan meningkatkan kolagen kulit wajah.",
    image: MTSPRPImg
  },
  {
    id: 47,
    categoryId: 8,
    title: "MTS for Acne Scars",
    duration: 60,
    price: 850000,
    description: "Perawatan intensif pada kulit wajah dengan memasukan serum dan vitamin kedalam lapisan kulit untuk indikasi scars, bopeng bekas jerawat dan pori – pori. (Paket: 2475K/4X)",
    image: MTSAcneImg
  },
  {
    id: 48,
    categoryId: 8,
    title: "PRP Face Combo Glow",
    duration: 60,
    price: 825000,
    description: "Perawatan intensif dengan kombinasi metode PRP (Platelet Rich Plasma) & Mesotherapy menggunakan darah pasien untuk dijadikan plasma yang kaya akan pertumbuhan dan mampu membantu regenerasi kulit. Perawatan ini akan meningkatkan kadar kolagen, menambah volume kulit secara alami, mengurangi garis halus, mengurangi bekas jerawat yang kehitaman dan mengurangi acne scar (bopeng).",
    image: PRPFaceComboImg
  },
  {
    id: 49,
    categoryId: 8,
    title: "SUBSISI + MTS PRP WITH Biolight",
    duration: 60,
    price: 1725000,
    description: "Perawatan intensif untuk bopeng atau scar bekas jerawat menggunakan jarum tumpul yang berfungsi untuk memutus jaringan ikat dibawah kulit yang sehingga dapat rata ke permukaan kulit, treatment ini dikombinasikan dengan microonedling menggunakan darah pasien dijadikan plasma yang kaya akan pertumbuhan dan membantu regenerasi sel kulit. Dilanjutkan dengan photodynamic therapy yang membantu untuk meredakan kemerahan dan membunuh bakteri penyebab infeksi diwajah pasca treatment.",
    image: SUBSISIImg
  },

  // 9. MESOTHERAPY
  {
    id: 50,
    categoryId: 9,
    title: "Mesoflek",
    duration: 60,
    price: 900000,
    description: "Perawatan wajah intensif untuk mengatasi problem melasma (flek), dark spot (noda hitam), kerutan halus, sering terpapar matahari (photo aging), dan dehidrasi kulit. (Paket: 3.700K/5X)",
    image: MesoflekImg
  },
  {
    id: 51,
    categoryId: 9,
    title: "Mesoalopecia",
    duration: 60,
    price: 685000,
    description: "Bentuk aktif perawatan kosmetika medis yang telah terbukti efektif menumbuhkan rambut, mencengah kerontokan, dan menyehatkan rambut melalui teknik pemberian mikro nutrisi yang akan mempercepat pertumbuhan rambut dan menunjang keseimbangan nutrisi kulit kepala. Bermanfaat untuk alopecia androgenetic. (Paket: 2.600K/5X)",
    image: MesoalopeciaImg
  },

  // 10. MISCHE SKIN BOOSTER
  {
    id: 52,
    categoryId: 10,
    title: "MISCHE LUMERA SKIN BOOSTER",
    duration: 60,
    price: 1800000,
    description: "Perawatan wajah yang mengandung DNA Salmon bertujuan untuk meregenerasi sel kulit, meningkatkan produksi kolagen, dan memperbaiki struktur kulit agar lebih kenyal, kencang dan lembab. Treatment ini efektif untuk anti aging, menyamarkan pori-pori, memudarkan bekas jerawat, mencerahkan kulit, memperbaiki tektstur kulit dan mengurangi peradangan pada kulit wajah.",
    image: LumeraImg
  },
  {
    id: 53,
    categoryId: 10,
    title: "PUREVA FRESH SKIN THERAPY",
    duration: 60,
    price: 825000,
    description: "Perawatan wajah yang berfungsi untuk mengurangi peradangan pada jerawat, mengurangi PIH bekas jerawat, meratakan warna kulit dan mencerahkan wajah.",
    image: PurevaImg
  },
  {
    id: 54,
    categoryId: 10,
    title: "HYDRALUXE SKIN BOOSTER",
    duration: 60,
    price: 825000,
    description: "Perawatan wajah yang berfungsi untuk mencerahkan kulit, meratakan warna kulit, menyamarkan flek dan melisma.",
    image: HydraluxeImg
  },
  {
    id: 55,
    categoryId: 10,
    title: "CRYSTALE SKIN BOOSTER",
    duration: 60,
    price: 850000,
    description: "Berfungsi meregenerasi sel kulit baru dan merangsang kolagen dan elastin kulit memberikan efek glowing, mencerahkan dan meningkatkan kelembapan kulit.",
    image: CrystaleImg
  },

  // 11. MISCHE ROYAL LIFT (BOTOX)
  {
    id: 56,
    categoryId: 11,
    title: "MISCHE ROYAL LIFT (BOTOX)",
    duration: 60,
    price: 3000000,
    description: "Berfungsi untuk menghilangkan kerutan pada wajah dan tanda penuaan, serta meniruskan rahang, mengencangkan kulit di area dagu dan leher",
    image: BotoxDetailImg
  },

  // 12. Other Treatments
  {
    id: 57,
    categoryId: 12,
    title: "Totok Wajah",
    duration: 60,
    price: 90000,
    description: "Therapy untuk menghilangkan kepenatan diwajah dengan menekan titik akupuntur pada wajah, dan melancarkan darah sehingga wajah terlihat lebih sehat, muda dan segar.",
    image: TotokWajahImg
  },
  {
    id: 58,
    categoryId: 12,
    title: "Oxygen Jet",
    duration: 60,
    price: 115000,
    description: "Infusi oxygen yang berfungsi untuk meningkatkan kelembaban dan mencegah dehidrasi pada kulit wajah, meredakan kulit wajah kemerahan, mengobati kulit berminyak dan berjerawat.",
    image: OxygenJetImg
  },
  {
    id: 59,
    categoryId: 12,
    title: "Biolight",
    duration: 60,
    price: 90000,
    description: "Yaitu penyinaran lampu LED untuk mengurangi produksi minyak yang berlebih, mengurangi peradangan jerawat, mengurangi bekas kemerahan karena jerawat, serta mencerahkan dan menghaluskan kulit.",
    image: BiolightImg
  },
  {
    id: 60,
    categoryId: 12,
    title: "Oxyserum Infusion",
    duration: 60,
    price: 90000,
    description: "Pengaplikasian serum dengan menggunakan alat dengan sensasi menyegarkan.",
    image: OxyserumImg
  },
  {
    id: 61,
    categoryId: 12,
    title: "Skin Analysis",
    duration: 60,
    price: 50000,
    description: "Untuk mengecek kondisi kulit wajah seperti kelembapan, kadar air, minyak atau sebum, pigmentasi, dan pori-pori kulit wajah sehingga dapat di rekomendasikan perawatan dan skin care yang tepat",
    image: SkinAnalysisImg
  },
  {
    id: 62,
    categoryId: 12,
    title: "Mische Privilege Card (MPC)",
    duration: 60,
    price: 90000,
    description: "Benefit : Free Refresh Facial senilai Rp. 145.000 ; 15% Off untuk Regular Treatment oleh Dokter ; 20% Off untuk Regular Treatment oleh Asisten Dokter ; 10% Off untuk semua produk dan krim racikan Dokter, Special Discount oleh Merchant – merchant",
    image: MPCImg
  },

  // 13. MISCHE PAKET PRODUCTS
  {
    id: 63,
    categoryId: 13,
    title: "Acne Skin Acne Control",
    duration: 60,
    price: 625000,
    description: "Paket produk perawatan lengkap untuk mengontrol jerawat secara intensif.",
    image: acneImg
  },
  {
    id: 64,
    categoryId: 13,
    title: "Paket Acne Skin Calming",
    duration: 60,
    price: 625000,
    description: "Paket produk perawatan untuk menenangkan kulit berjerawat dan meradang.",
    image: acneImg
  },
  {
    id: 65,
    categoryId: 13,
    title: "Paket Aging Skin Renewal",
    duration: 60,
    price: 720000,
    description: "Paket produk perawatan untuk peremajaan kulit agar tampak lebih muda.",
    image: antiAgingImg
  },
  {
    id: 66,
    categoryId: 13,
    title: "Paket Aging Skin Firming",
    duration: 60,
    price: 720000,
    description: "Paket produk perawatan untuk mengencangkan kulit yang mulai kendur.",
    image: antiAgingImg
  },
  {
    id: 67,
    categoryId: 13,
    title: "Paket Brightening Skin Radiance",
    duration: 60,
    price: 740000,
    description: "Paket produk perawatan untuk mencerahkan kulit wajah yang kusam.",
    image: whitteningImg
  },
  {
    id: 68,
    categoryId: 13,
    title: "Paket Brightening Skin Glow Up",
    duration: 60,
    price: 740000,
    description: "Paket produk perawatan pencerah agar wajah tampak sehat dan glowing instan.",
    image: whitteningImg
  }
];
