'use client'

import type React from 'react'
import {useState, useCallback} from 'react'
import type {Restaurant} from '@/types/db'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog'
import {Button} from '@/components/ui/button'
import {QrCode} from 'lucide-react'
import {QRCodeGenerator} from '@/components/qr-code/qr-code-generator'

type QRCodeVariant = 'default' | 'compact' | 'table'

interface QRCodeManagerProps {
  restaurant: Restaurant
  variant?: QRCodeVariant
  onUpdate?: (updatedRestaurant?: any) => void
}

export function QRCodeManager({
  restaurant,
  variant = 'default',
  onUpdate,
}: QRCodeManagerProps) {
  // Handle QR code update
  const handleQRCodeUpdate = useCallback(
    (updatedRestaurant: any) => {
      if (onUpdate) {
        onUpdate(updatedRestaurant)
      }
    },
    [onUpdate]
  )

  // Compact variant for table cells
  if (variant === 'table') {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            className='flex items-center gap-1 px-2 h-8 touch-manipulation'
          >
            {restaurant.qrCodeUrl ? 'View QR' : 'Create QR'}
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-md p-6'>
          <DialogHeader>
            <DialogTitle>
              {restaurant.qrCodeUrl
                ? 'Restaurant QR Code'
                : 'Create Restaurant QR Code'}
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            <QRCodeGenerator
              restaurant={restaurant}
              variant='compact'
              onUpdate={handleQRCodeUpdate}
            />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Compact variant for smaller spaces
  if (variant === 'compact') {
    return (
      <div className='flex flex-col sm:flex-row gap-2 items-center'>
        <QRCodeGenerator
          restaurant={restaurant}
          variant='compact'
          onUpdate={handleQRCodeUpdate}
        />
      </div>
    )
  }

  // Default full-featured variant
  return (
    <div className='w-full max-w-md'>
      <QRCodeGenerator
        restaurant={restaurant}
        variant='default'
        onUpdate={handleQRCodeUpdate}
      />
    </div>
  )
}
