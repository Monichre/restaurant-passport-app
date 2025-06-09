'use server'

import { uploadFileServer, getPublicUrlServer } from '@/db/storage/storage-server'
import { updateRestaurant } from '@/db/models/restaurants/restaurants'
import { 
  BUCKET_NAMES, 
  validateFileType, 
  validateFileSize, 
  ALLOWED_IMAGE_TYPES, 
  MAX_FILE_SIZE,
  getFileExtension 
} from '@/db/storage/storage-types'

export async function uploadRestaurantImageAction(
  restaurantId: string,
  formData: FormData
) {
  try {
    const file = formData.get('image') as File
    if (!file) {
      return { success: false, error: 'No file provided' }
    }

    // Validate file
    if (!validateFileType(file, ALLOWED_IMAGE_TYPES)) {
      return { 
        success: false, 
        error: 'Invalid file type. Please upload a JPEG, PNG, WebP, or SVG image.' 
      }
    }

    if (!validateFileSize(file, MAX_FILE_SIZE)) {
      return { 
        success: false, 
        error: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
      }
    }

    // Create file path
    const timestamp = Date.now()
    const extension = getFileExtension(file.name)
    const path = `logos/restaurant-${restaurantId}-${timestamp}.${extension}`

    // Upload to server-side storage
    const uploadResult = await uploadFileServer(
      BUCKET_NAMES.RESTAURANTS,
      path,
      file,
      {
        cacheControl: '3600',
        upsert: true,
      }
    )

    if (!uploadResult.success) {
      return { 
        success: false, 
        error: uploadResult.error || 'Failed to upload image' 
      }
    }

    // Generate public URL
    const imagePath = uploadResult.data?.path
    if (!imagePath) {
      return { 
        success: false, 
        error: 'No image path returned from upload' 
      }
    }

    const imageUrl = await getPublicUrlServer(BUCKET_NAMES.RESTAURANTS, imagePath)

    // Update restaurant in database
    const updateResult = await updateRestaurant(BigInt(restaurantId), {
      imageUrl: imageUrl,
    })

    if (!updateResult || updateResult.length === 0) {
      return { 
        success: false, 
        error: 'Failed to update restaurant' 
      }
    }

    return { 
      success: true, 
      data: { 
        imageUrl, 
        restaurant: updateResult[0] 
      } 
    }
  } catch (error) {
    console.error('Image upload server action error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
} 