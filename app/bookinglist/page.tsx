import React from "react";
import BookingListCard from "../components/BookingList/BookingListCard";
import { bookingDummy } from "../lib/data";

const BookingListPage = () => {
  return (
    <main className="mx-auto flex w-full max-w-[1280px] min-h-screen flex-col items-center px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:px-10">
      <h1 className="text-center text-3xl font-semibold text-[var(--biru)] sm:text-4xl">
        Status Booking
      </h1>

      <div className="mt-6 grid w-full grid-cols-1 justify-items-center gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
        {bookingDummy.map((booking) => (
          <BookingListCard
            key={booking.id}
            matkul={booking.matkul}
            namatutor={booking.namatutor}
            jam={booking.jam}
            tanggal={booking.tanggal}
            status={booking.status}
          />
        ))}
      </div>
    </main>
  );
};

export default BookingListPage;
