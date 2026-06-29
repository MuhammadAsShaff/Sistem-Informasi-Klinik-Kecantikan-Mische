import AcneImg from '@/assets/images/acne.jpg';
import AntiAgingImg from '@/assets/images/anti aging.jpg';
import WhiteningImg from '@/assets/images/whittening.jpg';

/**
 * =========================================================================
 * KATALOG BERKAS PRODUK TERLARIS (ProductData)
 * =========================================================================
 * Ibarat selebaran daftar menu produk unggulan (Whitening, Acne, Anti Aging)
 * yang dicetak tebal untuk memudahkan petugas memajang barang paling laku di rak etalase lobi.
 */
export const products = [
  {
    id: 1,
    title: "WHITENING SERIES",
    description: "Membantu mencerahkan kulit wajah dan menyamarkan noda hitam secara efektif.",
    image: WhiteningImg,
  },
  {
    id: 2,
    title: "ACNE SERIES",
    description: "Mengatasi masalah jerawat dan kulit berminyak dengan formula yang menenangkan.",
    image: AcneImg,
  },
  {
    id: 3,
    title: "ANTI AGING SERIES",
    description: "Menyamarkan tanda penuaan dini dan menjaga kekenyalan kulit wajah.",
    image: AntiAgingImg,
  }
];
