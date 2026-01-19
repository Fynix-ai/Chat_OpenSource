/**
 * ChatInput Component
 * 
 * A feature-rich chat input component with:
 * - Auto-resizing textarea
 * - File upload support
 * - Paste image support
 * - Send/Stop button
 * - Loading states
 * - Keyboard shortcuts
 * 
 * @component
 * @example
 * ```tsx
 * <ChatInput
 *   onSubmit={(message, files) => handleSubmit(message, files)}
 *   placeholder="Type your message..."
 *   isStreaming={false}
 * />
 * ```
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Send, CircleStop, Loader } from 'lucide-react';
import { IChatInputProps, IExtendedFile } from '../../types';
import { useFileUpload } from '../../hooks';
import { FileUploadButton } from './FileUploadButton';
import { FilePreview } from './FilePreview';

// ============================================================================
// Component
// ============================================================================

/**
 * ChatInput Component
 */
export const ChatInput: React.FC<IChatInputProps> = ({
  initialQuery = '',
  onSubmit,
  placeholder = 'How can I help you today?',
  disabled = false,
}) => {
  // ============================================================================
  // State
  // ============================================================================

  const [query, setQuery] = useState(initialQuery);
  const [isStreaming, setIsStreaming] = useState(false);
  const [rows, setRows] = useState(2);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // File upload hook
  const {
    uploadedFiles,
    isUploading,
    hasFailedUploads,
    handleFileInput,
    handlePaste,
    deleteFile,
  } = useFileUpload({
    maxFiles: 5,
  });

  // ============================================================================
  // Effects
  // ============================================================================

  /**
   * Update query when initialQuery changes
   */
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  /**
   * Auto-resize textarea based on content
   */
  useEffect(() => {
    if (textareaRef.current) {
      const lineHeight = 24; // approximate line height
      const maxRows = 7;
      const minRows = 2;

      // Reset height to get accurate scrollHeight
      textareaRef.current.style.height = 'auto';

      // Calculate new rows
      const scrollHeight = textareaRef.current.scrollHeight;
      const newRows = Math.max(
        minRows,
        Math.min(maxRows, Math.floor(scrollHeight / lineHeight))
      );

      setRows(newRows);
    }
  }, [query]);

  // ============================================================================
  // Event Handlers
  // ============================================================================

  /**
   * Handle message submission
   */
  const handleSubmit = useCallback(() => {
    if (!query.trim() || isUploading || disabled) {
      return;
    }

    // Get successfully uploaded files
    const successfulFiles = uploadedFiles.filter(
      (file) => file.cdnUrl && !file.uploadError && !file.isUploading
    );

    // Call onSubmit callback
    onSubmit?.(query.trim(), successfulFiles);

    // Clear input
    setQuery('');
    setRows(2);
  }, [query, isUploading, disabled, uploadedFiles, onSubmit]);

  /**
   * Handle keyboard shortcuts
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Submit on Enter (without Shift)
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  /**
   * Handle stop streaming
   */
  const handleStop = useCallback(() => {
    setIsStreaming(false);
    // In a real app, you would cancel the streaming request here
  }, []);

  /**
   * Handle paste event
   */
  const onPaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      handlePaste(e);
    },
    [handlePaste]
  );

  // ============================================================================
  // Render
  // ============================================================================

  const canSubmit = query.trim() && !isUploading && !hasFailedUploads && !disabled;

  return (
    <div className="chat-input-wrapper flex w-full">
      <div className="flex flex-col gap-2 w-full max-w-3xl mx-auto">
        {/* Main Input Container */}
        <div
          className={`flex flex-col rounded-2xl border border-borderDefault p-2 md:px-3 md:py-2 bg-bgCardColor gap-3 ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {/* File Preview */}
          {uploadedFiles.length > 0 && (
            <FilePreview files={uploadedFiles} onDelete={deleteFile} />
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={onPaste}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            className="outline-none resize-none bg-transparent placeholder:text-textDimmedColor text-textDefault font-sans text-sm md:text-base w-full px-3 py-1"
            aria-label="Message input"
            aria-describedby="input-hint"
          />

          {/* Actions Bar */}
          <div className="flex justify-end gap-2 items-center text-xs">
            {/* File Upload Button */}
            <div className="flex items-center gap-3 mr-auto">
              <FileUploadButton
                onFileSelect={handleFileInput}
                disabled={disabled || uploadedFiles.length >= 5}
                maxFiles={5}
              />
            </div>

            {/* Send/Stop Button */}
            <button
              type="button"
              onClick={isStreaming ? handleStop : handleSubmit}
              disabled={!canSubmit && !isStreaming}
              className="size-8 md:size-9 transition-opacity ease-in bg-textPurple hover:opacity-90 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              aria-label={isStreaming ? 'Stop generation' : 'Send message'}
            >
              {isUploading ? (
                <Loader size={16} className="animate-spin text-white" />
              ) : isStreaming ? (
                <CircleStop size={16} className="text-white" />
              ) : (
                <Send size={16} className="text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Hint Text */}
        <p
          id="input-hint"
          className="text-xs text-textDimmedColor text-center"
        >
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// Display Name
// ============================================================================

ChatInput.displayName = 'ChatInput';

// ============================================================================
// Export
// ============================================================================

export default ChatInput;
