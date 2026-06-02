"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect, useRef, useActionState } from "react";
import { Loader2, User, ImageIcon } from "lucide-react";
import {
  updateTutorProfileAction,
  type UpdateProfileState,
} from "@/features/tutor/services/tutor.action";
import Image from "next/image";

const initialProfileState: UpdateProfileState = { success: false };

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hasSelectedAvatar, setHasSelectedAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    experience: "",
    costPerHour: "",
    bio: "",
    portfolioUrls: "",
  });

  const [profileState, profileFormAction, profilePending] = useActionState(
    updateTutorProfileAction,
    initialProfileState,
  );

  useEffect(() => {
    if (!user) return;
    setProfileLoaded(false);
    setFormData((prev) => ({
      ...prev,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone ?? "",
    }));

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
            portfolioUrls: Array.isArray(data.profile.portfolio_urls)
              ? data.profile.portfolio_urls.join("\n")
              : "",
          }));
        }
        setProfileLoaded(true);
      })
      .catch(() => setProfileLoaded(true));
  }, [user]);

  useEffect(() => {
    if (profileState.success) {
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setHasSelectedAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      void refreshUser();
    }
  }, [profileState.success, refreshUser]);

  useEffect(() => {
    setImageError(false);
  }, [user?.avatarUrl]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const displayAvatarSrc =
    previewUrl ?? (user?.avatarUrl && !imageError ? user.avatarUrl : null);

  const onFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreviewUrl(null);
      setHasSelectedAvatar(false);
      return;
    }
    const url = URL.createObjectURL(file);
    setImageError(false);
    setHasSelectedAvatar(true);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--biru)]" />
      </div>
    );
  }

  if (!profileLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--biru)]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-[var(--biru)] sm:text-3xl">
          Profile and settings
        </h1>
        <p className="mt-1 text-sm text-[var(--gelap)]/60 sm:text-base">
          Inilah yang dilihat siswa di halaman tutor publik Anda. Perbarui foto,
          detail kontak, bio, dan tarif Anda di sini.
        </p>
      </header>

      {profileState.success && (
        <p className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-800">
          Profile details saved.
        </p>
      )}
      {profileState.error && (
        <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {profileState.error}
        </p>
      )}

      {/* Profile form */}
      <form action={profileFormAction}>
        <input type="hidden" name="userId" value={user?.id ?? ""} />

        <section className="rounded-2xl border border-[var(--gelap)]/10 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-[var(--gelap)]">
            Profile picture and details
          </h2>
          <p className="mt-1 text-sm text-[var(--gelap)]/55">
            Update the profile shown on your public tutor page, tutor listing,
            and dashboard.
          </p>

          <div className="mt-8 flex flex-col gap-6 border-b border-[var(--gelap)]/10 pb-8 sm:flex-row sm:items-center">
            <div className="relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-[var(--gelap)]/10 bg-[var(--biru)]/8 sm:mx-0">
              {displayAvatarSrc ? (
                <Image
                  src={displayAvatarSrc}
                  alt="Your profile"
                  width={112}
                  height={112}
                  className="h-full w-full object-cover"
                  onError={() => setImageError(true)}
                  unoptimized={displayAvatarSrc.startsWith("blob:")}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User className="h-14 w-14 text-[var(--biru)]/35" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-3">
              <p className="text-sm text-[var(--gelap)]/55">
                JPEG, PNG, or WebP. Maximum 2 MB.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  name="avatar"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  id="avatar-input"
                  onChange={onFilePicked}
                />
                <label
                  htmlFor="avatar-input"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--gelap)]/15 bg-[var(--putih)] px-4 py-2.5 text-sm font-medium text-[var(--gelap)] hover:bg-[var(--gelap)]/[0.04]"
                >
                  <ImageIcon className="h-4 w-4 text-[var(--biru)]" />
                  {hasSelectedAvatar ? "Change selected image" : "Choose image"}
                </label>
                {hasSelectedAvatar && (
                  <span className="text-sm text-[var(--gelap)]/55">
                    Image ready to save.
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--gelap)]">
                  Full name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-[var(--gelap)]/15 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/25"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--gelap)]">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="w-full rounded-xl border border-[var(--gelap)]/15 bg-[var(--gelap)]/[0.04] px-4 py-2.5 text-[var(--gelap)]/60 focus:outline-none"
                />
                <p className="mt-1 text-xs text-[var(--gelap)]/45">
                  Email cannot be changed here.
                </p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--gelap)]">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 08xxxxxxxxxx"
                  className="w-full rounded-xl border border-[var(--gelap)]/15 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/25"
                />
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--gelap)]">
                  Teaching experience
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[var(--gelap)]/15 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/25"
                >
                  <option value="">Select range</option>
                  <option value="0-1 tahun">Under 1 year</option>
                  <option value="1-2 tahun">1–2 years</option>
                  <option value="2-3 tahun">2–3 years</option>
                  <option value="3-5 tahun">3–5 years</option>
                  <option value="> 5 tahun">Over 5 years</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--gelap)]">
                  Rate (IDR per hour)
                </label>
                <input
                  type="number"
                  name="costPerHour"
                  value={formData.costPerHour}
                  onChange={handleChange}
                  placeholder="e.g. 75000"
                  min="0"
                  className="w-full rounded-xl border border-[var(--gelap)]/15 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/25"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-[var(--gelap)]/10 pt-8">
            <label className="mb-2 block text-sm font-medium text-[var(--gelap)]">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Describe your background, teaching style, and what students can expect."
              className="w-full rounded-xl border border-[var(--gelap)]/15 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/25"
            />
          </div>

          <div className="mt-8 border-t border-[var(--gelap)]/10 pt-8">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <label className="block text-sm font-medium text-[var(--gelap)]">
                  Portfolio
                </label>
                <p className="mt-1 text-sm text-[var(--gelap)]/55">
                  Tambahkan URL gambar publik atau link share Google Drive, satu
                  URL per baris. Maksimal 12 item.
                </p>
              </div>
            </div>
            <textarea
              name="portfolioUrls"
              value={formData.portfolioUrls}
              onChange={handleChange}
              rows={4}
              placeholder={`https://drive.google.com/file/d/FILE_ID/view?usp=sharing\nhttps://example.com/portfolio-2.webp`}
              className="mt-3 w-full rounded-xl border border-[var(--gelap)]/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/25"
            />
            <p className="mt-2 text-xs text-[var(--gelap)]/45">
              Untuk Google Drive, ubah akses setiap gambar menjadi
              &quot;Anyone with the link&quot; sebagai Viewer. PDF sebaiknya
              diubah menjadi beberapa gambar agar tampil bagus di carousel
              publik.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={profilePending}
              className="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold disabled:opacity-60"
            >
              {profilePending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Saving…
                </>
              ) : (
                "Simpan profil"
              )}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}
