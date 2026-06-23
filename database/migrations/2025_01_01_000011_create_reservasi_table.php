<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        // Blueprint $table digunakan untuk mendefinisikan struktur kolom tabel.
        Schema::create('reservasi', function (Blueprint $table) {
            // $table->increments(): Membuat primary key bernama 'idReservasi' dengan tipe data Integer (Auto-Increment)
            $table->increments('idReservasi');
            
            // $table->string(): Membuat kolom tipe VARCHAR dengan batas panjang karakter (misal: 60)
            $table->string('namaCustomer', 60); 
            
            // Kolom nomorWa untuk menyimpan nomor telepon customer (VARCHAR, panjang 16 karakter)
            $table->string('nomorWa', 16); 
            
            // Kolom ini mengelompokkan jenis treatment secara umum (contoh: 'Facial', 'Laser', 'Hair Removal')
            $table->string('kategoriReservasi', 60); 
            
            // Kolom ini menyimpan jenis treatment spesifik yang dipilih dalam kategori tersebut (contoh: 'Facial Glowing')
            $table->string('jenisReservasi', 60); 
            
            // $table->date(): Membuat kolom untuk menyimpan format Tanggal (YYYY-MM-DD) tanpa jam/waktu
            $table->date('tanggalReservasi'); 
            
            // Kolom status untuk melacak alur reservasi (Menunggu, Dikonfirmasi, Dibatalkan, dsb.)
            $table->string('status', 60); 
            
            // $table->boolean(): Membuat kolom bernilai true/false (1/0). 'default(false)' berarti secara default belum pernah di-reschedule
            $table->boolean('is_rescheduled')->default(false); 
            
            // $table->unsignedInteger(): Membuat kolom integer non-negatif. 'nullable()' artinya kolom ini boleh kosong (null) jika tamu yang mendaftar bukan member.
            $table->unsignedInteger('idUser')->nullable(); 
            // Foreign key 'idUser' yang merujuk pada tabel 'user'. 'onDelete(cascade)' berarti jika akun user dihapus, maka reservasi ini juga akan terhapus.
            $table->foreign('idUser')->references('idUser')->on('user')->onDelete('cascade'); 
            
            // Kolom integer non-negatif yang mereferensikan dokter yang dituju. Tidak boleh null (wajib).
            $table->unsignedInteger('idDokter'); 
            // Foreign key 'idDokter' yang merujuk pada tabel 'profilDokter'
            $table->foreign('idDokter')->references('idDokter')->on('profilDokter')->onDelete('cascade'); 
            
            // Kolom integer non-negatif untuk ID slot jadwal waktu pendaftaran reservasi
            $table->unsignedInteger('idJadwal'); 
            // Foreign key 'idJadwal' yang merujuk ke tabel 'jadwalReservasi'
            $table->foreign('idJadwal')->references('idJadwal')->on('jadwalReservasi')->onDelete('cascade'); 
            
            // $table->timestamps(): Method ajaib Laravel yang secara otomatis akan membuat dua kolom: 'created_at' dan 'updated_at'
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('reservasi');
    }
};