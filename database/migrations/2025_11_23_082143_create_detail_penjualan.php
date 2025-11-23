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
        Schema::create('detailPenjualan', function (Blueprint $table) {
            $table->increments('idDetailPenjualan');
            $table->unsignedInteger('jumlahProduk');
            $table->unsignedInteger('idPenjualan');
            $table->foreign('idPenjualan')->references('idPenjualan')->on('penjualan')->onDelete('cascade');
            $table->unsignedInteger('idProduk');
            $table->foreign('idProduk')->references('idProduk')->on('produkKlinik')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detailPenjualan');
    }
};
