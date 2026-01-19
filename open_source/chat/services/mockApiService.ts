/**
 * Mock API Service
 * 
 * This service simulates backend API calls for development and testing.
 * Replace these with real API calls in production.
 * 
 * @module services/mockApiService
 */

import {
  IApiResponse,
  IUserMessage,
  IAssistantMessage,
  IStarterPrompt,
  IDislikeReason,
  IChatThread,
  IImageAttachment,
} from '../types';
import { sleep, generateId } from '../utils/helpers';

// ============================================================================
// Mock Data
// ============================================================================

/**
 * Mock starter prompts
 */
const MOCK_STARTER_PROMPTS: IStarterPrompt[] = [
  {
    text: 'Explain quantum computing in simple terms',
    category: 'education',
  },
  {
    text: 'Write a React component for a todo list',
    category: 'coding',
  },
  {
    text: 'Analyze this sales data and create a chart',
    category: 'data',
  },
  {
    text: 'Generate creative ideas for a blog post',
    category: 'creative',
  },
];

/**
 * Mock dislike reasons
 */
const MOCK_DISLIKE_REASONS: IDislikeReason[] = [
  { id: 1, reason: 'Inaccurate information' },
  { id: 2, reason: 'Not helpful' },
  { id: 3, reason: 'Inappropriate content' },
  { id: 4, reason: 'Too verbose' },
  { id: 5, reason: 'Missing key details' },
  { id: 6, reason: 'Other' },
];

/**
 * Mock streaming responses
 */
const MOCK_STREAMING_RESPONSES = [
  'Let me think about that...',
  'Analyzing your question...',
  'Here\'s what I found:',
  'Based on the information available:',
  'To answer your question:',
];

// ============================================================================
// API Functions
// ============================================================================

/**
 * Fetch starter prompts
 * 
 * @example
 * const prompts = await fetchStarterPrompts();
 */
export async function fetchStarterPrompts(): Promise<IApiResponse<IStarterPrompt[]>> {
  // Simulate network delay
  await sleep(500);

  return {
    success: true,
    data: MOCK_STARTER_PROMPTS,
    status: 200,
  };
}

/**
 * Fetch dislike reasons
 */
export async function fetchDislikeReasons(): Promise<IApiResponse<IDislikeReason[]>> {
  await sleep(300);

  return {
    success: true,
    data: MOCK_DISLIKE_REASONS,
    status: 200,
  };
}

/**
 * Fetch a thread's messages
 * 
 * @param threadId - The thread ID to fetch
 */
export async function fetchThreadMessages(
  threadId: string
): Promise<IApiResponse<IChatThread>> {
  await sleep(800);

  // Mock thread data
  const mockThread: IChatThread = {
    id: threadId,
    messages: [
      {
        id: generateId(),
        role: 'user',
        content: 'Hello! Can you help me with React?',
        timestamp: new Date(Date.now() - 60000),
      },
      {
        id: generateId(),
        role: 'assistant',
        assistantChunks: [
          {
            type: 'supervisor_streaming',
            content: 'Of course! I\'d be happy to help you with React. What specific aspect would you like to learn about?',
          },
        ],
        timestamp: new Date(Date.now() - 50000),
      },
    ],
    streaming: false,
    progressMessage: null,
    lastMessageId: null,
    computerState: {
      progressTracker: [],
    },
    createdAt: new Date(Date.now() - 120000),
    updatedAt: new Date(Date.now() - 50000),
  };

  return {
    success: true,
    data: mockThread,
    status: 200,
  };
}

/**
 * Send a message and start streaming response
 * 
 * @param message - The user's message
 * @param threadId - The thread ID
 * @param onChunk - Callback for each streaming chunk
 */
