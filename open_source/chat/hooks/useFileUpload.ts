/**
 * useFileUpload Hook
 * 
 * A comprehensive hook for handling file uploads with the following features:
 * - Multi-file upload support
 * - Progress tracking
 * - Error handling and retry logic
 * - Drag and drop support
 * - Paste support
 * - File validation
 * - Upload cancellation
 * 
 * @module hooks/useFileUpload
 * 
 * @example
 * ```tsx
 * const {
 *   uploadedFiles,
 *   isUploading,
 *   uploadFiles,
 *   deleteFile,
 *   retryUpload,
 * } = useFileUpload({
 *   maxFiles: 5,
 *   onUploadComplete: (files) => console.log('Uploaded:', files),
 * });
 * ```
 */

import { useState, useCallback, useRef } from 'react';
import { IExtendedFile } from '../types';
import {
  validateFile,
  generateSafeFilename,
  generateId,
} from '../utils/helpers';
import {
  ALLOWED_FILE_TYPES,
  MAX_FILES_ALLOWED,
  ERROR_MESSAGES,
} from '../utils/constants';
import { uploadFile } from '../services/mockApiService';

// ============================================================================
// Types
// ============================================================================

interface UseFileUploadOptions {
  /** Maximum number of files allowed */
  maxFiles?: number;
  
  /** Allowed file types (MIME types) */
  allowedTypes?: string[];
  
  /** Callback when upload completes successfully */
  onUploadComplete?: (files: IExtendedFile[]) => void;
  
  /** Callback when upload fails */
  onUploadError?: (error: Error) => void;
  
  /** Callback for each file's progress */
  onProgress?: (uploadId: string, progress: number) => void;
}

interface UseFileUploadReturn {
  /** Array of uploaded files with metadata */
  uploadedFiles: IExtendedFile[];
  
  /** Whether any file is currently uploading */
  isUploading: boolean;
  
  /** Whether any file has failed to upload */
  hasFailedUploads: boolean;
  
  /** Upload one or more files */
  uploadFiles: (files: File[]) => Promise<void>;
  
  /** Delete a file by index */
  deleteFile: (index: number) => void;
  
  /** Retry a failed upload */
  retryUpload: (uploadId: string) => Promise<void>;
  
  /** Cancel an in-progress upload */
  cancelUpload: (uploadId: string) => void;
  
  /** Handle file input change event */
  handleFileInput: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  
  /** Handle paste event (for pasting images) */
  handlePaste: (event: React.ClipboardEvent) => Promise<void>;
  
