"use client";

import { useEffect, useState } from "react";
import {
  User,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  Loader2,
  Shield,
  Calendar,
} from "lucide-react";
import Image from "next/image";

interface CardHolder {
  name: string;
  phone: string;
  resident: string;
  active: boolean;
}

export default function CardHolderProfile({
  id,
  initialData,
}: {
  id: string;
  initialData?: Partial<CardHolder>;
}) {
  const [profile, setProfile] = useState<CardHolder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);

        if (
          initialData &&
          initialData.name &&
          initialData.phone &&
          initialData.resident
        ) {
          setProfile(initialData as CardHolder);
          setLoading(false);
          return;
        }

        const { createBrowserClient } = await import("@supabase/ssr");
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data, error } = await supabase
          .from("discount_cards")
          .select("name, phone, resident, active")
          .eq("card_id", id)
          .single();

        if (error || !data) {
          throw new Error("Card not found");
        }

        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProfile();
    }
  }, [id, initialData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#1b447a] animate-spin" />
          <p className="text-gray-700 font-semibold">
            Loading Member Profile...
          </p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full border-l-4 border-red-600">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Access Denied
              </h2>
              <p className="text-gray-600">
                {error || "Card verification failed. Please contact support."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
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
                  Card Holder Profile
                </h1>
                <p className="text-sm text-gray-600">
                  Verified Member Information
                </p>
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
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  ACTIVE
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  INACTIVE
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white shadow-lg rounded-b-lg overflow-hidden">
          {/* Member ID Banner */}
          <div className="bg-[#1b447a] text-white py-4 px-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider opacity-90 mb-1">
                  Member ID
                </p>
                <p className="text-xl font-mono font-bold">{id}</p>
              </div>
              <Shield className="w-10 h-10 opacity-30" />
            </div>
          </div>

          {/* Profile Information Grid */}
          <div className="p-8">
            {/* Name Section */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-[#1b447a] rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
                    Full Name
                  </p>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {profile.name}
                  </h2>
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
                      Contact Number
                    </p>
                    <a
                      href={`tel:${profile.phone}`}
                      className="text-lg font-bold text-[#1b447a] hover:underline break-all"
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
                      Residence
                    </p>
                    <p className="text-lg font-bold text-gray-900 break-words">
                      {profile.resident}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Section */}
            <div className="bg-gray-50 border-l-4 border-[#1b447a] rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    profile.active ? "bg-green-100" : "bg-gray-200"
                  }`}
                >
                  {profile.active ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                    Account Status
                  </p>
                  <p
                    className={`text-xl font-bold mb-2 ${
                      profile.active ? "text-green-600" : "text-gray-600"
                    }`}
                  >
                    {profile.active ? "Active & Verified" : "Inactive Account"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {profile.active
                      ? "This member has full access to all benefits and services."
                      : "Please contact support to activate this account."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {/* <div className="bg-gray-100 px-8 py-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => (window.location.href = `tel:${profile.phone}`)}
                className="flex-1 bg-[#1b447a] text-white font-bold py-4 px-6 rounded-lg hover:bg-[#152f54] transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <Phone className="w-5 h-5" />
                Call Member
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 bg-white text-[#1b447a] font-bold py-4 px-6 rounded-lg hover:bg-gray-50 transition-colors border-2 border-[#1b447a] flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Print Profile
              </button>
            </div>
          </div> */}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            <span className="inline-flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Secured & Verified • Cardly Business Services
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
