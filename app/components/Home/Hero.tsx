"use client";

import React from "react";
import Image from "next/image";
import { assets } from "../../assets/assets";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="w-full bg-[var(--putih)] text-[var(--gelap)]">
      <div className="relative min-h-[320px] sm:min-h-[380px] lg:min-h-0 lg:aspect-[21/7]">
        <Image
          src={assets.bgimage}
          alt="Hero background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[var(--putih)]/60" />

        <div className="relative z-10 mx-auto flex min-h-[320px] sm:min-h-[380px] lg:min-h-full w-full flex-col items-center justify-center px-6 py-10 text-center">
          {/* Logo — fades + slides up only on first load */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Image
              src={assets.logohd}
              alt="MyTutor logo"
              className="w-[260px] sm:w-[340px] md:w-[420px] h-auto drop-shadow-[0_10px_5px_rgba(0,0,100,0.2)]"
              priority
            />
          </motion.div>

          {/* Tagline — fades + slides up slightly after logo */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="mt-5 text-lg sm:text-2xl md:text-3xl font-semibold text-[var(--biru)] text-shadow-lg"
          >
            Tempat terbaik berbagi Ilmu!
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
