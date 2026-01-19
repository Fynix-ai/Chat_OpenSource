# AI Chat Interface - Open Source

A modern, production-ready AI chat interface built with React, TypeScript, and TailwindCSS. This project demonstrates best practices for building real-time streaming chat applications with advanced features like file uploads, markdown rendering, and data visualization.

## 🎯 Purpose

This open-source project serves as:
- **Educational Resource**: Learn modern React patterns and best practices
- **Production Template**: Use as a foundation for your own chat applications
- **Reference Implementation**: See how complex features are implemented cleanly

## ✨ Features

### Core Chat Functionality
- ✅ Real-time message streaming with Server-Sent Events (SSE)
- ✅ Markdown rendering with syntax highlighting
- ✅ File upload with drag-and-drop support
- ✅ Image preview and management
- ✅ Auto-scrolling message container
- ✅ Typing indicators and progress states

### Advanced Features
- 📊 Interactive chart visualization (ECharts)
- 🎨 Theme support (light/dark mode)
- 💬 Follow-up question suggestions
- 👍 Like/dislike feedback system
- 🔍 Streaming thoughts visualization
- 📁 Multi-file upload with progress tracking

### UX Enhancements
- ⚡ Optimized performance with memo and useMemo
- ♿ Accessibility-first design
- 📱 Fully responsive layout
- 🎭 Smooth animations with Framer Motion
- 🚀 Lazy loading and code splitting ready

## 🏗️ Architecture

The project is organized into two main modules: **Chat** and **History**.

```
open_source/
├── chat/                    # Chat Interface Module
│   ├── components/
│   │   ├── InitialChat/     # Empty state and starter prompts
│   │   ├── ExistingChat/    # Message display and interactions
│   │   └── Shared/          # Reusable UI components
│   ├── hooks/               # Chat-specific hooks
│   └── services/            # API services and streaming
│
├── history/                 # History/Sidebar Module
│   ├── components/          # History sidebar components
│   ├── hooks/               # History management hooks
│   ├── types/               # History-specific types
│   └── utils/               # History helper functions
│
├── types/                   # Shared TypeScript types
├── utils/                   # Shared helper functions
├── examples/                # Usage examples and demos
└── docs/                   # Additional documentation
```

## 🚀 Quick Start

### Prerequisites
```bash
node >= 18.0.0
npm >= 9.0.0
```

### Installation
```bash
# Install dependencies
npm install

# Required packages
npm install react react-dom
npm install framer-motion lucide-react clsx
npm install react-markdown remark-gfm
npm install react-syntax-highlighter
npm install echarts-for-react
npm install react-textarea-autosize
```

### Basic Usage

```tsx
import { ChatInterface } from './components/ChatInterface';

function App() {
  return (
    <ChatInterface
      apiEndpoint="https://your-api.com/chat"
      onMessageSent={(message) => console.log(message)}
      onError={(error) => console.error(error)}
    />
  );
}
```

## 📚 Component Documentation

### Chat Module

#### ChatInput
The main input component with file upload support.

```tsx
import { ChatInput } from './open_source/chat/components/Shared';

<ChatInput
  onSubmit={(message, files) => handleSubmit(message, files)}
  placeholder="Type your message..."
/>
```

#### MessageList
Displays chat messages with auto-scrolling.

```tsx
import { MessageList } from './open_source/chat/components/ExistingChat';

<MessageList
  messages={messages}
  isStreaming={isStreaming}
/>
```

#### StarterPrompts
Shows suggested prompts for new chats.

```tsx
import { StarterPrompts } from './open_source/chat/components/InitialChat';

<StarterPrompts
  prompts={prompts}
  onPromptSelect={(prompt) => handlePrompt(prompt)}
/>
```

### History Module

#### HistorySidebar
Full sidebar with chat history and search.

```tsx
import { HistorySidebar } from './open_source/history/components';

<HistorySidebar
  threads={threads}
  activeThreadId={activeThreadId}
  onThreadClick={(id) => navigateToThread(id)}
  onNewChat={() => createNewChat()}
/>
```

#### CollapsedSidebar
Collapsed icon-only sidebar that expands on hover.

```tsx
import { CollapsedSidebar } from './open_source/history/components';

<CollapsedSidebar
  items={sidebarItems}
  onNewChat={() => createNewChat()}
  onItemClick={(item) => navigate(item.path)}
/>
```

#### ThreadItem
Individual thread item in the history list.

```tsx
import { ThreadItem } from './open_source/history/components';

<ThreadItem
  thread={thread}
  selectedThread={thread.id === activeId}
  onClick={(id) => selectThread(id)}
  onDelete={(id) => deleteThread(id)}
/>
```

## 🎨 Styling

This project uses TailwindCSS with CSS variables for theming:

```css
:root {
  --bg-card-color: #ffffff;
  --text-default: #1a1a1a;
  --border-default: #e5e7eb;
  --text-purple: #8b5cf6;
}

[data-theme="dark"] {
  --bg-card-color: #1a1a1a;
  --text-default: #f3f4f6;
  --border-default: #374151;
}
```

## 🔧 Configuration

