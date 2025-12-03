"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, Phone, MapPin, CheckCircle2, AlertCircle } from "lucide-react";

export default function ActivateCardForm({ cardId }: { cardId: string }) {
  const supabase = createClient();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  function validate() {
    // Name: must not exceed 120 characters
    if (name.trim().length === 0 || name.trim().length > 120) {
      setMessage(
        "Name must not be empty and must be less than or equal to 120 characters."
      );
      return false;
    }

    // Phone: Iraq mobile format: starts with 07, total 11 digits, or with +964 / 964 formats
    const iraqPhoneRegex = /^(07\d{9})$|^(9647\d{9})$|^\+9647\d{9}$/;
    if (!iraqPhoneRegex.test(phone)) {
      setMessage(
        "Invalid Iraq phone number format. Use: 07xxxxxxxxx or +9647xxxxxxxxx"
      );
      return false;
    }

    // Location: must not be empty and reasonable length
    if (location.trim().length === 0 || location.trim().length > 200) {
      setMessage(
        "Location must not be empty and must be less than 200 characters."
      );
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
        location,
        active: true,
      })
      .eq("card_id", cardId);

    if (error) {
      setMessage("Activation failed. Please try again or contact support.");
      setSuccess(false);
    } else {
      setMessage("Card activated successfully! Redirecting...");
      setSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">
              Activate Your Card
            </h2>
            <p className="text-blue-100 text-center text-sm">
              Complete your profile to start enjoying exclusive discounts
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Full Name Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  maxLength={120}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <p className="text-xs text-gray-500">
                {name.length}/120 characters
              </p>
            </div>

            {/* Phone Number Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="07xxxxxxxxx"
                  required
                />
              </div>
              <p className="text-xs text-gray-500">
                Iraqi mobile number (07xxxxxxxxx or +9647xxxxxxxxx)
              </p>
            </div>

            {/* Location Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={location}
                  maxLength={200}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="City, neighborhood, or area"
                  required
                />
              </div>
              <p className="text-xs text-gray-500">
                Where do you live? (e.g., Erbil - Dream City)
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Activating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Activate Card
                </>
              )}
            </button>

            {/* Message Display */}
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

          {/* Footer */}
          <div className="px-8 pb-8">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-gray-600 text-center">
                By activating your card, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
