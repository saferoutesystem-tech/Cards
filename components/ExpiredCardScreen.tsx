// components/ExpiredCardScreen.tsx
"use client";

import { useEffect, useState } from "react";
import {
  XCircle,
  Calendar,
  Phone,
  Mail,
  Home,
  AlertTriangle,
  User,
  MapPin,
  Shield,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import Link from "next/link";
import Image from "next/image";

interface ExpiredCardScreenProps {
  cardId: string;
  expiresAt?: string;
}

interface CardData {
  name?: string;
  phone?: string;
  resident?: string;
  profile_picture_url?: string;
}

export default function ExpiredCardScreen({
  cardId,
  expiresAt,
}: ExpiredCardScreenProps) {
  const { t, dir } = useLanguage();
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCardData() {
      try {
        const { createBrowserClient } = await import("@supabase/ssr");
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data, error } = await supabase
          .from("discount_cards")
          .select("name, phone, resident, profile_picture_url")
          .eq("card_id", cardId)
          .single();

        if (error) {
          console.error("Error fetching card data:", error);
        } else if (data) {
          setCardData(data);
        }
      } catch (err) {
        console.error("Exception fetching card data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCardData();
  }, [cardId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const locale =
        dir === "rtl"
          ? t("language.code") === "ar"
            ? "ar-IQ"
            : "ku-IQ"
          : "en-US";
      return date.toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const formatMemberId = (cardId: string) => {
    const cleanId = cardId.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    return cleanId.match(/.{1,4}/g)?.join(" ") || cleanId;
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
        dir={dir}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
          <p className="text-gray-700 font-semibold">{t("loading.member")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4" dir={dir}>
      <div className="max-w-4xl mx-auto">
        {/* Top Controls */}
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

        {/* EXPIRED WARNING BANNER */}
        <div className="mb-6 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-6 shadow-2xl border-4 border-red-700 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
              <XCircle className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">
                {t("card.expired.title")}
              </h2>
              <p className="text-red-100 text-sm">
                {t("card.expired.subtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* Header with Logo */}
        <div className="bg-white rounded-t-lg shadow-sm border-b-2 border-red-500 p-6">
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
            <div className="px-4 py-2 rounded-lg font-bold text-sm bg-red-100 text-red-800 border-2 border-red-300">
              <span className="flex items-center gap-2 rtl:flex-row-reverse">
                <XCircle className="w-4 h-4 rtl:transform rtl:scale-x-[-1]" />
                {t("expired")}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white shadow-lg rounded-b-lg overflow-hidden">
          {/* Member ID Banner - Expired Style */}
          <div className="bg-gradient-to-br from-gray-600 to-gray-800 text-white py-6 px-6 relative overflow-hidden opacity-75">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="flex items-start justify-between relative z-10">
              <div className="flex-1">
                <div className="mb-4">
                  <p className="text-xs uppercase tracking-wider opacity-80 mb-1">
                    {t("member.id")}
                  </p>
                  <p className="text-xl font-mono font-bold tracking-widest">
                    {formatMemberId(cardId)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {expiresAt && (
                  <div>
                    <p className="text-xs uppercase tracking-wider opacity-80 mb-1">
                      {t("expired.on")}
                    </p>
                    <p className="text-lg font-mono font-semibold tracking-wider text-red-300">
                      {formatDate(expiresAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="p-8">
            {/* Name Section with Avatar */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-red-200 shadow-md opacity-75">
                  {cardData?.profile_picture_url ? (
                    <img
                      src={cardData.profile_picture_url}
                      alt="Profile"
                      className="w-full h-full object-cover grayscale"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-400">
                      <User className="text-white w-10 h-10" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
                    {t("full.name")}
                  </p>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {cardData?.name || "N/A"}
                  </h2>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Phone */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
                      {t("contact.number")}
                    </p>
                    <p className="text-lg font-bold text-gray-900 break-all ltr-only">
                      {cardData?.phone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Residence */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
                      {t("residence")}
                    </p>
                    <p className="text-lg font-bold text-gray-900 break-words">
                      {cardData?.resident || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Renewal Required Section */}
            <div
              className={`bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 ${
                dir === "rtl" ? "border-r-4" : "border-l-4"
              } border-red-400 mb-6`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wider text-red-500 font-semibold mb-1">
                    {t("account.status")}
                  </p>
                  <p className="text-xl font-bold text-red-600 mb-2">
                    {t("renewal.required")}
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {t("expired.card.message")}
                  </p>
                </div>
              </div>

              {/* Renewal Process Info */}
              <div className="bg-white/60 rounded-lg p-4 border border-red-200 mt-4">
                <p className="text-sm text-gray-600">
                  {t("renewal.process.info")}
                </p>
              </div>
            </div>

            {/* Contact Support Options */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {t("contact.support.renewal")}
              </h3>

              {/* Call Support Button */}
              <a
                href="tel:+9647501234567"
                className="flex items-center gap-3 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold">{t("call.support")}</div>
                  <div className="text-sm text-blue-100 ltr-only">
                    +964 750 123 4567
                  </div>
                </div>
              </a>

              {/* Email Support Button */}
              <a
                href="mailto:support@cardly.com"
                className="flex items-center gap-3 p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold">{t("email.support")}</div>
                  <div className="text-sm text-purple-100 ltr-only">
                    support@cardly.com
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-500">
            {t("questions")}{" "}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              {t("contact.support")}
            </a>
          </p>
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            {t("secured.verified")}
          </p>
        </div>
      </div>
    </div>
  );
}
