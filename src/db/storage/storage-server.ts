"use server";

import { createSupabaseServerClient } from "@/db/supabase/supabase.server";
import { createSupabaseServiceClient } from "@/db/supabase/supabase.client";
import {
  BucketName,
  StorageResponse,
  UploadOptions,
  ListOptions,
  FileObject,
  StorageError,
  StorageErrorCode,
  validatePath,
  normalizeFilePath,
} from "./storage-types";

// Server-Side Storage Operations (using service client for admin operations)
export const uploadFileServer = async (
  bucket: BucketName,
  path: string,
  file: File | ArrayBuffer,
  options: UploadOptions = {}
): Promise<StorageResponse> => {
  try {
    if (!validatePath(path)) {
      throw new StorageError('Invalid file path', StorageErrorCode.INVALID_PATH);
    }

    // Use service client for admin upload operations to bypass RLS
    const supabase = createSupabaseServiceClient();
    const normalizedPath = normalizeFilePath(path);

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(normalizedPath, file, {
        cacheControl: options.cacheControl || '3600',
        upsert: options.upsert || false,
        contentType: options.contentType,
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

export const downloadFileServer = async (
  bucket: BucketName,
  path: string
): Promise<StorageResponse<Blob>> => {
  try {
    if (!validatePath(path)) {
      throw new StorageError('Invalid file path', StorageErrorCode.INVALID_PATH);
    }

    const supabase = await createSupabaseServerClient();
    const normalizedPath = normalizeFilePath(path);

    const { data, error } = await supabase.storage
      .from(bucket)
      .download(normalizedPath);

    if (error) {
      console.error('Download error:', error);
      throw new StorageError(
        `Failed to download file: ${error.message}`,
        StorageErrorCode.DOWNLOAD_FAILED,
        error
      );
    }

    return {
      data,
      error: null,
      success: true,
    };
  } catch (err) {
    console.error('Storage download error:', err);
    const message = err instanceof StorageError ? err.message : 'Unknown download error';
    
    return {
      data: null,
      error: message,
      success: false,
    };
  }
};

export const listFilesServer = async (
  bucket: BucketName,
  folder?: string,
  options: ListOptions = {}
): Promise<StorageResponse<FileObject[]>> => {
  try {
    const supabase = await createSupabaseServerClient();
    const folderPath = folder ? normalizeFilePath(folder) : undefined;

    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folderPath, {
        limit: options.limit || 100,
        offset: options.offset || 0,
        sortBy: options.sortBy || { column: 'name', order: 'asc' },
        search: options.search,
      });

    if (error) {
      console.error('List files error:', error);
      throw new StorageError(
        `Failed to list files: ${error.message}`,
        StorageErrorCode.LIST_FAILED,
        error
      );
    }

    return {
      data: data || [],
      error: null,
      success: true,
    };
  } catch (err) {
    console.error('Storage list error:', err);
    const message = err instanceof StorageError ? err.message : 'Unknown list error';
    
    return {
      data: null,
      error: message,
      success: false,
    };
  }
};

export const deleteFileServer = async (
  bucket: BucketName,
  path: string
): Promise<StorageResponse> => {
  try {
    if (!validatePath(path)) {
      throw new StorageError('Invalid file path', StorageErrorCode.INVALID_PATH);
    }

    const supabase = await createSupabaseServerClient();
    const normalizedPath = normalizeFilePath(path);

    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([normalizedPath]);

    if (error) {
      console.error('Delete error:', error);
      throw new StorageError(
        `Failed to delete file: ${error.message}`,
        StorageErrorCode.DELETE_FAILED,
        error
      );
    }

    return {
      data,
      error: null,
      success: true,
    };
  } catch (err) {
    console.error('Storage delete error:', err);
    const message = err instanceof StorageError ? err.message : 'Unknown delete error';
    
    return {
      data: null,
      error: message,
      success: false,
    };
  }
};

export const deleteFilesServer = async (
  bucket: BucketName,
  paths: string[]
): Promise<StorageResponse> => {
  try {
    const validPaths = paths.filter(validatePath);
    if (validPaths.length !== paths.length) {
      throw new StorageError('One or more invalid file paths', StorageErrorCode.INVALID_PATH);
    }

    const supabase = await createSupabaseServerClient();
    const normalizedPaths = validPaths.map(normalizeFilePath);

    const { data, error } = await supabase.storage
      .from(bucket)
      .remove(normalizedPaths);

    if (error) {
      console.error('Delete files error:', error);
      throw new StorageError(
        `Failed to delete files: ${error.message}`,
        StorageErrorCode.DELETE_FAILED,
        error
      );
    }

    return {
      data,
      error: null,
      success: true,
    };
  } catch (err) {
    console.error('Storage delete files error:', err);
    const message = err instanceof StorageError ? err.message : 'Unknown delete error';
    
    return {
      data: null,
      error: message,
      success: false,
    };
  }
};

export const moveFileServer = async (
  bucket: BucketName,
  fromPath: string,
  toPath: string
): Promise<StorageResponse> => {
  try {
    if (!validatePath(fromPath) || !validatePath(toPath)) {
      throw new StorageError('Invalid file path', StorageErrorCode.INVALID_PATH);
    }

    const supabase = await createSupabaseServerClient();
    const normalizedFromPath = normalizeFilePath(fromPath);
    const normalizedToPath = normalizeFilePath(toPath);

    const { data, error } = await supabase.storage
      .from(bucket)
      .move(normalizedFromPath, normalizedToPath);

    if (error) {
      console.error('Move file error:', error);
      throw new StorageError(
        `Failed to move file: ${error.message}`,
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
    console.error('Storage move error:', err);
    const message = err instanceof StorageError ? err.message : 'Unknown move error';
    
    return {
      data: null,
      error: message,
      success: false,
    };
  }
};

export const copyFileServer = async (
  bucket: BucketName,
  fromPath: string,
  toPath: string
): Promise<StorageResponse> => {
  try {
    if (!validatePath(fromPath) || !validatePath(toPath)) {
      throw new StorageError('Invalid file path', StorageErrorCode.INVALID_PATH);
    }

    const supabase = await createSupabaseServerClient();
    const normalizedFromPath = normalizeFilePath(fromPath);
    const normalizedToPath = normalizeFilePath(toPath);

    const { data, error } = await supabase.storage
      .from(bucket)
      .copy(normalizedFromPath, normalizedToPath);

    if (error) {
      console.error('Copy file error:', error);
      throw new StorageError(
        `Failed to copy file: ${error.message}`,
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
    console.error('Storage copy error:', err);
    const message = err instanceof StorageError ? err.message : 'Unknown copy error';
    
    return {
      data: null,
      error: message,
      success: false,
    };
  }
};

// Generate Signed URL for private access
export const getSignedUrlServer = async (
  bucket: BucketName,
  path: string,
  expiresIn: number = 3600
): Promise<StorageResponse<string>> => {
  try {
    if (!validatePath(path)) {
      throw new StorageError('Invalid file path', StorageErrorCode.INVALID_PATH);
    }

    const supabase = await createSupabaseServerClient();
    const normalizedPath = normalizeFilePath(path);

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(normalizedPath, expiresIn);

    if (error) {
      console.error('Signed URL error:', error);
      throw new StorageError(
        `Failed to create signed URL: ${error.message}`,
        StorageErrorCode.PERMISSION_DENIED,
        error
      );
    }

    return {
      data: data.signedUrl,
      error: null,
      success: true,
    };
  } catch (err) {
    console.error('Storage signed URL error:', err);
    const message = err instanceof StorageError ? err.message : 'Unknown signed URL error';
    
    return {
      data: null,
      error: message,
      success: false,
    };
  }
};

// Generate Public URL (server-side version)
export const getPublicUrlServer = async (bucket: BucketName, path: string): Promise<string> => {
  if (!validatePath(path)) {
    throw new StorageError('Invalid file path', StorageErrorCode.INVALID_PATH);
  }

  const normalizedPath = normalizeFilePath(path);
  
  // Use service client to get public URL
  const supabase = createSupabaseServiceClient();
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(normalizedPath);

  return data.publicUrl;
};

// Convenience functions for QR codes (server-side only)
export const uploadQRCode = async (
  restaurantId: string,
  qrType: 'menu' | 'contact' | 'referral' = 'menu',
  qrCodeBuffer: ArrayBuffer
): Promise<StorageResponse> => {
  const timestamp = Date.now();
  const path = `restaurant-${restaurantId}/${qrType}-qr-${timestamp}.png`;
  
  return uploadFileServer('qr-codes', path, qrCodeBuffer, {
    cacheControl: '86400', // 24 hours
    contentType: 'image/png',
    upsert: true,
  });
};

export const getQRCodes = async (
  restaurantId: string,
  qrType?: 'menu' | 'contact' | 'referral'
): Promise<StorageResponse<FileObject[]>> => {
  const folder = `restaurant-${restaurantId}/`;
  const searchPattern = qrType ? `${qrType}-qr` : '';
  
  return listFilesServer('qr-codes', folder, {
    search: searchPattern,
    sortBy: { column: 'created_at', order: 'desc' },
  });
};

export const deleteQRCodes = async (
  restaurantId: string,
  qrType?: 'menu' | 'contact' | 'referral'
): Promise<StorageResponse> => {
  const { data: files, error } = await getQRCodes(restaurantId, qrType);
  
  if (error || !files || files.length === 0) {
    return { data: null, error: error || 'No files found', success: false };
  }
  
  const folder = `restaurant-${restaurantId}/`;
  const filePaths = files.map(file => `${folder}${file.name}`);
  
  return deleteFilesServer('qr-codes', filePaths);
};

export const getRestaurantImages = async (
  restaurantId: string,
  imageType?: 'logo' | 'banner' | 'gallery'
): Promise<StorageResponse<FileObject[]>> => {
  const folder = imageType ? `${imageType}s/` : '';
  const searchPattern = `restaurant-${restaurantId}`;
  
  return listFilesServer('restaurants', folder, {
    search: searchPattern,
    sortBy: { column: 'created_at', order: 'desc' },
  });
};

export const deleteRestaurantImages = async (
  restaurantId: string,
  imageType?: 'logo' | 'banner' | 'gallery'
): Promise<StorageResponse> => {
  const { data: files, error } = await getRestaurantImages(restaurantId, imageType);
  
  if (error || !files || files.length === 0) {
    return { data: null, error: error || 'No files found', success: false };
  }
  
  const folder = imageType ? `${imageType}s/` : '';
  const filePaths = files.map(file => `${folder}${file.name}`);
  
  return deleteFilesServer('restaurants', filePaths);
}; 