import type { StaticImageData } from "next/image";

export type TutorTestimony = {
  studentName: string;
  createdAt: string;
  rating: number;
  message: string;
};

export type TutorDetail = {
  id: number;
  name: string;
  profile: string | StaticImageData;
  matkuls: string[];
  description: string;
  portofolio: Array<string | StaticImageData>;
  testimonies: TutorTestimony[];
};
