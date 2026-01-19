/**
 * Streaming Example
 * 
 * This example demonstrates real-time streaming of AI responses.
 */

import React, { useState, useCallback } from 'react';
import { ChatInput, MarkdownRenderer } from '../components/Shared';
import { useStreaming } from '../hooks';
import { IUserMessage, IAssistantMessage } from '../types';

/**
 * Chat with Streaming Responses
 */
export function StreamingExample() {
  const [messages, setMessages] = useState<(IUserMessage | IAssistantMessage)[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');

  // Streaming hook
  const { startStream, stopStream, isStreaming, error } = useStreaming({
    onChunk: (chunk) => {
      if (chunk.type === 'supervisor_streaming') {
        setCurrentResponse((prev) => prev + chunk.content);
      }
    },
    onComplete: () => {
      // Add completed response to messages
      const assistantMessage: IAssistantMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        assistantChunks: [
          {
            type: 'supervisor_streaming',
            content: currentResponse,
          },
        ],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setCurrentResponse('');
    },
    onError: (err) => {
      console.error('Streaming error:', err);
    },
  });

  // Handle message submission
  const handleSubmit = useCallback(
    async (message: string) => {
      // Add user message
      const userMessage: IUserMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Start streaming response
      await startStream({
        message,
        threadId: 'demo-thread',
      });
    },
    [startStream]
  );

  return (
    <div className="h-screen w-screen bg-bgCardColor p-4">
      <div className="max-w-3xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="mb-4 pb-4 border-b border-borderDefault">
          <h1 className="text-2xl font-bold text-textTitle">
            Streaming Chat Demo
          </h1>
          <p className="text-sm text-textDimmedColor">
            Watch AI responses stream in real-time
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-4 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-textPurple text-white ml-auto max-w-[80%]'
                  : 'bg-bgStreamingThoughtsColor max-w-[80%]'
              }`}
            >
              {msg.role === 'user' ? (
                <p>{msg.content}</p>
              ) : (
                <MarkdownRenderer
                  content={
                    msg.assistantChunks
                      .map((chunk) =>
                        chunk.type === 'supervisor_streaming' ? chunk.content : ''
                      )
                      .join('')
                  }
                />
              )}
            </div>
          ))}

          {/* Current streaming response */}
          {isStreaming && currentResponse && (
            <div className="p-4 rounded-lg bg-bgStreamingThoughtsColor max-w-[80%]">
              <MarkdownRenderer content={currentResponse} />
              <div className="flex items-center gap-2 mt-2">
                <div className="animate-pulse w-2 h-2 bg-textPurple rounded-full" />
                <span className="text-xs text-textDimmedColor">Streaming...</span>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="p-4 rounded-lg bg-red-100 text-red-700 border border-red-300">
              <p className="font-semibold">Error:</p>
              <p className="text-sm">{error.message}</p>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="relative">
          <ChatInput
            onSubmit={handleSubmit}
            placeholder={
              isStreaming
                ? 'Waiting for response...'
                : 'Ask me anything...'
            }
            disabled={isStreaming}
          />

          {/* Stop button */}
          {isStreaming && (
            <button
              onClick={stopStream}
              className="absolute top-2 right-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Stop
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default StreamingExample;
