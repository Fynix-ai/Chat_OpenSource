/**
 * AssistantMessage Component
 * 
 * Displays an AI assistant's message with markdown rendering.
 */

import React from 'react';
import { IAssistantMessage } from '../../types';
import { MarkdownRenderer } from '../Shared';
import { formatDateTime } from '../../utils/helpers';

interface AssistantMessageProps {
  message: IAssistantMessage;
  isStreaming?: boolean;
  showTimestamp?: boolean;
}

export const AssistantMessage: React.FC<AssistantMessageProps> = ({
  message,
  isStreaming = false,
  showTimestamp = false,
}) => {
  // Extract text content from chunks
  const textContent = message.assistantChunks
    .filter(
      (chunk) =>
        chunk.type === 'supervisor_streaming' || chunk.type === 'streaming'
    )
    .map((chunk) => chunk.content)
    .join('');

  return (
    <div className="assistant-message flex justify-start">
      <div className="max-w-[80%] flex flex-col items-start gap-1">
        {/* Message Bubble */}
        <div className="bg-bgStreamingThoughtsColor border border-borderDefault px-4 py-3 rounded-2xl rounded-tl-none">
          {/* Content */}
          {textContent ? (
            <MarkdownRenderer content={textContent} />
          ) : (
            <div className="flex items-center gap-2">
              <div className="animate-pulse w-2 h-2 bg-textPurple rounded-full" />
              <div className="animate-pulse w-2 h-2 bg-textPurple rounded-full animation-delay-200" />
              <div className="animate-pulse w-2 h-2 bg-textPurple rounded-full animation-delay-400" />
            </div>
          )}

          {/* Streaming Indicator */}
          {isStreaming && (
            <div className="flex items-center gap-2 mt-2 text-textDimmedColor">
              <div className="animate-pulse w-2 h-2 bg-textPurple rounded-full" />
              <span className="text-xs">AI is thinking...</span>
            </div>
          )}
        </div>

        {/* Timestamp */}
        {showTimestamp && message.timestamp && (
          <span className="text-xs text-textDimmedColor">
            {formatDateTime(message.timestamp)}
          </span>
        )}
      </div>

      <style jsx>{`
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};

AssistantMessage.displayName = 'AssistantMessage';

export default AssistantMessage;
