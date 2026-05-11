export const IPB_PROGRAM_STUDI = [
  // SEKOLAH SAINS DATA, MATEMATIKA DAN INFORMATIKA
  {
    id: "comp-sci",
    name: "Ilmu Komputer",
    faculty: "Sekolah Sains Data, Matematika dan Informatika",
  },
  {
    id: "ai",
    name: "Kecerdasan Buatan",
    faculty: "Sekolah Sains Data, Matematika dan Informatika",
  },
  {
    id: "stats",
    name: "Statistika dan Sains Data",
    faculty: "Sekolah Sains Data, Matematika dan Informatika",
  },
  {
    id: "math",
    name: "Matematika",
    faculty: "Sekolah Sains Data, Matematika dan Informatika",
  },
  {
    id: "actuaria",
    name: "Aktuaria",
    faculty: "Sekolah Sains Data, Matematika dan Informatika",
  },

  // FAKULTAS TEKNIK DAN TEKNOLOGI
  {
    id: "agri-eng",
    name: "Teknik Pertanian dan Biosistem",
    faculty: "Fakultas Teknik dan Teknologi",
  },
  {
    id: "food-tech",
    name: "Ilmu dan Teknologi Pangan",
    faculty: "Fakultas Teknik dan Teknologi",
  },
  {
    id: "agro-ind",
    name: "Teknologi Industri Pertanian",
    faculty: "Fakultas Teknik dan Teknologi",
  },
  {
    id: "civil-env",
    name: "Teknik Sipil Lingkungan",
    faculty: "Fakultas Teknik dan Teknologi",
  },
  {
    id: "mech-eng",
    name: "Teknik Mesin",
    faculty: "Fakultas Teknik dan Teknologi",
  },
  {
    id: "chem-eng",
    name: "Teknik Kimia",
    faculty: "Fakultas Teknik dan Teknologi",
  },

  // FAKULTAS MATEMATIKA DAN ILMU PENGETAHUAN ALAM
  { id: "geofisika", name: "Geofisika dan Meteorologi", faculty: "FMIPA" },
  { id: "biologi", name: "Biologi", faculty: "FMIPA" },
  { id: "kimia", name: "Kimia", faculty: "FMIPA" },
  { id: "fisika", name: "Fisika", faculty: "FMIPA" },
  { id: "biokimia", name: "Biokimia", faculty: "FMIPA" },
  { id: "bioinformatika", name: "Bioinformatika", faculty: "FMIPA" },

  // FAKULTAS PERTANIAN
  {
    id: "land-res",
    name: "Manajemen Sumberdaya Lahan",
    faculty: "Fakultas Pertanian",
  },
  {
    id: "agronomi",
    name: "Agronomi dan Hortikultura",
    faculty: "Fakultas Pertanian",
  },
  { id: "prot-tan", name: "Proteksi Tanaman", faculty: "Fakultas Pertanian" },
  { id: "ars-lan", name: "Arsitektur Lanskap", faculty: "Fakultas Pertanian" },
  {
    id: "smart-agri",
    name: "Smart Agriculture",
    faculty: "Fakultas Pertanian",
  },

  // FAKULTAS EKONOMI DAN MANAJEMEN
  { id: "ekonomi", name: "Ilmu Ekonomi", faculty: "FEM" },
  { id: "manajemen", name: "Manajemen", faculty: "FEM" },
  { id: "agribisnis", name: "Agribisnis", faculty: "FEM" },
  { id: "esl", name: "Ekonomi Sumberdaya dan Lingkungan", faculty: "FEM" },
  { id: "ekis", name: "Ilmu Ekonomi Syariah", faculty: "FEM" },

  // FAKULTAS LAINNYA
  { id: "perairan", name: "Budidaya Perairan", faculty: "FPIK" },
  { id: "msp", name: "Manajemen Sumberdaya Perairan", faculty: "FPIK" },
  { id: "thp", name: "Teknologi Hasil Perairan", faculty: "FPIK" },
  { id: "itk", name: "Ilmu dan Teknologi Kelautan", faculty: "FPIK" },
  {
    id: "ternak-prod",
    name: "Produksi dan Teknologi Peternakan",
    faculty: "Fakultas Peternakan",
  },
  {
    id: "nutrisi-pakan",
    name: "Nutrisi dan Teknologi Pakan",
    faculty: "Fakultas Peternakan",
  },
  { id: "hutan-man", name: "Manajemen Hutan", faculty: "Fahutan" },
  { id: "hutan-hasil", name: "Teknologi Hasil Hutann", faculty: "Fahutan" },
  {
    id: "konservasi",
    name: "Konservasi Sumberdaya Hutan dan Ekowisata",
    faculty: "Fahutan",
  },
  { id: "silvikultur", name: "Silvikultur", faculty: "Fahutan" },
  { id: "keluarga", name: "Ilmu Keluarga dan Konsumen", faculty: "Fema" },
  {
    id: "skpm",
    name: "Sains Komunikasi dan Pengembangan Masyarakat",
    faculty: "Fema",
  },
  {
    id: "kedokteran",
    name: "Kedokteran",
    faculty: "Fakultas Kedokteran dan Gizi",
  },
  { id: "gizi", name: "Gizi", faculty: "Fakultas Kedokteran dan Gizi" },
  { id: "bisnis", name: "Bisnis", faculty: "Sekolah Bisnis" },
  { id: "vet", name: "Kedokteran Hewan", faculty: "SKHB" },
];

