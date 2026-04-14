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
        Schema::create('user', function (Blueprint $table) {
            $table->increments('idUser');
            $table->string('nama',60);
            $table->string('alamat');
            $table->string('jenisKelamin',12);
            $table->date('tanggalLahir');
            $table->string('role',12);
            $table->string('email',255);
            $table->string('nomorWa');
            $table->string('password');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user');
    }
};
