/**
 * Core Type Definitions for AI Chat Interface
 * 
 * This file contains all the essential types used throughout the chat application.
 * These types ensure type safety and provide excellent IntelliSense support.
 * 
 * @module types/chat.types
 */

// ============================================================================
// Message Types
// ============================================================================

/**
 * Base message interface
 * All messages extend from this base interface
 */
export interface IBaseMessage {
  /** Unique identifier for the message */
  id: string;
  
  /** Role of the message sender */
  role: 'user' | 'assistant' | 'system';
  
  /** Timestamp when the message was created */
  timestamp?: Date;
}

/**
 * User message with optional file attachments
 */
export interface IUserMessage extends IBaseMessage {
  role: 'user';
  
  /** The text content of the message */
  content: string;
  
  /** Optional images attached to the message */
  images?: IImageAttachment[];
  
  /** Selected knowledge bases for context */
  selected_kbs?: string[];
  
  /** Desired output format (text, json, markdown, etc.) */
  outputResponseFormat?: string;
}

/**
 * Image attachment metadata
 */
export interface IImageAttachment {
  /** MIME type of the image */
  type: string;
  
  /** Original filename */
  filename: string;
  
  /** CDN or storage URL */
  url: string;
}

/**
 * Assistant message with streaming chunks
 */
export interface IAssistantMessage extends IBaseMessage {
  role: 'assistant';
  
  /** Chunks of content streamed from the AI */
  assistantChunks: IAssistantChunk[];
  
  /** User's reaction to the message (optional) */
  reaction?: IMessageReaction;
}

/**
 * Different types of content chunks in assistant responses
 */
export type IAssistantChunk =
  | IStreamingChunk
  | ISupervisorStreamingChunk
  | IToolStartChunk
  | IToolUsedChunk
  | IConsolidatedDataChunk
  | IErrorChunk
  | INetworkErrorChunk
  | INextQuestionsChunk;

/**
 * Regular streaming text chunk
 */
export interface IStreamingChunk {
  type: 'streaming';
  content: string;
  timestamp?: number;
}

/**
 * Supervisor (final) streaming chunk
 */
export interface ISupervisorStreamingChunk {
  type: 'supervisor_streaming';
  content: string;
  timestamp?: number;
}

/**
 * Tool execution start indicator
 */
export interface IToolStartChunk {
  type: 'toolStart';
  run_id?: string;
  message?: {
    action?: string;
    param?: string;
  };
  tip?: string;
}

/**
 * Tool execution result
 */
export interface IToolUsedChunk {
  type: 'toolUsed';
  run_id?: string;
  result?: any;
  timestamp?: number;
}

/**
 * Consolidated data from multiple sources
 */
export interface IConsolidatedDataChunk {
  type: 'consolidated_data';
  content: any[];
}

/**
 * Error during processing
 */
export interface IErrorChunk {
  type: 'error';
  content: string;
}

/**
 * Network error
 */
export interface INetworkErrorChunk {
  type: 'network_error';
  content: string;
}

/**
 * Suggested follow-up questions
 */
export interface INextQuestionsChunk {
  type: 'next_questions';
  content: string; // JSON string of questions array
}

/**
 * User reaction to a message
 */
export interface IMessageReaction {
  type: 'liked' | 'disliked';
  dislike_reason_id: number | null;
  details: string | null;
}

// ============================================================================
// Thread/Conversation Types
// ============================================================================

/**
 * Chat thread containing messages and metadata
 */
export interface IChatThread {
  /** Unique thread identifier */
  id: string;
  
  /** Messages in this thread */
  messages: (IUserMessage | IAssistantMessage)[];
  
  /** Whether the AI is currently streaming a response */
  streaming: boolean;
  
  /** Current progress message during streaming */
  progressMessage: string | null;
  
  /** Last message ID in the thread */
  lastMessageId: string | null;
  
  /** Computer tool state for advanced interactions */
  computerState: IComputerState;
  
  /** Thread creation timestamp */
  createdAt?: Date;
  
  /** Last updated timestamp */
  updatedAt?: Date;
}

/**
 * Computer tool state for visual debugging
 */
export interface IComputerState {
  /** Progress tracker for computer tool actions */
  progressTracker: IProgressItem[];
}

/**
 * Progress tracking item
 */
export interface IProgressItem {
  /** Unique identifier */
  id: string;
  
  /** Action being performed */
  action: string;
  
  /** Status of the action */
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  
  /** Optional result data */
  result?: any;
  
  /** Timestamp */
  timestamp: number;
}

// ============================================================================
// Chat State Management
// ============================================================================

/**
 * Product mode for different chat behaviors
 */
export type ProductMode = 'general' | 'code' | 'data' | 'creative';

/**
 * Global chat store state
 */
