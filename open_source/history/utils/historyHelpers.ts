/**
 * History Helper Functions
 * 
 * Utility functions for history management and thread grouping.
 * 
 * @module history/utils
 */

import { IChatHistoryThread, IGroupedThreads } from '../types';

// ============================================================================
// Thread Grouping
// ============================================================================

/**
 * Group threads by date (today, yesterday, last week, etc.)
 */
export function groupThreadsByDate(threads: IChatHistoryThread[]): IGroupedThreads {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastMonth = new Date(today);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const grouped: IGroupedThreads = {
    today: [],
    yesterday: [],
    lastWeek: [],
    lastMonth: [],
    older: [],
  };

  threads.forEach((thread) => {
    const threadDate = new Date(thread.updated_at);

    if (threadDate >= today) {
      grouped.today.push(thread);
    } else if (threadDate >= yesterday) {
      grouped.yesterday.push(thread);
    } else if (threadDate >= lastWeek) {
      grouped.lastWeek.push(thread);
    } else if (threadDate >= lastMonth) {
      grouped.lastMonth.push(thread);
    } else {
      grouped.older.push(thread);
    }
  });

  return grouped;
}

/**
 * Get relative time label for thread
 */
export function getThreadTimeLabel(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - new Date(date).getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

// ============================================================================
// Thread Filtering
// ============================================================================

/**
 * Filter threads by search query
 */
export function filterThreadsByQuery(
  threads: IChatHistoryThread[],
  query: string
): IChatHistoryThread[] {
  if (!query.trim()) return threads;

  const lowercaseQuery = query.toLowerCase();

  return threads.filter((thread) =>
    thread.title.toLowerCase().includes(lowercaseQuery)
  );
}

/**
 * Sort threads by date (most recent first)
 */
export function sortThreadsByDate(
  threads: IChatHistoryThread[]
): IChatHistoryThread[] {
  return [...threads].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
}

// ============================================================================
// Thread Actions
// ============================================================================

/**
 * Create new thread ID
 */
export function createNewThreadId(): string {
  return `thread_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate thread title from first message
 */
export function generateThreadTitle(
  message: string,
  maxLength: number = 50
): string {
  if (!message) return 'New Chat';

  // Remove extra whitespace
  const cleaned = message.replace(/\s+/g, ' ').trim();

  if (cleaned.length <= maxLength) return cleaned;

  // Truncate at word boundary
  const truncated = cleaned.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
}

// ============================================================================
// Navigation Helpers
// ============================================================================

/**
 * Navigate to thread
 */
export function navigateToThread(
  threadId: string,
  navigate: (path: string) => void
): void {
  navigate(`/chat/${threadId}`);
}

/**
 * Create new chat
 */
export function createNewChat(navigate: (path: string) => void): void {
  navigate('/chat');
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Validate thread ID
 */
export function isValidThreadId(id: string): boolean {
  return typeof id === 'string' && id.length > 0;
}

/**
 * Check if thread is active
 */
export function isThreadActive(thread: IChatHistoryThread): boolean {
  return thread.status === 'active' || !thread.status;
}

// ============================================================================
// Storage Helpers
// ============================================================================

/**
 * Save threads to localStorage
 */
export function saveThreadsToStorage(threads: IChatHistoryThread[]): void {
  try {
    localStorage.setItem('chat_threads', JSON.stringify(threads));
  } catch (error) {
    console.error('Failed to save threads:', error);
  }
}

/**
 * Load threads from localStorage
 */
export function loadThreadsFromStorage(): IChatHistoryThread[] | null {
  try {
    const stored = localStorage.getItem('chat_threads');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load threads:', error);
    return null;
  }
}
