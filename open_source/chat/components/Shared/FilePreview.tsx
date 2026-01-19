/**
 * FilePreview Component
 * 
 * Displays preview of uploaded files with upload progress,
 * error states, and delete functionality.
 */

import React from 'react';
import { X, AlertCircle, Loader, RotateCw } from 'lucide-react';
import { IExtendedFile } from '../../types';
import { formatFileSize } from '../../utils/helpers';

interface FilePreviewProps {
  files: IExtendedFile[];
  onDelete: (index: number) => void;
  onRetry?: (uploadId: string) => void;
  className?: string;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  files,
  onDelete,
  onRetry,
  className = '',
}) => {
  if (files.length === 0) return null;

  return (
    <div className={`file-preview flex flex-wrap gap-2 ${className}`}>
      {files.map((file, index) => (
        <div
          key={file.uploadId}
          className="relative flex items-center gap-2 px-3 py-2 bg-bgStreamingThoughtsColor rounded-lg border border-borderDefault"
        >
          {/* File Info */}
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium text-textDefault truncate max-w-[150px]">
              {file.filename}
            </span>
            <span className="text-xs text-textDimmedColor">
              {formatFileSize(file.file.size)}
            </span>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-1">
            {/* Loading */}
            {file.isUploading && (
              <Loader
                size={14}
                className="text-textPurple animate-spin"
                aria-label="Uploading"
              />
            )}

            {/* Error */}
            {file.uploadError && (
              <>
                <AlertCircle
                  size={14}
                  className="text-red-500"
                  aria-label="Upload failed"
                />
                {onRetry && (
                  <button
                    type="button"
                    onClick={() => onRetry(file.uploadId)}
                    className="p-1 hover:bg-hoverBackgroundColor rounded"
                    aria-label="Retry upload"
                  >
                    <RotateCw size={12} className="text-textDimmedColor" />
                  </button>
                )}
              </>
            )}

            {/* Delete Button */}
            <button
              type="button"
              onClick={() => onDelete(index)}
              className="p-1 hover:bg-hoverBackgroundColor rounded transition-colors"
              aria-label="Remove file"
            >
              <X size={14} className="text-textDimmedColor hover:text-textDefault" />
            </button>
          </div>

          {/* Progress Bar */}
          {file.isUploading && file.uploadProgress !== undefined && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-borderDefault rounded-b-lg overflow-hidden">
              <div
                className="h-full bg-textPurple transition-all duration-300"
                style={{ width: `${file.uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

FilePreview.displayName = 'FilePreview';

export default FilePreview;
