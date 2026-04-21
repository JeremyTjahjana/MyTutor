import React from "react";
import Image from "next/image";
import { assets, social } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="mt-10 w-full bg-[var(--biru)] text-[var(--putih)]">
      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-10 md:px-14 lg:px-20 py-6 sm:py-8 md:py-7">
        <div className="md:flex md:items-end md:justify-between md:gap-8">
          <div>
            <Image
              src={assets.logo3}
              alt="MyTutor"
              className="h-auto w-[140px] sm:w-[160px]"
            />

            <p className="mt-4 max-w-[360px] text-[12px] leading-6 font-medium text-[var(--putih)]/95 sm:text-sm">
              MyTutor adalah platform tutor sebaya untuk mahasiswa IPB
              University. Kami menghubungkan mahasiswa yang ingin belajar
              dengan tutor yang kompeten untuk meningkatkan pemahaman akademik
              dan pengembangan soft-skills.
            </p>

            <div className="mt-4 flex items-center gap-4 sm:gap-5">
              <a
                href="#"
                aria-label="Facebook"
                className="inline-flex transition-opacity hover:opacity-85"
              >
                <Image src={social.facebook} alt="Facebook" className="h-6 w-6" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="inline-flex transition-opacity hover:opacity-85"
              >
                <Image src={social.instagram} alt="Instagram" className="h-6 w-6" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="inline-flex transition-opacity hover:opacity-85"
              >
                <Image src={social.linkedin} alt="LinkedIn" className="h-6 w-6" />
              </a>
              <a
                href="#"
                aria-label="WhatsApp"
                className="inline-flex transition-opacity hover:opacity-85"
              >
                <Image src={social.whatsapp} alt="WhatsApp" className="h-6 w-6" />
              </a>
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-[var(--putih)]/75 md:mt-0 md:text-right sm:text-sm">
            Copyright | @ Mytutor 2026
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
