// ./src/components/ChatBotComponent.js
import React from 'react';
import ChatBot from 'react-simple-chatbot';

const ChatBotComponent = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    { id: '1', message: 'Hi! How can I assist you today?', trigger: 'options' },
    {
      id: 'options',
      options: [
        { value: 'shop', label: 'Browse Products', trigger: 'shop' },
        { value: 'wishlist', label: 'View Wishlist', trigger: 'wishlist' },
        { value: 'help', label: 'Get Help', trigger: 'help' },
      ],
    },
    { id: 'shop', message: 'You can browse products in the Shop section!', end: true },
    { id: 'wishlist', message: 'View your wishlist for saved items.', end: true },
    { id: 'help', message: 'Contact support for further assistance.', end: true },
  ];

  return (
    <div className="chatbot-container fixed bottom-20 right-10 bg-white shadow-lg border rounded">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={onClose}
      >
        ✖
      </button>
      <ChatBot steps={steps} />
    </div>
  );
};

export default ChatBotComponent;
