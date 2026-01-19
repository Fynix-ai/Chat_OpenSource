# Architecture Documentation

## 🏗️ System Overview

This AI Chat Interface is built with a **component-based architecture** using React and TypeScript. The system follows **clean code principles**, **separation of concerns**, and **SOLID design patterns**.

## 📐 Architecture Layers

```
┌─────────────────────────────────────────────────┐
│              Presentation Layer                  │
│         (React Components / UI)                  │
├─────────────────────────────────────────────────┤
│              Business Logic Layer                │
│          (Custom Hooks / Services)               │
├─────────────────────────────────────────────────┤
│              Data Layer                          │
│          (State Management / API)                │
├─────────────────────────────────────────────────┤
│              Infrastructure Layer                │
│          (Utils / Constants / Types)             │
└─────────────────────────────────────────────────┘
```

## 🗂️ Folder Structure

### `/components`
Contains all React components organized by feature:

```
components/
├── InitialChat/         # Empty state components
│   ├── ChatHeader.tsx   # Welcoming header
│   ├── StarterPrompts.tsx # Suggested prompts
│   └── InitialChatPage.tsx # Main page
├── ExistingChat/        # Active chat components
│   ├── MessageList.tsx  # Message display
│   ├── UserMessage.tsx  # User message bubble
│   └── AssistantMessage.tsx # AI response bubble
├── Shared/              # Reusable components
│   ├── ChatInput.tsx    # Message input
│   ├── FileUpload.tsx   # File upload
│   └── MarkdownRenderer.tsx # Markdown display
└── Common/              # Base components
    └── ErrorBoundary.tsx # Error handling
```

**Design Principles:**
- **Single Responsibility**: Each component has one clear purpose
- **Composition over Inheritance**: Build complex UIs from simple components
- **Props Down, Events Up**: Unidirectional data flow
- **Smart vs Dumb**: Container components (logic) vs Presentational (UI)

### `/hooks`
Custom React hooks for reusable logic:

```
hooks/
├── useFileUpload.ts     # File upload logic
├── useStreaming.ts      # SSE streaming
├── useAutoScroll.ts     # Auto-scroll behavior
└── index.ts             # Central export
```

**Hook Patterns:**
- Custom hooks start with `use` prefix
- Return object with clear interface
- Handle cleanup in `useEffect` return
- Memoize callbacks with `useCallback`
- Memoize values with `useMemo`

### `/services`
API communication and business logic:

```
services/
├── mockApiService.ts    # Mock API for dev/testing
├── streamingService.ts  # Real-time streaming
└── index.ts             # Service exports
```

**Service Patterns:**
- Pure functions (no side effects)
- Async/await for promises
- Error handling with try/catch
- Return standardized response format

### `/types`
TypeScript type definitions:

```
types/
├── chat.types.ts        # Message & thread types
└── index.ts             # Type exports
```

**Type Strategy:**
- Interfaces for object shapes
- Types for unions/intersections
- Generics for reusable types
- Strict null checks enabled

### `/utils`
Helper functions and utilities:

```
utils/
├── constants.ts         # App constants
├── helpers.ts           # Pure utility functions
└── index.ts             # Utility exports
```

**Utility Guidelines:**
- Pure functions only
- Well-documented with JSDoc
- Comprehensive examples
- Unit testable

## 🔄 Data Flow

### Message Sending Flow

```
User Input (Component)
    ↓
ChatInput Component
    ↓
onSubmit Handler
    ↓
useStreaming Hook
    ↓
StreamingService
    ↓
API/Backend
    ↓
SSE Stream
    ↓
onChunk Callback
    ↓
State Update
    ↓
Component Re-render
```

### File Upload Flow

```
File Selection
    ↓
useFileUpload Hook
    ↓
File Validation
    ↓
Upload to CDN
    ↓
Progress Tracking
    ↓
URL Returned
    ↓
Attach to Message
```

## 🧩 Design Patterns

### 1. **Container/Presentational Pattern**

```tsx
// Container (Smart Component)
export const ChatContainer = () => {
  const { messages, sendMessage } = useChatLogic();
  
  return (
    <ChatPresentation
      messages={messages}
      onSendMessage={sendMessage}
    />
  );
};

// Presentational (Dumb Component)
export const ChatPresentation = ({ messages, onSendMessage }) => {
  return (
    <div>
      {messages.map(msg => <Message key={msg.id} {...msg} />)}
      <ChatInput onSubmit={onSendMessage} />
    </div>
  );
};
```

### 2. **Compound Component Pattern**

```tsx
// Parent provides context
export const FileUpload = ({ children }) => {
  const [files, setFiles] = useState([]);
  
  return (
    <FileUploadContext.Provider value={{ files, setFiles }}>
      {children}
    </FileUploadContext.Provider>
  );
};

// Children consume context
FileUpload.Button = () => {
  const { setFiles } = useFileUploadContext();
  return <button onClick={handleUpload}>Upload</button>;
};

FileUpload.Preview = () => {
  const { files } = useFileUploadContext();
  return <div>{files.map(...)}</div>;
};
```

