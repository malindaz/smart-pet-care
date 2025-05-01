import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../../css/Chatbot/chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      text: 'Hello! I\'m your pet health assistant. Describe your pet\'s symptoms and I\'ll try to help identify possible conditions.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = { type: 'user', text: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Clear input field
    setInput('');
    
    // Show loading indicator
    setIsLoading(true);
    
    try {
      // Send message to backend
      const response = await axios.post('http://localhost:5000/api/chatbot/chat', { message: input });
      
      // Process response based on type
      if (response.data.success) {
        const botData = response.data.data;
        
        if (botData.type === 'greeting') {
          // Simple greeting response
          setMessages(prevMessages => [
            ...prevMessages, 
            { type: 'bot', text: botData.message }
          ]);
        } 
        else if (botData.type === 'prediction') {
          // Disease prediction - create a detailed response
          let botMessage = botData.message;
          
          if (botData.disease !== 'uncertain') {
            botMessage += `\n\n**Description**: ${botData.description}\n\n**Possible Causes**: ${botData.causes}\n\n**Care Tips**: ${botData.care}\n\n**Veterinary Advice**: ${botData.vet_visit}`;
            
            if (botData.confidence) {
              botMessage += `\n\n(Confidence: ${botData.confidence}%)`;
            }
          }
          
          setMessages(prevMessages => [
            ...prevMessages, 
            { type: 'bot', text: botMessage }
          ]);
        }
        else {
          // Default response
          setMessages(prevMessages => [
            ...prevMessages, 
            { type: 'bot', text: 'I\'m not sure how to respond to that. Could you try rephrasing?' }
          ]);
        }
      } else {
        // Error response
        setMessages(prevMessages => [
          ...prevMessages, 
          { type: 'bot', text: 'Sorry, I encountered an error. Please try again.' }
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prevMessages => [
        ...prevMessages, 
        { type: 'bot', text: 'Sorry, I couldn\'t process your message. Please try again later.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to render message text with markdown-like formatting
  const formatMessage = (text) => {
    // Split text by new lines to handle paragraphs
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, idx) => {
      // Check for bold text
      let formattedText = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      return <p key={idx} dangerouslySetInnerHTML={{ __html: formattedText }} />;
    });
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>Pet Health Assistant</h2>
        <p>Describe your pet's symptoms for help</p>
      </div>
      
      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-bubble">
              {formatMessage(message.text)}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message bot-message">
            <div className="message-bubble loading">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chatbot-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Describe your pet's symptoms..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;