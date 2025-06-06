'use client'

import React, {useState, useRef, useCallback} from 'react'
import type {Restaurant} from '@/types/db'
import {saveQRCodeUrl} from '@/app/admin/restaurants/actions'
import {QRCodeSVG} from 'qrcode.react'
import {AlertCircle, Check, Download, XCircle} from 'lucide-react'
import clsx from 'clsx'
import {Button} from '@/components/ui/button'

export interface QRCodeGeneratorProps {
  restaurant: {
    id: bigint
    name: string
    qrCodeUrl?: string | null
    [key: string]: any // Allow any other properties
  }
  onUpdate?: (updatedRestaurant?: any) => void
  className?: string
  variant?: 'default' | 'compact' | 'table'
}

/**
 * QR Code Generator component for restaurants
 * Provides functionality to generate, download, and save QR codes
 */
export function QRCodeGenerator({
  restaurant,
  onUpdate,
  className,
  variant = 'default',
}: QRCodeGeneratorProps) {
  // State for QR code generation
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // This is the target URL the QR code points to
  const [qrCodeTargetUrl, setQrCodeTargetUrl] = useState<string>(
    restaurant.qrCodeUrl || getDefaultTargetUrl(restaurant.id)
  )

  const qrRef = useRef<HTMLDivElement>(null)

  // Get default target URL for a restaurant
  function getDefaultTargetUrl(restaurantId: bigint | number | string): string {
    return `https://experiencemaplegrove.app/restaurants/${restaurantId}`
  }

  // Generate QR code with the restaurant ID
  const handleGenerate = useCallback(() => {
    const newTargetUrl = getDefaultTargetUrl(restaurant.id)
    setQrCodeTargetUrl(newTargetUrl)
    setGenerating(true)
    setError(null)
    setSuccess(false)
  }, [restaurant.id])

  // Cancel QR code generation
  const handleCancel = () => {
    setGenerating(false)
    setError(null)
  }

  // Download QR code as image
  const handleDownload = () => {
    try {
      if (!qrRef.current) {
        throw new Error('QR code container not found')
      }

      // Find SVG in container
      const svgElement = qrRef.current.querySelector('svg')
      if (!svgElement) {
        throw new Error('QR code SVG not found')
      }

      // Set white background for better visibility
      svgElement.setAttribute('style', 'background-color: white')

      // Serialize SVG to string
      const svgData = new XMLSerializer().serializeToString(svgElement)

      // Create data URL from SVG
      const blob = new Blob([svgData], {type: 'image/svg+xml'})
      const url = URL.createObjectURL(blob)

      // Create and download the image
      const link = document.createElement('a')
      link.href = url
      link.download = `qrcode-${restaurant.name
        .replace(/\s+/g, '-')
        .toLowerCase()}.svg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download error:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to download QR code'
      )
    }
  }

  // Save QR code to database
  const handleSave = useCallback(async () => {
    setSaving(true)
    setError(null)

    try {
      // Save the target URL to the database
      const result = await saveQRCodeUrl(
        restaurant.id.toString(),
        qrCodeTargetUrl
      )

      if (result?.success) {
        setSuccess(true)
        setGenerating(false)
        // Call onUpdate callback if provided, passing the updated restaurant
        if (onUpdate && result.restaurant) {
          onUpdate(result.restaurant)
        }
      } else {
        throw new Error(result?.error || 'Failed to save QR code')
      }
    } catch (error) {
      console.error('Error saving QR code:', error)
      setError('An error occurred while saving the QR code')
    } finally {
      setSaving(false)
    }
  }, [restaurant.id, qrCodeTargetUrl, onUpdate])

  // Render compact variant
  if (variant === 'compact' || variant === 'table') {
    return (
      <div className={clsx('space-y-2', className)}>
        {/* QR Code Display */}
        {restaurant.qrCodeUrl && !generating ? (
          <div className='flex flex-col items-center'>
            <div className='bg-white p-2 rounded-md shadow-sm'>
              <QRCodeSVG value={restaurant.qrCodeUrl} size={100} />
            </div>
            <div className='flex space-x-2 mt-2'>
              <button
                type='button'
                onClick={handleGenerate}
                className='text-xs bg-blue-500 text-white rounded px-2 py-1 hover:bg-blue-600'
              >
                New
              </button>
              <button
                type='button'
                onClick={handleDownload}
                className='text-xs bg-gray-100 text-gray-700 rounded px-2 py-1 hover:bg-gray-200 flex items-center'
              >
                <Download className='w-3 h-3 mr-1' />
                Download
              </button>
            </div>
          </div>
        ) : (
          <>
            {generating ? (
              <div className='flex flex-col items-center'>
                {/* QR Code Preview */}
                <div
                  ref={qrRef}
                  className='bg-white p-2 rounded-md shadow-sm'
                  data-qr-container='true'
                >
                  <QRCodeSVG value={qrCodeTargetUrl} size={100} />
                </div>

                {/* Action Buttons */}
                <div className='flex space-x-2 mt-2'>
                  <button
                    type='button'
                    onClick={handleSave}
                    disabled={saving}
                    className='text-xs bg-green-500 text-white rounded px-2 py-1 hover:bg-green-600 disabled:bg-green-300'
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type='button'
                    onClick={handleCancel}
                    disabled={saving}
                    className='text-xs bg-gray-100 text-gray-700 rounded px-2 py-1 hover:bg-gray-200 disabled:bg-gray-50'
                  >
                    Cancel
                  </button>
                </div>

                {/* Status Messages */}
                {error && (
                  <div className='flex items-center text-red-500 text-xs mt-1'>
                    <AlertCircle className='w-3 h-3 mr-1' />
                    {error}
                  </div>
                )}
                {success && (
                  <div className='flex items-center text-green-500 text-xs mt-1'>
                    <Check className='w-3 h-3 mr-1' />
                    QR code saved
                  </div>
                )}
              </div>
            ) : (
              <div className='flex flex-col items-center'>
                <div className='bg-gray-100 p-2 rounded-md h-full flex flex-col items-center justify-center'>
                  <h3 className='text-gray-400 text-xs text-center flex'>
                    <AlertCircle className='w-4 h-4 mr-1' />
                    <span>No QR code</span>
                  </h3>

                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleGenerate}
                    className='text-xs bg-black text-white rounded px-2 py-1 hover:bg-white hover:text-black mt-2'
                  >
                    Generate QR
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  // Default (full) variant
  return (
    <div className={clsx('rounded-lg border p-4', className)}>
      <h3 className='text-lg font-medium mb-4'>QR Code</h3>

      {/* QR Code Display or Generator */}
      <div className='space-y-4'>
        {restaurant.qrCodeUrl && !generating ? (
          <div className='flex flex-col items-center'>
            <div className='bg-white p-4 rounded-md shadow-sm mb-3'>
              <QRCodeSVG value={restaurant.qrCodeUrl} size={200} />
            </div>
            <div className='flex space-x-3'>
              <button
                type='button'
                onClick={handleGenerate}
                className='bg-blue-500 text-white rounded-md px-3 py-2 hover:bg-blue-600'
              >
                Generate New
              </button>
              <button
                type='button'
                onClick={handleDownload}
                className='bg-gray-100 text-gray-700 rounded-md px-3 py-2 hover:bg-gray-200 flex items-center'
              >
                <Download className='w-4 h-4 mr-2' />
                Download
              </button>
            </div>
          </div>
        ) : (
          <>
            {generating ? (
              <div className='flex flex-col items-center'>
                {/* QR Code Preview */}
                <div
                  ref={qrRef}
                  className='bg-white p-4 rounded-md shadow-sm mb-4'
                  data-qr-container='true'
                >
                  <QRCodeSVG value={qrCodeTargetUrl} size={200} />
                </div>

                {/* Action Buttons */}
                <div className='flex space-x-3'>
                  <button
                    type='button'
                    onClick={handleSave}
                    disabled={saving}
                    className='bg-green-500 text-white rounded-md px-3 py-2 hover:bg-green-600 disabled:bg-green-300 flex items-center'
                  >
                    {saving ? 'Saving...' : 'Save QR Code'}
                  </button>
                  <button
                    type='button'
                    onClick={handleCancel}
                    disabled={saving}
                    className='bg-gray-100 text-gray-700 rounded-md px-3 py-2 hover:bg-gray-200 disabled:bg-gray-50'
                  >
                    Cancel
                  </button>
                </div>

                {/* Status Messages */}
                {error && (
                  <div className='flex items-center text-red-500 mt-3'>
                    <AlertCircle className='w-4 h-4 mr-2' />
                    {error}
                  </div>
                )}
                {success && (
                  <div className='flex items-center text-green-500 mt-3'>
                    <Check className='w-4 h-4 mr-2' />
                    QR code successfully saved!
                  </div>
                )}
              </div>
            ) : (
              <div className='text-center'>
                <div className='bg-gray-100 p-4 rounded-md w-48 h-48 mx-auto flex items-center justify-center mb-4'>
                  <p className='text-gray-400'>No QR code generated</p>
                </div>
                <button
                  type='button'
                  onClick={handleGenerate}
                  className='bg-blue-500 text-white rounded-md px-3 py-2 hover:bg-blue-600'
                >
                  Generate QR Code
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
