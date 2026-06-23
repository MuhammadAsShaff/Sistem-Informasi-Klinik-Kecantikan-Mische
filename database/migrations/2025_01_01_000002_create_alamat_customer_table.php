<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('alamat_customer', function (Blueprint $table) {
            // Primary key 'id' bertipe BigInteger Auto-Increment bawaan Laravel
            $table->id();
            
            // Foreign key 'idUser' untuk merelasikan alamat ini dengan pemiliknya (Customer)
            $table->unsignedInteger('idUser');
            // Menentukan bahwa 'idUser' merujuk ke tabel 'user'. Jika user dihapus, alamatnya ikut terhapus (cascade)
            $table->foreign('idUser')->references('idUser')->on('user')->onDelete('cascade');
            
            // Kolom 'namaPenerima' VARCHAR
            $table->string('namaPenerima');
            
            // Kolom 'nomorHp' penerima paket
            $table->string('nomorHp');
            
            // Kolom 'detailAlamat' bertipe TEXT untuk menyimpan alamat lengkap yang panjang
            $table->text('detailAlamat');
            
            // Kolom-kolom opsional (nullable) untuk integrasi API ongkir (RajaOngkir)
            $table->string('provinceId')->nullable();
            $table->string('cityId')->nullable();
            $table->string('districtId')->nullable();
            $table->string('kodePos')->nullable();
            
            // Kolom created_at dan updated_at
            $table->timestamps();
        });

        // Setelah tabel alamat jadi, kita update tabel 'user' untuk mendaftarkan 'idAlamatUtama' sebagai Foreign Key
        Schema::table('user', function (Blueprint $table) {
            // Jika alamat utama dihapus, biarkan kolom idAlamatUtama di tabel user menjadi NULL (set null)
            $table->foreign('idAlamatUtama')->references('id')->on('alamat_customer')->onDelete('set null');
        });
    }

    public function down(): void {
        // Rollback: Hapus foreign key di tabel user terlebih dahulu sebelum menghapus tabel alamat
        Schema::table('user', function (Blueprint $table) {
            $table->dropForeign(['idAlamatUtama']);
        });
        
        // Hapus tabel alamat_customer
        Schema::dropIfExists('alamat_customer');
    }
};