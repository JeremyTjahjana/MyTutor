import React from 'react';
import { Check } from 'lucide-react';

export default function Done() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-6">
      <div className="flex w-full max-w-[350px] flex-col items-center text-center">
        
        <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-full border-[1.5px] border-slate-300">
          {/* Kalau belum install lucide, ganti baris ini dengan Icon SVG */}
          <Check size={48} className="text-slate-400" strokeWidth={1.5} />
        </div>

        <h1 className="mb-2 text-xl font-bold text-[#008db1]">
          Pesanan Selesai
        </h1>

        <p className="mb-16 text-sm text-gray-500">
          Jangan lupa untuk hubungi tutor
        </p>

        <button 
          className="w-full rounded-full bg-[#008db1] py-3.5 text-base font-semibold text-white active:scale-95 transition-all"
          onClick={() => alert('Selesai!')}
        >
          Selesai
        </button>
        
      </div>
    </main>
  );
}