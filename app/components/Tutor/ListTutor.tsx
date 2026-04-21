import React from "react";
import TutorCard from "../Home/TutorCard";
import { assets } from "../../assets/assets";

const Dummy = [
  {
    profile: assets.mehehe,
    name: "John Carter",
    role: "MK1, MK2, MK3",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit amet hendrerit pretium nulla sed enim iaculis mi.",
    rating: 4,
  },
  {
    profile: assets.mehehe,
    name: "John Carter",
    role: "MK1, MK2, MK3",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit amet hendrerit pretium nulla sed enim iaculis mi.",
    rating: 5,
  },
];

const ListTutor = () => {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-6 sm:px-10 md:px-14 lg:px-20 py-12 sm:py-16 bg-[var(--putih)] text-[var(--gelap)]">
      

      <div className="mt-8 flex gap-4 overflow-x-auto pb-2 flex-col items-center sm:justify-center sm:overflow-visible sm:gap-5 lg:max-w-[760px] lg:mx-auto">
        {Dummy.map((item, index) => (
          <TutorCard
            key={`${item.name}-${index}`}
            profile={item.profile}
            name={item.name}
            role={item.role}
            description={item.description}
            rating={item.rating}
          />
        ))}
      </div>
    </section>
  );
};

export default ListTutor;
