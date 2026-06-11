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
     * Menampilkan daftar event (Admin)
     */
    public function getAllEvents()
    {
        try {
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
     * Menampilkan data event pada halaman customer
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
     * Menampilkan detail event
     */
    public function getEventById($idEvent)
    {
        try {
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
     * Menambahkan data event (Admin)
     */
    public function createEvent(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nama' => 'required|string|max:60',
                'deskripsi' => 'required|string',
                'foto' => 'required|image|mimes:jpeg,png,jpg|max:4000',
                'tanggalMulai' => 'required|date',
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
            if ($request->hasFile('foto')) {
                $file = $request->file('foto');
                $filename = time() . '_' . uniqid() . '.webp';
                
                $manager = new ImageManager(new Driver());
                $image = $manager->read($file->getPathname());
                $webpData = $image->toWebp(80)->toString();
                
                Storage::disk('public')->put('event/' . $filename, $webpData);
                $dataToInsert['foto'] = 'event/' . $filename;
            }

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
     * Memperbarui data event (Admin)
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
                'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:4000',
                'tanggalMulai' => 'required|date',
                'tanggalSelesai' => 'required|date|after_or_equal:tanggalMulai',
                'lokasi' => 'required|string|max:100'
            ], [
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
            if ($request->hasFile('foto')) {
                if ($event->foto) {
                    Storage::disk('public')->delete($event->foto);
                }
                $file = $request->file('foto');
                $filename = time() . '_' . uniqid() . '.webp';
                
                $manager = new ImageManager(new Driver());
                $image = $manager->read($file->getPathname());
                $webpData = $image->toWebp(80)->toString();
                
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
     * Menghapus data event (Admin)
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
