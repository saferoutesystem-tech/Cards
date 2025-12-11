// components/ActivateCard.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { User, Phone, MapPin, CheckCircle2, AlertCircle } from "lucide-react";

export default function ActivateCard({ cardId }: { cardId: string }) {
  const supabase = createClient();
  const { t, dir } = useLanguage();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [resident, setResident] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  function validate() {
    if (name.trim().length === 0 || name.trim().length > 120) {
      setMessage(t("validation.name.empty"));
      return false;
    }

    const iraqPhoneRegex = /^(07\d{9})$|^(9647\d{9})$|^\+9647\d{9}$/;
    if (!iraqPhoneRegex.test(phone)) {
      setMessage(t("validation.phone.invalid"));
      return false;
    }

    if (resident.trim().length === 0 || resident.trim().length > 200) {
      setMessage(t("validation.location.empty"));
      return false;
    }

    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    if (!validate()) return;

    setLoading(true);

    const { error } = await supabase
      .from("discount_cards")
      .update({
        name,
        phone,
        resident,
        active: true,
      })
      .eq("card_id", cardId);

    if (error) {
      setMessage(t("activation.failed"));
      setSuccess(false);
    } else {
      setMessage(t("activation.success"));
      setSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }

    setLoading(false);
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4"
      dir={dir}
    >
      <div className="w-full max-w-md">
        {/* Language Switcher - Positioned at top */}
        <div className="mb-4 flex justify-center">
          <LanguageSwitcher />
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 to-[#1b447a] p-8 text-white">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 rtl:transform rtl:-scale-x-100" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">
              {t("activate.card")}
            </h2>
            <p className="text-blue-100 text-center text-sm">
              {t("activate.subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                {t("full.name")}
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 ${
                    dir === "rtl" ? "right-0 pr-3" : "left-0 pl-3"
                  } flex items-center pointer-events-none`}
                >
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  maxLength={120}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full ${
                    dir === "rtl" ? "pr-10 pl-4" : "pl-10 pr-4"
                  } py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-black`}
                  placeholder={t("enter.full.name")}
                  required
                />
              </div>
              <p className="text-xs text-gray-500">
                {name.length}/120 {t("characters")}
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                {t("phone.number")}
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 ${
                    dir === "rtl" ? "right-0 pr-3" : "left-0 pl-3"
                  } flex items-center pointer-events-none`}
                >
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full ${
                    dir === "rtl" ? "pr-10 pl-4" : "pl-10 pr-4"
                  } py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-black`}
                  placeholder={t("phone.placeholder")}
                  required
                />
              </div>
              <p className="text-xs text-gray-500">{t("phone.hint")}</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                {t("location.label")}
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 ${
                    dir === "rtl" ? "right-0 pr-3" : "left-0 pl-3"
                  } flex items-center pointer-events-none`}
                >
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={resident}
                  maxLength={200}
                  onChange={(e) => setResident(e.target.value)}
                  className={`w-full ${
                    dir === "rtl" ? "pr-10 pl-4" : "pl-10 pr-4"
                  } py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-black`}
                  placeholder={t("location.placeholder")}
                  required
                />
              </div>
              <p className="text-xs text-gray-500">{t("location.hint")}</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-700 to-[#1b447a] text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {/* {t("activating")} */}
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 rtl:transform rtl:-scale-x-100" />
                  {t("activate.button")}
                </>
              )}
            </button>

            {message && (
              <div
                className={`flex items-start gap-3 p-4 rounded-xl ${
                  success
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                {success ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <p
                  className={`text-sm ${
                    success ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {message}
                </p>
              </div>
            )}
          </form>

          <div className="px-8 pb-8">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-gray-600 text-center">
                {t("agree.text")}{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  {t("terms")}
                </a>{" "}
                {t("and")}{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  {t("privacy")}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {t("need.help")}{" "}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              {t("contact.support")}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
