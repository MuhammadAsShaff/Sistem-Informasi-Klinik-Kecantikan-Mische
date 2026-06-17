<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('penjualan', function (Blueprint $table) {
            $table->increments('idPenjualan');
            $table->date('tanggal');
            $table->unsignedBigInteger('idAlamat')->nullable();
            $table->foreign('idAlamat')->references('id')->on('alamat_customer')->onDelete('set null');
            $table->string('invoiceNumber')->unique();
            $table->integer('subtotal');
            $table->integer('shippingCost')->default(0);
            $table->string('shippingCourier')->nullable();
            $table->string('shippingService')->nullable();
            $table->string('nomorResi')->nullable();
            $table->integer('total');
            $table->enum('paymentStatus', ['unpaid', 'paid', 'failed', 'expired'])->default('unpaid');
            $table->enum('orderStatus', ['pending', 'diproses', 'dikirim', 'selesai', 'dibatalkan'])->default('pending');
            $table->string('snapToken')->nullable();
            $table->string('midtransOrderId')->nullable();
            $table->timestamp('paidAt')->nullable();
            $table->unsignedInteger('idUser');
            $table->foreign('idUser')->references('idUser')->on('user')->onDelete('cascade');
            $table->unsignedInteger('idPromo')->nullable();
            $table->foreign('idPromo')->references('idPromo')->on('promo')->onDelete('set null');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('penjualan');
    }
};