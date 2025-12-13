// components/CardHolderProfile.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import {
  User,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  Loader2,
  Shield,
  Home,
  Camera,
  CreditCard,
  Hash,
} from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import Link from "next/link";

interface CardHolder {
  name: string;
  phone: string;
  resident: string;
  active: boolean;
  expires_at?: string;
  profile_picture_url?: string;
}

export default function CardHolderProfile({ id }: { id: string }) {
  const { t, dir } = useLanguage();
  const [profile, setProfile] = useState<CardHolder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);

        const { createBrowserClient } = await import("@supabase/ssr");
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data, error } = await supabase
          .from("discount_cards")
          .select(
            "name, phone, resident, active, expires_at, profile_picture_url"
          )
          .eq("card_id", id)
          .single();

        if (error || !data) throw new Error("Card not found");

        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProfile();
  }, [id]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be less than 5MB");
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);

      const { createBrowserClient } = await import("@supabase/ssr");
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const ext = file.name.split(".").pop();
      const fileName = `${id}-${Date.now()}.${ext}`;

      // delete old image if exists
      if (profile?.profile_picture_url) {
        const oldName = profile.profile_picture_url.split("/").pop();
        if (oldName) {
          await supabase.storage.from("profile-pictures").remove([oldName]);
        }
      }

      const { error: uploadErr } = await supabase.storage
        .from("profile-pictures")
        .upload(fileName, file, { cacheControl: "3600" });

      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage
        .from("profile-pictures")
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      await supabase
        .from("discount_cards")
        .update({ profile_picture_url: publicUrl })
        .eq("card_id", id);

      setProfile((p) => (p ? { ...p, profile_picture_url: publicUrl } : p));
    } catch {
      setUploadError("Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  function formatExpiry(expiresAt: string) {
    const d = new Date(expiresAt);
    return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(
      d.getFullYear()
    ).slice(-2)}`;
  }

  function formatMemberId(cardId: string) {
    const cleanId = cardId.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    return cleanId.match(/.{1,4}/g)?.join(" ") || cleanId;
  }

  if (loading) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
        dir={dir}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#1b447a] animate-spin" />
          <p className="text-gray-700 font-semibold">{t("loading.member")}</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
        dir={dir}
      >
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full border-l-4 border-red-600">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {t("access.denied")}
              </h2>
              <p className="text-gray-600">
                {error || t("verification.failed")}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4" dir={dir}>
      <div className="max-w-4xl mx-auto">
        {/* Top Controls - Language Switcher and Home Button */}
        <div className="mb-6 flex justify-between items-center gap-3 flex-wrap">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 hover:border-[#1b447a] group"
          >
            <Home className="w-5 h-5 text-[#1b447a] group-hover:scale-110 transition-transform" />
            <span className="font-medium text-gray-700 group-hover:text-[#1b447a] transition-colors">
              {t("home")}
            </span>
          </Link>
          <LanguageSwitcher />
        </div>

        {/* Header with Logo */}
        <div className="bg-white rounded-t-lg shadow-sm border-b-2 border-[#1b447a] p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="Cardly"
                width={120}
                height={60}
                className="h-12 w-auto"
              />
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-[#1b447a]">
                  {t("card.holder.profile")}
                </h1>
                <p className="text-sm text-gray-600">{t("verified.member")}</p>
              </div>
            </div>
            <div
              className={`px-4 py-2 rounded-lg font-bold text-sm ${
                profile.active
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-gray-100 text-gray-800 border border-gray-300"
              }`}
            >
              {profile.active ? (
                <span className="flex items-center gap-2 rtl:flex-row-reverse">
                  <CheckCircle className="w-4 h-4 rtl:transform rtl:scale-x-[-1]" />
                  {t("active")}
                </span>
              ) : (
                <span className="flex items-center gap-2 rtl:flex-row-reverse">
                  <XCircle className="w-4 h-4 rtl:transform rtl:scale-x-[-1]" />
                  {t("inactive")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white shadow-lg rounded-b-lg overflow-hidden">
          {/* Member ID Banner with Card Info */}
          <div className="bg-gradient-to-br from-[#1b447a] to-[#2d5a9e] text-white py-6 px-6 relative overflow-hidden">
            <div className="flex items-start justify-between relative z-10">
              <div className="flex-1">
                <div className="mb-4">
                  <p className="text-xs uppercase tracking-wider opacity-80 mb-1">
                    {t("member.id")}
                  </p>
                  <p className="text-xl font-mono font-bold tracking-widest">
                    {formatMemberId(id)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {profile.expires_at && (
                  <div>
                    <p className="text-xs uppercase tracking-wider opacity-80 mb-1">
                      Valid Thru
                    </p>
                    <p className="text-lg font-mono font-semibold tracking-wider">
                      {formatExpiry(profile.expires_at)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Information Grid */}
          <div className="p-8">
            {/* Name Section with Avatar */}
            {/* Name Section with Avatar */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-start gap-4">
                <div
                  className="w-20 h-20 rounded-full overflow-hidden cursor-pointer relative flex-shrink-0 ring-4 ring-gray-200 shadow-md"
                  onClick={() => !uploading && fileInputRef.current?.click()}
                >
                  <div className="absolute inset-0 z-20 bg-black/0 hover:bg-black/60 transition-all flex items-center justify-center group">
                    <Camera className="text-white w-6 h-6 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  {uploading ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Loader2 className="animate-spin text-[#1b447a] w-6 h-6" />
                    </div>
                  ) : profile.profile_picture_url ? (
                    <img
                      src={profile.profile_picture_url}
                      alt="Profile"
                      className="w-full h-full object-cover relative z-10"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#1b447a]">
                      <User className="text-white w-10 h-10" />
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
                    {t("full.name")}
                  </p>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {profile.name}
                  </h2>
                  {uploadError && (
                    <p className="text-xs text-red-600 mt-2">{uploadError}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Phone */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:border-[#1b447a] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#1b447a] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
                      {t("contact.number")}
                    </p>
                    <a
                      href={`tel:${profile.phone}`}
                      className="text-lg font-bold text-[#1b447a] hover:underline break-all ltr-only"
                    >
                      {profile.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Residence */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:border-[#1b447a] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#1b447a] rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
                      {t("residence")}
                    </p>
                    <p className="text-lg font-bold text-gray-900 break-words">
                      {profile.resident}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Section */}
            <div
              className={`bg-gray-50 rounded-lg p-6 ${
                dir === "rtl" ? "border-r-4" : "border-l-4"
              } border-[#1b447a]`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    profile.active ? "bg-green-100" : "bg-gray-200"
                  }`}
                >
                  {profile.active ? (
                    <CheckCircle className="w-6 h-6 text-green-600 rtl:transform rtl:scale-x-[-1]" />
                  ) : (
                    <XCircle className="w-6 h-6 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                    {t("account.status")}
                  </p>
                  <p
                    className={`text-xl font-bold mb-2 ${
                      profile.active ? "text-green-600" : "text-gray-600"
                    }`}
                  >
                    {profile.active
                      ? t("active.verified")
                      : t("inactive.account")}
                  </p>
                  <p className="text-sm text-gray-600">
                    {profile.active
                      ? t("full.access")
                      : t("contact.support.activate")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            <span className="inline-flex items-center gap-2">
              {t("lostCard")}
            </span>
          </p>
        </div>
        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            <span className="inline-flex items-center gap-2">
              <Shield className="w-4 h-4" />
              {t("secured.verified")}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
