/**
 * MessageList Component
 * 
 * Displays a list of chat messages with auto-scrolling.
 * Handles both user and assistant messages.
 */

import React from 'react';
import { IUserMessage, IAssistantMessage } from '../../types';
import { useAutoScroll } from '../../hooks';
import { UserMessage } from './UserMessage';
import { AssistantMessage } from './AssistantMessage';

interface MessageListProps {
  messages: (IUserMessage | IAssistantMessage)[];
  isStreaming?: boolean;
  className?: string;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isStreaming = false,
  className = '',
}) => {
  // Auto-scroll hook
  const { containerRef } = useAutoScroll({
    dependencies: [messages.length],
    enabled: true,
  });

  return (
    <div
      ref={containerRef}
      className={`message-list flex-1 overflow-y-auto space-y-4 ${className}`}
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
    >
      {messages.map((message, index) => {
        const isLastMessage = index === messages.length - 1;
        const isCurrentlyStreaming = isLastMessage && isStreaming;

        if (message.role === 'user') {
          return (
            <UserMessage
              key={`user-${message.id}`}
              message={message}
            />
          );
        }

        if (message.role === 'assistant') {
          return (
            <AssistantMessage
              key={`assistant-${message.id}`}
              message={message}
              isStreaming={isCurrentlyStreaming}
            />
          );
        }

        return null;
      })}

      {/* Empty state */}
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full text-textDimmedColor">
          <p>No messages yet. Start a conversation!</p>
        </div>
      )}
    </div>
  );
};

MessageList.displayName = 'MessageList';

export default MessageList;
