'use client'

import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function VerifyDiscountCard() {
  const searchParams = useSearchParams()
  const [isActive, setIsActive] = useState<boolean | null>(null)

  useEffect(() => {
    const supabase = createClient()

    async function checkCardStatus() {
      const id = searchParams.get('id')
      if (!id) {
        console.error('No ID provided in the query parameters.')
        return
      }

      try {
        const { data, error } = await supabase
          .from('discount_cards')
          .select('active')
          .eq('id', id)
          .single()

        if (error) {
          console.error('Error fetching card status:', error)
          return
        }

        setIsActive(data?.active === true)
      } catch (err) {
        console.error('Error reaching the project:', err)
      }
    }

    checkCardStatus()
  }, [searchParams])

  if (isActive === null) {
    return null // Render nothing while loading
  }

  return (
    <div>
      {isActive ? (
        <h1>Activated</h1>
      ) : (
        <h1>Not Active</h1>
      )}
    </div>
  )
}

