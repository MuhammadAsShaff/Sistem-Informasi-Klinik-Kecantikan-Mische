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
        Schema::table('promo', function (Blueprint $table) {
            $table->unsignedInteger('idKategori')->nullable()->change();
            $table->unsignedInteger('idProduk')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('promo', function (Blueprint $table) {
            $table->unsignedInteger('idKategori')->nullable(false)->change();
            $table->unsignedInteger('idProduk')->nullable(false)->change();
        });
    }
};
