# Storage Module Documentation

## Overview

The Storage module provides a comprehensive interface for managing file storage operations in Supabase Storage. It supports two primary buckets:
- `restaurants` - For restaurant images (logos, banners, gallery images)
- `qr-codes` - For QR code images generated for restaurants

## Architecture

### Key Components

#### 1. **Types and Interfaces**
- `StorageResponse<T>` - Standardized response format with data, error, and success fields
- `UploadOptions` - Configuration for file uploads (cache control, upsert, content type)
- `ListOptions` - Configuration for file listing (pagination, sorting, search)
- `BucketName` - Type-safe bucket names ('qr-codes' | 'restaurants')
- `FileObject` - Supabase file metadata structure
- `FileInfo` - Detailed file information structure

#### 2. **Error Handling**
- `StorageError` - Custom error class with error codes and details
- `StorageErrorCode` - Enumeration of specific error types
- Comprehensive error handling with user-friendly messages

#### 3. **Security Features**
- Path validation to prevent directory traversal attacks
- File type validation for images
- File size limits (50MB max)
- Content type validation

#### 4. **Dual Client Support**
- **Server Operations**: Use `createSupabaseServerClient()` for server-side operations
- **Client Operations**: Use `supabaseBrowserClient` for client-side operations

## Core Functions

### Server-Side Operations

#### File Upload
```typescript
uploadFileServer(
  bucket: BucketName,
  path: string,
  file: File | ArrayBuffer,
  options?: UploadOptions
): Promise<StorageResponse>
```

#### File Download
```typescript
downloadFileServer(
  bucket: BucketName,
  path: string
): Promise<StorageResponse<Blob>>
```

#### List Files
```typescript
listFilesServer(
  bucket: BucketName,
  folder?: string,
  options?: ListOptions
): Promise<StorageResponse<FileObject[]>>
```

#### File Deletion
```typescript
deleteFileServer(bucket: BucketName, path: string): Promise<StorageResponse>
deleteFilesServer(bucket: BucketName, paths: string[]): Promise<StorageResponse>
```

#### File Management
```typescript
moveFileServer(bucket: BucketName, fromPath: string, toPath: string): Promise<StorageResponse>
copyFileServer(bucket: BucketName, fromPath: string, toPath: string): Promise<StorageResponse>
```

#### Signed URLs
```typescript
getSignedUrlServer(
  bucket: BucketName,
  path: string,
  expiresIn?: number
): Promise<StorageResponse<string>>
```

### Client-Side Operations

#### File Upload
```typescript
uploadFileClient(
  bucket: BucketName,
  path: string,
  file: File,
  options?: UploadOptions
): Promise<StorageResponse>
```

### Universal Operations

#### Public URL Generation
```typescript
getPublicUrl(bucket: BucketName, path: string): string
```

## Convenience Functions

### Restaurant Image Management

#### Upload Restaurant Image
```typescript
uploadRestaurantImage(
  restaurantId: string,
  file: File,
  imageType: 'logo' | 'banner' | 'gallery' = 'logo'
): Promise<StorageResponse>
```

#### Get Restaurant Images
```typescript
getRestaurantImages(
  restaurantId: string,
  imageType?: 'logo' | 'banner' | 'gallery'
): Promise<StorageResponse<FileObject[]>>
```

#### Delete Restaurant Images
```typescript
deleteRestaurantImages(
  restaurantId: string,
  imageType?: 'logo' | 'banner' | 'gallery'
): Promise<StorageResponse>
```

### QR Code Management

#### Upload QR Code
```typescript
uploadQRCode(
  restaurantId: string,
  qrType: 'menu' | 'contact' | 'referral' = 'menu',
  qrCodeBuffer: ArrayBuffer
): Promise<StorageResponse>
```

#### Get QR Codes
```typescript
getQRCodes(
  restaurantId: string,
  qrType?: 'menu' | 'contact' | 'referral'
): Promise<StorageResponse<FileObject[]>>
```

#### Delete QR Codes
```typescript
deleteQRCodes(
  restaurantId: string,
  qrType?: 'menu' | 'contact' | 'referral'
): Promise<StorageResponse>
```

## Utility Functions

### Path Management
- `validatePath(path: string)` - Validates file paths for security
- `normalizeFilePath(path: string)` - Normalizes file paths
- `getFileExtension(filename: string)` - Extracts file extension

### File Validation
- `validateFileType(file: File, allowedTypes: string[])` - Validates file MIME types
- `validateFileSize(file: File, maxSize?: number)` - Validates file size

## Data Flow

### Upload Process
1. **Validation** - Path, file type, and size validation
2. **Normalization** - Path normalization and sanitization
3. **Client Selection** - Choose appropriate Supabase client (server/browser)
4. **Upload** - Execute upload with specified options
5. **Error Handling** - Comprehensive error handling and logging
6. **Response** - Return standardized response format

### Download Process
1. **Path Validation** - Ensure path security
2. **Client Selection** - Use server client for downloads
3. **Download** - Retrieve file as Blob
4. **Error Handling** - Handle download failures
5. **Response** - Return file data or error

### Listing Process
1. **Folder Configuration** - Set up folder path and options
2. **Query Execution** - Execute list query with pagination/sorting
3. **Data Processing** - Process file metadata
4. **Response** - Return file list or error

## Security Features

### Path Security
- Prevents directory traversal attacks (`../`)
- Blocks absolute paths
- Removes double slashes
- Normalizes paths consistently

### File Validation
- **Type Restrictions**: Only allows specified image types for restaurant bucket
- **Size Limits**: 50MB maximum file size
- **Content Type**: Validates MIME types

