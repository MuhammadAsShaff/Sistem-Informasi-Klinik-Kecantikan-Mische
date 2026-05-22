import React from "react";
import { useUbahStatusReservasi } from "../hooks/useUbahStatusReservasi";

export default function ModalUbahStatus({ isOpen, onClose, selectedReservasi, hook }) {
  if (!isOpen) return null;

  const { status, setStatus, submitStatus, isSubmitting, error } = hook;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Ubah Status Reservasi</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={submitStatus} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Status Reservasi</label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-sm font-medium text-gray-700 appearance-none focus:outline-none focus:border-[#56BC36] focus:ring-1 focus:ring-[#56BC36] transition-all cursor-pointer"
              >
                <option value="Menunggu">Menunggu</option>
                <option value="Dikonfirmasi">Dikonfirmasi</option>
                <option value="Selesai">Selesai</option>
                <option value="Dibatalkan">Dibatalkan</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-4 rounded-xl text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 px-6 py-4 rounded-xl text-sm font-bold text-white shadow-lg transition-colors
                ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#56BC36] hover:bg-[#469e2c]'}`}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Status'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
