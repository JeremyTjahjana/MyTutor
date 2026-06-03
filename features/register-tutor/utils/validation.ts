import type { FormData } from "../types";

export function isRegisterTutorStepValid(step: number, formData: FormData) {
  if (step === 1) {
    return Boolean(
      formData.namaLengkap.trim() &&
        formData.emailIPB.includes("@apps.ipb.ac.id") &&
        /^\d{8,13}$/.test(formData.nomorTelepon.trim()),
    );
  }

  if (step === 2) {
    return Boolean(
      formData.nim.trim() &&
        formData.fakultas &&
        formData.programStudi &&
        formData.alamatDomisili &&
        formData.angkatan,
    );
  }

  if (step === 3) {
    return Boolean(
      formData.lamaExperience &&
        formData.matkuls.length > 0 &&
        formData.biayaPerJam.trim(),
    );
  }

  if (step === 4) return formData.waktuTersedia.length > 0;

  if (step === 5) {
    return Boolean(
      formData.contractUploaded &&
        formData.contractFileName.trim() &&
        formData.contractPdfUrl.trim(),
    );
  }

  return false;
}
