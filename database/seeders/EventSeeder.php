<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use Carbon\Carbon;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $events = [
            [
                'nama' => 'Grand Opening Cabang Baru',
                'deskripsi' => 'Peresmian cabang Mische baru dengan berbagai penawaran menarik dan konsultasi gratis.',
                'foto' => 'event_grand_opening.jpg',
                'tanggalMulai' => Carbon::now()->addDays(5)->format('Y-m-d'),
                'tanggalSelesai' => Carbon::now()->addDays(7)->format('Y-m-d'),
                'lokasi' => 'Mische Clinic - Cabang Selatan'
            ],
            [
                'nama' => 'Beauty Class: Skincare 101',
                'deskripsi' => 'Kelas gratis tentang bagaimana merawat kulit wajah dengan benar oleh Dr. Jane Smith.',
                'foto' => 'event_beauty_class.jpg',
                'tanggalMulai' => Carbon::now()->addDays(10)->format('Y-m-d'),
                'tanggalSelesai' => Carbon::now()->addDays(10)->format('Y-m-d'),
                'lokasi' => 'Online (Zoom)'
            ]
        ];

        foreach ($events as $event) {
            Event::firstOrCreate(
                ['nama' => $event['nama']],
                $event
            );
        }
    }
}