export interface IChatState {
  /** All threads indexed by ID */
  threadsById: Record<string, IChatThread>;
  
  /** Currently active thread ID */
  activeThreadId: string | null;
  
  /** Current product mode */
  productMode: ProductMode;
  
  /** Module output configuration */
  moduleOutputObject: IModuleOutput;
  
  /** Abort controllers for cancelling streams */
  abortControllers: Record<string, AbortController>;
  
  /** Available dislike reasons */
  dislikeReasons: IDislikeReason[];
}

/**
 * Module output configuration
 */
export interface IModuleOutput {
  /** Selected knowledge bases */
  selected_kbs: string[];
  
  /** Desired output format */
  output: string;
}

/**
 * Dislike reason option
 */
export interface IDislikeReason {
  id: number;
  reason: string;
}

// ============================================================================
// File Upload Types
// ============================================================================

/**
 * Extended file with upload metadata
 */
export interface IExtendedFile {
  /** The original File object */
  file: File;
  
  /** Generated filename for storage */
  filename: string;
  
  /** CDN URL after successful upload */
  cdnUrl?: string;
  
  /** Whether file is currently uploading */
  isUploading?: boolean;
  
  /** Unique upload identifier */
  uploadId: string;
  
  /** Controller for cancelling upload */
  uploadAbortController?: AbortController;
  
  /** Upload progress (0-100) */
  uploadProgress?: number;
  
  /** Error message if upload failed */
  uploadError?: string;
}

/**
 * File upload configuration
 */
export interface IFileUploadConfig {
  /** Maximum number of files allowed */
  maxFiles: number;
  
  /** Maximum file size in bytes */
  maxFileSize: number;
  
  /** Allowed MIME types */
  allowedTypes: string[];
}

// ============================================================================
// UI Component Types
// ============================================================================

/**
 * Chat input props
 */
export interface IChatInputProps {
  /** Initial query to populate input */
  initialQuery?: string;
  
  /** Callback when message is submitted */
  onSubmit?: (message: string, files: IExtendedFile[]) => void;
  
  /** Placeholder text */
  placeholder?: string;
  
  /** Whether input is disabled */
  disabled?: boolean;
}

/**
 * Message component props
 */
export interface IMessageProps {
  /** The message to display */
  message: IUserMessage | IAssistantMessage;
  
  /** Whether this message is currently streaming */
  isStreaming?: boolean;
  
  /** Current progress message */
  progressMessage?: string;
  
  /** Whether to show action buttons (like/dislike) */
  showActions?: boolean;
}

/**
 * Starter prompt configuration
 */
export interface IStarterPrompt {
  /** Display text */
  text: string;
  
  /** Optional icon component */
  icon?: React.ComponentType<any>;
  
  /** Optional category */
  category?: string;
}

/**
 * Preview object for side panel
 */
export interface IPreviewObject {
  /** Preview title */
  title: string;
  
  /** Preview description */
  description: string;
  
  /** Preview image URL */
  image: string;
  
  /** Type of preview */
  type: 'file' | 'chart' | 'computer' | 'streaming_toughts_preview' | string;
  
  /** Optional data payload */
  data?: any;
  
  /** Optional streaming thoughts */
  streamingThoughts?: string[];
}

// ============================================================================
// API Types
// ============================================================================

/**
 * API response wrapper
 */
export interface IApiResponse<T = any> {
  /** Whether request was successful */
  success: boolean;
  
  /** Response data */
  data?: T;
  
  /** Error message if failed */
  message?: string;
  
  /** HTTP status code */
  status?: number;
}

/**
 * Streaming configuration
 */
export interface IStreamingConfig {
  /** API endpoint for streaming */
  endpoint: string;
  
  /** Message to stream */
  message: string;
  
  /** Thread ID */
  threadId: string;
  
  /** Optional uploaded files */
  uploadedFiles?: IImageAttachment[];
  
  /** Whether this is a new chat */
  isNewChat?: boolean;
  
  /** Product mode */
  productMode?: ProductMode;
  
  /** Callback when thread ID changes */
  onThreadIdChange?: (threadId: string) => void;
}

// ============================================================================
// Chart Types (for visualization)
// ============================================================================

/**
 * Chart configuration
 * Based on ECharts options but simplified
 */
export interface IChartConfig {
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'box_and_whisker' | 'superchart';
  title?: string;
  data?: any;
  elements?: IChartConfig[]; // For superchart
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Generic callback function type
 */
export type Callback<T = void> = (arg: T) => void;

/**
 * Async callback function type
 */
export type AsyncCallback<T = void> = (arg: T) => Promise<void>;

/**
 * Optional properties helper
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make all properties required
 */
export type RequiredAll<T> = {
  [P in keyof T]-?: T[P];
};
