<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('profilPerusahaan', function (Blueprint $table) {
            $table->increments('idProfil');
            $table->mediumText('visi');
            $table->mediumText('misi');
            $table->string('fotoPerusahaan');
            $table->mediumText('deskripsiPerusahaan');
            $table->string('nomorCustomerService');
            $table->time('jamBukak');
            $table->time('jamKeluar');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profilPerusahaan');
    }
};
