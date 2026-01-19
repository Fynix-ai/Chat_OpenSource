/**
 * useAutoScroll Hook
 * 
 * Automatically scrolls to the bottom of a container when new content is added.
 * Useful for chat interfaces, logs, and real-time data displays.
 * 
 * Features:
 * - Smart scrolling (only scrolls if user is near bottom)
 * - Smooth animations
 * - Dependency tracking
 * - Manual scroll detection
 * 
 * @module hooks/useAutoScroll
 * 
 * @example
 * ```tsx
 * const { containerRef, scrollToBottom, isAtBottom } = useAutoScroll({
 *   dependencies: [messages.length],
 *   enabled: true,
 * });
 * 
 * return (
 *   <div ref={containerRef}>
 *     {messages.map(msg => <Message key={msg.id} {...msg} />)}
 *   </div>
 * );
 * ```
 */

import { useRef, useEffect, useCallback, useState } from 'react';

// ============================================================================
// Types
// ============================================================================

interface UseAutoScrollOptions {
  /** Dependencies that trigger auto-scroll */
  dependencies?: React.DependencyList;
  
  /** Whether auto-scroll is enabled */
  enabled?: boolean;
  
  /** Scroll behavior (smooth or auto) */
  behavior?: ScrollBehavior;
  
  /** Threshold in pixels to consider "at bottom" */
  threshold?: number;
  
  /** Delay before scrolling (in milliseconds) */
  delay?: number;
}

interface UseAutoScrollReturn {
  /** Ref to attach to the scrollable container */
  containerRef: React.RefObject<HTMLDivElement>;
  
  /** Manually trigger scroll to bottom */
  scrollToBottom: (force?: boolean) => void;
  
  /** Whether the container is currently at the bottom */
  isAtBottom: boolean;
  
  /** Scroll to top */
  scrollToTop: () => void;
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function useAutoScroll(
  options: UseAutoScrollOptions = {}
): UseAutoScrollReturn {
  const {
    dependencies = [],
    enabled = true,
    behavior = 'smooth',
    threshold = 100,
    delay = 0,
  } = options;

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // State
  const [isAtBottom, setIsAtBottom] = useState(true);

  // ============================================================================
  // Helper Functions
  // ============================================================================

  /**
   * Check if container is near bottom
   */
  const checkIfAtBottom = useCallback((): boolean => {
    const container = containerRef.current;
    if (!container) return false;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    return distanceFromBottom <= threshold;
  }, [threshold]);

  /**
   * Scroll to bottom of container
   */
  const scrollToBottom = useCallback(
    (force = false) => {
      const container = containerRef.current;
      if (!container) return;

      // Only scroll if forced or if auto-scroll is enabled and user isn't manually scrolling
      if (force || (enabled && !isUserScrollingRef.current)) {
        // Clear any pending scroll
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        // Apply delay if specified
        if (delay > 0) {
          scrollTimeoutRef.current = setTimeout(() => {
            container.scrollTo({
              top: container.scrollHeight,
              behavior,
            });
            setIsAtBottom(true);
          }, delay);
        } else {
          container.scrollTo({
            top: container.scrollHeight,
            behavior,
          });
          setIsAtBottom(true);
        }
      }
    },
    [enabled, behavior, delay]
  );

  /**
   * Scroll to top of container
   */
  const scrollToTop = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTo({
      top: 0,
      behavior,
    });
    setIsAtBottom(false);
  }, [behavior]);

  // ============================================================================
  // Scroll Event Handler
  // ============================================================================

  /**
   * Handle scroll events to detect manual scrolling
   */
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check if at bottom
    const atBottom = checkIfAtBottom();
    setIsAtBottom(atBottom);

    // If user scrolls away from bottom, disable auto-scroll temporarily
    if (!atBottom) {
      isUserScrollingRef.current = true;

      // Re-enable auto-scroll after a delay if user scrolls back to bottom
      setTimeout(() => {
        if (checkIfAtBottom()) {
          isUserScrollingRef.current = false;
        }
      }, 1000);
    } else {
      isUserScrollingRef.current = false;
    }
  }, [checkIfAtBottom]);

  // ============================================================================
  // Effects
  // ============================================================================

  /**
   * Attach scroll listener
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  /**
   * Auto-scroll when dependencies change
   */
  useEffect(() => {
    if (enabled && isAtBottom) {
      scrollToBottom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...dependencies]);

  /**
   * Cleanup timeout on unmount
   */
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // ============================================================================
  // Return Hook Interface
  // ============================================================================

  return {
    containerRef,
    scrollToBottom,
    isAtBottom,
    scrollToTop,
  };
}

// ============================================================================
// Export Default
// ============================================================================

export default useAutoScroll;
