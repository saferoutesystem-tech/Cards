import ActivateCard from "@/components/ActivateCard";
import { createClient } from "@/lib/supabase/server";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const id = params?.id as string;

  if (!id) {
    return errorUI("Invalid or missing ID.");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("discount_cards")
    .select("card_id, active")
    .eq("card_id", id)
    .single();

  console.log("Verification data:", { id, data, error });

  if (error || !data) {
    return errorUI("Card not found or error occurred.");
  }

  return resultUI(id, data.active);
}

function errorUI(message: string) {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black flex items-center justify-center">
      <div className="bg-red-500 p-6 rounded-lg shadow-md max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-white">Error</h2>
        <p className="text-white">{message}</p>
      </div>
    </div>
  );
}

function resultUI(id: string, isActive: boolean) {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black flex items-center justify-center">
      {/* <div
        className={`p-6 rounded-lg shadow-md max-w-sm w-full ${
          isActive ? "bg-green-500" : "bg-red-500"
        }`}
      >
        <h2 className="text-xl font-bold mb-4 text-white">Verification</h2>
        <p className="text-white">Card ID: {id}</p>
        <p className="text-white">Status: {isActive ? "Active" : "Inactive"}</p>
      </div> */}
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
