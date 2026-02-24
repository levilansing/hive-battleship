import React from 'react';

interface MessageAreaProps {
  message?: string;
  isAiTalking?: boolean;
}

const MessageArea: React.FC<MessageAreaProps> = ({
  message = 'Welcome to Battleship! Place your ships to begin...',
  isAiTalking = false,
}) => {
  // Enhanced styling for AI messages to make personality more engaging
  const getBgStyle = () => {
    if (isAiTalking) {
      // Check message content for more specific styling
      if (message.includes('🎉') || message.includes('win')) {
        return 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400';
      } else if (message.includes('💀') || message.includes('destroyed')) {
        return 'bg-gradient-to-r from-red-100 to-rose-100 border-2 border-red-500';
      } else if (message.includes('sunk')) {
        return 'bg-gradient-to-r from-orange-100 to-amber-100 border-2 border-orange-400';
      } else {
        return 'bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-400';
      }
    }
    return 'bg-gray-100 border-2 border-gray-300';
  };

  const getTextStyle = () => {
    if (isAiTalking) {
      if (message.includes('🎉')) {
        return 'text-green-800 font-semibold italic';
      } else if (message.includes('💀')) {
        return 'text-red-900 font-bold italic';
      } else {
        return 'text-red-800 font-semibold italic';
      }
    }
    return 'text-gray-700';
  };

  return (
    <div className="py-4 px-6 mx-auto max-w-2xl">
      <div
        className={`p-4 rounded-lg shadow-lg transition-all duration-300 ${getBgStyle()}`}
      >
        <p className={`text-center ${getTextStyle()}`}>
          {isAiTalking && '🤖 '}{message}
        </p>
      </div>
    </div>
  );
};

export default MessageArea;
