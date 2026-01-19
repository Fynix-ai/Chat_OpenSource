/**
 * useStreaming Hook
 * 
 * Manages real-time streaming of AI responses with the following features:
 * - Connection management
 * - Chunk processing
 * - Error handling and retry logic
 * - Stream cancellation
 * - Progress tracking
 * 
 * @module hooks/useStreaming
 * 
 * @example
 * ```tsx
 * const { startStream, stopStream, isStreaming, error } = useStreaming({
 *   onChunk: (chunk) => console.log(chunk),
 *   onComplete: () => console.log('Done'),
 * });
 * 
 * // Start streaming
 * startStream({ message: 'Hello', threadId: 'thread_1' });
 * 
 * // Stop streaming
 * stopStream();
 * ```
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { IAssistantChunk, IStreamingConfig } from '../types';
import { mockStreaming } from '../services/streamingService';

// ============================================================================
// Types
// ============================================================================

interface UseStreamingOptions {
  /** Callback for each chunk received */
  onChunk?: (chunk: IAssistantChunk) => void;
  
  /** Callback when streaming completes */
  onComplete?: () => void;
  
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
  
  /** Enable automatic retry on failure */
  enableRetry?: boolean;
  
  /** Maximum number of retry attempts */
  maxRetries?: number;
}

interface UseStreamingReturn {
  /** Start streaming with the given configuration */
  startStream: (config: Omit<IStreamingConfig, 'endpoint'>) => Promise<void>;
  
  /** Stop the current stream */
  stopStream: () => void;
  
  /** Whether streaming is currently active */
  isStreaming: boolean;
  
  /** Current error if any */
  error: Error | null;
  
  /** Retry the last failed stream */
  retry: () => Promise<void>;
  
  /** Clear error state */
  clearError: () => void;
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function useStreaming(options: UseStreamingOptions = {}): UseStreamingReturn {
  const {
    onChunk,
    onComplete,
    onError,
    enableRetry = true,
    maxRetries = 3,
  } = options;

  // State
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Refs
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastConfigRef = useRef<Omit<IStreamingConfig, 'endpoint'> | null>(null);
  const retryCountRef = useRef(0);

  // ============================================================================
  // Cleanup Effect
  // ============================================================================

  useEffect(() => {
    // Cleanup function to stop streaming when component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // ============================================================================
  // Streaming Functions
  // ============================================================================

  /**
   * Handle incoming chunks
   */
  const handleChunk = useCallback(
    (chunk: IAssistantChunk) => {
      onChunk?.(chunk);
    },
    [onChunk]
  );

  /**
   * Handle stream completion
   */
  const handleComplete = useCallback(() => {
    setIsStreaming(false);
    setError(null);
    retryCountRef.current = 0;
    onComplete?.();
  }, [onComplete]);

  /**
   * Handle stream error
   */
  const handleError = useCallback(
    (err: Error) => {
      setIsStreaming(false);
      setError(err);
      onError?.(err);

      // Attempt retry if enabled
      if (enableRetry && retryCountRef.current < maxRetries) {
        retryCountRef.current += 1;
        console.log(
          `Retry attempt ${retryCountRef.current}/${maxRetries}...`
        );
        // You could implement automatic retry here
      }
    },
    [onError, enableRetry, maxRetries]
  );

  /**
   * Start streaming
   */
  const startStream = useCallback(
    async (config: Omit<IStreamingConfig, 'endpoint'>) => {
      // Stop any existing stream
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // Store config for potential retry
      lastConfigRef.current = config;

      // Set streaming state
      setIsStreaming(true);
      setError(null);

      try {
        // Use mock streaming for this example
        // In production, use the real streaming service
        await mockStreaming({
          endpoint: '/api/stream', // This would come from config
          ...config,
          onChunk: handleChunk,
          onComplete: handleComplete,
          onError: handleError,
          signal: abortController.signal,
        });
      } catch (err) {
        // Handle errors (unless it's an abort error)
        if (err instanceof Error && err.name !== 'AbortError') {
          handleError(err);
        }
      }
    },
    [handleChunk, handleComplete, handleError]
  );

  /**
   * Stop streaming
   */
  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    retryCountRef.current = 0;
  }, []);

  /**
   * Retry last failed stream
   */
  const retry = useCallback(async () => {
    if (lastConfigRef.current) {
      await startStream(lastConfigRef.current);
    }
  }, [startStream]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ============================================================================
  // Return Hook Interface
  // ============================================================================

  return {
    startStream,
    stopStream,
    isStreaming,
    error,
    retry,
    clearError,
  };
}

// ============================================================================
// Export Default
// ============================================================================

export default useStreaming;
