/**
 * History Type Definitions
 * 
 * Type definitions for chat history and sidebar functionality.
 * 
 * @module history/types
 */

// ============================================================================
// Thread/History Types
// ============================================================================

/**
 * Chat thread in history
 */
export interface IChatHistoryThread {
  /** Unique thread identifier */
  id: string;
  
  /** Thread title */
  title: string;
  
  /** Last message ID */
  last_message_id?: string;
  
  /** Thread creation timestamp */
  created_at: Date;
  
  /** Last updated timestamp */
  updated_at: Date;
  
  /** Thread status */
  status?: 'active' | 'archived' | 'deleted';
  
  /** Product mode */
  product?: string;
}

/**
 * Sidebar configuration item
 */
export interface ISidebarItem {
  /** Unique identifier */
  id: string;
  
  /** Display label */
  label: string;
  
  /** Icon component */
  icon: React.ReactNode;
  
  /** Navigation path */
  path: string;
  
  /** Whether to show top border */
  borderTop?: boolean;
  
  /** Popup metadata */
  popupMetadata?: {
    title: string;
    description: string;
  };
  
  /** User permissions required */
  permissions?: string[];
  
  /** Additional CSS classes */
  className?: string;
  
  /** Whether to show this item */
  show?: boolean;
  
  /** Whether to show hover container */
  showHoverContainer?: boolean;
}

/**
 * History context state
 */
export interface IHistoryContext {
  /** Whether history is open */
  historyOpen: boolean;
  
  /** Set history open state */
  setHistoryOpen: (open: boolean) => void;
  
  /** Whether using federated routes */
  federatedRoutes?: boolean;
}

/**
 * Thread action types
 */
export type ThreadAction = 'delete' | 'archive' | 'rename' | 'pin';

/**
 * Thread item props
 */
export interface IThreadItemProps {
  /** The thread data */
  thread: IChatHistoryThread;
  
  /** Whether this is the last item (for infinite scroll) */
  isLast?: boolean;
  
  /** Whether this thread is selected */
  selectedThread?: boolean;
  
  /** Whether rendering in search modal */
  searchModal?: boolean;
  
  /** Click handler */
  onClick?: (threadId: string) => void;
  
  /** Delete handler */
  onDelete?: (threadId: string) => void;
}

// ============================================================================
// History Store Types
// ============================================================================

/**
 * History store state
 */
export interface IHistoryStore {
  /** All chat threads */
  threads: IChatHistoryThread[];
  
  /** Currently active thread ID */
  activeThreadId: string | null;
  
  /** Whether history is loaded */
  loaded: boolean;
  
  /** Loading state */
  loading: boolean;
  
  /** Error state */
  error: string | null;
  
  /** Actions */
  setThreads: (threads: IChatHistoryThread[]) => void;
  setActiveThreadId: (id: string | null) => void;
  deleteThread: (id: string) => Promise<void>;
  archiveThread: (id: string) => Promise<void>;
  renameThread: (id: string, title: string) => Promise<void>;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Grouped threads by date
 */
export interface IGroupedThreads {
  today: IChatHistoryThread[];
  yesterday: IChatHistoryThread[];
  lastWeek: IChatHistoryThread[];
  lastMonth: IChatHistoryThread[];
  older: IChatHistoryThread[];
}
