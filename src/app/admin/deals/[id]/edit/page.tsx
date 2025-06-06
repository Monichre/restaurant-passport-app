import {notFound} from 'next/navigation'
import {EditDealForm} from '@/components/admin/deals'
import {getDeals} from '@/db/models/deals'

export const metadata = {
  title: 'Admin - Edit Deal',
  description: 'Edit an existing restaurant deal or offer',
}

export default async function EditDealPage({
  params,
}: {
  params: Promise<{id: string}>
}) {
  const resolvedParams = await params

  // Fetch the deal data
  const deals = await getDeals()
  const deal = deals.find((deal) => deal.id === BigInt(resolvedParams.id))

  // If the deal doesn't exist, show 404
  if (!deal) {
    notFound()
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>Edit Deal</h2>
        <p className='text-muted-foreground'>
          Update details for this restaurant deal
        </p>
      </div>

      <div className='bg-white rounded-lg shadow-sm p-6'>
        <EditDealForm id={resolvedParams.id} deal={deal} />
      </div>
    </div>
  )
}
