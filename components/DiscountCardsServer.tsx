import { createClient } from "@/lib/supabase/server";

export default async function DiscountCardsServer() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("discount_cards").select("*");

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold mb-2">
          Error loading discount cards:
        </h3>
        <p className="text-red-600 text-sm mb-2">{error.message}</p>
        <p className="text-red-500 text-xs">Code: {error.code || "N/A"}</p>
        <p className="text-red-500 text-xs">
          Details: {error.details || "N/A"}
        </p>
        <p className="text-red-500 text-xs">Hint: {error.hint || "N/A"}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
      <h2 className="text-2xl font-bold mb-4 text-black dark:text-zinc-50">
        Discount Cards (Server Component)
      </h2>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
        Found: {data?.length || 0} card(s)
      </p>

      {data && data.length > 0 ? (
        <div className="space-y-4">
          {data.map((card: Record<string, unknown>, index: number) => (
            <div
              key={(card.id as string) || `card-${index}`}
              className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700"
            >
              <pre className="text-sm text-zinc-700 dark:text-zinc-300 overflow-x-auto">
                {JSON.stringify(card, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 font-semibold">
            No discount cards found.
          </p>
        </div>
      )}
    </div>
  );
}
