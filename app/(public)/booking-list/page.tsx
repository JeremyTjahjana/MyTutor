"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import BookingListCard from "@/features/booking/components/BookingListCard";
import type { Booking } from "@/types/user";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const ITEMS_PER_PAGE = 9;

async function fetchStudentBookings(studentId: string): Promise<Booking[]> {
  // Import here to avoid bundling server code in client
  const res = await fetch(`/api/bookings?studentId=${studentId}`);
  if (!res.ok) return [];
  return res.json();
}

const BookingListPage = () => {
  const { user, isLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [fetching, setFetching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = bookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    if (!user) return;
    setFetching(true);
    fetchStudentBookings(user.id)
      .then(setBookings)
      .finally(() => setFetching(false));
  }, [user]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  if (isLoading || fetching) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-(--biru)" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-(--gelap)/60">
            Kamu harus masuk untuk melihat booking.
          </p>
          <Link href="/login" className="btn-primary px-6">
            Masuk
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:px-10">
      <h1 className="text-center text-3xl font-semibold text-(--biru) sm:text-4xl">
        Status Booking
      </h1>

      {bookings.length === 0 ? (
        <div className="mt-16 text-center text-(--gelap)/60">
          <p className="text-lg">Belum ada booking.</p>
          <Link href="/tutors" className="btn-primary mt-6 inline-block px-6">
            Cari Tutor
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 grid w-full grid-cols-1 justify-items-center gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {paginatedBookings.map((booking) => (
              <BookingListCard
                key={booking.id}
                booking={booking}
                onBookingUpdated={() => {
                  if (user) {
                    fetchStudentBookings(user.id).then(setBookings);
                  }
                }}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg font-semibold text-[var(--gelap)] shadow-sm transition hover:border-[var(--biru)] hover:text-[var(--biru)] disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
                disabled={currentPage === 1}
                aria-label="Halaman sebelumnya"
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold shadow-sm transition ${
                      currentPage === page
                        ? "bg-[var(--biru)] text-white"
                        : "border border-slate-200 bg-white text-[var(--gelap)] hover:border-[var(--biru)] hover:text-[var(--biru)]"
                    }`}
                    onClick={() => setCurrentPage(page)}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg font-semibold text-[var(--gelap)] shadow-sm transition hover:border-[var(--biru)] hover:text-[var(--biru)] disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={currentPage === totalPages}
                aria-label="Halaman berikutnya"
              >
                ›
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default BookingListPage;
