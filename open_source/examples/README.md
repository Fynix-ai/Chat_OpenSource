# Examples

This folder contains example implementations demonstrating various features and use cases of the AI Chat Interface.

## Available Examples

### 1. Basic Usage (`basic-usage.tsx`)

The simplest implementation showing:
- Initial chat page
- Chat input
- Message handling

**Best for**: Getting started, understanding the basics

```tsx
import { BasicChatExample } from './examples/basic-usage';

<BasicChatExample />
```

### 2. File Upload (`with-file-upload.tsx`)

Demonstrates file upload functionality:
- Multi-file upload
- File preview
- Progress tracking
- Error handling

**Best for**: Building apps that need document/image uploads

```tsx
import { FileUploadExample } from './examples/with-file-upload';

<FileUploadExample />
```

### 3. Streaming (`with-streaming.tsx`)

Shows real-time response streaming:
- Server-Sent Events (SSE)
- Chunk processing
- Progress indicators
- Stream cancellation

**Best for**: Real-time AI chat applications

```tsx
import { StreamingExample } from './examples/with-streaming';

<StreamingExample />
```

## Running Examples

### Option 1: In Your App

```tsx
import { BasicChatExample } from './open_source/examples/basic-usage';

function App() {
  return <BasicChatExample />;
}
```

### Option 2: Standalone Dev Server

```bash
# Create a dev file
touch dev-example.tsx

# Add this content:
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BasicChatExample } from './examples/basic-usage';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BasicChatExample />
);

# Run dev server
npm run dev
```

### Option 3: Storybook

```tsx
// .storybook/stories/Examples.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { BasicChatExample } from '../examples/basic-usage';

const meta: Meta<typeof BasicChatExample> = {
  title: 'Examples/Basic Chat',
  component: BasicChatExample,
};

export default meta;

export const Default: StoryObj = {};
```

## Customization Guide

### Styling

All examples use CSS variables for theming. Customize in your global CSS:

```css
:root {
  --bg-card-color: #ffffff;
  --text-default: #1a1a1a;
  --text-purple: #8b5cf6;
  --border-default: #e5e7eb;
}

[data-theme="dark"] {
  --bg-card-color: #1a1a1a;
  --text-default: #f3f4f6;
  --text-purple: #a78bfa;
  --border-default: #374151;
}
```

### API Integration

Replace mock services with real API calls:

```tsx
// Before (Mock)
import { sendMessage } from '../services/mockApiService';

// After (Real API)
const sendMessage = async (message: string) => {
  const response = await fetch('https://your-api.com/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  return response.json();
};
```

### State Management

Add global state management:

```tsx
// Using Zustand
import create from 'zustand';

const useChatStore = create((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
}));

// In your component
const { messages, addMessage } = useChatStore();
```

## Common Modifications

### 1. Add Authentication

```tsx
function AuthenticatedChat() {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  
  return <BasicChatExample userName={user.name} />;
}
```

### 2. Add Persistence

```tsx
// Save messages to localStorage
useEffect(() => {
  localStorage.setItem('chat-messages', JSON.stringify(messages));
}, [messages]);

// Load on mount
const [messages, setMessages] = useState(() => {
  const saved = localStorage.getItem('chat-messages');
  return saved ? JSON.parse(saved) : [];
});
```

### 3. Add Analytics

```tsx
const handleMessageSubmit = (message: string) => {
  // Send message
  sendMessage(message);
  
  // Track analytics
  analytics.track('Message Sent', {
    length: message.length,
    timestamp: new Date(),
  });
};
```

### 4. Add Rate Limiting

```tsx
import { useRateLimit } from '../hooks/useRateLimit';

const { canSend, remaining } = useRateLimit({
  maxRequests: 10,
  windowMs: 60000, // 1 minute
});

if (!canSend) {
  alert(`Rate limit exceeded. ${remaining} requests left.`);
  return;
}
```

## Troubleshooting

### Issue: Components not rendering

**Solution**: Ensure CSS variables are defined:

```css
/* Add to your global CSS */
@import './open_source/styles/variables.css';
```

### Issue: TypeScript errors

**Solution**: Check your tsconfig.json:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

### Issue: Files not uploading

**Solution**: Check CORS and file size limits:

```tsx
// Increase file size limit
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Add CORS headers in your API
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}
```

## Next Steps

1. **Read the Architecture docs** - Understand the design patterns
2. **Explore the components** - See how they're built
3. **Check the tests** - Learn testing strategies
4. **Build your own** - Create custom examples

## Need Help?

- 📖 [Full Documentation](../README.md)
- 🏗️ [Architecture Guide](../docs/ARCHITECTURE.md)
- 🤝 [Contributing Guide](../docs/CONTRIBUTING.md)
- 💬 [GitHub Discussions](https://github.com/yourproject/discussions)

---

**Happy Coding! 🚀**
