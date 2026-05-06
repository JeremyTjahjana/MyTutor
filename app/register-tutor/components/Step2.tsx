"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormData } from "../types";
import {
  fakultasOptions,
  alamatDomisiliOptions,
  angkatanOptions,
} from "../constants";
import { IPB_PROGRAM_STUDI } from "../../lib/data";

interface Step2Props {
  formData: FormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  programStudi: string;
  onProgramSelect: (value: string) => void;
  fakultas: string;
  onFakultasSelect: (value: string) => void;
}

export default function Step2({
  formData,
  onChange,
  programStudi,
  onProgramSelect,
  fakultas,
  onFakultasSelect,
}: Step2Props) {
  const [query, setQuery] = useState(programStudi || "");
  const [isFakultasOpen, setIsFakultasOpen] = useState(false);
  const [isProgramOpen, setIsProgramOpen] = useState(false);

  useEffect(() => {
    setQuery(programStudi || "");
  }, [programStudi]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return IPB_PROGRAM_STUDI.slice(0, 10);
    return IPB_PROGRAM_STUDI.filter((p) =>
      p.name.toLowerCase().includes(q),
    ).slice(0, 10);
  }, [query]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-[var(--biru)]">
        Data Akademik
      </h2>

      {/* NIM */}
      <div>
        <label className="block text-sm font-medium text-[var(--gelap)] mb-2">
          NIM
        </label>
        <input
          type="text"
          name="nim"
          value={formData.nim}
          onChange={onChange}
          placeholder="Masukkan NIM Anda"
          className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30"
        />
      </div>

      {/* Fakultas (Combobox) */}
      <div className="relative">
        <label className="block text-sm font-medium text-[var(--gelap)] mb-2">
          Fakultas
        </label>
        <input
          type="text"
          name="fakultas"
          value={fakultas || formData.fakultas}
          onFocus={() => setIsFakultasOpen(true)}
          onBlur={() => setTimeout(() => setIsFakultasOpen(false), 120)}
          onChange={(e) => {
            setIsFakultasOpen(true);
            onFakultasSelect(e.target.value);
          }}
          placeholder="Ketik atau pilih fakultas"
          className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30"
        />

        {isFakultasOpen && (
          <ul className="absolute z-50 mt-1 w-full max-h-48 overflow-auto rounded-lg bg-white border border-[var(--gelap)]/10 shadow-sm">
            {fakultasOptions
              .filter((f) =>
                fakultas || formData.fakultas
                  ? f
                      .toLowerCase()
                      .includes((fakultas || formData.fakultas).toLowerCase())
                  : true,
              )
              .slice(0, 10)
              .map((f) => (
                <li
                  key={f}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onFakultasSelect(f);
                    setIsFakultasOpen(false);
                  }}
                  className="cursor-pointer px-4 py-2 hover:bg-[var(--biru)]/10"
                >
                  {f}
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Program Studi (Combobox) */}
      <div className="relative">
        <label className="block text-sm font-medium text-[var(--gelap)] mb-2">
          Program Studi
        </label>
        <input
          type="text"
          name="programStudi"
          value={query}
          onFocus={() => setIsProgramOpen(true)}
          onBlur={() => setTimeout(() => setIsProgramOpen(false), 120)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsProgramOpen(true);
            onProgramSelect(e.target.value);
          }}
          placeholder="Ketik atau pilih program studi"
          className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30"
        />

        {isProgramOpen && suggestions.length > 0 && (
          <ul className="absolute z-50 mt-1 w-full max-h-48 overflow-auto rounded-lg bg-white border border-[var(--gelap)]/10 shadow-sm">
            {suggestions.map((s) => (
              <li
                key={s.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setQuery(s.name);
                  setIsProgramOpen(false);
                  onProgramSelect(s.name);
                }}
                className="cursor-pointer px-4 py-2 hover:bg-[var(--biru)]/10"
              >
                {s.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Alamat Domisili */}
      <div>
        <label className="block text-sm font-medium text-[var(--gelap)] mb-2">
          Alamat Domisili
        </label>
        <select
          name="alamatDomisili"
          value={formData.alamatDomisili}
          onChange={onChange}
          className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30"
        >
          <option value="">Pilih Alamat Domisili</option>
          {alamatDomisiliOptions.map((alamat) => (
            <option key={alamat} value={alamat}>
              {alamat}
            </option>
          ))}
        </select>
      </div>

      {/* Angkatan */}
      <div>
        <label className="block text-sm font-medium text-[var(--gelap)] mb-2">
          Angkatan
        </label>
        <select
          name="angkatan"
          value={formData.angkatan}
          onChange={onChange}
          className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30"
        >
          <option value="">Pilih Angkatan</option>
          {angkatanOptions.map((ang) => (
            <option key={ang} value={ang}>
              {ang}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
