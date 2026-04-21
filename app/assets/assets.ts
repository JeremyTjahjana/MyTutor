import logo1 from "./logo1.png";
import logo2 from "./logo2.png";
import logo3 from "./logo3.png";
import mehehe from "./mehehe.png";
import bgimg from "./bgimg.jpg";
import bgimage from "./bgimg.jpg";
import logohd from "./logohd.png";
import star from "./star.svg";
import filter from "./filter.svg";
import search from "./search.svg";

import lightbulb from "./lightbulb.svg";
import home from "./home.svg";
import book from "./book.svg";

import porto1 from "./porto1.jpg";
import porto2 from "./porto2.jpg";
import porto3 from "./porto3.jpg";

import instagram from "./ig.svg";
import facebook from "./fb.svg";
import linkedin from "./linkedin.svg";
import whatsapp from "./wa.svg";
import { StaticImageData } from "next/image";

const assets = {
  logo1,
  logo2,
  logo3,
  mehehe,
  home,
  lightbulb,
  book,
  bgimg,
  bgimage,
  logohd,
  star,
  filter,
  search,
  porto1,
  porto2,
  porto3,
};

const social = {
  instagram,
  facebook,
  linkedin,
  whatsapp,
};

type TutorSchedule = {
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  tanggal: string;
};

type TutorTestimony = {
  studentName: string;
  message: string;
  rating: number;
  createdAt: string;
};

type DummyTutor = {
  id: number;
  profile: StaticImageData;
  name: string;
  description: string;
  rating: number;
  matkuls: string[];
  waktu: TutorSchedule[];
  testimonies: TutorTestimony[];
  portofolio: StaticImageData[];
};

const dummyTutor: DummyTutor[] = [
  {
    id: 1,
    profile: assets.mehehe,
    name: "Julio Calvin Edgario",
    description:
      "Tutor yang fokus pada dasar logika dan latihan soal terstruktur untuk memperkuat pemahaman konsep inti.",
    rating: 4,
    matkuls: ["MBL", "Kalkulus", "Alpro"],
    waktu: [
      {
        hari: "Senin",
        jamMulai: "13:00",
        jamSelesai: "14:30",
        tanggal: "2026-04-27",
      },
      {
        hari: "Rabu",
        jamMulai: "19:00",
        jamSelesai: "20:30",
        tanggal: "2026-04-29",
      },
    ],
    testimonies: [
      {
        studentName: "Andi Pratama",
        message: "Penjelasan kalkulusnya detail dan mudah diikuti.",
        rating: 5,
        createdAt: "2026-03-10",
      },
      {
        studentName: "Nadia Putri",
        message: "PR alpro jadi lebih cepat selesai setelah dibimbing.",
        rating: 4,
        createdAt: "2026-03-19",
      },
    ],
    portofolio: [assets.porto1, assets.porto2, assets.porto3],
  },
  {
    id: 2,
    profile: assets.mehehe,
    name: "Raisa Maharani",
    description:
      "Tutor komunikatif dengan pendekatan visual untuk membantu mahasiswa memahami materi statistik dan data.",
    rating: 5,
    matkuls: ["Statistika", "Metode Numerik", "Data Science Dasar"],
    waktu: [
      {
        hari: "Selasa",
        jamMulai: "15:30",
        jamSelesai: "17:00",
        tanggal: "2026-04-28",
      },
      {
        hari: "Jumat",
        jamMulai: "08:00",
        jamSelesai: "09:30",
        tanggal: "2026-05-01",
      },
    ],
    testimonies: [
      {
        studentName: "Fikri Hidayat",
        message: "Materi statistik jadi jauh lebih masuk akal.",
        rating: 5,
        createdAt: "2026-03-14",
      },
      {
        studentName: "Tasya Ramadhani",
        message: "Sangat membantu untuk persiapan kuis numerik.",
        rating: 5,
        createdAt: "2026-03-26",
      },
    ],
    portofolio: [assets.porto1, assets.porto2, assets.porto3],
  },
  {
    id: 3,
    profile: assets.mehehe,
    name: "Bagus Wicaksono",
    description:
      "Tutor sabar dan sistematis untuk mata kuliah kimia dasar dan fisika, cocok untuk belajar dari nol.",
    rating: 4,
    matkuls: ["Kimia Dasar", "Fisika Dasar", "Termodinamika"],
    waktu: [
      {
        hari: "Kamis",
        jamMulai: "10:00",
        jamSelesai: "11:30",
        tanggal: "2026-04-30",
      },
      {
        hari: "Sabtu",
        jamMulai: "14:00",
        jamSelesai: "15:30",
        tanggal: "2026-05-02",
      },
    ],
    testimonies: [
      {
        studentName: "Kevin Alvian",
        message: "Belajar termodinamika jadi lebih santai dan terarah.",
        rating: 4,
        createdAt: "2026-03-07",
      },
      {
        studentName: "Nabila Sari",
        message: "Tutor ramah dan selalu kasih contoh soal tambahan.",
        rating: 4,
        createdAt: "2026-03-22",
      },
    ],
    portofolio: [assets.porto1, assets.porto2, assets.porto3],
  },
];

export { social, assets, dummyTutor };
