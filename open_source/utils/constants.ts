/**
 * Application Constants
 * 
 * Centralized location for all constant values used throughout the application.
 * This promotes consistency and makes configuration changes easier.
 * 
 * @module utils/constants
 */

// ============================================================================
// File Upload Constants
// ============================================================================

/**
 * Allowed file types for upload
 * These are MIME types that the application accepts
 */
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
] as const;

/**
 * Maximum file size in bytes (5MB)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Maximum number of files that can be uploaded at once
 */
export const MAX_FILES_ALLOWED = 5;

// ============================================================================
// UI Constants
// ============================================================================

/**
 * Default placeholder text for chat input
 */
export const DEFAULT_PLACEHOLDER = 'How can I help you today?';

/**
 * Thinking message shown during initial processing
 */
export const CHAT_INPUT_THINKING_MESSAGE = 'Thinking...';

/**
 * Default messages for various states
 */
export const MESSAGES = {
  LOADING: 'Loading chat history...',
  ERROR: 'Failed to load chat',
  NO_MESSAGES: 'No messages yet. Start a conversation!',
  STREAMING: 'AI is thinking...',
  COMPLETED: 'Answer completed',
} as const;

// ============================================================================
// Animation Constants
// ============================================================================

/**
 * Default animation duration in seconds
 */
export const ANIMATION_DURATION = 0.2;

/**
 * Default easing function for animations
 */
export const ANIMATION_EASING = 'backOut';

// ============================================================================
// API Constants
// ============================================================================

/**
 * API endpoints (configure based on your backend)
 */
export const API_ENDPOINTS = {
  STREAM: '/api/chat/stream',
  UPLOAD: '/api/upload',
  THREADS: '/api/threads',
  MESSAGES: '/api/messages',
  REACTIONS: '/api/reactions',
  PROMPTS: '/api/prompts',
} as const;

/**
 * Request timeout in milliseconds
 */
export const REQUEST_TIMEOUT = 30000; // 30 seconds

/**
 * Retry configuration
 */
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  BACKOFF_MULTIPLIER: 2,
} as const;

// ============================================================================
// Chat Constants
// ============================================================================

/**
 * Maximum number of messages to display
 */
export const MAX_MESSAGES_DISPLAY = 100;

/**
 * Auto-scroll delay in milliseconds
 */
export const AUTO_SCROLL_DELAY = 100;

/**
 * Debounce delay for typing indicators in milliseconds
 */
export const TYPING_DEBOUNCE_DELAY = 300;

// ============================================================================
// Product Modes
// ============================================================================

/**
 * Available product modes
 */
export const PRODUCT_MODES = {
  GENERAL: 'general',
  CODE: 'code',
  DATA: 'data',
  CREATIVE: 'creative',
} as const;

// ============================================================================
// Theme Constants
// ============================================================================

/**
 * Available themes
 */
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
} as const;

// ============================================================================
// Storage Keys
// ============================================================================

/**
 * LocalStorage keys for persisting state
 */
export const STORAGE_KEYS = {
  THEME: 'chat_theme',
  ACTIVE_THREAD: 'chat_active_thread',
  USER_PREFERENCES: 'chat_user_preferences',
} as const;

// ============================================================================
// Error Messages
// ============================================================================

/**
 * Standard error messages
 */
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File is too large. Maximum size is 5MB',
  INVALID_FILE_TYPE: 'Invalid file type. Allowed types: JPEG, PNG, WebP',
  MAX_FILES_EXCEEDED: 'Maximum number of files exceeded',
  UPLOAD_FAILED: 'Upload failed. Please try again',
  NETWORK_ERROR: 'Network error. Please check your connection',
  STREAM_ERROR: 'Streaming error. Please try again',
  GENERIC_ERROR: 'Something went wrong. Please try again',
} as const;

// ============================================================================
// Regular Expressions
// ============================================================================

/**
 * Common regex patterns
 */
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  MARKDOWN_CODE_BLOCK: /```(\w+)?\n([\s\S]*?)```/g,
} as const;

// ============================================================================
// Accessibility
// ============================================================================

/**
 * ARIA labels and roles
 */
export const ARIA_LABELS = {
  CHAT_INPUT: 'Message input',
  SEND_BUTTON: 'Send message',
  FILE_UPLOAD: 'Upload file',
  LIKE_BUTTON: 'Like response',
  DISLIKE_BUTTON: 'Dislike response',
  MESSAGE_LIST: 'Chat messages',
} as const;

// ============================================================================
// Feature Flags
// ============================================================================

/**
 * Feature flags for enabling/disabling features
 * In production, these would come from environment variables
 */
export const FEATURE_FLAGS = {
  ENABLE_FILE_UPLOAD: true,
  ENABLE_VOICE_INPUT: false,
  ENABLE_CHARTS: true,
  ENABLE_CODE_EXECUTION: false,
  ENABLE_REACTIONS: true,
} as const;

// ============================================================================
// Chart Constants
// ============================================================================

/**
 * Chart configuration defaults
 */
export const CHART_DEFAULTS = {
  MIN_HEIGHT: 300,
  MAX_HEIGHT: 600,
  ANIMATION_DURATION: 1000,
  COLOR_PALETTE: [
    '#8b5cf6', // purple
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
  ],
} as const;

// ============================================================================
// Markdown Constants
// ============================================================================

/**
 * Markdown rendering configuration
 */
export const MARKDOWN_CONFIG = {
  ENABLE_GFM: true, // GitHub Flavored Markdown
  ENABLE_SYNTAX_HIGHLIGHTING: true,
  ENABLE_TABLES: true,
  ENABLE_TASK_LISTS: true,
  CODE_THEME_LIGHT: 'prism',
  CODE_THEME_DARK: 'vscDarkPlus',
} as const;

// ============================================================================
// Performance Constants
// ============================================================================

/**
 * Performance optimization thresholds
 */
export const PERFORMANCE = {
  LARGE_MESSAGE_THRESHOLD: 1000, // characters
  DEBOUNCE_DELAY: 300, // milliseconds
  THROTTLE_DELAY: 1000, // milliseconds
  CHUNK_SIZE: 1024, // bytes
} as const;
