/**
 * Basic Usage Example
 * 
 * This example demonstrates the simplest way to use the AI Chat Interface.
 * Perfect for getting started quickly.
 */

import React from 'react';
import { InitialChatPage } from '../components/InitialChat';
import { ChatInput } from '../components/Shared';

/**
 * Basic Chat Application
 */
export function BasicChatExample() {
  // Handle message submission
  const handleMessageSubmit = (message: string) => {
    console.log('Message sent:', message);
    // In a real app, you would send this to your API
  };

  // Handle prompt selection
  const handlePromptSelect = (prompt: string) => {
    console.log('Prompt selected:', prompt);
    // In a real app, you would populate the input with this prompt
  };

  return (
    <div className="h-screen w-screen bg-bgCardColor">
      <InitialChatPage
        userName="User"
        onMessageSubmit={handleMessageSubmit}
        onPromptSelect={handlePromptSelect}
      >
        {/* ChatInput as child component */}
        <ChatInput
          onSubmit={handleMessageSubmit}
          placeholder="Type your message..."
        />
      </InitialChatPage>
    </div>
  );
}

export default BasicChatExample;
