import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/server";

// Load client component only on the client
const ActivateCard = dynamic(() => import("@/components/ActivateCard"), {
  ssr: false,
});

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const id = params?.id as string;

  if (!id) return errorUI("Invalid or missing ID.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("discount_cards")
    .select("card_id, active")
    .eq("card_id", id)
    .single();

  if (error || !data) return errorUI("Card not found.");

  return resultUI(id, data.active);
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
