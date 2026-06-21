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
        Schema::table('reservasi', function (Blueprint $table) {
            $table->dropColumn('jenisTreatment');
            $table->string('kategoriReservasi', 60)->after('nomorWa');
            $table->string('jenisReservasi', 60)->after('kategoriReservasi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservasi', function (Blueprint $table) {
            $table->dropColumn('kategoriReservasi');
            $table->dropColumn('jenisReservasi');
            $table->string('jenisTreatment', 60)->after('nomorWa');
        });
    }
};
