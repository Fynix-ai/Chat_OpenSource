/**
 * ChatHeader Component
 * 
 * Displays a welcoming header for new chat sessions.
 * Features a typewriter animation effect for better UX.
 * 
 * @component
 * @example
 * ```tsx
 * <ChatHeader
 *   userName="John"
 *   title="Hey, John"
 * />
 * ```
 */

import React from 'react';

// ============================================================================
// Types
// ============================================================================

interface ChatHeaderProps {
  /** User's name to display in greeting */
  userName?: string;
  
  /** Custom title (overrides default greeting) */
  title?: string;
  
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * ChatHeader Component
 */
export const ChatHeader: React.FC<ChatHeaderProps> = ({
  userName,
  title,
  className = '',
}) => {
  // Generate greeting message
  const greetingText = title || `Hey${userName ? `, ${userName}` : ', there'}`;

  return (
    <header className={`chat-header ${className}`}>
      <h2
        className="typewriter text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-textTitle"
        role="heading"
        aria-level={2}
      >
        {greetingText}
      </h2>

      <style jsx>{`
        .typewriter {
          overflow: hidden;
          border-right: 0.15em solid transparent;
          white-space: nowrap;
          animation:
            typing 1.5s steps(40, end),
            blink-caret 0.75s step-end 3;
        }

        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes blink-caret {
          from,
          to {
            border-color: transparent;
          }
          50% {
            border-color: currentColor;
          }
        }

        @media (max-width: 768px) {
          .typewriter {
            animation: none;
            border-right: none;
          }
        }
      `}</style>
    </header>
  );
};

// ============================================================================
// Display Name
// ============================================================================

ChatHeader.displayName = 'ChatHeader';

// ============================================================================
// Export
// ============================================================================

export default ChatHeader;
