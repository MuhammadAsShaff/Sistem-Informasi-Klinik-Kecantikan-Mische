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
            $table->text('visi');
            $table->text('misi');
            $table->text('deskripsiPerusahaan');
            $table->unsignedInteger('nomorCustomerService');
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
