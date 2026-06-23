<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        // Blueprint $table digunakan untuk merancang kolom-kolom apa saja yang ada di tabel penjualan.
        Schema::create('penjualan', function (Blueprint $table) {
            // $table->increments(): Membuat primary key bernama 'idPenjualan' dengan Auto-Increment
            $table->increments('idPenjualan');
            
            // Kolom untuk menyimpan tanggal transaksi dilakukan (format date: YYYY-MM-DD)
            $table->date('tanggal');
            
            // Kolom nullable (boleh kosong) yang merujuk pada alamat pengiriman (FK)
            $table->unsignedBigInteger('idAlamat')->nullable();
            // 'onDelete(set null)' berarti jika alamat dihapus di master data, histori penjualan ini tidak ikut terhapus, tapi ID alamatnya menjadi NULL.
            $table->foreign('idAlamat')->references('id')->on('alamat_customer')->onDelete('set null');
            
            // Nomor invoice / nomor nota pesanan, sifatnya unik (tidak boleh ada invoice ganda di DB)
            $table->string('invoiceNumber')->unique();
            
            // Subtotal harga murni (harga barang x jumlah) sebelum kena promo atau ongkir
            $table->integer('subtotal');
            
            // Biaya pengiriman / ongkir. Default 0 jika belum divalidasi ongkirnya atau gratis ongkir
            $table->integer('shippingCost')->default(0);
            
            // Kurir pengiriman (contoh: JNE, J&T, POS). Boleh kosong jika di-pickup
            $table->string('shippingCourier')->nullable();
            
            // Layanan pengiriman dari kurir (contoh: REG, OKE, YES)
            $table->string('shippingService')->nullable();
            
            // Nomor resi pengiriman yang akan diinput oleh admin
            $table->string('nomorResi')->nullable();
            
            // Total keseluruhan harga (Subtotal + Ongkir - Diskon Promo)
            $table->integer('total');
            
            // Status pembayaran (unpaid: belum bayar, paid: lunas, failed: gagal, expired: kedaluwarsa)
            $table->enum('paymentStatus', ['unpaid', 'paid', 'failed', 'expired'])->default('unpaid');
            
            // Kolom untuk melacak pengguna menggunakan metode pembayaran apa (misal: gopay, bank_transfer). Boleh kosong.
            $table->string('paymentMethod', 100)->nullable();
            
            // Status pesanan dari kacamata admin/toko (pending, diproses, dikirim, selesai, dibatalkan)
            $table->enum('orderStatus', ['pending', 'diproses', 'dikirim', 'selesai', 'dibatalkan'])->default('pending');
            
            // Token unik dari gateway pembayaran (Midtrans) untuk memunculkan popup pembayaran
            $table->string('snapToken')->nullable();
            
            // ID unik pesanan yang tercatat di server Midtrans
            $table->string('midtransOrderId')->nullable();
            
            // Waktu persis kapan pembayaran berhasil diverifikasi
            $table->timestamp('paidAt')->nullable();
            
            // ID Customer yang melakukan pesanan ini (tidak boleh kosong/wajib)
            $table->unsignedInteger('idUser');
            // 'onDelete(cascade)' berarti jika akun customer dihapus, seluruh riwayat pesanannya ikut terhapus dari DB
            $table->foreign('idUser')->references('idUser')->on('user')->onDelete('cascade');
            
            // ID Promo yang mungkin digunakan oleh customer. Boleh null jika tidak pakai promo.
            $table->unsignedInteger('idPromo')->nullable();
            $table->foreign('idPromo')->references('idPromo')->on('promo')->onDelete('set null');
            
            // Membuat kolom otomatis created_at dan updated_at
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('penjualan');
    }
};