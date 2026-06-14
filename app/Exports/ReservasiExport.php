<?php

namespace App\Exports;

use App\Models\Reservasi;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ReservasiExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $filters;

    public function __construct($filters)
    {
        $this->filters = $filters;
    }

    public function query()
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

        return $query;
    }

    public function headings(): array
    {
        return [
            'ID Reservasi',
            'Tanggal Reservasi',
            'Nama Customer',
            'Nomor WA',
            'Jenis Treatment',
            'Dokter',
            'Jadwal',
            'Status Reservasi'
        ];
    }

    public function map($reservasi): array
    {
        return [
            $reservasi->idReservasi,
            $reservasi->tanggalReservasi,
            $reservasi->namaCustomer ?? ($reservasi->user->nama ?? '-'),
            $reservasi->nomorWa ?? '-',
            $reservasi->jenisTreatment ?? '-',
            $reservasi->dokter->nama ?? '-',
            $reservasi->jadwal->waktuMulai ?? '-',
            $reservasi->status ?? '-'
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1    => ['font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF']], 'fill' => ['fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF4F81BD']]],
        ];
    }
}
