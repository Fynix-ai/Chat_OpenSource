/**
 * AI Chat Interface - Open Source
 * 
 * Main export file for the entire library.
 * Import components, hooks, types, and utilities from this file.
 * 
 * @example
 * ```tsx
 * // Chat Components
 * import {
 *   InitialChatPage,
 *   ChatInput,
 *   useFileUpload,
 * } from './open_source';
 * 
 * // History Components
 * import {
 *   HistorySidebar,
 *   useHistory,
 * } from './open_source';
 * ```
 */

// ============================================================================
// CHAT MODULE
// ============================================================================

// Chat Components
export {
  ChatHeader,
  StarterPrompts,
  InitialChatPage,
} from './chat/components/InitialChat';

export {
  MessageList,
  UserMessage,
  AssistantMessage,
} from './chat/components/ExistingChat';

export {
  ChatInput,
  FileUploadButton,
  FilePreview,
  MarkdownRenderer,
} from './chat/components/Shared';

// Chat Hooks
export {
  useFileUpload,
  useStreaming,
  useAutoScroll,
} from './chat/hooks';

// Chat Services
export { MockApiService } from './chat/services/mockApiService';
export { StreamingService } from './chat/services/streamingService';

export {
  createStreamingConnection,
  createEventSourceConnection,
  mockStreaming,
  parseSseLine,
  reconnectWithBackoff,
} from './chat/services/streamingService';

// ============================================================================
// HISTORY MODULE
// ============================================================================

// History Components
export {
  ThreadItem,
  HistorySidebar,
  CollapsedSidebar,
} from './history/components';

// History Hooks
export {
  useHistory,
} from './history/hooks';

// History Types
export type {
  IChatHistoryThread,
  ISidebarItem,
  IHistoryContext,
  IThreadItemProps,
  IHistoryStore,
  IGroupedThreads,
} from './history/types';

// History Utils
export {
  groupThreadsByDate,
  getThreadTimeLabel,
  filterThreadsByQuery,
  sortThreadsByDate,
  createNewThreadId,
  generateThreadTitle,
  navigateToThread,
  createNewChat,
  isValidThreadId,
  isThreadActive,
  saveThreadsToStorage,
  loadThreadsFromStorage,
} from './history/utils/historyHelpers';

// ============================================================================
// SHARED TYPES
// ============================================================================

export type {
  // Message Types
  IBaseMessage,
  IUserMessage,
  IAssistantMessage,
  IAssistantChunk,
  IStreamingChunk,
  ISupervisorStreamingChunk,
  IToolStartChunk,
  IToolUsedChunk,
  IConsolidatedDataChunk,
  IErrorChunk,
  INetworkErrorChunk,
  INextQuestionsChunk,
  IMessageReaction,
  IImageAttachment,
  
  // Thread Types
  IChatThread,
  IComputerState,
  IProgressItem,
  
  // State Types
  ProductMode,
  IChatState,
  IModuleOutput,
  IDislikeReason,
  
  // File Upload Types
  IExtendedFile,
  IFileUploadConfig,
  
  // UI Component Types
  IChatInputProps,
  IMessageProps,
  IStarterPrompt,
  IPreviewObject,
  
  // API Types
  IApiResponse,
  IStreamingConfig,
  
  // Chart Types
  IChartConfig,
  
  // Utility Types
  Callback,
  AsyncCallback,
  Optional,
  RequiredAll,
} from './types';

// ============================================================================
// SHARED UTILITIES
// ============================================================================

export {
  // Date & Time
  formatDate,
  formatDateTime,
  getRelativeTime,
  
  // String
  truncate,
  capitalize,
  slugify,
  generateId,
  
  // File
  validateFile,
  formatFileSize,
  getFileExtension,
  generateSafeFilename,
  
  // Array
  unique,
  chunk,
  shuffle,
  
  // Object
  deepClone,
  isEmpty,
  pick,
  omit,
  
  // Validation
  isValidEmail,
  isValidUrl,
  isDefined,
  
  // Async
  sleep,
  retry,
  debounce,
  throttle,
  
  // Color
  hexToRgb,
  randomColor,
  
  // Browser
  copyToClipboard,
  downloadFile,
  isBrowser,
  getPreferredColorScheme,
  
  // Error Handling
  safeJsonParse,
  getErrorMessage,
  
  // Performance
  measureTime,
} from './utils/helpers';

export {
  // File Upload
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  MAX_FILES_ALLOWED,
  
  // UI
  DEFAULT_PLACEHOLDER,
  CHAT_INPUT_THINKING_MESSAGE,
  MESSAGES,
  
  // Animation
  ANIMATION_DURATION,
  ANIMATION_EASING,
  
  // API
  API_ENDPOINTS,
  REQUEST_TIMEOUT,
  RETRY_CONFIG,
  
  // Chat
  MAX_MESSAGES_DISPLAY,
  AUTO_SCROLL_DELAY,
  TYPING_DEBOUNCE_DELAY,
  
  // Product Modes
  PRODUCT_MODES,
  
  // Theme
  THEMES,
  
  // Storage
  STORAGE_KEYS,
  
  // Errors
  ERROR_MESSAGES,
  
  // Regex
  REGEX_PATTERNS,
  
  // Accessibility
  ARIA_LABELS,
  
  // Features
  FEATURE_FLAGS,
  
  // Charts
  CHART_DEFAULTS,
  
  // Markdown
  MARKDOWN_CONFIG,
  
  // Performance
  PERFORMANCE,
} from './utils/constants';

// ============================================================================
// VERSION
// ============================================================================

export const VERSION = '1.0.0';
