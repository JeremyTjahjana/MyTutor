"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Search, Trash2, Sparkles } from "lucide-react";
import type { Subject } from "@/types/tutor";
import {
  addTutorSubjectBySubjectIdAction,
  addTutorSubjectByCustomNameAction,
  removeTutorSubjectAction,
} from "@/features/tutor/services/tutor.action";
import { subjectNameCategoryMatch } from "@/lib/subject-utils";

type SubjectPreset = { name: string; category: string | null };

async function fetchJson<T>(url: string): Promise<T> {
  const sep = url.includes("?") ? "&" : "?";
  const finalUrl = `${url}${sep}_t=${Date.now()}`;
  const res = await fetch(finalUrl, {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export default function TutorSubjectsPage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [search, setSearch] = useState("");
  const [catalog, setCatalog] = useState<Subject[]>([]);
  const [presets, setPresets] = useState<SubjectPreset[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  const loadMine = useCallback(async () => {
    if (!user?.id) return;
    setLoadingList(true);
    try {
      const data = await fetchJson<{ subjects: Subject[] }>(
        `/api/tutor-subjects?tutorUserId=${encodeURIComponent(user.id)}`,
      );
      setSubjects(data.subjects);
    } catch {
      setSubjects([]);
    } finally {
      setLoadingList(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void loadMine();
  }, [loadMine]);

  useEffect(() => {
    const q = search.trim();
    const t = setTimeout(async () => {
      setLoadingCatalog(true);
      try {
        const url = q
          ? `/api/subjects?search=${encodeURIComponent(q)}`
          : "/api/subjects";
        const data = await fetchJson<{
          subjects: Subject[];
          presets?: SubjectPreset[];
        }>(url);
        setCatalog(data.subjects);
        setPresets(data.presets ?? []);
      } catch {
        setCatalog([]);
        setPresets([]);
      } finally {
        setLoadingCatalog(false);
      }
    }, 320);
    return () => clearTimeout(t);
  }, [search]);

  const linkedIds = useMemo(
    () => new Set(subjects.map((s) => s.id)),
    [subjects],
  );

  const presetsFiltered = useMemo(
    () =>
      presets.filter(
        (p) =>
          !subjects.some((s) =>
            subjectNameCategoryMatch(p.name, p.category, s.name, s.category),
          ),
      ),
    [presets, subjects],
  );

  const catalogFiltered = useMemo(
    () => catalog.filter((c) => !linkedIds.has(c.id)),
    [catalog, linkedIds],
  );

  const hasCatalogResults =
    presetsFiltered.length > 0 || catalogFiltered.length > 0;

  const showFlash = (type: "ok" | "err", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const onAddPreset = async (preset: SubjectPreset) => {
    if (!user?.id) return;
    const key = `preset:${preset.name}`;
    setBusyId(key);
    const res = await addTutorSubjectByCustomNameAction(
      user.id,
      preset.name,
      preset.category,
    );
    setBusyId(null);
    if (!res.success) {
      showFlash("err", res.error ?? "Gagal menambahkan.");
      return;
    }
    showFlash("ok", "Mata kuliah ditambahkan.");
    void loadMine();
  };

  const onAddById = async (subjectId: string) => {
    if (!user?.id) return;
    setBusyId(subjectId);
    const res = await addTutorSubjectBySubjectIdAction(user.id, subjectId);
    setBusyId(null);
    if (!res.success) {
      showFlash("err", res.error ?? "Gagal menambahkan.");
      return;
    }
    showFlash("ok", "Mata kuliah ditambahkan.");
    void loadMine();
  };

  const onAddCustom = async () => {
    if (!user?.id) return;
    const name = customName.trim();
    if (!name) {
      showFlash("err", "Isi nama mata kuliah atau skill terlebih dahulu.");
      return;
    }
    setBusyId("__custom__");
    const res = await addTutorSubjectByCustomNameAction(
      user.id,
      name,
      customCategory.trim() ? customCategory.trim() : null,
    );
    setBusyId(null);
    if (!res.success) {
      showFlash("err", res.error ?? "Gagal menambahkan.");
      return;
    }
    setCustomName("");
    setCustomCategory("");
    showFlash("ok", "Mata kuliah / skill baru ditambahkan.");
    void loadMine();
  };

  const onRemove = async (subjectId: string) => {
    if (!user?.id) return;
    setBusyId(subjectId);
    const res = await removeTutorSubjectAction(user.id, subjectId);
    setBusyId(null);
    if (!res.success) {
      showFlash("err", res.error ?? "Gagal menghapus.");
      return;
    }
    showFlash("ok", "Dihapus dari daftar Anda.");
    void loadMine();
  };

  if (!user) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--biru)]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-[var(--biru)] sm:text-3xl">
          Mata kuliah & skill
        </h1>
      </header>

      {message ? (
        <p
          className={`rounded-xl border px-4 py-3 text-sm ${
            message.type === "ok"
              ? "border-green-100 bg-green-50 text-green-800"
              : "border-red-100 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </p>
      ) : null}

      {/* Daftar saat ini */}
      <section className="rounded-2xl border border-[var(--gelap)]/10 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold text-[var(--gelap)]">
          Yang Anda ajarkan sekarang
        </h2>
        <p className="mt-1 text-sm text-[var(--gelap)]/55">
          Hapus jika Anda tidak lagi menawarkan materi tersebut.
        </p>

        {loadingList ? (
          <div className="mt-6 flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--biru)]" />
          </div>
        ) : subjects.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-[var(--gelap)]/15 bg-[var(--putih)] px-4 py-6 text-center text-sm text-[var(--gelap)]/55">
            Belum ada mata kuliah. Tambahkan dari katalog di bawah atau buat
            nama baru.
          </p>
        ) : (
          <ul className="mt-6 space-y-2">
            {subjects.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--gelap)]/10 bg-[var(--putih)] px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="font-medium text-[var(--gelap)]">{s.name}</p>
                  {s.category ? (
                    <p className="text-xs text-[var(--gelap)]/50">
                      {s.category}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => void onRemove(s.id)}
                  disabled={busyId === s.id}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg border border-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                >
                  {busyId === s.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Hapus
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Katalog */}
      <section className="rounded-2xl border border-[var(--gelap)]/10 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold text-[var(--gelap)]">
          Tambah dari katalog
        </h2>
        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--gelap)]/40" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Contoh: Kalkulus, Bahasa Inggris…"
            className="w-full rounded-xl border border-[var(--gelap)]/15 py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/25"
          />
        </div>

        <div className="mt-4 max-h-72 overflow-y-auto rounded-xl border border-[var(--gelap)]/10">
          {loadingCatalog ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-[var(--biru)]" />
            </div>
          ) : !hasCatalogResults ? (
            <p className="px-4 py-8 text-center text-sm text-[var(--gelap)]/50">
              {search.trim()
                ? "Tidak ada hasil yang belum ada di daftar Anda."
                : "Ketik untuk mencari atau gunakan tambah baru di bawah."}
            </p>
          ) : (
            <ul className="divide-y divide-[var(--gelap)]/8">
              {presetsFiltered.map((p) => (
                <li
                  key={`preset-${p.name}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-[var(--gelap)]/[0.03]"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-[var(--gelap)]">
                        {p.name}
                      </p>
                      <span className="rounded-full bg-[var(--biru)]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--biru)]">
                        Bawaan
                      </span>
                    </div>
                    {p.category ? (
                      <p className="text-xs text-[var(--gelap)]/50">
                        {p.category}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => void onAddPreset(p)}
                    disabled={busyId === `preset:${p.name}`}
                    className="btn-primary inline-flex shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-sm disabled:opacity-50"
                  >
                    {busyId === `preset:${p.name}` ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    Tambah
                  </button>
                </li>
              ))}
              {catalogFiltered.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-[var(--gelap)]/[0.03]"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--gelap)]">{s.name}</p>
                    {s.category ? (
                      <p className="text-xs text-[var(--gelap)]/50">
                        {s.category}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => void onAddById(s.id)}
                    disabled={busyId === s.id}
                    className="btn-primary inline-flex shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-sm disabled:opacity-50"
                  >
                    {busyId === s.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    Tambah
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Custom */}
      <section className="rounded-2xl border border-[var(--gelap)]/10 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--gelap)]">
          <Sparkles className="h-5 w-5 text-[var(--biru)]" />
          Tambah mata kuliah / skill baru
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <div className="min-w-0 sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-[var(--gelap)]/70">
              Nama mata kuliah atau skill
            </label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Contoh: Blender"
              className="w-full rounded-xl border border-[var(--gelap)]/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/25"
            />
          </div>
          <div className="min-w-0">
            <label className="mb-1.5 block text-xs font-medium text-[var(--gelap)]/70">
              Kategori (opsional)
            </label>
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Contoh: 3D & desain, Software…"
              className="w-full rounded-xl border border-[var(--gelap)]/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/25"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => void onAddCustom()}
            disabled={busyId === "__custom__"}
            className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold disabled:opacity-50 sm:shrink-0"
          >
            {busyId === "__custom__" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Simpan ke daftar
          </button>
        </div>
      </section>
    </div>
  );
}
