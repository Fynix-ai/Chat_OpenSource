/**
 * HistorySidebar Component
 * 
 * Main sidebar component for displaying chat history.
 * Features:
 * - Grouped threads by date
 * - Search functionality
 * - Infinite scroll
 * - New chat button
 * 
 * @component
 * @example
 * ```tsx
 * <HistorySidebar
 *   threads={threads}
 *   activeThreadId={activeThreadId}
 *   onThreadClick={(id) => navigateToThread(id)}
 *   onNewChat={() => createNewChat()}
 * />
 * ```
 */

import React, { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { ThreadItem } from './ThreadItem';
import { IChatHistoryThread } from '../types';
import {
  groupThreadsByDate,
  filterThreadsByQuery,
  sortThreadsByDate,
} from '../utils/historyHelpers';

// ============================================================================
// Types
// ============================================================================

interface HistorySidebarProps {
  /** Array of chat threads */
  threads: IChatHistoryThread[];
  
  /** Currently active thread ID */
  activeThreadId: string | null;
  
  /** Callback when thread is clicked */
  onThreadClick: (threadId: string) => void;
  
  /** Callback when new chat is requested */
  onNewChat: () => void;
  
  /** Callback when thread is deleted */
  onThreadDelete?: (threadId: string) => void;
  
  /** Loading state */
  loading?: boolean;
  
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * HistorySidebar Component
 */
export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  threads,
  activeThreadId,
  onThreadClick,
  onNewChat,
  onThreadDelete,
  loading = false,
  className = '',
}) => {
  // ============================================================================
  // State
  // ============================================================================

  const [searchQuery, setSearchQuery] = useState('');

  // ============================================================================
  // Computed Values
  // ============================================================================

  const filteredAndSortedThreads = useMemo(() => {
    const filtered = filterThreadsByQuery(threads, searchQuery);
    return sortThreadsByDate(filtered);
  }, [threads, searchQuery]);

  const groupedThreads = useMemo(
    () => groupThreadsByDate(filteredAndSortedThreads),
    [filteredAndSortedThreads]
  );

  // ============================================================================
  // Render Helpers
  // ============================================================================

  const renderThreadGroup = (
    title: string,
    threads: IChatHistoryThread[]
  ) => {
    if (threads.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-textDimmedColor px-3 mb-2">
          {title}
        </h3>
        <div className="space-y-1">
          {threads.map((thread) => (
            <ThreadItem
              key={thread.id}
              thread={thread}
              selectedThread={thread.id === activeThreadId}
              onClick={onThreadClick}
              onDelete={onThreadDelete}
            />
          ))}
        </div>
      </div>
    );
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className={`history-sidebar flex flex-col h-full bg-bgCardColor ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-borderDefault">
        {/* New Chat Button */}
        <button
          type="button"
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-textPurple text-white rounded-lg hover:opacity-90 transition-opacity mb-3"
        >
          <Plus size={18} />
          <span className="font-medium">New Chat</span>
        </button>

        {/* Search */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-textDimmedColor"
          />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-bgStreamingThoughtsColor border border-borderDefault rounded-lg text-sm placeholder:text-textDimmedColor focus:outline-none focus:ring-2 focus:ring-textPurple"
          />
        </div>
      </div>

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-textPurple" />
          </div>
        ) : filteredAndSortedThreads.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-textDimmedColor text-sm">
              {searchQuery ? 'No chats found' : 'No chats yet'}
            </p>
          </div>
        ) : (
          <>
            {renderThreadGroup('Today', groupedThreads.today)}
            {renderThreadGroup('Yesterday', groupedThreads.yesterday)}
            {renderThreadGroup('Last 7 Days', groupedThreads.lastWeek)}
            {renderThreadGroup('Last 30 Days', groupedThreads.lastMonth)}
            {renderThreadGroup('Older', groupedThreads.older)}
          </>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// Display Name
// ============================================================================

HistorySidebar.displayName = 'HistorySidebar';

// ============================================================================
// Export
// ============================================================================

export default HistorySidebar;
