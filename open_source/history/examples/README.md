# History Module Examples

This folder contains examples for the History/Sidebar module.

## Available Examples

### 1. Basic History (`basic-history.tsx`)

The simplest implementation showing:
- History sidebar with threads
- Thread list with grouping
- New chat creation
- Thread selection

**Best for**: Getting started with history management

```tsx
import { BasicHistoryExample } from './history/examples/basic-history';

<BasicHistoryExample />
```

## Features Demonstrated

### Thread Management
- Create new threads
- Delete existing threads
- Update thread titles
- Navigate between threads

### UI Components
- Full history sidebar
- Collapsed icon sidebar
- Thread items with actions
- Search functionality

### State Management
- useHistory hook
- localStorage persistence
- Thread grouping by date
- Active thread tracking

## Running Examples

```bash
# Import and use in your app
import { BasicHistoryExample } from './open_source/history/examples/basic-history';

function App() {
  return <BasicHistoryExample />;
}
```

## Customization

### Styling
All components use CSS variables:

```css
:root {
  --bg-card-color: #ffffff;
  --bg-selected-color: #f3f4f6;
  --text-default: #1a1a1a;
  --text-dimmed-color: #6b7280;
  --border-default: #e5e7eb;
  --text-purple: #8b5cf6;
}
```

### Custom Icons
Replace the default icons with your own:

```tsx
import { MessageSquare, Settings, User } from 'lucide-react';

const customSidebarItems = [
  {
    id: 'chats',
    label: 'Chats',
    icon: <MessageSquare size={20} />,
    path: '/chats',
  },
  // ...
];
```

## Integration with Chat Module

Combine history with the chat interface:

```tsx
import { HistorySidebar } from './open_source/history/components';
import { ChatInput, MessageList } from './open_source/chat/components';
import { useHistory } from './open_source/history/hooks';

function FullChatApp() {
  const { threads, activeThreadId, createThread, setActiveThread } = useHistory();
  const [messages, setMessages] = useState([]);

  return (
    <div className="flex h-screen">
      {/* History Sidebar */}
      <HistorySidebar
        threads={threads}
        activeThreadId={activeThreadId}
        onThreadClick={setActiveThread}
        onNewChat={() => createThread()}
      />
      
      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        <MessageList messages={messages} />
        <ChatInput onSubmit={(msg) => handleSend(msg)} />
      </div>
    </div>
  );
}
```

---

**Happy Coding! 🚀**
