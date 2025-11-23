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
        Schema::create('reservasi', function (Blueprint $table) {
            $table->increments('idReservasi');
            $table->string('namaCustomer',60);
            $table->unsignedInteger('nomorWa');
            $table->string('jenisTreatment',60);
            $table->date('tanggalReservasi');
            $table->string('status',60);
            $table->unsignedInteger('idUser');
            $table->foreign('idUser')->references('idUser')->on('user')->onDelete('cascade');
            $table->unsignedInteger('idDokter');
            $table->foreign('idDokter')->references('idDokter')->on('profilDokter')->onDelete('cascade');
            $table->unsignedInteger('idJadwal');
            $table->foreign('idJadwal')->references('idJadwal')->on('jadwalReservasi')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservasi');
    }
};
