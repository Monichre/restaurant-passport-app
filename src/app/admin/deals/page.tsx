import {AdminDealsInterface} from '@/components/admin/deals/admin-deals-interface'
import {DealFilters} from '@/components/admin/deals/deal-filters'
import {DealsTable} from '@/components/admin/deals/deals-table'
import {getDeals} from '@/db/models/deals'
import {getRestaurants} from '@/db/models/restaurants/restaurants'
import {Suspense} from 'react'

export const metadata = {
  title: 'Admin - Deals Management',
  description: 'Manage restaurant deals and offers',
}

export default async function DealsAdminPage() {
  const deals = await getDeals()

  const restaurants = await getRestaurants()
  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Deals Management
          </h2>
          <p className='text-muted-foreground'>
            View and manage special deals and offers for restaurants
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <a
            href='/admin/deals/new'
            className='inline-flex h-10 items-center justify-center rounded-md bg-[#818cf8] px-4 py-2 text-sm font-medium text-white hover:bg-[#6366f1] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          >
            Add New Deal
          </a>
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <DealFilters restaurants={restaurants} />
        <DealsTable deals={deals} />
      </Suspense>
    </div>
  )
}
