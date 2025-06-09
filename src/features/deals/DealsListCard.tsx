import Image from 'next/image'
import {Card, CardContent} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
import {Separator} from '@/components/ui/separator'
import {Clock, ExternalLink} from 'lucide-react'
import {Deal as DealType} from '@/types/db'
import Link from 'next/link'
import {cn} from '@/lib/utils'

export const DealsListCard = ({deal}: {deal: DealType}) => {
  return (
    <Link
      href={`/restaurants/${deal.restaurantId}`}
      style={{border: '1px dashed #ed8025'}}
      className={cn(
        'block w-full max-w-3xl mx-auto border-2 border-dashed',
        'overflow-hidden rounded-lg',
        'bg-white dark:bg-zinc-900',
        'shadow-md',
        'border border-2 border-yellow-200 dark:border-zinc-800',
        'hover:shadow-md transition-all duration-200'
      )}
    >
      <Card className='w-full  shadow-lg border-2 border-dashed border-[#ed8025]'>
        <CardContent className='p-6'>
          {/* Top Section: Offer Details */}
          <div className='flex flex-col gap-2'>
            <div className='flex justify-between items-center'>
              <h2 className='text-lg font-bold text-gray-800'>
                {' '}
                {deal.title || `${deal.content.substring(0, 40)}...`}
              </h2>
              <Badge
                variant='outline'
                className='bg-green-100 text-green-700 border-green-300 px-2.5 py-0.5 text-xs font-semibold'
              >
                Active
              </Badge>
            </div>
            <p className='text-sm text-gray-600'>{deal?.content}</p>
            <div className='flex justify-between items-center align-middle mt-3'>
              <div className='flex items-center gap-1.5'>
                <Clock className='h-4 w-4 text-red-500' />
                <span className='text-xs text-red-500'>Limited time offer</span>
              </div>
              <a
                href='#'
                className='flex items-center gap-1 text-xs text-blue-600 hover:underline'
              >
                View Restaurant
                <ExternalLink className='h-3.5 w-3.5' />
              </a>
            </div>
          </div>

          <Separator className='my-4' />

          {/* Bottom Section: Restaurant Info */}
          <div className='flex flex-row justify-end align-middle content-center items-center'>
            <div className='mx-4'>
              <h3 className='font-semibold text-gray-800 text-center'>
                {deal?.restaurant?.name}
              </h3>
              <p className='text-xs text-gray-500 text-center'>
                View Restaurant Details
              </p>
            </div>
            <Image
              src={deal?.restaurant?.imageUrl || '/RWP.jpg'}
              alt={deal?.restaurant?.name || 'Restaurant'}
              width={48}
              height={48}
              className='rounded-md object-cover'
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
