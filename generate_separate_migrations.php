<?php

function create_migration($filename, $content) {
    file_put_contents('d:/ProgramLaptop/laragon/www/backend-mische/database/migrations/' . $filename, $content);
}

create_migration('2025_01_01_000001_create_user_table.php', <<<'EOT'
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('user', function (Blueprint $table) {
            $table->increments('idUser');
            $table->string('nama', 60);
            $table->string('jenisKelamin', 12);
            $table->date('tanggalLahir');
            $table->string('role', 12);
            $table->string('email', 255);
            $table->string('nomorWa');
            $table->string('password');
            $table->unsignedBigInteger('idAlamatUtama')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('user');
    }
};
EOT
);

create_migration('2025_01_01_000002_create_alamat_customer_table.php', <<<'EOT'
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
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

        Schema::table('user', function (Blueprint $table) {
            $table->foreign('idAlamatUtama')->references('id')->on('alamat_customer')->onDelete('set null');
        });
    }
    public function down(): void {
        Schema::table('user', function (Blueprint $table) {
            $table->dropForeign(['idAlamatUtama']);
        });
        Schema::dropIfExists('alamat_customer');
    }
};
EOT
);

create_migration('2025_01_01_000003_create_kategori_produk_table.php', <<<'EOT'
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('kategoriProduk', function (Blueprint $table) {
            $table->increments('idKategori');
            $table->string('nama', 60);
            $table->text('deskripsi'); 
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('kategoriProduk');
    }
};
EOT
);

create_migration('2025_01_01_000004_create_produk_klinik_table.php', <<<'EOT'
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('produkKlinik', function (Blueprint $table) {
            $table->increments('idProduk');
            $table->string('gambar');
            $table->string('nama', 60);
            $table->text('deskripsi');
            $table->unsignedInteger('harga');
            $table->unsignedInteger('stock');
            $table->integer('berat')->default(500)->comment('Berat produk dalam gram');
            $table->unsignedInteger('idKategori');
            $table->foreign('idKategori')->references('idKategori')->on('kategoriProduk')->onDelete('cascade');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('produkKlinik');
    }
};
EOT
);

create_migration('2025_01_01_000005_create_promo_table.php', <<<'EOT'
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('promo', function (Blueprint $table) {
            $table->increments('idPromo');
            $table->string('gambar');
            $table->string('namaPromo', 60);
            $table->string('jenisPromo', 60);
            $table->string('kode', 12);
            $table->unsignedInteger('diskon');
            $table->text('deskripsi');
            $table->date('tanggalMulai');
            $table->date('tanggalSelesai');
            $table->unsignedInteger('minimalTransaksi');
            $table->boolean('status');
            $table->unsignedInteger('idKategori')->nullable();
            $table->foreign('idKategori')->references('idKategori')->on('kategoriProduk')->onDelete('cascade');
            $table->unsignedInteger('idProduk')->nullable();
            $table->foreign('idProduk')->references('idProduk')->on('produkKlinik')->onDelete('cascade');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('promo');
    }
};
EOT
);

create_migration('2025_01_01_000006_create_penjualan_table.php', <<<'EOT'
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
EOT
);

create_migration('2025_01_01_000007_create_detail_penjualan_table.php', <<<'EOT'
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('detailPenjualan', function (Blueprint $table) {
            $table->increments('idDetailPenjualan');
            $table->unsignedInteger('jumlahProduk');
            $table->unsignedInteger('idPenjualan');
            $table->foreign('idPenjualan')->references('idPenjualan')->on('penjualan')->onDelete('cascade');
            $table->unsignedInteger('idProduk');
            $table->foreign('idProduk')->references('idProduk')->on('produkKlinik')->onDelete('cascade');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('detailPenjualan');
    }
};
EOT
);