// ─── Fakultas (turunan dari prodi) ───────────────────────────────────────────
/**
 * Daftar fakultas unik dari `IPB_PROGRAM_STUDI`. Untuk mengubah nama fakultas,
 * edit field `faculty` pada entri prodi di atas — hindari duplikat manual.
 */
export const IPB_FAKULTAS_LIST: readonly string[] = Array.from(
  new Set(IPB_PROGRAM_STUDI.map((p) => p.faculty)),
).sort((a, b) => a.localeCompare(b, "id"));

// ─── Mata kuliah / skill bawaan (katalog aplikasi) ───────────────────────────
/**
 * Katalog default untuk tutor & pendaftaran. **Bukan** sumber kebenaran di DB:
 * baris di tabel `subjects` Supabase tetap dipakai untuk booking; entri di sini
 * muncul di UI sampai nama yang sama ada di DB, lalu disatukan.
 *
 * Edit daftar ini untuk mengatur pilihan bawaan. `category` opsional (mis. kelompok mapel).
 */
export type TutorSubjectPreset = {
  name: string;
  category: string | null;
};

export const DEFAULT_TUTOR_SUBJECTS: readonly TutorSubjectPreset[] = [
  // Programming & Computer Science
  { name: "Algoritma dan Dasar Pemrograman", category: "Programming" },
  { name: "Pemrograman Web", category: "Programming" },
  { name: "Pemrograman Mobile", category: "Programming" },
  { name: "Object Oriented Programming (OOP)", category: "Programming" },
  { name: "Struktur Data", category: "Computer Science" },
  { name: "Basis Data", category: "Computer Science" },
  { name: "Pengantar Teori Komputasi", category: "Computer Science" },
  { name: "Struktur Diskrit", category: "Computer Science" },
  { name: "Aljabar Linier untuk Komputasi", category: "Mathematics" },
  { name: "Rangkaian Digital", category: "Computer Engineering" },

  // Design & Creative
  { name: "Adobe Photoshop", category: "Design & Arts" },
  { name: "Adobe Illustrator", category: "Design & Arts" },
  { name: "Figma", category: "UI/UX Design" },
  { name: "UI/UX Design", category: "UI/UX Design" },
  { name: "Canva Design", category: "Design & Arts" },
  { name: "Video Editing", category: "Multimedia" },

  // Mathematics
  { name: "Kalkulus 1", category: "Mathematics" },
  { name: "Kalkulus 2", category: "Mathematics" },
  { name: "Statistika", category: "Mathematics" },
  { name: "Matematika Diskrit", category: "Mathematics" },

  // Science
  { name: "Biokimia Umum", category: "Biology" },
  { name: "Fisiologi Mikrob", category: "Biology" },
  { name: "Ekologi Mikrob dan Evolusi", category: "Biology" },
  { name: "Mikologi dan Aplikasi", category: "Biology" },
  { name: "Fisiologi Tumbuhan", category: "Biology" },
  { name: "Fisika Dasar", category: "Physics" },
  { name: "Kimia Dasar", category: "Chemistry" },

  // Business & Management
  { name: "Akuntansi Dasar", category: "Business" },
  { name: "Manajemen Bisnis", category: "Business" },
  { name: "Ekonomi Mikro", category: "Economics" },
  { name: "Ekonomi Makro", category: "Economics" },

  // Language
  { name: "Bahasa Inggris Akademik", category: "Language" },
  { name: "TOEFL Preparation", category: "Language" },
  { name: "IELTS Preparation", category: "Language" },
  { name: "Public Speaking", category: "Communication" },

  // School Subjects
  { name: "Matematika SMA", category: "School Subjects" },
  { name: "Fisika SMA", category: "School Subjects" },
  { name: "Kimia SMA", category: "School Subjects" },
  { name: "Biologi SMA", category: "School Subjects" },
  { name: "Sejarah SMA", category: "School Subjects" },
  { name: "Geografi SMA", category: "School Subjects" },
];

/** Nama saja — dipakai dropdown register tutor (Step 3) agar satu sumber dengan katalog. */
export const DEFAULT_SUBJECT_OPTION_NAMES: readonly string[] =
  DEFAULT_TUTOR_SUBJECTS.map((s) => s.name);
