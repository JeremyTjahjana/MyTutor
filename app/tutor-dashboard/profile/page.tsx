"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { useState } from "react";
import { Upload } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    experience: "2-3 tahun",
    subject: "Matematika",
    costPerHour: "150000",
    bio: "Tutor berpengalaman dengan fokus pada pembelajaran interaktif dan hasil yang terukur.",
    portfolio: "https://portfolio.example.com",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert("Profile updated successfully!");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--biru)] mb-1">
          Edit Profile
        </h1>
        <p className="text-[var(--gelap)]/60">Update your tutor information.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-[var(--gelap)]/5">
        {/* Avatar Upload - Full Width */}
        <div className="mb-8 pb-8 border-b border-[var(--gelap)]/10">
          <label className="block text-sm font-medium text-[var(--gelap)] mb-3">
            Profile Picture
          </label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-[var(--biru)]/10 flex items-center justify-center flex-shrink-0">
              <Upload className="w-6 h-6 text-[var(--biru)]" />
            </div>
            <button className="btn-secondary px-4 py-2 rounded-lg text-sm">
              Upload Image
            </button>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--gelap)] mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[var(--gelap)] mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-[var(--gelap)] mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-[var(--gelap)] mb-2">
                Teaching Experience
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30"
              >
                <option value="< 1 tahun">Less than 1 year</option>
                <option value="1-2 tahun">1-2 years</option>
                <option value="2-3 tahun">2-3 years</option>
                <option value="3-5 tahun">3-5 years</option>
                <option value="> 5 tahun">More than 5 years</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-[var(--gelap)] mb-2">
                Main Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30"
              />
            </div>

            {/* Cost per Hour */}
            <div>
              <label className="block text-sm font-medium text-[var(--gelap)] mb-2">
                Cost per Hour (IDR)
              </label>
              <input
                type="number"
                name="costPerHour"
                value={formData.costPerHour}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30"
              />
            </div>
          </div>
        </div>

        {/* Bio & Portfolio - Full Width */}
        <div className="mt-8 pt-8 border-t border-[var(--gelap)]/10 space-y-5">
          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-[var(--gelap)] mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30"
            />
          </div>

          {/* Portfolio */}
          <div>
            <label className="block text-sm font-medium text-[var(--gelap)] mb-2">
              Portfolio URL
            </label>
            <input
              type="url"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`btn-primary px-6 py-3 rounded-lg font-semibold ${isSaving ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <button className="btn-secondary px-6 py-3 rounded-lg font-semibold">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
