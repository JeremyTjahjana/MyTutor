"use client";

import { useState, useEffect, useRef } from "react";
import { FormData } from "../types";
import { supabase } from "@/lib/supabase/client";

interface Step3Props {
  formData: FormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onAddSubject: (name: string) => void;
  onRemoveMatkul: (index: number) => void;
}

type SubjectOption = { id: string; name: string };

export default function Step3({
  formData,
  onChange,
  onAddSubject,
  onRemoveMatkul,
}: Step3Props) {
  const [allSubjects, setAllSubjects] = useState<SubjectOption[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch subjects from database
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("subjects")
        .select("id, name")
        .order("name");
      setAllSubjects(data ?? []);
    })();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSubjects = allSubjects.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !formData.matkuls.includes(s.name),
  );

  const addSubject = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && !formData.matkuls.includes(trimmed)) {
      onAddSubject(trimmed);
    }
    setSearchQuery("");
    setShowDropdown(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-[var(--biru)]">
        Subject & Pengalaman
      </h2>

      {/* Subject Combo-box */}
      <div>
        <label className="block text-sm font-medium text-[var(--gelap)] mb-2">
          Mata Kuliah / Subject yang Diajarkan
        </label>

        <div ref={dropdownRef} className="relative">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSubject(searchQuery);
                }
              }}
              placeholder="Cari atau ketik subject baru..."
              className="flex-1 px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30 text-sm"
            />
            <button
              type="button"
              onClick={() => addSubject(searchQuery)}
              disabled={!searchQuery.trim()}
              className={`btn-primary px-5 py-2.5 text-sm whitespace-nowrap ${
                !searchQuery.trim() ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              Tambah
            </button>
          </div>

          {/* Dropdown */}
          {showDropdown && searchQuery.trim() && (
            <div className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-[var(--gelap)]/15 bg-white shadow-lg">
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => addSubject(s.name)}
                    className="w-full text-left px-4 py-2.5 text-sm text-[var(--gelap)] hover:bg-[var(--biru)]/5 transition-colors cursor-pointer"
                  >
                    {s.name}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-[var(--gelap)]/50">
                  Tidak ditemukan — tekan &quot;Tambah&quot; untuk membuat subject baru
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected Subject Pills */}
        <div className="flex flex-wrap gap-2 mt-3">
          {formData.matkuls.map((matkul, index) => (
            <div
              key={index}
              className="bg-[var(--biru)] text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm"
            >
              {matkul}
              <button
                type="button"
                onClick={() => onRemoveMatkul(index)}
                className="ml-1 hover:opacity-80 transition-opacity cursor-pointer"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {formData.matkuls.length === 0 && (
          <p className="text-sm text-[var(--gelap)]/50 italic mt-2">
            Belum ada subject yang ditambahkan
          </p>
        )}
      </div>

      {/* Lama Pengalaman */}
      <div>
        <label className="block text-sm font-medium text-[var(--gelap)] mb-2">
          Lama Pengalaman Mengajar
        </label>
        <select
          name="lamaExperience"
          value={formData.lamaExperience}
          onChange={onChange}
          className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30"
        >
          <option value="">Pilih Lama Pengalaman</option>
          <option value="0-1 tahun">0 - 1 tahun</option>
          <option value="1-2 tahun">1 - 2 tahun</option>
          <option value="2-3 tahun">2 - 3 tahun</option>
          <option value="3+ tahun">3+ tahun</option>
        </select>
      </div>

      {/* Biaya Per Jam */}
      <div>
        <label className="block text-sm font-medium text-[var(--gelap)] mb-2">
          Biaya Per Jam
        </label>
        <div className="flex items-center gap-2">
          <span className="text-[var(--gelap)]/70 font-medium">Rp.</span>
          <input
            type="number"
            name="biayaPerJam"
            value={formData.biayaPerJam}
            onChange={onChange}
            placeholder="50000"
            className="flex-1 px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30"
          />
          <span className="text-[var(--gelap)]/70 font-medium">/orang</span>
        </div>
      </div>
    </div>
  );
}
