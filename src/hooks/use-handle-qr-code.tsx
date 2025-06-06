'use client'

import {
  saveQRCodeUrl,
  saveBulkQRCodeUrls,
} from '@/app/admin/restaurants/actions'
import type {Restaurant} from '@/types/db'
import {useRef, useState, useCallback} from 'react'
import JSZip from 'jszip'
import {saveAs} from 'file-saver'

type QRCodeResult = {
  restaurantId: string
  success: boolean
  qrCodeTargetUrl?: string
}

// Define distinct types for the two modes
type SingleModeProps = {
  restaurant: Restaurant
  mode: 'single'
}

type BulkModeProps = {
  restaurants: Restaurant[]
  mode: 'bulk'
  onSuccess?: () => void
}

// Union type for all possible props
type UseHandleQRCodeProps = SingleModeProps | BulkModeProps

export const useHandleQRCode = (props: UseHandleQRCodeProps) => {
  // Shared state
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get the appropriate properties based on mode
  const isSingleMode = props.mode === 'single'
  const restaurant = isSingleMode ? props.restaurant : null
  const restaurants = !isSingleMode ? props.restaurants : []
  const onSuccess = !isSingleMode ? props.onSuccess : undefined

  // Single mode state
  const [qrCodeValue, setQrCodeValue] = useState<string>(
    restaurant ? getDefaultQrCodeValue(restaurant.id) : ''
  )
  const qrRef = useRef<HTMLDivElement>(null)

  // Bulk mode state
  const [selectedRestaurants, setSelectedRestaurants] = useState<Restaurant[]>(
    []
  )
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<QRCodeResult[]>([])

  // Get default QR code value for a restaurant
  function getDefaultQrCodeValue(
    restaurantId: bigint | number | string
  ): string {
    return `https://experiencemaplegrove.app/restaurants/${restaurantId}`
  }

  // Single mode: Generate QR code and show save/cancel buttons
  const handleGenerate = useCallback(() => {
    if (!isSingleMode || !restaurant) return

    const newQrCodeValue = getDefaultQrCodeValue(restaurant.id)
    setQrCodeValue(newQrCodeValue)
    setGenerating(true)
    setError(null)
    setSuccess(false)
  }, [isSingleMode, restaurant])

  // Single mode: Cancel QR code generation
  const handleCancel = useCallback(() => {
    if (!isSingleMode) return

    setGenerating(false)
    setError(null)
  }, [isSingleMode])

  // Single mode: Download QR code as image
  const handleDownload = useCallback(() => {
    if (!isSingleMode || !restaurant || !qrRef.current) {
      setError('No QR code found to download')
      return
    }

    try {
      // Find the SVG element in the container
      const svgElement = qrRef.current.querySelector('svg')
      if (!svgElement) {
        throw new Error('QR code SVG not found')
      }

      // Ensure white background for better visibility
      svgElement.setAttribute('style', 'background-color: white')

      // Serialize SVG to string
      const svgData = new XMLSerializer().serializeToString(svgElement)

      // Create a blob from SVG data
      const blob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'})
      const url = URL.createObjectURL(blob)

      // Create download link
      const link = document.createElement('a')
      link.href = url
      link.download = `${restaurant.name
        .replace(/\s+/g, '-')
        .toLowerCase()}-qrcode.svg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to download QR code'
      )
    }
  }, [isSingleMode, restaurant])

  // Single mode: Save QR code URL to database
  const handleSave = useCallback(async () => {
    if (!isSingleMode || !restaurant) return

    setSaving(true)
    setError(null)

    try {
      // Save the target URL (not the SVG data)
      const result = await saveQRCodeUrl(restaurant.id.toString(), qrCodeValue)

      if (result?.success) {
        setSuccess(true)
        setGenerating(false)
      } else {
        throw new Error(result?.error || 'Failed to save QR code')
      }
    } catch (error) {
      console.error('Error saving QR code:', error)
      setError(
        error instanceof Error
          ? error.message
          : 'An error occurred while saving the QR code'
      )
    } finally {
      setSaving(false)
    }
  }, [isSingleMode, restaurant, qrCodeValue])

  // Bulk mode: Toggle selection of a restaurant
  const toggleRestaurant = useCallback(
    (restaurant: Restaurant) => {
      if (isSingleMode) return

      setSelectedRestaurants((prev) => {
        const isSelected = prev.some((r) => r.id === restaurant.id)
        if (isSelected) {
          return prev.filter((r) => r.id !== restaurant.id)
        }
        return [...prev, restaurant]
      })
    },
    [isSingleMode]
  )

  // Bulk mode: Select/deselect all restaurants
  const toggleSelectAll = useCallback(
    (restaurants: Restaurant[], select: boolean) => {
      if (isSingleMode) return

      if (select) {
        setSelectedRestaurants(restaurants)
      } else {
        setSelectedRestaurants([])
      }
    },
    [isSingleMode]
  )

  // Bulk mode: Generate QR codes for all selected restaurants
  const handleGenerateAll = useCallback(
    async (restaurants?: Restaurant[]) => {
      if (isSingleMode) return

      const restaurantsToProcess = restaurants || selectedRestaurants
      if (restaurantsToProcess.length === 0) {
        setError('Please select at least one restaurant to generate QR codes')
        return
      }

      setGenerating(true)
      setError(null)
      setSuccess(false)
      setProgress(0)
      setResults([])

      try {
        const generatedResults: QRCodeResult[] = []

        // Process each restaurant
        for (let i = 0; i < restaurantsToProcess.length; i++) {
          const restaurant = restaurantsToProcess[i]
          const targetUrl = getDefaultQrCodeValue(restaurant.id)

          generatedResults.push({
            restaurantId: restaurant.id.toString(),
            success: true,
            qrCodeTargetUrl: targetUrl,
          })

          // Update progress
          setProgress(Math.round(((i + 1) / restaurantsToProcess.length) * 100))
        }

        setResults(generatedResults)

        // If restaurants were passed in, update the internal selection state
        if (restaurants) {
          setSelectedRestaurants(restaurants)
        }
      } catch (error) {
        console.error('Error generating QR codes:', error)
        setError('Failed to generate QR codes')
      }
    },
    [isSingleMode, selectedRestaurants]
  )

  // Bulk mode: Save all generated QR codes to the database
  const handleSaveAll = useCallback(async () => {
    if (isSingleMode) return

    if (results.length === 0) {
      setError('No QR codes have been generated yet')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const bulkData = results.map((result) => ({
        restaurantId: result.restaurantId,
        qrCodeUrl: result.qrCodeTargetUrl || '',
      }))

      // Filter out any entries without target URLs
      const validBulkData = bulkData.filter((data) => data.qrCodeUrl)

      if (validBulkData.length === 0) {
        throw new Error('No valid QR code data to save')
      }

      const saveResult = await saveBulkQRCodeUrls(validBulkData)

      if (saveResult.success) {
        setSuccess(true)
        setResults((prev) =>
          prev.map((item) => {
            const resultItem = saveResult.results.find(
              (r) => r.restaurantId === item.restaurantId
            )
            return {
              ...item,
              success: resultItem ? resultItem.success : false,
            }
          })
        )

        // Call the success callback if provided
        if (onSuccess) {
          onSuccess()
        }
      } else {
        throw new Error('Failed to save QR codes to database')
      }
    } catch (error) {
      console.error('Error saving QR codes:', error)
      setError(
        error instanceof Error
          ? error.message
          : 'An error occurred while saving QR codes'
      )
    } finally {
      setSaving(false)
    }
  }, [isSingleMode, results, onSuccess])

  // Bulk mode: Download all generated QR codes
  const handleDownloadAll = useCallback(async () => {
    if (isSingleMode) return

    if (results.length === 0) {
      setError('No QR codes available to download')
      return
    }

    try {
      const zip = new JSZip()
      const qrFolder = zip.folder('qr-codes')

      if (!qrFolder) {
        throw new Error('Failed to create folder in ZIP')
      }

      let successCount = 0
      for (const result of results) {
        if (!result.qrCodeTargetUrl || !result.success) continue

        const restaurant = selectedRestaurants.find(
          (r) => r.id.toString() === result.restaurantId
        )
        if (!restaurant) continue

        // Create a text file with the QR code target URL
        // This is useful for scanning with a QR code reader
        const fileName = `${restaurant.name
          .replace(/\s+/g, '-')
          .toLowerCase()}-qrcode-url.txt`
        qrFolder.file(fileName, result.qrCodeTargetUrl)
        successCount++
      }

      // Generate the ZIP file
      const content = await zip.generateAsync({type: 'blob'})
      saveAs(content, 'restaurant-qr-codes.zip')

      if (successCount === 0) {
        setError('Failed to package any QR codes')
      }
    } catch (error) {
      console.error('Error downloading QR codes:', error)
      setError(
        `Failed to download QR codes: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }, [isSingleMode, results, selectedRestaurants])

  // Bulk mode: Reset the state
  const handleReset = useCallback(() => {
    if (isSingleMode) return

    setSelectedRestaurants([])
    setGenerating(false)
    setSaving(false)
    setSuccess(false)
    setError(null)
    setProgress(0)
    setResults([])
  }, [isSingleMode])

  // Return appropriate props based on mode
  if (isSingleMode) {
    return {
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

  return {
    selectedRestaurants,
    generating,
    saving,
    success,
    error,
    progress,
    results,
    toggleSelectAll,
    toggleRestaurant,
    handleGenerateAll,
    handleSaveAll,
    handleDownloadAll,
    handleReset,
  }
}
