'use client'

import {useHandleQRCode} from './use-handle-qr-code'
import type {Restaurant} from '@/types/db'
import {useCallback, useEffect} from 'react'

interface BulkQRCodeOptions {
  onSuccess?: () => void
}

export const useHandleBulkQRCode = (options?: BulkQRCodeOptions) => {
  const qrCodeHook = useHandleQRCode({mode: 'bulk'})

  // Wrap the handleSaveAll method to call the onSuccess callback
  const originalHandleSaveAll = qrCodeHook.handleSaveAll

  const handleSaveAll = useCallback(async () => {
    // Check if originalHandleSaveAll exists before calling it
    if (originalHandleSaveAll) {
      await originalHandleSaveAll()
    }
  }, [originalHandleSaveAll])

  // Use an effect to monitor the success state and call onSuccess when appropriate
  useEffect(() => {
    if (qrCodeHook.success && options?.onSuccess) {
      // Call onSuccess when saving is complete and successful
      options.onSuccess()
    }
  }, [qrCodeHook.success, options])

  return {
    ...qrCodeHook,
    handleSaveAll,
  }
}
