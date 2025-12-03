"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import ActivateCard from "@/components/ActivateCard";

export default function VerifyPage({ searchParams }: any) {
  const id = searchParams?.id as string;

  const [loading, setLoading] = useState(true);
  const [cardData, setCardData] = useState<null | { active: boolean }>(null);
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

      const { data, error } = await supabase
        .from("discount_cards")
        .select("active")
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

  if (loading) {
    return uiContainer(<p className="text-white">Loading…</p>);
  }

  if (error) {
    return errorUI(error);
  }

  return resultUI(id, cardData!.active);
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

function resultUI(id: string, isActive: boolean) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
      {!isActive ? (
        <ActivateCard cardId={id} />
      ) : (
        <div className="p-6 rounded-lg shadow-md max-w-sm w-full bg-green-500">
          <h2 className="text-xl font-bold mb-4 text-white">Verification</h2>
          <p className="text-white">Card ID: {id}</p>
          <p className="text-white">Status: Active</p>
        </div>
      )}
    </div>
  );
}
