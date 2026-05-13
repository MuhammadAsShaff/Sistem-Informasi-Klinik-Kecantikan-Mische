<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProfilPerusahaan;

class ProfilePerusahaanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ProfilPerusahaan::create([
            'visi' => 'Menjadi pusat layanan klinik estetika dan kecantikan medis terdepan dan paling tepercaya di tingkat nasional, yang tidak hanya mengedepankan inovasi teknologi mutakhir serta standar pelayanan bertaraf internasional, namun juga berdedikasi penuh dalam membantu setiap individu, baik wanita maupun pria, untuk menemukan dan memancarkan potensi kecantikan serta kepercayaan diri alami mereka secara aman, sehat, dan berkelanjutan.',
            'misi' => '1. Menyediakan ragam perawatan estetika medis dan non-medis yang terbukti aman, bersertifikasi klinis, dan selalu disesuaikan dengan kebutuhan spesifik (personalisasi) setiap jenis kulit pasien. 
2. Membangun tim medis yang terdiri dari dokter spesialis kulit dan terapis bersertifikat tinggi yang secara konsisten mengikuti perkembangan ilmu pengetahuan dan teknologi kecantikan global. 
3. Menggunakan produk berbahan dasar premium yang ramah lingkungan serta alat-alat teknologi tinggi yang telah lulus uji kelayakan BPOM dan standar medis dunia. 
4. Memberikan pengalaman pelanggan (Customer Experience) yang sangat eksklusif, hangat, dan mengutamakan kenyamanan mulai dari pintu masuk hingga layanan purnajual paska-perawatan. 
5. Turut serta mengedukasi masyarakat luas tentang pentingnya menjaga kesehatan kulit jangka panjang dengan cara yang rasional dan bukan sekadar mengejar hasil instan yang berpotensi merusak jaringan kulit.',
            'fotoPerusahaan' => 'profil_perusahaan/mische-logo.png',
            'deskripsiPerusahaan' => 'Mische Beauty Clinic didirikan dengan satu filosofi sederhana: "Setiap individu terlahir dengan keunikan pesonanya masing-masing, dan tugas kami adalah merawat kanvas alami tersebut agar bersinar pada titik paling maksimal." 

Beroperasi sejak puluhan tahun lalu, kami telah berevolusi menjadi lebih dari sekadar tempat perawatan wajah, melainkan sebuah pelarian medis nan mewah tempat Anda mempercayakan sepenuhnya aset terbesar Anda: Kulit Anda. Seluruh fasilitas di Mische Beauty Clinic telah dirancang menyerupai hotel bintang lima guna memastikan sterilitas sekelas rumah sakit namun dengan suasana ketenangan relaksasi yang tiada tara. 

Kami menyadari bahwa masalah kulit seperti jerawat akut, penuaan dini, flek hitam, atau sekadar wajah kusam sering kali mengambil alih kepercayaan diri seseorang dalam kehidupan sosial mereka. Oleh karena itu, melalui pendekatan medis dermatologi yang berbasis pada data, bukti analitis (Evidence-Based Medicine), serta empati, setiap pasien kami akan melalui sesi konsultasi mendalam untuk mengupas akar permasalahan kulit mereka. Kami tidak percaya pada pendekatan "Satu Krim untuk Semua Orang". Mulai dari tindakan Laser Rejuvenation, Filler, Botox, hingga eksfoliasi organik, semua prosedur dijamin ditangani langsung oleh para pakar estetika kami. 

Komitmen terbesar kami bukan sekadar merias atau menutupi kekurangan, melainkan menyehatkan struktur lapisan kulit dari dalam sehingga Anda tetap merasa rupawan bahkan ketika baru bangun tidur tanpa riasan apa pun.',
            'nomorCustomerService' => '081234567890',
            'jamBuka' => '09:00',
            'jamTutup' => '20:00'
        ]);
    }
}
