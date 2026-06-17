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
        Schema::table('produkklinik', function (Blueprint $table) {
            $table->integer('berat')->default(500)->after('stock')->comment('Berat produk dalam gram');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('produkklinik', function (Blueprint $table) {
            $table->dropColumn('berat');
        });
    }
};
