/**
 * CollapsedSidebar Component
 * 
 * A collapsed version of the sidebar showing only icons.
 * Expands on hover to show labels.
 * 
 * @component
 * @example
 * ```tsx
 * <CollapsedSidebar
 *   items={sidebarItems}
 *   onNewChat={() => createNewChat()}
 *   onItemClick={(item) => navigate(item.path)}
 * />
 * ```
 */

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { ISidebarItem } from '../types';

// ============================================================================
// Types
// ============================================================================

interface CollapsedSidebarProps {
  /** Sidebar navigation items */
  items: ISidebarItem[];
  
  /** Callback when new chat is requested */
  onNewChat: () => void;
  
  /** Callback when item is clicked */
  onItemClick?: (item: ISidebarItem) => void;
  
  /** Callback when item is hovered */
  onItemHover?: (item: ISidebarItem | null) => void;
  
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * CollapsedSidebar Component
 */
export const CollapsedSidebar: React.FC<CollapsedSidebarProps> = ({
  items,
  onNewChat,
  onItemClick,
  onItemHover,
  className = '',
}) => {
  // ============================================================================
  // State
  // ============================================================================

  const [hoveredItem, setHoveredItem] = useState<ISidebarItem | null>(null);

  // ============================================================================
  // Event Handlers
  // ============================================================================

  const handleItemHover = (item: ISidebarItem | null) => {
    setHoveredItem(item);
    onItemHover?.(item);
  };

  const handleItemClick = (item: ISidebarItem) => {
    if (item.path) {
      onItemClick?.(item);
    }
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div
      className={`collapsed-sidebar flex flex-col items-center gap-3 py-5 px-2 bg-bgCardColor border-r border-borderDefault ${className}`}
      onMouseLeave={() => handleItemHover(null)}
    >
      {/* New Chat Button */}
      <button
        type="button"
        onClick={onNewChat}
        onMouseEnter={() => handleItemHover(null)}
        className="flex items-center justify-center w-10 h-10 bg-textPurple text-white rounded-lg hover:opacity-90 transition-opacity"
        aria-label="New chat"
        title="New Chat"
      >
        <Plus size={20} />
      </button>

      {/* Divider */}
      <div className="w-full h-px bg-borderDefault" />

      {/* Navigation Items */}
      {items
        .filter((item) => item.show !== false)
        .map((item) => (
          <React.Fragment key={item.id}>
            {item.borderTop && (
              <div className="w-full h-px bg-borderDefault" />
            )}
            
            <button
              type="button"
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => handleItemHover(item)}
              className={`flex flex-col items-center justify-center w-10 h-10 rounded-lg hover:bg-bgSelectedColor transition-colors ${
                hoveredItem?.id === item.id ? 'bg-bgSelectedColor' : ''
              } ${item.className || ''}`}
              aria-label={item.label}
              title={item.label}
            >
              {item.icon}
            </button>
          </React.Fragment>
        ))}
    </div>
  );
};

// ============================================================================
// Display Name
// ============================================================================

CollapsedSidebar.displayName = 'CollapsedSidebar';

// ============================================================================
// Export
// ============================================================================

export default CollapsedSidebar;