create_migration('2025_01_01_000008_create_keranjang_table.php', <<<'EOT'
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('keranjang', function (Blueprint $table) {
            $table->increments('idKeranjang');
            $table->unsignedInteger('jumlahProduk');
            $table->unsignedInteger('idProduk');
            $table->foreign('idProduk')->references('idProduk')->on('produkKlinik')->onDelete('cascade');
            $table->unsignedInteger('idUser');
            $table->foreign('idUser')->references('idUser')->on('user')->onDelete('cascade');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('keranjang');
    }
};
EOT
);

create_migration('2025_01_01_000009_create_jadwal_reservasi_table.php', <<<'EOT'
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('jadwalReservasi', function (Blueprint $table) {
            $table->increments('idJadwal');
            $table->time('jamMulai');
            $table->time('jamSelesai');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('jadwalReservasi');
    }
};
EOT
);

create_migration('2025_01_01_000010_create_profil_dokter_table.php', <<<'EOT'
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('profilDokter', function (Blueprint $table) {
            $table->increments('idDokter');
            $table->string('nama', 60);
            $table->string('foto');
            $table->string('email');
            $table->text('deskripsi');
            $table->string('status')->default('Tersedia');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('profilDokter');
    }
};
EOT
);

create_migration('2025_01_01_000011_create_reservasi_table.php', <<<'EOT'
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('reservasi', function (Blueprint $table) {
            $table->increments('idReservasi');
            $table->string('namaCustomer', 60);
            $table->string('nomorWa', 16);
            $table->string('jenisTreatment', 60);
            $table->date('tanggalReservasi');
            $table->string('status', 60);
            $table->boolean('is_rescheduled')->default(false);
            $table->unsignedInteger('idUser')->nullable();
            $table->foreign('idUser')->references('idUser')->on('user')->onDelete('cascade');
            $table->unsignedInteger('idDokter');
            $table->foreign('idDokter')->references('idDokter')->on('profilDokter')->onDelete('cascade');
            $table->unsignedInteger('idJadwal');
            $table->foreign('idJadwal')->references('idJadwal')->on('jadwalReservasi')->onDelete('cascade');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('reservasi');
    }
};
EOT
);

create_migration('2025_01_01_000012_create_testimoni_table.php', <<<'EOT'
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('testimoni', function (Blueprint $table) {
            $table->increments('idTestimoni');
            $table->string('namaTester', 20);
            $table->string('jenisTestimoni', 60);
            $table->text('deskripsi');
            $table->date('tanggalTreatment');
            $table->string('buktiFoto');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('testimoni');
    }
};
EOT
);

create_migration('2025_01_01_000013_create_profil_perusahaan_table.php', <<<'EOT'
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('profilPerusahaan', function (Blueprint $table) {
            $table->increments('idProfil');
            $table->mediumText('visi');
            $table->mediumText('misi');
            $table->string('fotoPerusahaan');
            $table->mediumText('deskripsiPerusahaan');
            $table->string('nomorCustomerService');
            $table->time('jamBuka');
            $table->time('jamTutup');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('profilPerusahaan');
    }
};
EOT
);

create_migration('2025_01_01_000014_create_event_table.php', <<<'EOT'
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('event', function (Blueprint $table) {
            $table->increments('idEvent');
            $table->string('nama', 60);
            $table->text('deskripsi');
            $table->string('foto');
            $table->date('tanggalMulai');
            $table->date('tanggalSelesai');
            $table->string('lokasi', 100);
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('event');
    }
};
EOT
);

create_migration('2025_01_01_000015_create_kegiatan_table.php', <<<'EOT'
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('kegiatan', function (Blueprint $table) {
            $table->increments('idKegiatan');
            $table->string('namaKegiatan', 60);
            $table->text('deskripsi');
            $table->string('foto');
            $table->date('tanggalKegiatan');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('kegiatan');
    }
};
EOT
);

@unlink('d:/ProgramLaptop/laragon/www/backend-mische/database/migrations/2025_01_01_000000_create_mische_schema.php');
echo "15 migration files created successfully.";
