# Project Structure Documentation

Complete overview of the AI Chat Interface open-source project structure.

## 📁 Directory Structure

```
open_source/
│
├── 📂 chat/                           # Chat Interface Module (16 files)
│   ├── 📂 components/
│   │   ├── 📂 InitialChat/            # Empty state components
│   │   │   ├── ChatHeader.tsx         # Welcoming header with animation
│   │   │   ├── StarterPrompts.tsx     # Suggested prompt chips
│   │   │   ├── InitialChatPage.tsx    # Main initial page
│   │   │   └── index.ts               # Module exports
│   │   │
│   │   ├── 📂 ExistingChat/           # Active chat components
│   │   │   ├── MessageList.tsx        # Message container with auto-scroll
│   │   │   ├── UserMessage.tsx        # User message bubble
│   │   │   ├── AssistantMessage.tsx   # AI response with markdown
│   │   │   └── index.ts               # Module exports
│   │   │
│   │   └── 📂 Shared/                 # Reusable chat components
│   │       ├── ChatInput.tsx          # Message input with file upload
│   │       ├── FileUploadButton.tsx   # Upload trigger button
│   │       ├── FilePreview.tsx        # File preview with progress
│   │       ├── MarkdownRenderer.tsx   # Markdown with syntax highlighting
│   │       └── index.ts               # Module exports
│   │
│   ├── 📂 hooks/                      # Chat-specific hooks
│   │   ├── useFileUpload.ts           # File upload management
│   │   ├── useStreaming.ts            # Real-time streaming
│   │   ├── useAutoScroll.ts           # Auto-scroll behavior
│   │   └── index.ts                   # Module exports
│   │
│   └── 📂 services/                   # API services
│       ├── mockApiService.ts          # Mock API for development
│       └── streamingService.ts        # SSE streaming service
│
├── 📂 history/                        # History/Sidebar Module (8 files)
│   ├── 📂 components/
│   │   ├── ThreadItem.tsx             # Individual thread item
│   │   ├── HistorySidebar.tsx         # Full sidebar with search
│   │   ├── CollapsedSidebar.tsx       # Icon-only sidebar
│   │   └── index.ts                   # Module exports
│   │
│   ├── 📂 hooks/
│   │   ├── useHistory.ts              # History state management
│   │   └── index.ts                   # Module exports
│   │
│   ├── 📂 types/
│   │   ├── history.types.ts           # History-specific types
│   │   └── index.ts                   # Type exports
│   │
│   ├── 📂 utils/
│   │   └── historyHelpers.ts          # History utility functions
│   │
│   └── 📂 examples/
│       ├── basic-history.tsx          # Basic history example
│       └── README.md                  # Examples documentation
│
├── 📂 types/                          # Shared type definitions (2 files)
│   ├── chat.types.ts                  # All chat-related types
│   └── index.ts                       # Type exports
│
├── 📂 utils/                          # Shared utilities (2 files)
│   ├── constants.ts                   # Application constants
│   └── helpers.ts                     # 60+ utility functions
│
├── 📂 examples/                       # Usage examples (4 files)
│   ├── basic-usage.tsx                # Simple chat example
│   ├── with-file-upload.tsx           # File upload demo
│   ├── with-streaming.tsx             # Streaming demo
│   └── README.md                      # Examples guide
│
├── 📂 docs/                           # Documentation (3 files)
│   ├── ARCHITECTURE.md                # System architecture (~2000 lines)
│   ├── CONTRIBUTING.md                # Contribution guide (~1000 lines)
│   └── [Additional guides]            # More documentation
│
├── 📄 index.ts                        # Main export file
├── 📄 README.md                       # Project documentation
├── 📄 PROJECT_SUMMARY.md              # Project summary
├── 📄 CHANGELOG.md                    # Version history
├── 📄 STRUCTURE.md                    # This file
└── 📄 package.json                    # Dependencies (if needed)
```

## 📊 File Count by Type

| File Type | Count | Purpose |
|-----------|-------|---------|
| `.tsx` Components | 16 | React components |
| `.ts` Hooks | 4 | Custom React hooks |
| `.ts` Services | 2 | API and streaming services |
| `.ts` Types | 4 | TypeScript definitions |
| `.ts` Utils | 2 | Helper functions |
| `.tsx` Examples | 4 | Usage demonstrations |
| `.md` Documentation | 7 | Guides and docs |
| **Total** | **43** | All files |

**Purpose**: Complete chat interface with messaging, file uploads, and real-time streaming.

**Key Components**:
- `InitialChatPage` - Landing page with starter prompts
- `ChatInput` - Feature-rich input with file support
- `MessageList` - Auto-scrolling message container
- `MarkdownRenderer` - Syntax-highlighted markdown

**Key Hooks**:
- `useFileUpload` - File upload with progress tracking
- `useStreaming` - SSE streaming management
- `useAutoScroll` - Smart auto-scrolling

