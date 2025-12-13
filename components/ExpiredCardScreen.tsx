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
} from "lucide-react";
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

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#f8f8f8" }}
      >
        <Loader2
          className="w-10 h-10 animate-spin"
          style={{ color: "#1b447a" }}
        />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#f8f8f8" }}
      >
        <p style={{ color: "#1b447a" }}>{error}</p>
      </div>
    );
  }

  return (
    <div
      dir={dir}
      className="min-h-screen p-4"
      style={{ backgroundColor: "#f8f8f8" }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-medium transition-opacity hover:opacity-70"
            style={{ color: "#1b447a" }}
          >
            <Home /> {t("home")}
          </Link>
          <LanguageSwitcher />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm" style={{ color: "#1b447a", opacity: 0.7 }}>
                {t("member.id")}
              </p>
              <p className="text-xl font-bold" style={{ color: "#1b447a" }}>
                {id}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm" style={{ color: "#1b447a", opacity: 0.7 }}>
                {t("expires")}
              </p>
              <p className="font-bold" style={{ color: "#1b447a" }}>
                {profile.expires_at ? formatExpiry(profile.expires_at) : "-"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 mb-6">
            <div
              className="relative w-20 h-20 rounded-full overflow-hidden"
              style={{ backgroundColor: "#f8f8f8" }}
            >
              {uploading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Loader2
                    className="animate-spin"
                    style={{ color: "#1b447a" }}
                  />
                </div>
              ) : profile.profile_picture_url ? (
                <img
                  src={profile.profile_picture_url}
                  alt={profile.name}
                  className="w-full h-full object-cover relative z-10"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: "#1b447a" }}
                >
                  <User className="text-white" />
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 z-20 rounded-full bg-black/0 hover:bg-black/60 transition flex items-center justify-center"
              >
                <Camera className="text-white opacity-0 hover:opacity-100" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            <div>
              <p className="text-2xl font-bold" style={{ color: "#1b447a" }}>
                {profile.name}
              </p>
              {uploadError && (
                <p className="text-xs text-red-600">{uploadError}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div
              className="flex items-center gap-3"
              style={{ color: "#1b447a" }}
            >
              <Phone /> {profile.phone}
            </div>
            <div
              className="flex items-center gap-3"
              style={{ color: "#1b447a" }}
            >
              <MapPin /> {profile.resident}
            </div>
          </div>

          <div
            className={`p-4 rounded-xl flex items-center gap-3 ${
              profile.active ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {profile.active ? (
              <CheckCircle style={{ color: "#1b447a" }} />
            ) : (
              <XCircle style={{ color: "#1b447a" }} />
            )}
            <span className="font-bold" style={{ color: "#1b447a" }}>
              {profile.active ? t("active") : t("inactive")}
            </span>
          </div>
        </div>

        <div
          className="text-center mt-6 text-sm flex justify-center gap-2"
          style={{ color: "#1b447a", opacity: 0.7 }}
        >
          <Shield className="w-4 h-4" /> {t("secured.verified")}
        </div>
      </div>
    </div>
  );
}
