<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('profilPerusahaan', function (Blueprint $table) {
            // Primary key idProfil
            $table->increments('idProfil');
            
            // Kolom mediumText mampu menampung string lebih panjang dari text biasa (cocok untuk Visi/Misi panjang)
            $table->mediumText('visi');
            $table->mediumText('misi');
            
            // Kolom foto banner / logo perusahaan
            $table->string('fotoPerusahaan');
            
            // Paragraf profil panjang tentang klinik
            $table->mediumText('deskripsiPerusahaan');
            
            // Kontak center WA yang akan dipasang di footer / tombol chat
            $table->string('nomorCustomerService');
            
            // Waktu buka & tutup menggunakan tipe data time
            $table->time('jamBuka');
            $table->time('jamTutup');
            
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('profilPerusahaan');
    }
};