import React from "react";
import Link from "next/link";
import TutorCard from "../Home/TutorCard";
import { dummyTutor } from "../../assets/assets";

const ListTutor = () => {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-2 sm:px-6 md:px-8 lg:px-12 py-2 sm:py-8 bg-[var(--putih)] text-[var(--gelap)]">
      <div className="mt-16 grid w-full grid-cols-1 justify-items-center gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dummyTutor.map((item) => (
          <Link
            key={item.id}
            href={`/tutor/${item.id}`}
            className="w-full flex justify-center"
          >
            <TutorCard
              profile={item.profile}
              name={item.name}
              role={item.matkuls.join(", ")}
              description={item.description}
              rating={item.rating}
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ListTutor;
