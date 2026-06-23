<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Menjalankan migration (Membuat tabel di database)
     */
    public function up(): void {
        // Blueprint $table digunakan untuk mendefinisikan struktur tabel
        Schema::create('user', function (Blueprint $table) {
            // $table->increments(): Membuat primary key 'idUser' dengan tipe data Integer Auto-Increment
            $table->increments('idUser');
            
            // $table->string(): Membuat kolom VARCHAR 'nama' dengan panjang maksimal 60 karakter
            $table->string('nama', 60);
            
            // Kolom 'jenisKelamin' VARCHAR panjang 12 karakter (Pria/Wanita)
            $table->string('jenisKelamin', 12);
            
            // $table->date(): Membuat tipe kolom DATE (YYYY-MM-DD)
            $table->date('tanggalLahir');
            
            // Kolom 'role' untuk membedakan hak akses (admin/customer)
            $table->string('role', 12);
            
            // Kolom 'email' VARCHAR dengan panjang maksimum 255 karakter
            $table->string('email', 255);
            
            // Kolom 'nomorWa' (WhatsApp) VARCHAR tipe string
            $table->string('nomorWa');
            
            // Kolom 'password' menyimpan hash password terenkripsi
            $table->string('password');
            
            // Kolom foreign key 'idAlamatUtama' bertipe BigInteger yang boleh kosong (nullable)
            $table->unsignedBigInteger('idAlamatUtama')->nullable();
            
            // $table->timestamps(): Otomatis membuat kolom 'created_at' dan 'updated_at'
            $table->timestamps();
        });
    }

    /**
     * Membatalkan migration (Menghapus tabel dari database jika di-rollback)
     */
    public function down(): void {
        Schema::dropIfExists('user');
    }
};