### Environment Variables
```env
# API Configuration
VITE_API_BASE_URL=https://your-api.com
VITE_API_KEY=your-api-key

# Feature Flags
VITE_ENABLE_FILE_UPLOAD=true
VITE_ENABLE_CHARTS=true
VITE_MAX_FILE_SIZE=5242880
```

### Custom Configuration
```tsx
// config/chat.config.ts
export const chatConfig = {
  streaming: {
    enabled: true,
    chunkSize: 1024,
  },
  upload: {
    maxFiles: 5,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  markdown: {
    enableSyntaxHighlighting: true,
    enableCharts: true,
  },
};
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

## 📖 Advanced Usage

### Custom Streaming
```tsx
import { useStreaming } from './hooks/useStreaming';

function CustomChat() {
  const { stream, isStreaming, error } = useStreaming({
    endpoint: '/api/stream',
    onChunk: (chunk) => console.log(chunk),
    onComplete: () => console.log('Stream complete'),
  });

  return <StreamDisplay stream={stream} />;
}
```

### File Upload with Progress
```tsx
import { useFileUpload } from './hooks/useFileUpload';

function FileUploadComponent() {
  const {
    uploadFile,
    progress,
    isUploading,
    cancelUpload,
  } = useFileUpload({
    maxSize: 5 * 1024 * 1024,
    onSuccess: (url) => console.log('Uploaded:', url),
  });

  return (
    <FileUploader
      onUpload={uploadFile}
      progress={progress}
      onCancel={cancelUpload}
    />
  );
}
```

## 🎯 Best Practices Demonstrated

### 1. **Performance Optimization**
- React.memo for expensive components
- useMemo for computed values
- useCallback for stable function references
- Lazy loading for code splitting

### 2. **Type Safety**
- Comprehensive TypeScript types
- Strict null checks
- Discriminated unions for message types

### 3. **State Management**
- Zustand for global state (can be replaced with Context API)
- Local state for component-specific data
- Optimistic updates for better UX

### 4. **Accessibility**
- Semantic HTML
- ARIA labels and roles
- Keyboard navigation
- Screen reader support

### 5. **Error Handling**
- Error boundaries
- Graceful degradation
- User-friendly error messages
- Retry mechanisms

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

### Development Workflow
```bash
# Create a feature branch
git checkout -b feature/your-feature

# Make your changes
# ...

# Run linting
npm run lint

# Run tests
npm test

# Commit with conventional commits
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/your-feature
```

## 📝 Code Standards

### Component Structure
```tsx
// 1. Imports (grouped logically)
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

// 2. Types
interface ComponentProps {
  value: string;
  onChange: (value: string) => void;
}

// 3. Component
export const Component: React.FC<ComponentProps> = ({
  value,
  onChange,
}) => {
  // 3a. Hooks
  const [state, setState] = useState('');
  
  // 3b. Handlers
  const handleChange = useCallback(() => {
    // ...
  }, []);
  
  // 3c. Render
  return <div>{/* ... */}</div>;
};

// 4. Display name (for debugging)
Component.displayName = 'Component';
```

### Naming Conventions
- **Components**: PascalCase (`ChatInput`, `MessageList`)
- **Hooks**: camelCase with 'use' prefix (`useStreaming`, `useFileUpload`)
- **Utils**: camelCase (`formatDate`, `parseMessage`)
- **Types**: PascalCase with interface/type (`IMessage`, `ChatState`)

## 🔍 Troubleshooting

### Common Issues

**Issue**: Messages not streaming
```tsx
// Solution: Check your SSE connection
const eventSource = new EventSource('/api/stream');
eventSource.onerror = (error) => {
  console.error('SSE Error:', error);
};
```

**Issue**: File upload fails
```tsx
// Solution: Check file size and type
const isValidFile = (file: File) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png'];
  return file.size <= maxSize && allowedTypes.includes(file.type);
};
```

## 📚 Learning Resources

- [React Best Practices](./docs/react-best-practices.md)
- [TypeScript Guide](./docs/typescript-guide.md)
- [Testing Strategy](./docs/testing-strategy.md)
- [Performance Tips](./docs/performance.md)
- [Accessibility Guide](./docs/accessibility.md)

## 🎓 For Beginners

New to React? Start here:

1. **Read the Component Guide**: `docs/component-guide.md`
2. **Study Simple Examples**: `examples/basic/`
3. **Follow the Tutorial**: `docs/tutorial/`
4. **Join Discussions**: Use GitHub Discussions for questions

## 🎓 For Senior Developers

Advanced topics:

1. **Architecture Decisions**: `docs/architecture.md`
2. **Performance Optimization**: `docs/performance.md`
3. **Testing Strategy**: `docs/testing.md`
4. **CI/CD Pipeline**: `.github/workflows/`

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details

## 🙏 Acknowledgments

- React team for the amazing framework
- All contributors who help improve this project
- The open-source community for inspiration

## 📧 Contact

- **Issues**: [GitHub Issues](https://github.com/Fynix-ai/Chat_OpenSource/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Fynix-ai/Chat_OpenSource/discussions)

---

**Built with ❤️ by developers, for developers**