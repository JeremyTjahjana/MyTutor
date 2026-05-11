"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import BookingListCard from "@/features/booking/components/BookingListCard";
import type { Booking } from "@/types/user";
import { Loader2 } from "lucide-react";
import Link from "next/link";

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

  useEffect(() => {
    if (!user) return;
    setFetching(true);
    fetchStudentBookings(user.id)
      .then(setBookings)
      .finally(() => setFetching(false));
  }, [user]);

  if (isLoading || fetching) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--biru)]" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--gelap)]/60 mb-4">
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
    <main className="mx-auto flex w-full max-w-[1280px] min-h-screen flex-col items-center px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:px-10">
      <h1 className="text-center text-3xl font-semibold text-[var(--biru)] sm:text-4xl">
        Status Booking
      </h1>

      {bookings.length === 0 ? (
        <div className="mt-16 text-center text-[var(--gelap)]/60">
          <p className="text-lg">Belum ada booking.</p>
          <Link href="/tutors" className="btn-primary mt-6 inline-block px-6">
            Cari Tutor
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid w-full grid-cols-1 justify-items-center gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <BookingListCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </main>
  );
};

export default BookingListPage;
