/**
 * FileUploadButton Component
 * 
 * A button component for triggering file upload.
 * Supports multiple files and custom file type restrictions.
 */

import React from 'react';
import { Paperclip } from 'lucide-react';
import { ALLOWED_FILE_TYPES } from '../../utils/constants';

interface FileUploadButtonProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  maxFiles?: number;
  allowedTypes?: string[];
  className?: string;
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  onFileSelect,
  disabled = false,
  maxFiles = 5,
  allowedTypes = ALLOWED_FILE_TYPES as unknown as string[],
  className = '',
}) => {
  return (
    <div className={`file-upload-button ${className}`}>
      <label
        htmlFor="file-upload"
        className={`flex items-center gap-1 p-2 rounded-xl cursor-pointer hover:bg-hoverBackgroundColor transition-colors ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        }`}
        aria-label="Upload files"
      >
        <Paperclip
          size={16}
          strokeWidth={2}
          className={disabled ? 'text-textDimmedColor' : ''}
        />
      </label>
      <input
        id="file-upload"
        type="file"
        className="hidden"
        accept={allowedTypes.join(',')}
        onChange={onFileSelect}
        disabled={disabled}
        multiple
        title="Upload files"
        aria-label="File upload input"
      />
    </div>
  );
};

FileUploadButton.displayName = 'FileUploadButton';

export default FileUploadButton;
