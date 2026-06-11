<?php

namespace App\Exports;

use App\Models\Reservasi;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ReservasiExport implements FromCollection, WithHeadings, WithMapping
{
    protected $filters;

    public function __construct($filters)
    {
        $this->filters = $filters;
    }

    public function collection()
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

        return $query->get();
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
}
