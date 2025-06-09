import {DealsList, DealsListSkeleton} from '@/features/deals'

import {Suspense} from 'react'

import {DealsHero} from './DealsHero'
import {getActiveDeals} from '@/db/models/deals'
export const metadata = {
  title: 'Special Deals | Restaurant Passport',
  description:
    'View all current special offers and deals from our partner restaurants',
}

export default async function DealsPage() {
  const deals = await getActiveDeals()

  console.log('🚀 ~ DealsPage ~ deals:', deals)

  return (
    <Suspense fallback={<DealsListSkeleton />}>
      <DealsHero>
        <DealsList deals={deals} />
      </DealsHero>
    </Suspense>
  )
}
