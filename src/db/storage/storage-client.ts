"use client";

import { supabaseBrowserClient } from "@/db/supabase/supabase.client";
import {
  BucketName,
  StorageResponse,
  UploadOptions,
  StorageError,
  StorageErrorCode,
  BUCKET_NAMES,
  ALLOWED_IMAGE_TYPES,
  validatePath,
  validateFileType,
  validateFileSize,
  normalizeFilePath,
  getFileExtension,
} from "./storage-types";

// Client-Side Storage Operations (using browser client)
export const uploadFileClient = async (
  bucket: BucketName,
  path: string,
  file: File,
  options: UploadOptions = {}
): Promise<StorageResponse> => {
  try {
    if (!validatePath(path)) {
      throw new StorageError('Invalid file path', StorageErrorCode.INVALID_PATH);
    }

    if (!validateFileSize(file)) {
      throw new StorageError(
        `File size exceeds maximum allowed size of ${50}MB`,
        StorageErrorCode.FILE_TOO_LARGE
      );
    }

    // Validate file type for images
    if (bucket === BUCKET_NAMES.RESTAURANTS && !validateFileType(file, ALLOWED_IMAGE_TYPES)) {
      throw new StorageError(
        'Invalid file type. Only JPEG, PNG, WebP, and SVG images are allowed.',
        StorageErrorCode.INVALID_FILE_TYPE
      );
    }

    const normalizedPath = normalizeFilePath(path);

    const { data, error } = await supabaseBrowserClient.storage
      .from(bucket)
      .upload(normalizedPath, file, {
        cacheControl: options.cacheControl || '3600',
        upsert: options.upsert || false,
        contentType: options.contentType || file.type,
      });

    if (error) {
      console.error('Upload error:', error);
      throw new StorageError(
        `Failed to upload file: ${error.message}`,
        StorageErrorCode.UPLOAD_FAILED,
        error
      );
    }

    return {
      data,
      error: null,
      success: true,
    };
  } catch (err) {
    console.error('Storage upload error:', err);
    const message = err instanceof StorageError ? err.message : 'Unknown upload error';
    
    return {
      data: null,
      error: message,
      success: false,
    };
  }
};

// Public URL Generation (works for both client and server)
export const getPublicUrl = (bucket: BucketName, path: string): string => {
  if (!validatePath(path)) {
    throw new StorageError('Invalid file path', StorageErrorCode.INVALID_PATH);
  }

  const normalizedPath = normalizeFilePath(path);
  const { data } = supabaseBrowserClient.storage
    .from(bucket)
    .getPublicUrl(normalizedPath);

  return data.publicUrl;
};

// Convenience function for restaurant images (client-side)
export const uploadRestaurantImage = async (
  restaurantId: string,
  file: File,
  imageType: 'logo' | 'banner' | 'gallery' = 'logo'
): Promise<StorageResponse> => {
  const timestamp = Date.now();
  const extension = getFileExtension(file.name);
  const path = `${imageType}s/restaurant-${restaurantId}-${timestamp}.${extension}`;
  
  return uploadFileClient(BUCKET_NAMES.RESTAURANTS, path, file, {
    cacheControl: '3600',
    upsert: true,
  });
}; 