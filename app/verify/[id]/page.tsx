import { createClient } from "@/lib/supabase/server";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("discount_cards")
    .select("active")
    .eq("id", id)
    .single();

  if (error || !data) {
    return (
      <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black flex items-center justify-center">
        <div className="bg-red-500 p-6 rounded-lg shadow-md max-w-sm w-full">
          <h2 className="text-xl font-bold mb-4 text-white">Error</h2>
          <p className="text-white">ID not found or error occurred.</p>
        </div>
      </div>
    );
  }

  const isActive = data.active;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black flex items-center justify-center">
      <div className={`p-6 rounded-lg shadow-md max-w-sm w-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}>
        <h2 className="text-xl font-bold mb-4 text-white">Verification</h2>
        <p className="text-white">ID: {id}</p>
        <p className="text-white">Status: {isActive ? 'Active' : 'Inactive'}</p>
      </div>
    </div>
  );
}
