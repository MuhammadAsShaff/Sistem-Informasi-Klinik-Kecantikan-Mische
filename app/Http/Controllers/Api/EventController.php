<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class EventController extends Controller
{
    /**
     * getAllEvents
     * 
     * Menampilkan daftar semua event yang ada (Biasanya digunakan oleh Admin untuk Dashboard Manajemen).
     * Menggunakan pagination agar loading tidak berat jika event sudah sangat banyak.
     */
    public function getAllEvents()
    {
        try {
            // latest() mengurutkan dari yang terbaru ditambahkan. paginate(10) membatasi 10 baris per halaman.
            $events = Event::latest()->paginate(10);
            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil daftar event.',
                'data' => $events
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data event.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * getPublicEvents
     * 
     * Menampilkan data event untuk halaman pengunjung/Customer (Publik).
     * Mengambil semua event tanpa pagination (get) untuk ditampilkan mungkin di Carousel atau Banner Web.
     */
    public function getPublicEvents()
    {
        try {
            $events = Event::latest()->get();
            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil event.',
                'data' => $events
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data event.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * getEventById
     * 
     * Menampilkan detail dari 1 event tertentu (Saat Customer / Admin klik "Baca Selengkapnya").
     */
    public function getEventById($idEvent)
    {
        try {
            // Mencari event berdasarkan Primary Key
            $event = Event::find($idEvent);
            if (!$event) {
                return response()->json([
                    'success' => false,
                    'message' => 'Event tidak ditemukan.'
                ], 404);
            }
            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil detail event.',
                'data' => $event
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil detail event.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * createEvent
     * 
     * Menambahkan data event baru (Khusus Admin). 
     * Otomatis mengkompresi gambar banner/poster event menjadi format WebP.
     */
    public function createEvent(Request $request)
    {
        try {
            // 1. Validasi Inputan Admin
            $validator = Validator::make($request->all(), [
                'nama' => 'required|string|max:60',
                'deskripsi' => 'required|string',
                'foto' => 'required|image|mimes:jpeg,png,jpg|max:4000',
                'tanggalMulai' => 'required|date',
                // Validasi Cerdas: after_or_equal memastikan Tanggal Selesai TIDAK BOLEH lebih dulu dari Tanggal Mulai
                'tanggalSelesai' => 'required|date|after_or_equal:tanggalMulai',
                'lokasi' => 'required|string|max:100'
            ], [
                'nama.required' => 'Nama event wajib diisi.',
                'deskripsi.required' => 'Deskripsi wajib diisi.',
                'foto.required' => 'Foto event wajib diunggah.',
                'foto.image' => 'File harus berupa gambar.',
                'foto.mimes' => 'Format gambar yang diperbolehkan adalah jpeg, png, atau jpg.',
                'foto.max' => 'Ukuran gambar maksimal 4MB.',
                'tanggalMulai.required' => 'Tanggal mulai wajib diisi.',
                'tanggalSelesai.required' => 'Tanggal selesai wajib diisi.',
                'tanggalSelesai.after_or_equal' => 'Tanggal selesai harus sama atau setelah tanggal mulai.',
                'lokasi.required' => 'Lokasi wajib diisi.'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Terdapat kesalahan pada inputan Anda.',
                    'errors' => $validator->errors()
                ], 400);
            }

            $dataToInsert = $request->all();
            
            // 2. Proses Kompresi Gambar Event
            if ($request->hasFile('foto')) {
                $file = $request->file('foto');
                $filename = time() . '_' . uniqid() . '.webp';
                
                // Decode gambar asli lalu Encode paksa menjadi webp (kualitas 80%)
                $manager = new ImageManager(new Driver());
                $image = $manager->decode($file->getPathname());
                $webpData = $image->encodeUsingFileExtension('webp', 80)->toString();
                
                // Simpan ke harddisk server
                Storage::disk('public')->put('event/' . $filename, $webpData);
                $dataToInsert['foto'] = 'event/' . $filename;
            }

            // 3. Simpan data lengkap ke database
            $event = Event::create($dataToInsert);

            return response()->json([
                'success' => true,
                'message' => 'Event berhasil ditambahkan.',
                'data' => $event
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan event.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * updateEvent
     * 
     * Memperbarui/Mengedit informasi event yang sudah ada.
     */
    public function updateEvent(Request $request, $idEvent)
    {
        try {
            $event = Event::find($idEvent);
            if (!$event) {
                return response()->json([
                    'success' => false,
                    'message' => 'Event tidak ditemukan.'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'nama' => 'required|string|max:60',
                'deskripsi' => 'required|string',
                // Foto jadi nullable (boleh tidak diisi) karena mungkin admin hanya ingin mengedit judul saja tanpa ganti gambar
                'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:4000',
                'tanggalMulai' => 'required|date',
                'tanggalSelesai' => 'required|date|after_or_equal:tanggalMulai',
                'lokasi' => 'required|string|max:100'
            ], [
                // Pesan sama dengan fungsi Create
                'nama.required' => 'Nama event wajib diisi.',
                'deskripsi.required' => 'Deskripsi wajib diisi.',
                'foto.image' => 'File harus berupa gambar.',
                'foto.mimes' => 'Format gambar yang diperbolehkan adalah jpeg, png, atau jpg.',
                'foto.max' => 'Ukuran gambar maksimal 4MB.',
                'tanggalMulai.required' => 'Tanggal mulai wajib diisi.',
                'tanggalSelesai.required' => 'Tanggal selesai wajib diisi.',
                'tanggalSelesai.after_or_equal' => 'Tanggal selesai harus sama atau setelah tanggal mulai.',
                'lokasi.required' => 'Lokasi wajib diisi.'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Terdapat kesalahan pada inputan Anda.',
                    'errors' => $validator->errors()
                ], 400);
            }

            $dataToUpdate = $request->except(['foto']);
            
            // Jika ada upload gambar baru
            if ($request->hasFile('foto')) {
                // 1. Hapus gambar event yang lama terlebih dahulu
                if ($event->foto) {
                    Storage::disk('public')->delete($event->foto);
                }
                
                // 2. Upload gambar yang baru
                $file = $request->file('foto');
                $filename = time() . '_' . uniqid() . '.webp';
                
                $manager = new ImageManager(new Driver());
                $image = $manager->decode($file->getPathname());
                $webpData = $image->encodeUsingFileExtension('webp', 80)->toString();
                
                Storage::disk('public')->put('event/' . $filename, $webpData);
                $dataToUpdate['foto'] = 'event/' . $filename;
            }

            $event->update($dataToUpdate);

            return response()->json([
                'success' => true,
                'message' => 'Event berhasil diperbarui.',
                'data' => $event
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui event.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * deleteEvent
     * 
     * Menghapus data event secara permanen dari sistem.
     */
    public function deleteEvent($idEvent)
    {
        try {
            $event = Event::find($idEvent);
            if (!$event) {
                return response()->json([
                    'success' => false,
                    'message' => 'Event tidak ditemukan.'
                ], 404);
            }
            
            // Jangan lupa menghapus file gambarnya agar storage server tidak penuh dengan data sampah
            if ($event->foto) {
                Storage::disk('public')->delete($event->foto);
            }
            
            $event->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Event berhasil dihapus.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus event.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
