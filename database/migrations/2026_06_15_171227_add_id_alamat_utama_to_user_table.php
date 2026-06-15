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
        Schema::table('user', function (Blueprint $table) {
            $table->unsignedBigInteger('idAlamatUtama')->nullable()->after('password');
            $table->foreign('idAlamatUtama')->references('id')->on('alamat_customer')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user', function (Blueprint $table) {
            $table->dropForeign(['idAlamatUtama']);
            $table->dropColumn('idAlamatUtama');
        });
    }
};
