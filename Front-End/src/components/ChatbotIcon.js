import React, { useState } from 'react';
import { Bot, X, Send } from 'lucide-react';

const ChatbotIcon = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatbot-icon-container">
      {isOpen ? (
        <div className="chatbot-icon-window">
          <div className="chatbot-icon-header">
            <div className="chatbot-icon-header-title">
              <Bot size={18} />
              <h3>AI Pet Health Assistant</h3>
            </div>
            <button 
              className="chatbot-icon-close" 
              onClick={toggleChatbot}
              aria-label="Close chatbot"
            >
              <X size={18} />
            </button>
          </div>
          <div className="chatbot-icon-body">
            <div className="chatbot-icon-message">
              <p>👋 Hello! I'm your AI assistant. Describe your pet's symptoms, and I'll help identify possible health issues.</p>
            </div>
            <div className="chatbot-icon-input">
              <input 
                type="text" 
                placeholder="Describe symptoms here..." 
                aria-label="Chat message input"
              />
              <button aria-label="Send message">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          className="chatbot-icon-button" 
          onClick={toggleChatbot}
          aria-label="Open AI chatbot"
        >
          <div className="chatbot-icon-button-content">
            <Bot size={28} />
            <span>Ask AI</span>
          </div>
        </button>
      )}
      <style jsx>{`
        .chatbot-icon-container {
          position: fixed;
          bottom: 80px;
          right: 30px;
          z-index: 1000;
          font-family: 'Inter', sans-serif;
        }
        
        .chatbot-icon-button {
          width: 120px;
          height: 60px;
          border-radius: 30px;
          background-color: #20B2AA;
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          transition: all 0.3s ease;
        }
        
        .chatbot-icon-button-content {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 16px;
        }
        
        .chatbot-icon-button:hover {
          background-color: #1A9086;
          transform: scale(1.05);
        }
        
        .chatbot-icon-window {
          position: absolute;
          bottom: 70px;
          right: 0;
          width: 320px;
          height: 420px;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        
        .chatbot-icon-header {
          background-color: #20B2AA;
          color: white;
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .chatbot-icon-header-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .chatbot-icon-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }
        
        .chatbot-icon-close {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }
        
        .chatbot-icon-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 16px;
          overflow-y: auto;
        }
        
        .chatbot-icon-message {
          background-color: #f5f5f5;
          padding: 12px 14px;
          border-radius: 10px;
          margin-bottom: 12px;
          max-width: 85%;
        }
        
        .chatbot-icon-message p {
          margin: 0;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .chatbot-icon-input {
          margin-top: auto;
          display: flex;
          border-top: 1px solid #eee;
          padding-top: 12px;
        }
        
        .chatbot-icon-input input {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
        }
        
        .chatbot-icon-input button {
          background-color: #20B2AA;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px;
          margin-left: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .chatbot-icon-input button:hover {
          background-color: #1A9086;
        }
      `}</style>
    </div>
  );
};

export default ChatbotIcon;