/**
 * InitialChatPage Component
 * 
 * The main page shown when starting a new chat session.
 * Combines the chat header, input, and starter prompts.
 * 
 * @component
 * @example
 * ```tsx
 * <InitialChatPage
 *   userName="John"
 *   onMessageSubmit={(message) => console.log(message)}
 * />
 * ```
 */

import React, { useState, useEffect } from 'react';
import { ChatHeader } from './ChatHeader';
import { StarterPrompts } from './StarterPrompts';
import { IStarterPrompt } from '../../types';
import { fetchStarterPrompts } from '../../services/mockApiService';

// ============================================================================
// Types
// ============================================================================

interface InitialChatPageProps {
  /** User's name for personalized greeting */
  userName?: string;
  
  /** Callback when a message is submitted */
  onMessageSubmit?: (message: string) => void;
  
  /** Callback when a prompt is selected */
  onPromptSelect?: (prompt: string) => void;
  
  /** Custom starter prompts (overrides API fetch) */
  customPrompts?: IStarterPrompt[];
  
  /** Additional CSS classes */
  className?: string;
  
  /** Child components (usually ChatInput) */
  children?: React.ReactNode;
}

// ============================================================================
// Component
// ============================================================================

/**
 * InitialChatPage Component
 */
export const InitialChatPage: React.FC<InitialChatPageProps> = ({
  userName,
  onMessageSubmit,
  onPromptSelect,
  customPrompts,
  className = '',
  children,
}) => {
  // ============================================================================
  // State
  // ============================================================================

  const [prompts, setPrompts] = useState<IStarterPrompt[]>(customPrompts || []);
  const [isLoading, setIsLoading] = useState(!customPrompts);
  const [error, setError] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');

  // ============================================================================
  // Effects
  // ============================================================================

  /**
   * Load starter prompts from API if custom prompts not provided
   */
  useEffect(() => {
    if (customPrompts) {
      setPrompts(customPrompts);
      setIsLoading(false);
      return;
    }

    const loadPrompts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetchStarterPrompts();

        if (response.success && response.data) {
          setPrompts(response.data);
        } else {
          throw new Error(response.message || 'Failed to load prompts');
        }
      } catch (err) {
        console.error('Error loading prompts:', err);
        setError('Failed to load starter prompts');
      } finally {
        setIsLoading(false);
      }
    };

    loadPrompts();
  }, [customPrompts]);

  // ============================================================================
  // Event Handlers
  // ============================================================================

  /**
   * Handle prompt selection
   */
  const handlePromptSelect = (prompt: string) => {
    setSelectedPrompt(prompt);
    onPromptSelect?.(prompt);
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div
      className={`initial-chat-page flex flex-col items-center h-full w-full max-w-3xl mx-auto justify-center ${className}`}
      role="main"
    >
      {/* Header */}
      <ChatHeader userName={userName} />

      {/* Chat Input (passed as children) */}
      {children && <div className="w-full mb-4">{children}</div>}

      {/* Starter Prompts */}
      <StarterPrompts
        prompts={prompts}
        onPromptSelect={handlePromptSelect}
        isLoading={isLoading}
        error={error}
      />

      {/* Helper Text */}
      {!isLoading && prompts.length > 0 && (
        <p className="text-textDimmedColor text-xs text-center mt-4 max-w-md">
          Select a prompt above or type your own message to get started
        </p>
      )}
    </div>
  );
};

// ============================================================================
// Display Name
// ============================================================================

InitialChatPage.displayName = 'InitialChatPage';

// ============================================================================
// Export
// ============================================================================

export default InitialChatPage;