### 3. **Custom Hook Pattern**

```tsx
// Encapsulate complex logic
export function useFeature(config) {
  const [state, setState] = useState();
  
  useEffect(() => {
    // Side effects
  }, []);
  
  const action = useCallback(() => {
    // Logic
  }, []);
  
  return { state, action };
}
```

### 4. **Higher-Order Component (HOC)**

```tsx
// Add functionality to components
export function withErrorBoundary(Component) {
  return class extends React.Component {
    componentDidCatch(error) {
      // Handle error
    }
    
    render() {
      return <Component {...this.props} />;
    }
  };
}
```

### 5. **Render Props Pattern**

```tsx
// Share code via render prop
export const DataProvider = ({ render, url }) => {
  const [data, setData] = useState();
  
  useEffect(() => {
    fetch(url).then(setData);
  }, [url]);
  
  return render(data);
};

// Usage
<DataProvider
  url="/api/data"
  render={(data) => <Display data={data} />}
/>
```

## 🎯 State Management Strategy

### Local State (useState)
Use for component-specific state:
- Form inputs
- UI toggles
- Temporary data

```tsx
const [isOpen, setIsOpen] = useState(false);
```

### Context API
Use for cross-component state:
- Theme
- User preferences
- App-wide settings

```tsx
const ThemeContext = createContext();
```

### External State (Zustand/Redux)
Use for complex global state:
- Chat threads
- Message history
- User data

```tsx
const useChatStore = create((set) => ({
  messages: [],
  addMessage: (msg) => set((state) => ({
    messages: [...state.messages, msg]
  }))
}));
```

## 🔌 API Integration

### REST API Pattern

```tsx
// Service layer
export async function fetchData(endpoint: string) {
  try {
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

### Server-Sent Events (SSE)

```tsx
// Streaming service
export function createSSEConnection(url: string, onMessage: Function) {
  const eventSource = new EventSource(url);
  
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };
  
  eventSource.onerror = () => {
    eventSource.close();
  };
  
  return () => eventSource.close(); // Cleanup
}
```

### WebSocket Pattern

```tsx
// Real-time connection
export class WebSocketService {
  private ws: WebSocket;
  
  connect(url: string) {
    this.ws = new WebSocket(url);
    
    this.ws.onopen = () => console.log('Connected');
    this.ws.onmessage = (event) => this.handleMessage(event);
    this.ws.onerror = (error) => this.handleError(error);
  }
  
  send(data: any) {
    this.ws.send(JSON.stringify(data));
  }
  
  disconnect() {
    this.ws.close();
  }
}
```

## ⚡ Performance Optimization

### 1. **Memoization**

```tsx
// Memoize expensive computations
const processedData = useMemo(() => {
  return expensiveOperation(data);
}, [data]);

// Memoize callbacks
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);

// Memoize components
const MemoizedComponent = React.memo(Component);
```

### 2. **Code Splitting**

```tsx
// Lazy load components
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

// Use with Suspense
<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

### 3. **Virtualization**

```tsx
// For long lists
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={1000}
  itemSize={50}
>
  {({ index, style }) => (
    <div style={style}>Item {index}</div>
  )}
</FixedSizeList>
```

### 4. **Debouncing**

```tsx
// Limit function calls
const debouncedSearch = useMemo(
  () => debounce((value) => search(value), 300),
  []
);
```

## 🛡️ Error Handling

### Error Boundary

```tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    logError(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    
    return this.props.children;
  }
}
```

### Try/Catch Pattern

```tsx
async function handleAction() {
  try {
    await riskyOperation();
  } catch (error) {
    if (error instanceof NetworkError) {
      showNetworkError();
    } else if (error instanceof ValidationError) {
      showValidationError();
    } else {
      showGenericError();
    }
  }
}
```

## 🧪 Testing Strategy

### Unit Tests
Test individual functions and components:

```tsx
describe('useFileUpload', () => {
  it('should upload files successfully', async () => {
    const { result } = renderHook(() => useFileUpload());
    
    await act(async () => {
      await result.current.uploadFiles([mockFile]);
    });
    
    expect(result.current.uploadedFiles).toHaveLength(1);
  });
});
```

### Integration Tests
Test component interactions:

```tsx
test('sending a message updates the chat', async () => {
  render(<ChatInterface />);
  
  const input = screen.getByRole('textbox');
  const button = screen.getByRole('button', { name: 'Send' });
  
  fireEvent.change(input, { target: { value: 'Hello' } });
  fireEvent.click(button);
  
  await waitFor(() => {
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### E2E Tests
Test complete user flows:

```tsx
test('complete chat flow', async () => {
  await page.goto('http://localhost:3000');
  await page.fill('[aria-label="Message input"]', 'Test message');
  await page.click('[aria-label="Send message"]');
  await page.waitForSelector('.assistant-message');
  
  const messages = await page.$$('.message');
  expect(messages.length).toBeGreaterThan(0);
});
```

## 📚 Further Reading

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React Patterns](https://reactpatterns.com)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)

---

**Last Updated**: January 2026
