import React from "react";
import Image from "next/image";
import { assets, social } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="w-full bg-[var(--biru)] text-[var(--putih)] mt-10">
      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-10 md:px-14 lg:px-20 py-10 sm:py-12">
        <Image
          src={assets.logo3}
          alt="MyTutor"
          className="w-[150px] sm:w-[170px] h-auto"
        />

        <p className="mt-6 max-w-[360px] text-sm sm:text-base leading-7 text-[var(--putih)]/95 font-semibold">
          Lorem Ipsum has been the industry&apos;s standard dummy text ever
          since the 1500s, when an unknown printer took a galley.
        </p>

        <div className="mt-6 flex items-center gap-5">
          <a
            href="#"
            aria-label="Facebook"
            className="inline-flex hover:opacity-85 transition-opacity"
          >
            <Image src={social.facebook} alt="Facebook" className="w-7 h-7" />
          </a>
          <a
            href="#"
            aria-label="Instagram"
            className="inline-flex hover:opacity-85 transition-opacity"
          >
            <Image src={social.instagram} alt="Instagram" className="w-7 h-7" />
          </a>
          <a
            href="#"
            aria-label="LinkedIn"
            className="inline-flex hover:opacity-85 transition-opacity"
          >
            <Image src={social.linkedin} alt="LinkedIn" className="w-7 h-7" />
          </a>
          <a
            href="#"
            aria-label="WhatsApp"
            className="inline-flex hover:opacity-85 transition-opacity"
          >
            <Image src={social.whatsapp} alt="WhatsApp" className="w-7 h-7" />
          </a>
        </div>

        <p className="mt-14 text-center text-xs sm:text-sm text-[var(--putih)]/75">
          Copyright | @ Mytutor 2026
        </p>
      </div>
    </footer>
  );
};

export default Footer;
