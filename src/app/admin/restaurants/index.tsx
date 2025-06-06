// Import the BulkQRCodeManager component
import {getRestaurants} from '@/db/models/restaurants'
import {PageHeader} from './dummy-components'
import {Button} from '@/components/ui/button'
import {PlusCircle} from 'lucide-react'
import {AddRestaurantDialog} from './dummy-components'
import {SelectableRestaurantsTable} from './selectable-restaurants-table'
import type {Restaurant} from '@/types/db'

export default async function RestaurantsPage() {
  // Fetch restaurants from the database
  const restaurantsData = await getRestaurants()

  // Process the data to ensure it matches the Restaurant type
  // We need to do this two-step approach to handle the type safely
  const restaurants = restaurantsData.map((restaurant) => {
    // First cast to unknown to avoid TypeScript errors
    const processedData = {
      id: restaurant.id,
      name: restaurant.name || 'Unknown Restaurant',
      description: restaurant.description || 'No description available',
      imageUrl: restaurant.imageUrl || '/placeholder.jpg',
      address: restaurant.address || 'No address provided',
      qrCodeUrl: restaurant.qrCodeUrl || null,
      // For arrays that might not match the expected type exactly,
      // create empty arrays as a safe default
      deals: [],

      punchCards: [],
      // Include scalar counts directly
      punchCardCount: restaurant.punchCardCount || 0,
      dealCount: restaurant.dealCount || 0,
    }

    // Then cast to Restaurant type
    return processedData as unknown as Restaurant
  })

  return (
    <div className='container py-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <PageHeader
          heading='Restaurants'
          subheading='Manage all participating restaurants'
        />

        <AddRestaurantDialog>
          <Button className='flex items-center gap-2'>
            <PlusCircle className='h-4 w-4' />
            <span>Add Restaurant</span>
          </Button>
        </AddRestaurantDialog>
      </div>

      <SelectableRestaurantsTable restaurants={restaurants} />
    </div>
  )
}
