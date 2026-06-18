<?php

namespace App\Exports;

use App\Models\Reservasi;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Carbon\Carbon;

class ReservasiExport implements FromArray, WithHeadings, ShouldAutoSize, WithStyles
{
    protected $filters;
    protected $totalRowCounter = 0;

    public function __construct($filters)
    {
        $this->filters = $filters;
    }

    public function array(): array
    {
        $query = Reservasi::with(['user', 'dokter', 'jadwal']);

        if (!empty($this->filters['jenisTreatment']) && !in_array(strtolower($this->filters['jenisTreatment']), ['semua', 'all', '0', 'semua treatment'])) {
            $query->where('jenisTreatment', $this->filters['jenisTreatment']);
        }

        if (!empty($this->filters['status']) && !in_array(strtolower($this->filters['status']), ['semua', 'all', '0', 'semua status'])) {
            $query->where('status', $this->filters['status']);
        }

        if (!empty($this->filters['tanggalMulai']) && !empty($this->filters['tanggalSelesai'])) {
            $query->whereBetween('tanggalReservasi', [
                $this->filters['tanggalMulai'],
                $this->filters['tanggalSelesai']
            ]);
        }

        // Urutkan dari yang terbaru (berdasarkan tanggal treatment)
        $reservasis = $query->orderBy('tanggalReservasi', 'desc')->get();

        $rows = [];
        $totalReservasi = 0;
        $totalSelesai = 0;
        $totalDibatalkan = 0;
        $totalReschedule = 0;

        foreach ($reservasis as $reservasi) {
            $totalReservasi++;

            // Agregasi Status
            $statusLower = strtolower($reservasi->status);
            if (in_array($statusLower, ['selesai', 'disetujui'])) {
                $totalSelesai++;
            } elseif (in_array($statusLower, ['ditolak', 'dibatalkan'])) {
                $totalDibatalkan++;
            }

            if ($reservasi->is_rescheduled) {
                $totalReschedule++;
            }

            // Waktu & Jadwal
            $waktuJadwal = '-';
            if ($reservasi->jadwal) {
                $waktuJadwal = $reservasi->jadwal->jamMulai . ' - ' . $reservasi->jadwal->jamSelesai;
            }

            $rows[] = [
                $reservasi->idReservasi,
                Carbon::parse($reservasi->created_at)->format('Y-m-d H:i:s'),
                $reservasi->tanggalReservasi,
                $waktuJadwal,
                $reservasi->namaCustomer ?? ($reservasi->user->nama ?? '-'),
                $reservasi->nomorWa ?? '-',
                $reservasi->jenisTreatment ?? '-',
                $reservasi->dokter->nama ?? '-',
                $reservasi->is_rescheduled ? 'Ya' : 'Tidak',
                $reservasi->status ?? '-'
            ];
        }

        $this->totalRowCounter = count($rows) + 1; // +1 untuk baris Header utama

        // Tambahkan spasi
        $rows[] = ['', '', '', '', '', '', '', '', '', ''];
        $rows[] = ['', '', '', '', '', '', '', '', '', ''];

        // Tambahkan Baris Kesimpulan
        $rows[] = ['KESIMPULAN LAPORAN', '', '', '', '', '', '', '', '', ''];
        $rows[] = ['Total Seluruh Reservasi', $totalReservasi . ' Reservasi', '', '', '', '', '', '', '', ''];
        $rows[] = ['Total Reservasi Sukses (Selesai/Disetujui)', $totalSelesai . ' Reservasi', '', '', '', '', '', '', '', ''];
        $rows[] = ['Total Reservasi Dibatalkan/Ditolak', $totalDibatalkan . ' Reservasi', '', '', '', '', '', '', '', ''];
        $rows[] = ['Total Pasien Reschedule', $totalReschedule . ' Pasien', '', '', '', '', '', '', '', ''];

        return $rows;
    }

    public function headings(): array
    {
        return [
            'ID Reservasi',
            'Tanggal Pendaftaran',
            'Tanggal Treatment',
            'Jadwal / Waktu',
            'Nama Customer',
            'Nomor WA',
            'Jenis Treatment',
            'Nama Dokter',
            'Status Reschedule',
            'Status Reservasi'
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $styles = [
            // Styling Header
            1 => [
                'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF']],
                'fill' => ['fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF4F81BD']]
            ]
        ];

        // Baris mulai kesimpulan
        $summaryStartRow = $this->totalRowCounter + 3;

        // Styling Header Kesimpulan
        $styles[$summaryStartRow] = [
            'font' => ['bold' => true, 'size' => 12],
            'fill' => ['fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID, 'startColor' => ['argb' => 'FFF2F2F2']]
        ];

        // Styling Value Kesimpulan
        $styles[$summaryStartRow + 1] = ['font' => ['bold' => true]];
        $styles[$summaryStartRow + 2] = ['font' => ['bold' => true, 'color' => ['argb' => 'FF00B050']]]; // Hijau untuk Sukses
        $styles[$summaryStartRow + 3] = ['font' => ['bold' => true, 'color' => ['argb' => 'FFFF0000']]]; // Merah untuk Batal
        $styles[$summaryStartRow + 4] = ['font' => ['bold' => true, 'color' => ['argb' => 'FFFFC000']]]; // Orange untuk Reschedule

        return $styles;
    }
}
