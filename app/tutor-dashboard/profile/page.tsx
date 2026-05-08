"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { useState, useActionState, useEffect } from "react";
import { Loader2, User } from "lucide-react";
import {
  updateTutorProfileAction,
  type UpdateProfileState,
} from "@/app/server/actions/tutors.action";
import Image from "next/image";
import { assets } from "@/app/assets/assets";

const initialState: UpdateProfileState = { success: false };

export default function ProfilePage() {
  const { user } = useAuth();
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    experience: "",
    costPerHour: "",
    bio: "",
  });

  // Load user + tutor profile data on mount
  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      ...prev,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone ?? "",
    }));

    // Fetch tutor profile data (bio, experience, costPerHour)
    fetch(`/api/schedules?tutorUserId=${user.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.profile) {
          setFormData((prev) => ({
            ...prev,
            experience: data.profile.experience ?? "",
            costPerHour: data.profile.cost_per_hour
              ? String(data.profile.cost_per_hour)
              : "",
            bio: data.profile.bio ?? "",
          }));
        }
        setProfileLoaded(true);
      })
      .catch(() => setProfileLoaded(true));
  }, [user]);

  const [state, formAction, isPending] = useActionState(
    updateTutorProfileAction,
    initialState,
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!profileLoaded && !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--biru)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--biru)] mb-1">
          Edit Profil
        </h1>
        <p className="text-[var(--gelap)]/60">
          Perbarui informasi profil tutor kamu.
        </p>
      </div>

      {state.success && (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
          Profil berhasil diperbarui!
        </p>
      )}
      {state.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <form action={formAction}>
        {/* Hidden user ID */}
        <input type="hidden" name="userId" value={user?.id ?? ""} />

        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-[var(--gelap)]/5">
          {/* Avatar */}
          <div className="mb-8 pb-8 border-b border-[var(--gelap)]/10">
            <label className="block text-sm font-medium text-[var(--gelap)] mb-3">
              Foto Profil
            </label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-[var(--biru)]/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {!imageError && user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                    priority
                  />
                ) : (
                  <User className="w-12 h-12 text-[var(--biru)]/50" />
                )}
              </div>
              <p className="text-sm text-[var(--gelap)]/50">
                {user?.avatarUrl && !imageError
                  ? "Foto profil dari akun Google kamu."
                  : "Foto profil placeholder (Google OAuth avatar tidak tersedia)"}
              </p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[var(--gelap)] mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--gelap)] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg bg-[var(--gelap)]/5 text-[var(--gelap)]/60 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--gelap)] mb-2">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[var(--gelap)] mb-2">
                  Pengalaman Mengajar
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30"
                >
                  <option value="">Pilih pengalaman</option>
                  <option value="0-1 tahun">Kurang dari 1 tahun</option>
                  <option value="1-2 tahun">1–2 tahun</option>
                  <option value="2-3 tahun">2–3 tahun</option>
                  <option value="3-5 tahun">3–5 tahun</option>
                  <option value="> 5 tahun">Lebih dari 5 tahun</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--gelap)] mb-2">
                  Biaya per Jam (IDR)
                </label>
                <input
                  type="number"
                  name="costPerHour"
                  value={formData.costPerHour}
                  onChange={handleChange}
                  placeholder="contoh: 75000"
                  className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30"
                />
              </div>
            </div>
          </div>

          {/* Bio — Full Width */}
          <div className="mt-8 pt-8 border-t border-[var(--gelap)]/10">
            <label className="block text-sm font-medium text-[var(--gelap)] mb-2">
              Bio / Deskripsi Diri
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Ceritakan tentang dirimu, metode mengajar, dan pengalamanmu..."
              className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30"
            />
          </div>

          {/* Save Button */}
          <div className="flex gap-3 mt-8">
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary px-6 py-3 rounded-lg font-semibold"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </button>
            <button
              type="reset"
              className="btn-secondary px-6 py-3 rounded-lg font-semibold"
            >
              Batal
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
