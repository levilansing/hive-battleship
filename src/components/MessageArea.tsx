import React from 'react';

interface MessageAreaProps {
  message?: string;
  isAiTalking?: boolean;
}

const MessageArea: React.FC<MessageAreaProps> = ({
  message = 'Welcome to Battleship! Place your ships to begin...',
  isAiTalking = false,
}) => {
  return (
    <div className="py-4 px-6 mx-auto max-w-2xl">
      <div
        className={`p-4 rounded-lg shadow-md ${
          isAiTalking
            ? 'bg-red-100 border-2 border-red-400'
            : 'bg-gray-100 border-2 border-gray-300'
        }`}
      >
        <p
          className={`text-center ${
            isAiTalking
              ? 'text-red-800 font-semibold italic'
              : 'text-gray-700'
          }`}
        >
          {isAiTalking && '🤖 '}{message}
        </p>
      </div>
    </div>
  );
};

export default MessageArea;
