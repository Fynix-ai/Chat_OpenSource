/**
 * ThreadItem Component
 * 
 * Displays a single chat thread in the history sidebar.
 * Supports hover states, selection, and actions (delete, rename).
 * 
 * @component
 * @example
 * ```tsx
 * <ThreadItem
 *   thread={thread}
 *   selectedThread={thread.id === activeThreadId}
 *   onClick={(id) => navigateToThread(id)}
 *   onDelete={(id) => deleteThread(id)}
 * />
 * ```
 */

import React, { useState, useCallback } from 'react';
import { MoreVertical, Trash2 } from 'lucide-react';
import { IThreadItemProps } from '../types';
import { getThreadTimeLabel } from '../utils/historyHelpers';

// ============================================================================
// Component
// ============================================================================

/**
 * ThreadItem Component
 */
export const ThreadItem: React.FC<IThreadItemProps> = ({
  thread,
  selectedThread = false,
  onClick,
  onDelete,
}) => {
  // ============================================================================
  // State
  // ============================================================================

  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // ============================================================================
  // Event Handlers
  // ============================================================================

  const handleClick = useCallback(() => {
    onClick?.(thread.id);
  }, [thread.id, onClick]);

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete?.(thread.id);
    },
    [thread.id, onDelete]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div
      role="button"
      tabIndex={0}
      className={`thread-item group px-3 py-2 rounded-lg cursor-pointer transition-colors ${
        selectedThread
          ? 'bg-bgSelectedColor'
          : 'hover:bg-bgSelectedColor'
      }`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowActions(false);
      }}
      aria-label={`Chat: ${thread.title}`}
      aria-current={selectedThread ? 'page' : undefined}
    >
      <div className="flex items-center justify-between gap-2">
        {/* Thread Title */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-textDefault truncate">
            {thread.title}
          </p>
          <p className="text-xs text-textDimmedColor">
            {getThreadTimeLabel(thread.updated_at)}
          </p>
        </div>

        {/* Actions */}
        {(isHovered || selectedThread) && (
          <div className="flex items-center gap-1">
            {/* More Options */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="p-1 hover:bg-hoverBackgroundColor rounded transition-colors"
              aria-label="Thread options"
            >
              <MoreVertical size={16} className="text-textDimmedColor" />
            </button>
          </div>
        )}
      </div>

      {/* Action Menu */}
      {showActions && (
        <div className="mt-2 p-2 bg-bgCardColor border border-borderDefault rounded-lg shadow-lg">
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-2 w-full px-2 py-1 text-sm text-red-500 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Display Name
// ============================================================================

ThreadItem.displayName = 'ThreadItem';

// ============================================================================
// Export
// ============================================================================

export default ThreadItem;
