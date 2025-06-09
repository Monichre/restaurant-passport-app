// Types and Interfaces
export interface StorageResponse<T = any> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface UploadOptions {
  cacheControl?: string;
  upsert?: boolean;
  contentType?: string;
}

export interface ListOptions {
  limit?: number;
  offset?: number;
  sortBy?: { column: string; order: 'asc' | 'desc' };
  search?: string;
}

export interface FileObject {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, any>;
}

export interface FileInfo {
  size: number;
  mimetype: string;
  etag: string;
  cacheControl: string;
  lastModified: string;
}

// Bucket Types
export type BucketName = 'qr-codes' | 'restaurants';

// Constants
export const BUCKET_NAMES: Record<string, BucketName> = {
  QR_CODES: 'qr-codes',
  RESTAURANTS: 'restaurants',
} as const;

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

// Custom Error Class
export class StorageError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

// Error Codes
export enum StorageErrorCode {
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
  INVALID_PATH = 'INVALID_PATH',
  BUCKET_NOT_FOUND = 'BUCKET_NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  DOWNLOAD_FAILED = 'DOWNLOAD_FAILED',
  DELETE_FAILED = 'DELETE_FAILED',
  LIST_FAILED = 'LIST_FAILED',
}

// Utility Functions
export const validatePath = (path: string): boolean => {
  // Prevent path traversal attacks
  if (path.includes('..') || path.includes('//') || path.startsWith('/')) {
    return false;
  }
  return true;
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File, maxSize: number = MAX_FILE_SIZE): boolean => {
  return file.size <= maxSize;
};

export const normalizeFilePath = (path: string): string => {
  return path.replace(/\/+/g, '/').replace(/^\/|\/$/g, '');
};

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
}; 