export async function sendMessage(
  message: string,
  threadId: string,
  onChunk?: (chunk: any) => void
): Promise<IApiResponse<{ threadId: string }>> {
  // Simulate streaming response
  const words = MOCK_STREAMING_RESPONSES[
    Math.floor(Math.random() * MOCK_STREAMING_RESPONSES.length)
  ].split(' ');

  for (const word of words) {
    await sleep(100);
    if (onChunk) {
      onChunk({
        type: 'streaming',
        content: word + ' ',
      });
    }
  }

  // Send final chunk
  if (onChunk) {
    onChunk({
      type: 'supervisor_streaming',
      content: '\n\nThis is a mock response. In production, this would be the actual AI response.',
    });
  }

  return {
    success: true,
    data: { threadId },
    status: 200,
  };
}

/**
 * Submit a reaction (like/dislike) to a message
 */
export async function submitReaction(
  threadId: string,
  messageId: string,
  reaction: 'liked' | 'disliked',
  dislikeReasonId?: number,
  details?: string
): Promise<IApiResponse> {
  await sleep(300);

  console.log('Reaction submitted:', {
    threadId,
    messageId,
    reaction,
    dislikeReasonId,
    details,
  });

  return {
    success: true,
    message: 'Reaction submitted successfully',
    status: 200,
  };
}

/**
 * Upload a file
 * 
 * @param file - The file to upload
 * @param onProgress - Callback for upload progress
 */
export async function uploadFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<IApiResponse<{ url: string; filename: string }>> {
  // Simulate upload progress
  for (let progress = 0; progress <= 100; progress += 10) {
    await sleep(100);
    if (onProgress) {
      onProgress(progress);
    }
  }

  // Generate mock URL
  const mockUrl = `https://cdn.example.com/uploads/${generateId()}_${file.name}`;

  return {
    success: true,
    data: {
      url: mockUrl,
      filename: file.name,
    },
    status: 200,
  };
}

/**
 * Get signed upload URL (for direct cloud uploads)
 */
export async function getSignedUploadUrl(
  filename: string
): Promise<IApiResponse<{ signedUrl: string; cdnUrl: string }>> {
  await sleep(200);

  const mockSignedUrl = `https://upload.example.com/sign?file=${filename}`;
  const mockCdnUrl = `https://cdn.example.com/uploads/${filename}`;

  return {
    success: true,
    data: {
      signedUrl: mockSignedUrl,
      cdnUrl: mockCdnUrl,
    },
    status: 200,
  };
}

/**
 * Cancel a streaming task
 */
export async function cancelStreamingTask(threadId: string): Promise<IApiResponse> {
  await sleep(100);

  console.log('Cancelled streaming task for thread:', threadId);

  return {
    success: true,
    message: 'Streaming task cancelled',
    status: 200,
  };
}

/**
 * Create a new thread
 */
export async function createThread(): Promise<IApiResponse<{ threadId: string }>> {
  await sleep(200);

  const threadId = `thread_${generateId()}`;

  return {
    success: true,
    data: { threadId },
    status: 200,
  };
}

/**
 * Get thread list for a user
 */
export async function getUserThreads(): Promise<IApiResponse<IChatThread[]>> {
  await sleep(500);

  const mockThreads: IChatThread[] = [
    {
      id: 'thread_1',
      messages: [],
      streaming: false,
      progressMessage: null,
      lastMessageId: null,
      computerState: { progressTracker: [] },
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      updatedAt: new Date(Date.now() - 3600000), // 1 hour ago
    },
    {
      id: 'thread_2',
      messages: [],
      streaming: false,
      progressMessage: null,
      lastMessageId: null,
      computerState: { progressTracker: [] },
      createdAt: new Date(Date.now() - 172800000), // 2 days ago
      updatedAt: new Date(Date.now() - 7200000), // 2 hours ago
    },
  ];

  return {
    success: true,
    data: mockThreads,
    status: 200,
  };
}

// ============================================================================
// Export all functions as a service
// ============================================================================

export const MockApiService = {
  fetchStarterPrompts,
  fetchDislikeReasons,
  fetchThreadMessages,
  sendMessage,
  submitReaction,
  uploadFile,
  getSignedUploadUrl,
  cancelStreamingTask,
  createThread,
  getUserThreads,
};
