<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('testimoni', function (Blueprint $table) {
            // Primary key idTestimoni
            $table->increments('idTestimoni');
            
            // Nama inisial/panggilan pelanggan yang memberi ulasan
            $table->string('namaTester', 20);
            
            // Jenis treatment yang di-review (Misal: "Laser CO2")
            $table->string('jenisTestimoni', 60);
            
            // Pesan ulasan dari pelanggan
            $table->text('deskripsi');
            
            // Tanggal saat pelanggan tersebut melakukan treatment
            $table->date('tanggalTreatment');
            
            // Bukti foto before-after / wajah setelah treatment
            $table->string('buktiFoto');
            
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('testimoni');
    }
};