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
        Schema::create('penjualan', function (Blueprint $table) {
            $table->increments('idPenjualan');
            $table->date('tanggal');
            $table->unsignedBigInteger('idAlamat')->nullable(); // Foreign key to alamat_customer
            $table->foreign('idAlamat')->references('id')->on('alamat_customer')->onDelete('set null');
            
            $table->string('invoiceNumber')->unique();
            $table->integer('subtotal');
            $table->integer('shippingCost')->default(0);
            $table->string('shippingCourier')->nullable(); // pos, jne, tiki
            $table->string('shippingService')->nullable(); // REG, YES, dll
            $table->integer('total');
            $table->enum('paymentStatus', ['unpaid', 'paid', 'failed', 'expired'])->default('unpaid');
            $table->enum('orderStatus', ['pending', 'diproses', 'dikirim', 'selesai', 'dibatalkan'])->default('pending');
            $table->string('snapToken')->nullable(); // Dari Midtrans
            $table->string('midtransOrderId')->nullable();
            $table->timestamp('paidAt')->nullable();

            $table->unsignedInteger('idUser');
            $table->foreign('idUser')->references('idUser')->on('user')->onDelete('cascade');
            $table->unsignedInteger('idPromo')->nullable();
            $table->foreign('idPromo')->references('idPromo')->on('promo')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penjualan');
    }
};
