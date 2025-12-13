"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import ActivateCard from "@/components/ActivateCard";
import CardHolderProfile from "@/components/CardHolderProfile";
import ExpiredCardScreen from "@/components/ExpiredCardScreen";

interface CardData {
  active: boolean;
  name?: string;
  phone?: string;
  resident?: string;
  activated_at?: string;
  expires_at?: string;
}

export default function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = use(searchParams);
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!id) {
        setError("Invalid or missing ID.");
        setLoading(false);
        return;
      }

      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Fetch all data including expiry fields
      const { data, error } = await supabase
        .from("discount_cards")
        .select("active, name, phone, resident, activated_at, expires_at")
        .eq("card_id", id)
        .single();

      if (error || !data) {
        setError("Card not found.");
      } else {
        setCardData(data);
      }

      setLoading(false);
    }

    load();
  }, [id]);

  if (loading) return uiContainer(<p className="text-white">Loading…</p>);
  if (error) return errorUI(error);

  // Check if card is expired
  const isExpired = cardData?.expires_at 
    ? new Date(cardData.expires_at) < new Date() 
    : false;

  return resultUI(id, cardData!, isExpired);
}

function uiContainer(content: any) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="p-6 rounded-lg shadow-md max-w-sm w-full bg-blue-500">
        {content}
      </div>
    </div>
  );
}

function errorUI(message: string) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="bg-red-500 p-6 rounded-lg shadow-md max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-white">Error</h2>
        <p className="text-white">{message}</p>
      </div>
    </div>
  );
}

function resultUI(id: string, cardData: CardData, isExpired: boolean) {
  // If card is expired, show expired screen (cannot reactivate)
  if (isExpired) {
    return <ExpiredCardScreen cardId={id} expiryDate={cardData.expires_at} />;
  }

  // If card is not active yet, show activation form
  if (!cardData.active) {
    return <ActivateCard cardId={id} />;
  }

  // If card is active and not expired, show profile
  return <CardHolderProfile id={id} initialData={cardData} />;
}