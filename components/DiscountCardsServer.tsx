import { createClient } from '@/lib/supabase/server'

export default async function DiscountCardsServer() {
  const supabase = await createClient()
  
  // Try both table names in case there's a typo
  const { data: discountCards, error } = await supabase
    .from('discount_cards')
    .select('*')

  // If that fails, try the original table name
  let finalData = discountCards
  let finalError = error
  
  if (error && (error.message.includes('relation') || error.message.includes('does not exist'))) {
    const { data: altData, error: altError } = await supabase
      .from('discounte_cards')
      .select('*')
    if (!altError) {
      finalData = altData
      finalError = null
    }
  }

  if (finalError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold mb-2">Error loading discount cards:</h3>
        <p className="text-red-600 text-sm mb-2">{finalError.message}</p>
        <p className="text-red-500 text-xs">Code: {finalError.code || 'N/A'}</p>
        <p className="text-red-500 text-xs">Details: {finalError.details || 'N/A'}</p>
        <p className="text-red-500 text-xs">Hint: {finalError.hint || 'N/A'}</p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
      <h2 className="text-2xl font-bold mb-4 text-black dark:text-zinc-50">
        Discount Cards (Server Component)
      </h2>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
        Found: {finalData?.length || 0} card(s)
      </p>
      {finalData && finalData.length > 0 ? (
        <div className="space-y-4">
          {finalData.map((card: Record<string, unknown>, index: number) => (
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
          <p className="text-yellow-800 font-semibold">No discount cards found.</p>
          <p className="text-yellow-600 text-sm mt-2">
            This could mean:
          </p>
          <ul className="text-yellow-600 text-sm mt-1 list-disc list-inside">
            <li>The table is empty</li>
            <li>Row Level Security (RLS) is blocking access</li>
            <li>The table name might be different</li>
          </ul>
        </div>
      )}
    </div>
  )
}