### Access Control
- Server-side operations use authenticated client
- Client-side operations use browser client with RLS policies
- Signed URLs for temporary private access

## Error Handling Strategy

### Error Types
- `FILE_NOT_FOUND` - Requested file doesn't exist
- `UPLOAD_FAILED` - Upload operation failed
- `INVALID_PATH` - Path validation failed
- `BUCKET_NOT_FOUND` - Specified bucket doesn't exist
- `PERMISSION_DENIED` - Access denied
- `FILE_TOO_LARGE` - File exceeds size limit
- `INVALID_FILE_TYPE` - File type not allowed
- `DOWNLOAD_FAILED` - Download operation failed
- `DELETE_FAILED` - Delete operation failed
- `LIST_FAILED` - List operation failed

### Error Response Format
```typescript
{
  data: null,
  error: "User-friendly error message",
  success: false
}
```

## Performance Considerations

### Optimization Features
- **Caching**: Configurable cache control headers
- **Compression**: Automatic content compression
- **CDN Ready**: Public URLs support CDN integration
- **Batch Operations**: Support for multiple file operations

### Best Practices
- Use appropriate cache control settings
- Implement pagination for large file lists
- Use signed URLs for temporary access
- Batch delete operations when possible

## Usage Examples

### Upload Restaurant Logo
```typescript
import { uploadRestaurantImage } from '@/db/storage';

const handleLogoUpload = async (file: File, restaurantId: string) => {
  const { data, error, success } = await uploadRestaurantImage(
    restaurantId,
    file,
    'logo'
  );
  
  if (success) {
    console.log('Logo uploaded:', data);
  } else {
    console.error('Upload failed:', error);
  }
};
```

### Generate and Upload QR Code
```typescript
import { uploadQRCode } from '@/db/storage';

const generateMenuQR = async (restaurantId: string, menuData: any) => {
  // Generate QR code (implementation depends on QR library)
  const qrCodeBuffer = await generateQRCodeBuffer(menuData);
  
  const { data, error, success } = await uploadQRCode(
    restaurantId,
    'menu',
    qrCodeBuffer
  );
  
  if (success) {
    console.log('QR code uploaded:', data);
  } else {
    console.error('QR upload failed:', error);
  }
};
```

### List Restaurant Images
```typescript
import { getRestaurantImages, getPublicUrl } from '@/db/storage';

const loadRestaurantGallery = async (restaurantId: string) => {
  const { data: images, error, success } = await getRestaurantImages(
    restaurantId,
    'gallery'
  );
  
  if (success && images) {
    const imageUrls = images.map(image => 
      getPublicUrl('restaurants', `gallery/${image.name}`)
    );
    return imageUrls;
  } else {
    console.error('Failed to load gallery:', error);
    return [];
  }
};
```

### Cleanup Old Files
```typescript
import { deleteQRCodes } from '@/db/storage';

const cleanupOldQRCodes = async (restaurantId: string) => {
  const { success, error } = await deleteQRCodes(restaurantId, 'menu');
  
  if (success) {
    console.log('Old QR codes cleaned up');
  } else {
    console.error('Cleanup failed:', error);
  }
};
```

## Module Integration

### Import Patterns
```typescript
// Individual functions
import { 
  uploadFileClient, 
  getPublicUrl, 
  uploadRestaurantImage 
} from '@/db/storage';

// Default export with all functions
import storage from '@/db/storage';

// Types and constants
import { 
  BucketName, 
  StorageResponse, 
  BUCKET_NAMES 
} from '@/db/storage';
```

### Server Actions Integration
```typescript
'use server';

import { uploadFileServer } from '@/db/storage';

export async function uploadImageAction(formData: FormData) {
  const file = formData.get('image') as File;
  const restaurantId = formData.get('restaurantId') as string;
  
  const result = await uploadFileServer(
    'restaurants',
    `logos/restaurant-${restaurantId}.${getFileExtension(file.name)}`,
    file,
    { upsert: true, cacheControl: '3600' }
  );
  
  return result;
}
```

## Testing Strategy

### Unit Tests
- Path validation functions
- File validation utilities
- Error handling scenarios
- Response format consistency

### Integration Tests
- Upload/download workflows
- File listing with various options
- Batch operations
- Error recovery

### Mock Testing
- Supabase client mocking for tests
- File system simulation
- Network error simulation

## Future Enhancements

### Planned Features
- **Progress Tracking**: Upload progress callbacks
- **Image Processing**: Automatic resize/optimization
- **Metadata Storage**: Extended file metadata
- **Versioning**: File version management
- **Backup Integration**: Automatic backup to secondary storage

### Scalability Considerations
- **CDN Integration**: Enhanced CDN support
- **Multi-Region**: Support for multiple storage regions
- **Caching Layer**: Advanced caching strategies
- **Monitoring**: Storage usage analytics

## Constants and Configuration

### Bucket Names
```typescript
export const BUCKET_NAMES = {
  QR_CODES: 'qr-codes',
  RESTAURANTS: 'restaurants',
} as const;
```

### File Constraints
```typescript
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png', 
  'image/webp',
  'image/svg+xml'
];
```

## Troubleshooting

### Common Issues

1. **Upload Failures**
   - Check file size limits
   - Verify file type restrictions
   - Validate path format
   - Ensure proper authentication

2. **Permission Errors**
   - Verify RLS policies in Supabase
   - Check authentication status
   - Validate bucket permissions

3. **Path Issues**
   - Remove leading/trailing slashes
   - Avoid special characters
   - Check for directory traversal attempts

4. **Performance Issues**
   - Implement pagination for large lists
   - Use appropriate cache headers
   - Consider file compression

This storage module provides a robust, secure, and scalable foundation for file management in the restaurant passport application. 