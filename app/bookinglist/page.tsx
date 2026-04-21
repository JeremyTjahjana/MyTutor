import React from "react";
import BookingListCard from "../components/BookingList/BookingListCard";

const bookingDummy = [
  {
    id: 1,
    matkul: "Matkul",
    namatutor: "NAMA TUTOR",
    jam: "12:00-13:00",
    tanggal: "Jumat, 6 Maret 2026",
    status: "Selesai",
  },
  {
    id: 2,
    matkul: "Fisika",
    namatutor: "BUDI SANTOSO",
    jam: "14:00-15:00",
    tanggal: "Sabtu, 7 Maret 2026",
    status: "Selesai",
  },
  {
    id: 3,
    matkul: "Kimia",
    namatutor: "SINTA MAHARANI",
    jam: "16:00-17:00",
    tanggal: "Minggu, 8 Maret 2026",
    status: "Selesai",
  },
];

const page = () => {
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

export default page;
