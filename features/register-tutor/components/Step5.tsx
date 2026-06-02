"use client";

import { FormData } from "../types";

interface Step5Props {
  formData: FormData;
  onUploadContract: (file: File) => void | Promise<void>;
  isUploading?: boolean;
}

export default function Step5({ formData, onUploadContract, isUploading }: Step5Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-[var(--biru)] mb-2">
        Kontrak & Tanda Tangan
      </h2>

      <p className="text-sm text-[var(--gelap)]/80">
        Unduh template kontrak, tanda tangani menggunakan Digisign, lalu unggah
        file kontrak yang sudah ditandatangani untuk dikonfirmasi oleh admin.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 items-start">
        <a
          href="/api/register-tutor/contract-template"
          download="template-kontrak-tutor-mytutor-draft.pdf"
          className={`btn-secondary px-4 py-2 rounded-lg ${isUploading ? "pointer-events-none opacity-50" : ""}`}
          aria-disabled={isUploading}
        >
          Unduh Template Kontrak
        </a>

        <label className={`flex items-center gap-3 ${isUploading ? "pointer-events-none opacity-50" : ""}`}>
          <input
            type="file"
            accept="application/pdf"
            disabled={isUploading}
            onChange={(e) => {
              const f = e.target.files && e.target.files[0];
              if (f) onUploadContract(f);
            }}
            className="hidden"
          />
          <span className="btn-primary px-4 py-2 rounded-lg cursor-pointer">
            {isUploading ? "Mengunggah..." : "Unggah Kontrak (PDF)"}
          </span>
        </label>
      </div>

      <div>
        <p className="text-sm font-medium text-[var(--gelap)]">
          Instruksi singkat
        </p>
        <ol className="text-sm text-[var(--gelap)]/70 list-decimal ml-5 mt-2">
          <li>Unduh template kontrak.</li>
          <li>
            Tanda tangani dokumen menggunakan Digisign (atau layanan tanda
            tangan elektronik yang sah).
          </li>
          <li>Unggah file PDF yang sudah ditandatangani di atas.</li>
          <li>
            Admin akan memverifikasi dan mengonfirmasi setelah tanda tangan
            valid.
          </li>
        </ol>
      </div>

      <div>
        <p className="text-sm font-medium">Status unggahan</p>
        <div className="text-sm mt-2">
          {isUploading ? (
            <span className="text-[var(--biru)] font-medium">Sedang mengunggah...</span>
          ) : formData.contractUploaded ? (
            <span className="text-green-600 font-medium">✓ Terunggah: {formData.contractFileName}</span>
          ) : (
            <span className="italic text-[var(--gelap)]/60">
              Belum mengunggah kontrak
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
