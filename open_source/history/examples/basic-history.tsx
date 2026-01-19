/**
 * Basic History Example
 * 
 * Demonstrates the simplest way to use the History sidebar.
 */

import React from 'react';
import { HistorySidebar } from '../components';
import { useHistory } from '../hooks';

/**
 * Basic History Application
 */
export function BasicHistoryExample() {
  const {
    threads,
    activeThreadId,
    createThread,
    deleteThread,
    setActiveThread,
  } = useHistory({
    enableStorage: true,
  });

  const handleThreadClick = (threadId: string) => {
    setActiveThread(threadId);
    console.log('Navigating to thread:', threadId);
  };

  const handleNewChat = () => {
    const newThreadId = createThread('New Chat');
    console.log('Created new thread:', newThreadId);
  };

  const handleThreadDelete = async (threadId: string) => {
    await deleteThread(threadId);
    console.log('Deleted thread:', threadId);
  };

  return (
    <div className="h-screen w-80 bg-bgCardColor">
      <HistorySidebar
        threads={threads}
        activeThreadId={activeThreadId}
        onThreadClick={handleThreadClick}
        onNewChat={handleNewChat}
        onThreadDelete={handleThreadDelete}
      />
    </div>
  );
}

export default BasicHistoryExample;
