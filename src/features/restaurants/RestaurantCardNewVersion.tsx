import Link from 'next/link'
import Head from 'next/head'
import {restaurants, restaurantDeals} from '@/db/drizzle/schema'
import type {InferSelectModel} from 'drizzle-orm'
import './RestaurantCardNewVersion.css'
import {ArrowUpRight} from 'lucide-react'
import {Card} from '@/components/ui/card'
import Image from 'next/image'

type Restaurant = InferSelectModel<typeof restaurants>
type Deal = InferSelectModel<typeof restaurantDeals>

export type RestaurantWithDeals = Restaurant & {
  deals?: Deal[]
}

interface RestaurantCardProps {
  restaurant: RestaurantWithDeals
  color?: string
  tagColor?: string
}

export function NewRestaurantCard({
  restaurant,
  color = '#d3b19a', // Default color from example
  tagColor = '#d3b19a', // default color
}: RestaurantCardProps) {
  const hasDeals = restaurant.deals && restaurant.deals.length > 0

  return (
    <>
      <Card className='card'>
        <div
          className='card-inner'
          style={{'--clr': color} as React.CSSProperties}
        >
          <div className='box'>
            <div className='imgBox'>
              <Image
                src={restaurant?.imageUrl ?? '/RWP.jpg'}
                alt={restaurant.name}
                width={100}
                height={100}
              />
            </div>
            <div className='icon'>
              <Link href={`/restaurants/${restaurant.id}`} className='iconBox'>
                <ArrowUpRight />
              </Link>
            </div>
          </div>
        </div>
        <div className='content'>
          <h3>{restaurant.name}</h3>
          <p>{restaurant.description}</p>
          {hasDeals && (
            <ul>
              {restaurant.deals!.map((deal) => (
                <li
                  key={deal.id}
                  style={{'--clr-tag': tagColor} as React.CSSProperties}
                >
                  {deal.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </>
  )
}
