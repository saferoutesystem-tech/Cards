import DiscountCardsServer from '@/components/DiscountCardsServer'
import DiscountCardsClient from '@/components/DiscountCardsClient'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-black dark:text-zinc-50">
          Discount Cards
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DiscountCardsServer />
          <DiscountCardsClient />
        </div>
      </main>
    </div>
  );
}
