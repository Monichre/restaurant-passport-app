import {DealFilters} from '@/components/admin/deals/deal-filters'
import {DealsTable} from '@/components/admin/deals/deals-table'

import {getDeals} from '@/db/models/deals'
import {getRestaurants} from '@/db/models/restaurants'

export const AdminDealsInterface = async () => {
  const deals = await getDeals()

  const restaurants = await getRestaurants()
  return (
    <>
      <DealFilters restaurants={restaurants} deals={deals} />
      <DealsTable deals={deals} />
    </>
  )
}
