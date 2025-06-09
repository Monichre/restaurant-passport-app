'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {Button} from '@/components/ui/button'
import {PrizeCard} from './prize-card'
import {QRCodeManager} from '@/app/admin/restaurants/qr-code-manager'
import {Badge} from '@/components/ui/badge'
import Image from 'next/image'
import type {Restaurant, PunchCard} from '@/types/db'
import {PunchCardsList} from './punch-cards-list'

// Define a type for the detailed restaurant with associated data
interface DetailedRestaurant extends Restaurant {
  punchCards: PunchCard[]
  punchCardCount: number
}

interface RestaurantDetailModalProps {
  restaurant: DetailedRestaurant
  isOpen: boolean
  onClose: () => void
}

export function RestaurantDetailModal({
  restaurant,
  isOpen,
  onClose,
}: RestaurantDetailModalProps) {
  if (!restaurant) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold flex items-center gap-2'>
            {restaurant.name}
            <Badge variant='outline' className='ml-2'>
              ID: {restaurant.id.toString()}
            </Badge>
          </DialogTitle>
          <DialogDescription className='text-gray-600'>
            {restaurant.address}
          </DialogDescription>
        </DialogHeader>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-4'>
          {/* Restaurant Image */}
          <div className='relative h-64 rounded-lg overflow-hidden'>
            {restaurant.imageUrl && (
              <Image
                src={restaurant.imageUrl}
                alt={restaurant.name}
                fill
                className='object-cover'
              />
            )}
          </div>

          {/* Restaurant Description */}
          <div>
            <h3 className='text-lg font-semibold mb-2'>About</h3>
            <p className='text-gray-700'>{restaurant.description}</p>

            {/* QR Code */}
            <div className='mt-4'>
              <h3 className='text-lg font-semibold mb-2'>QR Code</h3>
              {restaurant.qrCodeUrl ? (
                <div className='border border-gray-200 rounded-lg p-4 inline-block'>
                  <img
                    src={restaurant.qrCodeUrl}
                    alt='Restaurant QR Code'
                    className='w-32 h-32'
                  />
                </div>
              ) : (
                <p className='text-gray-600'>No QR code generated yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Punch Cards */}
        <div className='mt-6'>
          <h3 className='text-lg font-semibold mb-2'>
            Punch Cards
            <Badge variant='secondary' className='ml-2'>
              {restaurant.punchCards?.length || 0}
            </Badge>
          </h3>
          {restaurant.punchCards && restaurant.punchCards.length > 0 ? (
            <PunchCardsList punchCards={restaurant.punchCards} />
          ) : (
            <p className='text-gray-600'>
              No punch cards for this restaurant yet.
            </p>
          )}
        </div>

        <DialogFooter className='mt-6'>
          <Button variant='outline' onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
