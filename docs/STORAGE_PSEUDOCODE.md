# Storage Module Implementation Pseudocode

## Overview
Create a comprehensive storage module for Supabase Storage with support for 'qr-codes' and 'restaurants' buckets.

## Module Structure

```typescript
// Types and Interfaces
interface StorageResponse<T> {
  data: T | null;
  error: string | null;
}

interface UploadOptions {
  cacheControl?: string;
  upsert?: boolean;
  contentType?: string;
}

interface ListOptions {
  limit?: number;
  offset?: number;
  sortBy?: { column: string; order: 'asc' | 'desc' };
  search?: string;
}

// Bucket Types
type BucketName = 'qr-codes' | 'restaurants';

// File Operations Interface
interface StorageOperations {
  // Upload operations
  uploadFile(bucket: BucketName, path: string, file: File, options?: UploadOptions): Promise<StorageResponse>;
  uploadBuffer(bucket: BucketName, path: string, buffer: ArrayBuffer, options?: UploadOptions): Promise<StorageResponse>;
  
  // Download operations
  downloadFile(bucket: BucketName, path: string): Promise<StorageResponse<Blob>>;
  getPublicUrl(bucket: BucketName, path: string): string;
  getSignedUrl(bucket: BucketName, path: string, expiresIn?: number): Promise<StorageResponse<string>>;
  
  // List operations
  listFiles(bucket: BucketName, folder?: string, options?: ListOptions): Promise<StorageResponse<FileObject[]>>;
  
  // Delete operations
  deleteFile(bucket: BucketName, path: string): Promise<StorageResponse>;
  deleteFiles(bucket: BucketName, paths: string[]): Promise<StorageResponse>;
  
  // Utility operations
  moveFile(bucket: BucketName, fromPath: string, toPath: string): Promise<StorageResponse>;
  copyFile(bucket: BucketName, fromPath: string, toPath: string): Promise<StorageResponse>;
  getFileInfo(bucket: BucketName, path: string): Promise<StorageResponse<FileInfo>>;
}
```

## Implementation Plan

### 1. Client-Side Storage Operations
- Use `supabaseBrowserClient` for client-side operations
- Handle File objects from form inputs
- Provide user-friendly error messages
- Support progress callbacks for uploads

### 2. Server-Side Storage Operations  
- Use `supabaseServerClient` for server-side operations
- Handle ArrayBuffer and Blob data
- Implement server actions with "use server" directive
- Support batch operations

### 3. Utility Functions
- Path normalization and validation
- File type validation
- Size limit checking
- URL generation helpers

### 4. Error Handling
- Comprehensive error types
- User-friendly error messages
- Logging for debugging
- Graceful fallbacks

### 5. Type Safety
- Strong TypeScript typing
- Runtime validation where needed
- Zod schemas for validation
- Generic types for flexibility

## File Organization

```
src/db/storage/
├── index.ts              // Main exports
├── client-storage.ts     // Client-side operations
├── server-storage.ts     // Server-side operations
├── storage-types.ts      // TypeScript types and interfaces
├── storage-utils.ts      // Utility functions
└── storage-constants.ts  // Constants and configuration
```

## Key Features

### Upload Operations
- Support for File objects (client) and ArrayBuffer (server)
- Automatic content type detection
- Optional cache control settings
- Upsert capability for updating existing files
- Progress tracking for large uploads

### Download Operations
- Public URL generation for public buckets
- Signed URL generation for private access
- Direct file download as Blob
- Streaming support for large files

### List Operations
- Folder-based listing
- Pagination support
- Sorting options
- Search/filter capabilities
- Metadata inclusion

### Delete Operations
- Single file deletion
- Batch file deletion
- Soft delete options
- Confirmation helpers

### Security
- Path traversal protection
- File type validation
- Size limit enforcement
- Permission checking

### Performance
- Lazy loading of large file lists
- Caching for frequently accessed files
- Compression options
- CDN integration ready

## Error Handling Strategy

```typescript
// Custom error types
class StorageError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

// Error codes
enum StorageErrorCode {
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
  INVALID_PATH = 'INVALID_PATH',
  BUCKET_NOT_FOUND = 'BUCKET_NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE'
}
```

## Usage Examples

```typescript
// Upload restaurant image
const { data, error } = await uploadFile(
  'restaurants', 
  'logos/restaurant-123.png', 
  imageFile,
  { cacheControl: '3600', upsert: true }
);

// Generate QR code and upload
const qrCodeBuffer = await generateQRCode(data);
await uploadBuffer('qr-codes', `restaurant-${id}/menu-qr.png`, qrCodeBuffer);

// Get public URL for restaurant image
const imageUrl = getPublicUrl('restaurants', 'logos/restaurant-123.png');

// List all QR codes for a restaurant
const { data: files } = await listFiles('qr-codes', `restaurant-${id}/`);

// Delete old QR codes
await deleteFiles('qr-codes', oldQrCodePaths);
``` 