  /** Clear all uploaded files */
  clearAllFiles: () => void;
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadReturn {
  const {
    maxFiles = MAX_FILES_ALLOWED,
    allowedTypes = ALLOWED_FILE_TYPES as unknown as string[],
    onUploadComplete,
    onUploadError,
    onProgress,
  } = options;

  // State
  const [uploadedFiles, setUploadedFiles] = useState<IExtendedFile[]>([]);
  
  // Counter for generating unique upload IDs
  const uploadCounterRef = useRef(0);

  // ============================================================================
  // Computed Values
  // ============================================================================

  const isUploading = uploadedFiles.some((file) => file.isUploading);
  const hasFailedUploads = uploadedFiles.some((file) => file.uploadError);

  // ============================================================================
  // Helper Functions
  // ============================================================================

  /**
   * Generate a unique upload ID
   */
  const generateUploadId = useCallback(() => {
    uploadCounterRef.current += 1;
    return `upload_${Date.now()}_${uploadCounterRef.current}`;
  }, []);

  /**
   * Update a specific file's state
   */
  const updateFile = useCallback(
    (uploadId: string, updates: Partial<IExtendedFile>) => {
      setUploadedFiles((prev) =>
        prev.map((file) =>
          file.uploadId === uploadId ? { ...file, ...updates } : file
        )
      );
    },
    []
  );

  /**
   * Process a single file upload
   */
  const processFileUpload = useCallback(
    async (extendedFile: IExtendedFile): Promise<void> => {
      const { file, uploadId, uploadAbortController } = extendedFile;

      try {
        // Check if upload was cancelled
        if (uploadAbortController?.signal.aborted) {
          return;
        }

        // Upload the file
        const result = await uploadFile(file, (progress) => {
          updateFile(uploadId, { uploadProgress: progress });
          onProgress?.(uploadId, progress);
        });

        if (!result.success || !result.data) {
          throw new Error('Upload failed');
        }

        // Update file with CDN URL
        updateFile(uploadId, {
          cdnUrl: result.data.url,
          isUploading: false,
          uploadProgress: 100,
        });
      } catch (error) {
        // Handle upload error
        const errorMessage =
          error instanceof Error ? error.message : ERROR_MESSAGES.UPLOAD_FAILED;

        updateFile(uploadId, {
          isUploading: false,
          uploadError: errorMessage,
        });

        onUploadError?.(
          error instanceof Error ? error : new Error(errorMessage)
        );
      }
    },
    [updateFile, onProgress, onUploadError]
  );

  // ============================================================================
  // Main Upload Function
  // ============================================================================

  /**
   * Upload multiple files
   */
  const uploadFiles = useCallback(
    async (files: File[]): Promise<void> => {
      // Check if we've reached the max files limit
      const currentCount = uploadedFiles.length;
      if (currentCount >= maxFiles) {
        onUploadError?.(new Error(ERROR_MESSAGES.MAX_FILES_EXCEEDED));
        return;
      }

      // Filter and validate files
      const validFiles: File[] = [];
      const errors: string[] = [];

      for (const file of files) {
        // Check file type
        if (!allowedTypes.includes(file.type)) {
          errors.push(`${file.name}: ${ERROR_MESSAGES.INVALID_FILE_TYPE}`);
          continue;
        }

        // Validate file
        const validation = validateFile(file);
        if (!validation.valid) {
          errors.push(validation.error || 'Validation failed');
          continue;
        }

        validFiles.push(file);
      }

      // Show errors if any
      if (errors.length > 0) {
        onUploadError?.(new Error(errors.join('\n')));
      }

      // Check if adding these files would exceed the limit
      const availableSlots = maxFiles - currentCount;
      const filesToUpload = validFiles.slice(0, availableSlots);

      if (filesToUpload.length === 0) {
        return;
      }

      // Create extended file objects
      const extendedFiles: IExtendedFile[] = filesToUpload.map((file) => ({
        file,
        filename: generateSafeFilename(file.name),
        uploadId: generateUploadId(),
        isUploading: true,
        uploadProgress: 0,
        uploadAbortController: new AbortController(),
      }));

      // Add files to state immediately (optimistic update)
      setUploadedFiles((prev) => [...prev, ...extendedFiles]);

      // Process uploads
      try {
        await Promise.all(extendedFiles.map((file) => processFileUpload(file)));

        // Call completion callback with successfully uploaded files
        const successfulFiles = extendedFiles.filter(
          (f) => !f.uploadError && f.cdnUrl
        );
        if (successfulFiles.length > 0) {
          onUploadComplete?.(successfulFiles);
        }
      } catch (error) {
        console.error('Upload batch error:', error);
      }
    },
    [
      uploadedFiles.length,
      maxFiles,
      allowedTypes,
      generateUploadId,
      processFileUpload,
      onUploadComplete,
      onUploadError,
    ]
  );

  // ============================================================================
  // File Management Functions
  // ============================================================================

  /**
   * Delete a file by index
   */
  const deleteFile = useCallback((index: number) => {
    setUploadedFiles((prev) => {
      const fileToDelete = prev[index];

      // Cancel upload if in progress
      if (fileToDelete?.isUploading && fileToDelete.uploadAbortController) {
        fileToDelete.uploadAbortController.abort();
      }

      return prev.filter((_, i) => i !== index);
    });
  }, []);

  /**
   * Retry a failed upload
   */
  const retryUpload = useCallback(
    async (uploadId: string): Promise<void> => {
      // Find the file
      const fileToRetry = uploadedFiles.find((f) => f.uploadId === uploadId);
      if (!fileToRetry) {
        console.error('File not found for retry');
        return;
      }

      // Reset file state
      const updatedFile: IExtendedFile = {
        ...fileToRetry,
        isUploading: true,
        uploadError: undefined,
        uploadProgress: 0,
        uploadAbortController: new AbortController(),
      };

      updateFile(uploadId, updatedFile);

      // Retry upload
      await processFileUpload(updatedFile);
    },
    [uploadedFiles, updateFile, processFileUpload]
  );

  /**
   * Cancel an in-progress upload
   */
  const cancelUpload = useCallback((uploadId: string) => {
    setUploadedFiles((prev) =>
      prev
        .map((file) => {
          if (file.uploadId === uploadId && file.isUploading) {
            // Abort the upload
            file.uploadAbortController?.abort();
            return null; // Remove from list
          }
          return file;
        })
        .filter(Boolean) as IExtendedFile[]
    );
  }, []);

  /**
   * Clear all files
   */
  const clearAllFiles = useCallback(() => {
    // Cancel all in-progress uploads
    uploadedFiles.forEach((file) => {
      if (file.isUploading && file.uploadAbortController) {
        file.uploadAbortController.abort();
      }
    });

    setUploadedFiles([]);
  }, [uploadedFiles]);

  // ============================================================================
  // Event Handlers
  // ============================================================================

  /**
   * Handle file input change event
   */
  const handleFileInput = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        await uploadFiles(Array.from(files));
      }
      
      // Reset input to allow selecting the same file again
      event.target.value = '';
    },
    [uploadFiles]
  );

  /**
   * Handle paste event (for pasting images from clipboard)
   */
  const handlePaste = useCallback(
    async (event: React.ClipboardEvent) => {
      const items = event.clipboardData.items;

      // Find image items
      const imageFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file' && allowedTypes.includes(item.type)) {
          const file = item.getAsFile();
          if (file) {
            imageFiles.push(file);
          }
        }
      }

      if (imageFiles.length > 0) {
        event.preventDefault();
        await uploadFiles(imageFiles);
      }
    },
    [allowedTypes, uploadFiles]
  );

  // ============================================================================
  // Return Hook Interface
  // ============================================================================

  return {
    uploadedFiles,
    isUploading,
    hasFailedUploads,
    uploadFiles,
    deleteFile,
    retryUpload,
    cancelUpload,
    handleFileInput,
    handlePaste,
    clearAllFiles,
  };
}

// ============================================================================
// Export Default
// ============================================================================

export default useFileUpload;
