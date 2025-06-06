'use client'

import {saveQRCodeUrl} from '@/app/admin/restaurants/actions'
import type {Restaurant} from '@/types/db'
import {useRef, useState, useCallback} from 'react'

export function useQRCodeGenerator(restaurant: Restaurant) {
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(
    restaurant.qrCodeUrl || null
  )
  const [qrCodeValue, setQrCodeValue] = useState<string>(
    `https://experiencemaplegrove.app/restaurants/${restaurant.id}`
  )
  const qrRef = useRef<HTMLDivElement>(null)

  // Generate QR code and show save/cancel buttons
  const handleGenerate = useCallback(() => {
    setQrCodeValue(`https://experiencemaplegrove.app/restaurants/${restaurant.id}`)
    setGenerating(true)
    setError(null)
    setSuccess(false)
  }, [restaurant.id])

  // Cancel QR code generation
  const handleCancel = useCallback(() => {
    setGenerating(false)
    setError(null)
  }, [])

  // Download QR code as image
  const handleDownload = useCallback(() => {
    if (!qrCodeDataUrl && !qrRef.current) {
      setError('No QR code found to download')
      return
    }

    try {
      // If we already have a data URL, use it
      let dataUrl = qrCodeDataUrl

      // Otherwise, try to generate one from the current SVG
      if (!dataUrl && qrRef.current) {
        const svgElement = qrRef.current.querySelector('svg')
        if (!svgElement) {
          throw new Error('QR code SVG not found')
        }

        // Clone and prepare SVG for download
        const clonedSvg = svgElement.cloneNode(true) as SVGElement
        clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

        // Ensure dimensions are set
        if (!clonedSvg.hasAttribute('width')) {
          clonedSvg.setAttribute('width', '200')
        }
        if (!clonedSvg.hasAttribute('height')) {
          clonedSvg.setAttribute('height', '200')
        }

        // Add white background
        clonedSvg.setAttribute('style', 'background-color: white')

        // Serialize the SVG
        const svgData = new XMLSerializer().serializeToString(clonedSvg)
        dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
          svgData
        )}`
      }

      if (!dataUrl) {
        throw new Error('Failed to generate QR code data URL')
      }

      // Create an anchor to trigger download
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `${restaurant.name
        .replace(/\s+/g, '-')
        .toLowerCase()}-qrcode.svg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Download failed:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to download QR code'
      )
    }
  }, [qrCodeDataUrl, restaurant.name])

  // Save QR code URL to database
  const handleSave = useCallback(async () => {
    setSaving(true)
    setError(null)

    try {
      // Make sure we have a valid QR code to save
      if (!qrRef.current) {
        throw new Error('QR code container not found')
      }

      // Get the SVG element
      const svgElement = qrRef.current.querySelector('svg')
      if (!svgElement) {
        throw new Error('QR code SVG not found')
      }

      // Clone and prepare SVG for saving
      const clonedSvg = svgElement.cloneNode(true) as SVGElement
      clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

      // Ensure dimensions are set
      if (!clonedSvg.hasAttribute('width')) {
        clonedSvg.setAttribute('width', '200')
      }
      if (!clonedSvg.hasAttribute('height')) {
        clonedSvg.setAttribute('height', '200')
      }

      // Add white background
      clonedSvg.setAttribute('style', 'background-color: white')

      const svgData = new XMLSerializer().serializeToString(clonedSvg)

      // Generate data URL
      let dataUrl: string
      try {
        // Modern approach - safer for all characters
        const blob = new Blob([svgData], {type: 'image/svg+xml'})
        dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
      } catch (blobError) {
        // Fallback to base64 encoding
        console.warn('Blob approach failed, falling back to base64:', blobError)
        dataUrl = `data:image/svg+xml;base64,${btoa(
          unescape(encodeURIComponent(svgData))
        )}`
      }

      console.log('About to save QR code URL', {
        restaurantId: restaurant.id.toString(),
        dataUrlLength: dataUrl.length,
      })

      // Save to database
      const result = await saveQRCodeUrl(restaurant.id.toString(), dataUrl)

      console.log('Save result:', result)

      if (result?.success) {
        setSuccess(true)
        setGenerating(false)
        setQrCodeDataUrl(dataUrl)
      } else {
        throw new Error(result?.error || 'Failed to save QR code')
      }
    } catch (err) {
      console.error('Save error:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while saving the QR code'
      )
    } finally {
      setSaving(false)
    }
  }, [restaurant.id])

  return {
    qrCodeDataUrl,
    qrCodeValue,
    handleGenerate,
    handleCancel,
    handleDownload,
    handleSave,
    generating,
    saving,
    success,
    error,
    qrRef,
  }
}
