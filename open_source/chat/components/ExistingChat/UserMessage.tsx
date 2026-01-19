/**
 * UserMessage Component
 * 
 * Displays a user's message in the chat.
 */

import React from 'react';
import { IUserMessage } from '../../types';
import { formatDateTime } from '../../utils/helpers';

interface UserMessageProps {
  message: IUserMessage;
  showTimestamp?: boolean;
}

export const UserMessage: React.FC<UserMessageProps> = ({
  message,
  showTimestamp = false,
}) => {
  return (
    <div className="user-message flex justify-end">
      <div className="max-w-[80%] flex flex-col items-end gap-1">
        {/* Message Bubble */}
        <div className="bg-textPurple text-white px-4 py-3 rounded-2xl rounded-tr-none">
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>

        {/* Images */}
        {message.images && message.images.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-end">
            {message.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.filename || `Uploaded image ${index + 1}`}
                className="w-24 h-24 object-cover rounded-lg border border-borderDefault cursor-pointer hover:opacity-80 transition-opacity"
              />
            ))}
          </div>
        )}

        {/* Timestamp */}
        {showTimestamp && message.timestamp && (
          <span className="text-xs text-textDimmedColor">
            {formatDateTime(message.timestamp)}
          </span>
        )}
      </div>
    </div>
  );
};

UserMessage.displayName = 'UserMessage';

export default UserMessage;