**Services**:
- `MockApiService` - Development API
- `StreamingService` - Real-time streaming

### History Module (8 files, ~900 lines)

**Purpose**: Thread management and navigation sidebar.

**Key Components**:
- `HistorySidebar` - Full sidebar with search
- `CollapsedSidebar` - Icon-only compact view
- `ThreadItem` - Individual thread display

**Key Hooks**:
- `useHistory` - Complete history management

**Utilities**:
- Thread grouping by date
- Search and filtering
- localStorage persistence

### Shared Resources (12 files, ~5200 lines)

**Purpose**: Common types, utilities, and documentation.

**Includes**:
- TypeScript type definitions
- Helper functions (60+)
- Constants and configuration
- Comprehensive documentation
- Usage examples

## 🔗 Import Paths

### Chat Module Imports

```tsx
// Components
import { InitialChatPage } from './open_source/chat/components/InitialChat';
import { ChatInput } from './open_source/chat/components/Shared';
import { MessageList } from './open_source/chat/components/ExistingChat';

// Hooks
import { useFileUpload, useStreaming } from './open_source/chat/hooks';

// Services
import { MockApiService } from './open_source/chat/services/mockApiService';
```

### History Module Imports

```tsx
// Components
import { HistorySidebar, ThreadItem } from './open_source/history/components';

// Hooks
import { useHistory } from './open_source/history/hooks';

// Utils
import { groupThreadsByDate } from './open_source/history/utils/historyHelpers';

// Types
import type { IChatHistoryThread } from './open_source/history/types';
```

### Shared Imports

```tsx
// Types
import type { IUserMessage, IChatThread } from './open_source/types';

// Utils
import { formatDate, generateId } from './open_source/utils/helpers';
import { MESSAGES, ERROR_MESSAGES } from './open_source/utils/constants';
```

## 📦 Dependencies

### Required Peer Dependencies

```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0"
}
```

### Required Dependencies

```json
{
  "framer-motion": "^10.x",
  "lucide-react": "^0.x",
  "clsx": "^2.x",
  "react-markdown": "^9.x",
  "remark-gfm": "^4.x",
  "react-syntax-highlighter": "^15.x",
  "echarts-for-react": "^3.x"
}
```

### Optional Dependencies

```json
{
  "@mantine/core": "^7.x",      // For additional UI components
  "@mantine/hooks": "^7.x",      // For additional hooks
  "zustand": "^4.x"              // For state management (optional)
}
```

## 🎯 Usage Patterns

### Standalone Chat

```tsx
import { InitialChatPage, ChatInput } from './open_source/chat/components';

function App() {
  return (
    <InitialChatPage>
      <ChatInput onSubmit={handleSubmit} />
    </InitialChatPage>
  );
}
```

### Standalone History

```tsx
import { HistorySidebar } from './open_source/history/components';
import { useHistory } from './open_source/history/hooks';

function App() {
  const { threads, activeThreadId } = useHistory();
  
  return (
    <HistorySidebar
      threads={threads}
      activeThreadId={activeThreadId}
      onThreadClick={handleThreadClick}
    />
  );
}
```

### Combined (Chat + History)

```tsx
import { ChatInput, MessageList } from './open_source/chat/components';
import { HistorySidebar } from './open_source/history/components';
import { useHistory } from './open_source/history/hooks';

function App() {
  const { threads, activeThreadId } = useHistory();
  
  return (
    <div className="flex h-screen">
      <HistorySidebar
        threads={threads}
        activeThreadId={activeThreadId}
        onThreadClick={setActiveThread}
      />
      <div className="flex-1">
        <MessageList messages={messages} />
        <ChatInput onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
```

## 🔍 Finding Components

| Need | Look in | File |
|------|---------|------|
| Chat input | `chat/components/Shared/` | `ChatInput.tsx` |
| Message display | `chat/components/ExistingChat/` | `MessageList.tsx` |
| File upload | `chat/hooks/` | `useFileUpload.ts` |
| History sidebar | `history/components/` | `HistorySidebar.tsx` |
| Thread management | `history/hooks/` | `useHistory.ts` |
| Type definitions | `types/` | `chat.types.ts` |
| Utilities | `utils/` | `helpers.ts` |
| Examples | `examples/` | `basic-usage.tsx` |

## 📝 Documentation Files

| File | Purpose | Audience |
|------|---------|----------|
| `README.md` | Getting started | All users |
| `PROJECT_SUMMARY.md` | Project overview | All users |
| `ARCHITECTURE.md` | System design | Developers |
| `CONTRIBUTING.md` | Contribution guide | Contributors |
| `CHANGELOG.md` | Version history | All users |
| `STRUCTURE.md` | This file | Developers |
| `examples/README.md` | Example guide | Beginners |

---

**Last Updated**: January 2026
**Version**: 1.0.0
