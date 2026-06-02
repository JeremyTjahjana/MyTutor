import type { AdminTutorReviewMode } from "./types";

export const adminTutorReviewModeConfig: Record<
  AdminTutorReviewMode,
  {
    title: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
  }
> = {
  pendaftaran: {
    title: "Pendaftaran",
    description:
      "Review pengajuan tutor yang masih pending dan lihat file kontraknya.",
    emptyTitle: "Tidak ada pendaftaran tutor",
    emptyDescription:
      "Pengajuan tutor baru akan muncul di sini setelah mereka mengirim form registrasi.",
  },
  "list-tutors": {
    title: "List tutors",
    description: "Lihat tutor aktif dan revoke role tutor bila perlu.",
    emptyTitle: "Tidak ada tutor aktif",
    emptyDescription:
      "Tutor yang sudah di-approve akan muncul di sini bersama akses revoke.",
  },
};
