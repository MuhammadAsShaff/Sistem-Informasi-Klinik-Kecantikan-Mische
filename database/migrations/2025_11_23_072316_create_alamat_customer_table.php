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
        Schema::create('alamat_customer', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('idUser');
            $table->foreign('idUser')->references('idUser')->on('user')->onDelete('cascade');
            $table->string('namaPenerima');
            $table->string('nomorHp');
            $table->text('detailAlamat');
            $table->string('provinceId')->nullable();
            $table->string('cityId')->nullable();
            $table->string('districtId')->nullable();
            $table->string('kodePos')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alamat_customer');
    }
};
