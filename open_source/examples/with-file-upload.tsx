/**
 * File Upload Example
 * 
 * This example shows how to use the chat interface with file upload capabilities.
 */

import React, { useState } from 'react';
import { ChatInput } from '../components/Shared';
import { IExtendedFile } from '../types';

/**
 * Chat with File Upload
 */
export function FileUploadExample() {
  const [messages, setMessages] = useState<Array<{
    id: string;
    text: string;
    files: IExtendedFile[];
  }>>([]);

  // Handle message with files
  const handleSubmit = (message: string, files: IExtendedFile[]) => {
    const newMessage = {
      id: Date.now().toString(),
      text: message,
      files: files,
    };

    setMessages((prev) => [...prev, newMessage]);

    console.log('Message sent:', {
      text: message,
      fileCount: files.length,
      files: files.map((f) => ({
        name: f.filename,
        url: f.cdnUrl,
      })),
    });

    // In a real app, send to API
    // await sendMessageWithFiles(message, files);
  };

  return (
    <div className="h-screen w-screen bg-bgCardColor p-4">
      <div className="max-w-3xl mx-auto h-full flex flex-col">
        {/* Message Display */}
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((msg) => (
            <div key={msg.id} className="mb-4 p-4 bg-bgStreamingThoughtsColor rounded-lg">
              <p className="text-textDefault mb-2">{msg.text}</p>
              {msg.files.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {msg.files.map((file) => (
                    <div
                      key={file.uploadId}
                      className="text-xs text-textDimmedColor px-2 py-1 bg-bgCardColor rounded"
                    >
                      📎 {file.filename}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <ChatInput
          onSubmit={handleSubmit}
          placeholder="Type a message or attach files..."
        />
      </div>
    </div>
  );
}

export default FileUploadExample;
