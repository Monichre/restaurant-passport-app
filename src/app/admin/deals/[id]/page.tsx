import {DealDetail, EditDealForm} from '@/components/admin/deals'
import {getDealById} from '@/db'

import {EditDealModal} from '@/app/admin/deals/edit-deal-modal'

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{id: string}>
}) {
  const resolved = await params

  console.log('🚀 ~ resolved:', resolved)

  const dealData: any = await getDealById(BigInt(resolved.id))

  console.log('🚀 ~ dealData:', dealData)

  if (!dealData) {
    return (
      <div className='space-y-6'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div className='space-y-2'>
            <div className='h-8 w-48 bg-gray-200 rounded animate-pulse'></div>
            <div className='h-5 w-64 bg-gray-200 rounded animate-pulse'></div>
          </div>
          <div className='h-10 w-24 bg-gray-200 rounded animate-pulse'></div>
        </div>
        <div className='h-96 bg-gray-200 rounded animate-pulse'></div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Deal Details</h2>
          <p className='text-muted-foreground'>
            View and manage details for this deal
          </p>
        </div>
        <div className='flex items-center gap-2'></div>
      </div>

      <DealDetail deal={dealData} id={dealData.id} />
      <EditDealModal deal={dealData} id={dealData.id} />
    </div>
  )
}
