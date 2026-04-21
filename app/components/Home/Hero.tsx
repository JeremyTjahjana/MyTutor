import React from "react";
import Image from "next/image";
import { assets } from "../../assets/assets";

const testimonials = [
  {
    name: "John Carter",
    role: "MK1, MK2, MK3",
  },
  {
    name: "John Carter",
    role: "MK1, MK2, MK3",
  },
];

const Hero = () => {
  return (
    <section className="w-full bg-[var(--putih)] text-[var(--gelap)]">
      <div className="relative min-h-[320px] sm:min-h-[380px]">
        <Image
          src={assets.bgimage}
          alt="Hero background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[var(--putih)]/60" />

        <div className="relative z-10 mx-auto flex min-h-[320px] sm:min-h-[380px] max-w-[1280px] flex-col items-center justify-center px-6 py-10 text-center">
          <Image
            src={assets.logohd}
            alt="MyTutor logo"
            className="w-[260px] sm:w-[340px] md:w-[420px] h-auto"
            priority
          />

          <p className="mt-5 text-lg sm:text-2xl md:text-3xl font-medium text-[var(--biru)] text-shadow-lg">
            Tempat terbaik berbagi Ilmu!
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
