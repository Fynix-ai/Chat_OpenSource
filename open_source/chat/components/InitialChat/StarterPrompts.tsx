/**
 * StarterPrompts Component
 * 
 * Displays suggested starter prompts to help users begin a conversation.
 * Supports custom icons, categories, and loading states.
 * 
 * @component
 * @example
 * ```tsx
 * <StarterPrompts
 *   prompts={[
 *     { text: 'Explain React hooks', category: 'education' },
 *     { text: 'Write a function', category: 'coding' }
 *   ]}
 *   onPromptSelect={(prompt) => console.log(prompt)}
 *   isLoading={false}
 * />
 * ```
 */

import React from 'react';
import { Sparkles } from 'lucide-react';
import { IStarterPrompt } from '../../types';

// ============================================================================
// Types
// ============================================================================

interface StarterPromptsProps {
  /** Array of starter prompts to display */
  prompts: IStarterPrompt[];
  
  /** Callback when a prompt is selected */
  onPromptSelect: (prompt: string) => void;
  
  /** Loading state */
  isLoading?: boolean;
  
  /** Error message */
  error?: string | null;
  
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * StarterPrompts Component
 */
export const StarterPrompts: React.FC<StarterPromptsProps> = ({
  prompts,
  onPromptSelect,
  isLoading = false,
  error = null,
  className = '',
}) => {
  // ============================================================================
  // Event Handlers
  // ============================================================================

  const handlePromptClick = (prompt: string) => {
    onPromptSelect(prompt);
  };

  // ============================================================================
  // Render Loading State
  // ============================================================================

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-textPurple" />
        <p className="text-textDimmedColor text-sm mt-4">Loading prompts...</p>
      </div>
    );
  }

  // ============================================================================
  // Render Error State
  // ============================================================================

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-red-500 text-sm text-center">{error}</p>
      </div>
    );
  }

  // ============================================================================
  // Render Empty State
  // ============================================================================

  if (prompts.length === 0) {
    return null;
  }

  // ============================================================================
  // Render Prompts
  // ============================================================================

  return (
    <div
      className={`starter-prompts flex flex-col items-center justify-center space-y-6 mx-auto max-w-3xl py-8 ${className}`}
      role="region"
      aria-label="Starter prompts"
    >
      {/* Prompts Grid */}
      <div className="flex flex-wrap gap-2 justify-center mx-auto">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            type="button"
            title={prompt.text}
            onClick={() => handlePromptClick(prompt.text)}
            className="px-4 py-2 w-fit flex items-center justify-center gap-2 bg-transparent text-center hover:bg-hoverBackgroundColor text-textDefault text-xs md:text-sm rounded-full border border-solid border-borderDefault transition-all duration-200 hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-textPurple focus:ring-offset-2"
            aria-label={`Use prompt: ${prompt.text}`}
          >
            {/* Icon */}
            <Sparkles size={18} className="flex-shrink-0" aria-hidden="true" />
            
            {/* Text */}
            <span className="truncate max-w-[200px] md:max-w-none">
              {prompt.text}
            </span>
          </button>
        ))}
      </div>

      {/* Optional: Show categories if available */}
      {prompts.some((p) => p.category) && (
        <div className="flex flex-wrap gap-2 justify-center text-xs text-textDimmedColor">
          <span>Categories:</span>
          {Array.from(new Set(prompts.map((p) => p.category).filter(Boolean))).map(
            (category) => (
              <span
                key={category}
                className="px-2 py-1 bg-bgStreamingThoughtsColor rounded-full"
              >
                {category}
              </span>
            )
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Display Name
// ============================================================================

StarterPrompts.displayName = 'StarterPrompts';

// ============================================================================
// Export
// ============================================================================

export default StarterPrompts;
