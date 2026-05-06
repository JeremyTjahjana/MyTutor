export type TimeSlot = {
  day: string; // e.g., 'Senin'
  start: string; // 'HH:MM'
  end: string; // 'HH:MM'
};

export type FormData = {
  // Step 1: Identitas Diri
  namaLengkap: string;
  emailIPB: string;
  password: string;
  nomorTelepon: string;

  // Step 2: Data Akademik
  nim: string;
  fakultas: string;
  programStudi: string;
  alamatDomisili: string;
  angkatan: string;

  // Step 3: Data Pengajaran
  lamaExperience: string;
  subject: string;
  biayaPerJam: string;

  // Step 4: Matkul & Waktu
  matkuls: string[];
  waktuTersedia: TimeSlot[];
  inputMatkul: string;
};
