<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('kegiatan', function (Blueprint $table) {
            $table->increments('idKegiatan');
            $table->string('namaKegiatan', 60);
            $table->text('deskripsi');
            $table->string('foto');
            $table->date('tanggalKegiatan');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('kegiatan');
    }
};