"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ActivateCardForm({ cardId }: { cardId: string }) {
  const supabase = createClient();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
      setMessage("Invalid Iraq phone number format.");
      return false;
    }

    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!validate()) return;

    setLoading(true);

    const { error } = await supabase
      .from("discount_cards")
      .update({
        name,
        phone,
        active: true,
      })
      .eq("card_id", cardId);

    if (error) {
      setMessage("Activation failed. Try again.");
    } else {
      setMessage("Card activated successfully. Redirecting...");
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto p-4 border rounded-lg shadow"
    >
      <h2 className="text-lg font-semibold mb-4">Activate Your Card</h2>

      <div className="mb-3">
        <label className="block text-sm mb-1">Full Name</label>
        <input
          type="text"
          value={name}
          maxLength={120}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Your full name"
          required
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm mb-1">Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="0770xxxxxxx or +9647xxxxxxxx"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded bg-blue-600 text-white disabled:bg-gray-400"
      >
        {loading ? "Activating..." : "Activate Card"}
      </button>

      {message && <p className="mt-3 text-sm">{message}</p>}
    </form>
  );
}
