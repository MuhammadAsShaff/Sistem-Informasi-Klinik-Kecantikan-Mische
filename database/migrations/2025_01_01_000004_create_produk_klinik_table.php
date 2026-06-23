<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('produkKlinik', function (Blueprint $table) {
            // Kolom primary key 'idProduk' (Auto-Increment Integer)
            $table->increments('idProduk');
            
            // Kolom 'gambar' untuk menyimpan path/nama file gambar produk
            $table->string('gambar');
            
            // Kolom 'nama' produk dengan maksimal 60 karakter
            $table->string('nama', 60);
            
            // Kolom 'deskripsi' produk (TEXT)
            $table->text('deskripsi');
            
            // Kolom 'harga' bertipe unsigned integer (tidak boleh minus)
            $table->unsignedInteger('harga');
            
            // Kolom 'stock' (sisa stok fisik produk)
            $table->unsignedInteger('stock');
            
            // Kolom 'berat' default 500. Sangat penting untuk perhitungan ongkos kirim API RajaOngkir
            $table->integer('berat')->default(500)->comment('Berat produk dalam gram');
            
            // Foreign key 'idKategori' yang merujuk pada tabel kategoriProduk
            $table->unsignedInteger('idKategori');
            // Jika kategori dihapus, seluruh produk di dalam kategori tersebut ikut terhapus (cascade)
            $table->foreign('idKategori')->references('idKategori')->on('kategoriProduk')->onDelete('cascade');
            
            // Kolom waktu (created_at & updated_at)
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('produkKlinik');
    }
};