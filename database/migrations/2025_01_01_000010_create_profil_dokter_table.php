<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('profilDokter', function (Blueprint $table) {
            $table->increments('idDokter');
            $table->string('nama', 60);
            $table->string('foto');
            $table->string('email');
            $table->text('deskripsi');
            $table->string('status')->default('Tersedia');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('profilDokter');
    }
};