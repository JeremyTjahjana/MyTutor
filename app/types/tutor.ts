import type { StaticImageData } from "next/image";

export type TutorSchedule = {
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  tanggal: string;
};

export type TutorTestimony = {
  studentName: string;
  message: string;
  rating: number;
  createdAt: string;
};

/** Single source-of-truth for a Tutor entity (covers both list and detail views) */
export type Tutor = {
  id: number;
  profile: string | StaticImageData;
  name: string;
  description: string;
  rating: number;
  matkuls: string[];
  waktu: TutorSchedule[];
  testimonies: TutorTestimony[];
  portofolio: Array<string | StaticImageData>;
};
