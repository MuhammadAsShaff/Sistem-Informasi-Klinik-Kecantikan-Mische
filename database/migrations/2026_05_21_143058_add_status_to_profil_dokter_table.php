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
        Schema::table('profilDokter', function (Blueprint $table) {
            if (!Schema::hasColumn('profilDokter', 'status')) {
                $table->string('status')->default('Tersedia')->after('deskripsi');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profilDokter', function (Blueprint $table) {
            if (Schema::hasColumn('profilDokter', 'status')) {
                $table->dropColumn('status');
            }
        });
    }
};
