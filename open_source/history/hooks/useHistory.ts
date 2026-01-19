/**
 * useHistory Hook
 * 
 * Manages chat history state and operations.
 * Provides CRUD operations for threads and history management.
 * 
 * @module history/hooks
 * 
 * @example
 * ```tsx
 * const {
 *   threads,
 *   activeThreadId,
 *   loading,
 *   createThread,
 *   deleteThread,
 *   setActiveThread,
 * } = useHistory();
 * ```
 */

import { useState, useCallback, useEffect } from 'react';
import { IChatHistoryThread } from '../types';
import {
  saveThreadsToStorage,
  loadThreadsFromStorage,
  createNewThreadId,
  generateThreadTitle,
} from '../utils/historyHelpers';

// ============================================================================
// Types
// ============================================================================

interface UseHistoryOptions {
  /** Enable localStorage persistence */
  enableStorage?: boolean;
  
  /** Initial threads */
  initialThreads?: IChatHistoryThread[];
  
  /** Callback when threads change */
  onThreadsChange?: (threads: IChatHistoryThread[]) => void;
}

interface UseHistoryReturn {
  /** All threads */
  threads: IChatHistoryThread[];
  
  /** Currently active thread ID */
  activeThreadId: string | null;
  
  /** Loading state */
  loading: boolean;
  
  /** Error state */
  error: string | null;
  
  /** Create a new thread */
  createThread: (title?: string) => string;
  
  /** Delete a thread */
  deleteThread: (id: string) => Promise<void>;
  
  /** Update thread title */
  updateThreadTitle: (id: string, title: string) => void;
  
  /** Set active thread */
  setActiveThread: (id: string | null) => void;
  
  /** Load threads from API */
  loadThreads: () => Promise<void>;
  
  /** Refresh threads */
  refreshThreads: () => Promise<void>;
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function useHistory(options: UseHistoryOptions = {}): UseHistoryReturn {
  const {
    enableStorage = true,
    initialThreads = [],
    onThreadsChange,
  } = options;

  // ============================================================================
  // State
  // ============================================================================

  const [threads, setThreads] = useState<IChatHistoryThread[]>(() => {
    if (enableStorage) {
      const stored = loadThreadsFromStorage();
      return stored || initialThreads;
    }
    return initialThreads;
  });

  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // Effects
  // ============================================================================

  /**
   * Save threads to storage when they change
   */
  useEffect(() => {
    if (enableStorage && threads.length > 0) {
      saveThreadsToStorage(threads);
    }
    onThreadsChange?.(threads);
  }, [threads, enableStorage, onThreadsChange]);

  // ============================================================================
  // CRUD Operations
  // ============================================================================

  /**
   * Create a new thread
   */
  const createThread = useCallback(
    (title?: string): string => {
      const threadId = createNewThreadId();
      const now = new Date();

      const newThread: IChatHistoryThread = {
        id: threadId,
        title: title || 'New Chat',
        created_at: now,
        updated_at: now,
        status: 'active',
      };

      setThreads((prev) => [newThread, ...prev]);
      setActiveThreadId(threadId);

      return threadId;
    },
    []
  );

  /**
   * Delete a thread
   */
  const deleteThread = useCallback(
    async (id: string): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        // In a real app, make API call here
        // await deleteThreadAPI(id);

        setThreads((prev) => prev.filter((thread) => thread.id !== id));

        // If deleted thread was active, clear active thread
        if (activeThreadId === id) {
          setActiveThreadId(null);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete thread';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [activeThreadId]
  );

  /**
   * Update thread title
   */
  const updateThreadTitle = useCallback(
    (id: string, title: string): void => {
      setThreads((prev) =>
        prev.map((thread) =>
          thread.id === id
            ? { ...thread, title, updated_at: new Date() }
            : thread
        )
      );
    },
    []
  );

  /**
   * Set active thread
   */
  const setActiveThread = useCallback((id: string | null): void => {
    setActiveThreadId(id);
  }, []);

  /**
   * Load threads from API
   */
  const loadThreads = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // In a real app, fetch from API
      // const response = await fetchThreadsAPI();
      // setThreads(response.data);

      // For now, use mock data or storage
      const stored = enableStorage ? loadThreadsFromStorage() : null;
      if (stored) {
        setThreads(stored);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load threads';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [enableStorage]);

  /**
   * Refresh threads
   */
  const refreshThreads = useCallback(async (): Promise<void> => {
    await loadThreads();
  }, [loadThreads]);

  // ============================================================================
  // Return Hook Interface
  // ============================================================================

  return {
    threads,
    activeThreadId,
    loading,
    error,
    createThread,
    deleteThread,
    updateThreadTitle,
    setActiveThread,
    loadThreads,
    refreshThreads,
  };
}

// ============================================================================
// Export Default
// ============================================================================

export default useHistory;
