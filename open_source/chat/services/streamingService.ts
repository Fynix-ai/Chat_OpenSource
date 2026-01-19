/**
 * Streaming Service
 * 
 * Handles Server-Sent Events (SSE) for real-time streaming responses.
 * This service manages the connection, parsing, and error handling for streaming data.
 * 
 * @module services/streamingService
 */

import { IStreamingConfig, IAssistantChunk } from '../types';
import { getErrorMessage } from '../utils/helpers';

// ============================================================================
// Types
// ============================================================================

interface StreamingOptions {
  onChunk: (chunk: IAssistantChunk) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
  signal?: AbortSignal;
}

// ============================================================================
// Streaming Service
// ============================================================================

/**
 * Create a streaming connection using Server-Sent Events
 * 
 * @example
 * ```tsx
 * const abort = createStreamingConnection({
 *   endpoint: '/api/stream',
 *   onChunk: (chunk) => console.log(chunk),
 *   onComplete: () => console.log('Complete'),
 *   onError: (error) => console.error(error),
 * });
 * 
 * // Later, to cancel:
 * abort.abort();
 * ```
 */
export function createStreamingConnection(
  config: IStreamingConfig & StreamingOptions
): AbortController {
  const abortController = new AbortController();

  // Start the streaming connection
  startStreaming(config, abortController.signal);

  return abortController;
}

/**
 * Start streaming data from the endpoint
 */
async function startStreaming(
  config: IStreamingConfig & StreamingOptions,
  signal: AbortSignal
): Promise<void> {
  const { endpoint, message, threadId, onChunk, onComplete, onError } = config;

  try {
    // Build request body
    const requestBody = {
      message,
      threadId,
      uploadedFiles: config.uploadedFiles || [],
      isNewChat: config.isNewChat || false,
      productMode: config.productMode || 'general',
    };

    // Create fetch request with streaming
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if response is streamable
    if (!response.body) {
      throw new Error('Response body is not readable');
    }

    // Read the stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        // Stream completed
        onComplete();
        break;
      }

      // Decode the chunk
      buffer += decoder.decode(value, { stream: true });

      // Process complete chunks (separated by newlines)
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep the last incomplete line in buffer

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          // Parse SSE format (data: {...})
          const cleanedLine = line.replace(/^data:\s*/, '');
          const chunk = JSON.parse(cleanedLine);

          // Call the chunk handler
          onChunk(chunk);

          // Handle thread ID changes (for new chats)
          if (chunk.type === 'thread_id' && config.onThreadIdChange) {
            config.onThreadIdChange(chunk.threadId);
          }
        } catch (error) {
          console.warn('Failed to parse chunk:', line, error);
        }
      }
    }
  } catch (error) {
    // Don't report abort errors as actual errors
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Stream aborted by user');
      return;
    }

    // Report actual errors
    onError(error instanceof Error ? error : new Error(getErrorMessage(error)));
  }
}

/**
 * Alternative implementation using EventSource (for traditional SSE)
 * Use this if your backend uses the standard SSE format with EventSource API
 */
export function createEventSourceConnection(
  config: IStreamingConfig & StreamingOptions
): () => void {
  const { endpoint, message, threadId, onChunk, onComplete, onError } = config;

  // Build query parameters
  const params = new URLSearchParams({
    message,
    threadId,
  });

  // Create EventSource connection
  const eventSource = new EventSource(`${endpoint}?${params.toString()}`);

  // Handle messages
  eventSource.onmessage = (event) => {
    try {
      const chunk = JSON.parse(event.data);
      onChunk(chunk);
    } catch (error) {
      console.warn('Failed to parse event data:', error);
    }
  };

  // Handle errors
  eventSource.onerror = (error) => {
    eventSource.close();
    onError(new Error('EventSource connection error'));
  };

  // Listen for completion event
  eventSource.addEventListener('complete', () => {
    eventSource.close();
    onComplete();
  });

  // Return cleanup function
  return () => {
    eventSource.close();
  };
}

/**
 * Mock streaming for development/testing
 * Simulates streaming with artificial delays
 */
export async function mockStreaming(
  config: IStreamingConfig & StreamingOptions
): Promise<void> {
  const { message, onChunk, onComplete, onError, signal } = config;

  try {
    // Simulate thinking time
    await delay(500, signal);

    // Send streaming chunks
    onChunk({
      type: 'streaming',
      content: 'Analyzing your question',
      timestamp: Date.now(),
    });

    await delay(800, signal);

    onChunk({
      type: 'streaming',
      content: 'Searching for relevant information',
      timestamp: Date.now(),
    });

    await delay(1000, signal);

    // Send tool start
    onChunk({
      type: 'toolStart',
      run_id: 'tool_123',
      message: {
        action: 'search',
        param: 'web',
      },
    });

    await delay(1500, signal);

    // Send tool result
    onChunk({
      type: 'toolUsed',
      run_id: 'tool_123',
      result: { data: 'Sample result' },
      timestamp: Date.now(),
    });

    await delay(500, signal);

    // Send final response
    const response = `This is a mock response to: "${message}". In a real application, this would be the AI's actual response based on your input.`;

    // Stream the response word by word
    const words = response.split(' ');
    let content = '';

    for (const word of words) {
      content += word + ' ';
      onChunk({
        type: 'supervisor_streaming',
        content,
        timestamp: Date.now(),
      });
      await delay(100, signal);
    }

    // Send completion
    onComplete();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Mock streaming aborted');
      return;
    }
    onError(error instanceof Error ? error : new Error(getErrorMessage(error)));
  }
}

/**
 * Delay helper that can be aborted
 */
function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms);

    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timeout);
        reject(new DOMException('Aborted', 'AbortError'));
      });
    }
  });
}

/**
 * Parse SSE data line
 * Handles the standard Server-Sent Events format
 */
export function parseSseLine(line: string): { event?: string; data?: string } | null {
  if (!line.trim()) return null;

  if (line.startsWith('event:')) {
    return { event: line.substring(6).trim() };
  }

  if (line.startsWith('data:')) {
    return { data: line.substring(5).trim() };
  }

  return null;
}

/**
 * Reconnect to streaming with exponential backoff
 */
export async function reconnectWithBackoff(
  config: IStreamingConfig & StreamingOptions,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    multiplier?: number;
  } = {}
): Promise<void> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    multiplier = 2,
  } = options;

  let delay = initialDelay;
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await startStreaming(config, config.signal || new AbortController().signal);
      return; // Success
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(getErrorMessage(error));

      if (attempt < maxRetries - 1) {
        console.log(`Reconnecting in ${delay}ms (attempt ${attempt + 1}/${maxRetries})...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay = Math.min(delay * multiplier, maxDelay);
      }
    }
  }

  // All retries failed
  if (lastError) {
    config.onError(lastError);
  }
}

// Export all functions as a service
export const StreamingService = {
  createStreamingConnection,
  createEventSourceConnection,
  mockStreaming,
  parseSseLine,
  reconnectWithBackoff,
};
