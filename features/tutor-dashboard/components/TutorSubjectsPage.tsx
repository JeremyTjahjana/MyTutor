"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Search, Trash2 } from "lucide-react";
import type { Subject } from "@/types/tutor";
import {
  addTutorSubjectByCustomNameAction,
  addTutorSubjectBySubjectIdAction,
  removeTutorSubjectAction,
} from "@/features/tutor/services/tutor.action";

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
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [customName, setCustomName] = useState("");
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
        const data = await fetchJson<{ subjects: Subject[] }>(url);
        setCatalog(data.subjects);
      } catch {
        setCatalog([]);
      } finally {
        setLoadingCatalog(false);
      }
    }, 320);
    return () => clearTimeout(t);
  }, [search]);

  const linkedIds = useMemo(
    () => new Set(subjects.map((subject) => subject.id)),
    [subjects],
  );

  const catalogFiltered = useMemo(
    () =>
      catalog.filter(
        (catalogSubject) =>
          !linkedIds.has(catalogSubject.id) &&
          !subjects.some(
            (subject) =>
              subject.name.trim().toLowerCase() ===
              catalogSubject.name.trim().toLowerCase(),
          ),
      ),
    [catalog, linkedIds, subjects],
  );

  const hasCatalogResults = catalogFiltered.length > 0;

  const showFlash = (type: "ok" | "err", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const onAddCatalogSubject = async (subject: Subject) => {
    if (!user?.id) return;
    setBusyId(subject.id);
    const res = subject.id.startsWith("preset:")
      ? await addTutorSubjectByCustomNameAction(
          user.id,
          subject.name,
          subject.category,
        )
      : await addTutorSubjectBySubjectIdAction(user.id, subject.id);
    setBusyId(null);

    if (!res.success) {
      showFlash("err", res.error ?? "Gagal menambahkan.");
      return;
    }

    showFlash("ok", "Materi ditambahkan.");
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
    const res = await addTutorSubjectByCustomNameAction(user.id, name, null);
    setBusyId(null);

    if (!res.success) {
      showFlash("err", res.error ?? "Gagal menambahkan.");
      return;
    }

    setCustomName("");
    showFlash("ok", "Materi baru ditambahkan.");
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
    <div className="mx-auto max-w-6xl space-y-5">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-2xl font-bold text-[var(--biru)] sm:text-3xl">
          Mata kuliah & skill
        </h1>
        <p className="max-w-xl text-sm text-[var(--gelap)]/55">
          Kelola daftar materi yang tampil di profil tutor Anda.
        </p>
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

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <section className="rounded-2xl border border-[var(--gelap)]/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[var(--gelap)]">
                Yang diajarkan
              </h2>
              <p className="text-sm text-[var(--gelap)]/55">
                {subjects.length} materi aktif
              </p>
            </div>
          </div>

          {loadingList ? (
            <div className="mt-4 flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--biru)]" />
            </div>
          ) : subjects.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-[var(--gelap)]/15 bg-[var(--putih)] px-4 py-6 text-center text-sm text-[var(--gelap)]/55">
              Belum ada materi. Tambahkan dari katalog atau buat nama baru.
            </p>
          ) : (
            <ul className="mt-4 max-h-[58vh] space-y-2 overflow-y-auto pr-1">
              {subjects.map((subject) => (
                <li
                  key={subject.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[var(--gelap)]/10 bg-[var(--putih)] px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[var(--gelap)]">
                      {subject.name}
                    </p>
                    {subject.category ? (
                      <p className="truncate text-xs text-[var(--gelap)]/50">
                        {subject.category}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => void onRemove(subject.id)}
                    disabled={busyId === subject.id}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-100 text-red-700 hover:bg-red-50 disabled:opacity-50"
                    aria-label={`Hapus ${subject.name}`}
                    title="Hapus"
                  >
                    {busyId === subject.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-[var(--gelap)]/10 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--gelap)]">
            Tambah materi
          </h2>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--gelap)]/40" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari: Struktur Data, Kalkulus..."
                className="w-full rounded-xl border border-[var(--gelap)]/15 py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/25"
              />
            </div>
            <div className="flex min-w-0 flex-1 gap-2">
              <input
                type="text"
                value={customName}
                onChange={(event) => setCustomName(event.target.value)}
                placeholder="Atau tulis materi baru"
                className="min-w-0 flex-1 rounded-xl border border-[var(--gelap)]/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/25"
              />
              <button
                type="button"
                onClick={() => void onAddCustom()}
                disabled={busyId === "__custom__"}
                className="btn-primary inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl px-4 text-sm font-semibold disabled:opacity-50"
                aria-label="Tambah materi baru"
                title="Tambah"
              >
                {busyId === "__custom__" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Tambah
              </button>
            </div>
          </div>

          <div className="mt-4 max-h-[58vh] overflow-y-auto rounded-xl border border-[var(--gelap)]/10">
            {loadingCatalog ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-[var(--biru)]" />
              </div>
            ) : !hasCatalogResults ? (
              <p className="px-4 py-8 text-center text-sm text-[var(--gelap)]/50">
                {search.trim()
                  ? "Tidak ada hasil yang belum ada di daftar Anda."
                  : "Semua materi katalog sudah ada di daftar Anda."}
              </p>
            ) : (
              <ul className="divide-y divide-[var(--gelap)]/8">
                {catalogFiltered.map((subject) => (
                  <li
                    key={subject.id}
                    className="flex items-center justify-between gap-3 px-3 py-2.5 hover:bg-[var(--gelap)]/[0.03]"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-[var(--gelap)]">
                        {subject.name}
                      </p>
                      {subject.category ? (
                        <p className="truncate text-xs text-[var(--gelap)]/50">
                          {subject.category}
                        </p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => void onAddCatalogSubject(subject)}
                      disabled={busyId === subject.id}
                      className="btn-primary inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-semibold disabled:opacity-50"
                      aria-label={`Tambah ${subject.name}`}
                      title="Tambah"
                    >
                      {busyId === subject.id ? (
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
      </div>
    </div>
  );
}
