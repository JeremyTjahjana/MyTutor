import React from "react";
import TestiCard from "./TestiCard";

const testimonials = [
  {
    name: "John Carter",
    role: "MK1, MK2, MK3",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit amet hendrerit pretium nulla sed enim iaculis mi.",
  },
  {
    name: "John Carter",
    role: "MK1, MK2, MK3",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit amet hendrerit pretium nulla sed enim iaculis mi.",
  },
];

const Testimonies = () => {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-6 sm:px-10 md:px-14 lg:px-20 py-12 sm:py-16 bg-[var(--putih)] text-[var(--gelap)]">
      <h2 className="text-center text-3xl sm:text-5xl font-semibold text-[var(--biru)]">
        Testimonies
      </h2>

      <div className="mt-8 flex flex-wrap justify-center gap-5 lg:max-w-[760px] lg:mx-auto">
        {testimonials.map((item, index) => (
          <TestiCard
            key={`${item.name}-${index}`}
            name={item.name}
            role={item.role}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
};

export default Testimonies;
