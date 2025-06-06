import {NewDealForm} from '@/components/admin/deals/new-deal-form'
import {getRestaurants} from '@/db/models/restaurants'

export const metadata = {
  title: 'Admin - Add New Deal',
  description: 'Create a new restaurant deal or offer',
}

export default async function NewDealPage() {
  const restaurants = await getRestaurants()
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>Add New Deal</h2>
        <p className='text-muted-foreground'>
          Create a new deal or special offer for a restaurant
        </p>
      </div>

      <div className='bg-white rounded-lg shadow-sm p-6'>
        <NewDealForm restaurants={restaurants} />
      </div>
    </div>
  )
}
