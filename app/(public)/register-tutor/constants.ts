import { FormData } from "./types";
import { DEFAULT_SUBJECT_OPTION_NAMES } from "@/lib/data";

export const initialFormData: FormData = {
  namaLengkap: "",
  emailIPB: "",
  nomorTelepon: "",
  nim: "",
  fakultas: "",
  programStudi: "",
  alamatDomisili: "",
  angkatan: "",
  lamaExperience: "",
  subject: "",
  biayaPerJam: "",
  matkuls: [],
  waktuTersedia: [],
  // Step 5
  contractFileName: "",
  contractUploaded: false,
  contractPdfUrl: "",
  inputMatkul: "",
};

export const waktuOptions = [
  "Senin 13:00 - 14:30",
  "Senin 15:00 - 16:30",
  "Selasa 10:00 - 11:30",
  "Selasa 13:00 - 14:30",
  "Rabu 09:00 - 10:30",
  "Rabu 14:00 - 15:30",
  "Kamis 11:00 - 12:30",
  "Kamis 13:00 - 14:30",
  "Jumat 10:00 - 11:30",
  "Jumat 14:00 - 15:30",
  "Sabtu 09:00 - 10:30",
  "Sabtu 13:00 - 14:30",
];

/** Sama dengan `DEFAULT_SUBJECT_OPTION_NAMES` di `@/lib/data` — edit di sana. */
export const subjectOptions = [...DEFAULT_SUBJECT_OPTION_NAMES];

export const fakultasOptions = [
  "Fakultas Pertanian (Faperta)",
  "Fakultas Kedokteran Hewan dan Biomedis (SKHB)",
  "Fakultas Perikanan dan Ilmu Kelautan (FPIK)",
  "Fakultas Peternakan (Fapet)",
  "Fakultas Kehutanan dan Lingkungan (Fahutan)",
  "Fakultas Teknik dan Teknologi (FTT)",
  "Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)",
  "Fakultas Ekonomi dan Manajemen (FEM)",
  "Fakultas Ekologi Manusia (FEMA)",
  "Sekolah Bisnis",
  "Sekolah Vokasi",
  "Fakultas Kedokteran",
  "Sekolah Sains Data Matematika dan Informatika",
];

export const programStudiOptions = [
  "Agronomi",
  "Manajemen Sumberdaya Lahan",
  "Budidaya Perairan",
  "Teknologi Pertanian",
  "Pendidikan Pertanian",
];

export const alamatDomisiliOptions = [
  "Bogor",
  "Jakarta",
  "Depok",
  "Tangerang",
  "Bekasi",
  "Cianjur",
  "Sukabumi",
];

export const angkatanOptions = ["2020", "2021", "2022", "2023", "2024"];
