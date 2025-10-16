import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hello! I\'m your Transparatech AI Assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Gemini AI
  const initializeAI = () => {
    if (!apiKey.trim()) {
      alert('Please enter your Gemini API key');
      return null;
    }
    
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    } catch (error) {
      console.error('Error initializing AI:', error);
      alert('Error initializing AI. Please check your API key.');
      return null;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const model = initializeAI();
      if (!model) {
        setIsLoading(false);
        return;
      }

      // Create context-aware prompt
      const contextPrompt = `You are a helpful AI assistant for Transparatech, a transparency portal application. 
      The user is asking: "${userMessage.content}"
      
      Please provide a helpful, informative response. If the question is about Transparatech, explain that it's a platform for organizational accountability and transparent budget access with role-based permissions (Viewer, Officer, Auditor, Admin).
      
      Keep responses concise but informative.`;

      const result = await model.generateContent(contextPrompt);
      const response = await result.response;
      const text = response.text();

      const botMessage = {
        type: 'bot',
        content: text,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage = {
        type: 'bot',
        content: 'Sorry, I encountered an error. Please check your API key and try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        type: 'bot',
        content: 'Hello! I\'m your Transparatech AI Assistant. How can I help you today?',
        timestamp: new Date()
      }
    ]);
  };

  if (!isConfigured) {
    return (
      <div className="chatbot-container">
        <div className="chatbot-setup">
          <div className="setup-card">
            <h2 className="setup-title">🤖 Gemini AI Chatbot Setup</h2>
            <p className="setup-description">
              To use the AI chatbot, you need a Google Gemini API key.
            </p>
            
            <div className="setup-steps">
              <h3>How to get your API key:</h3>
              <ol>
                <li>Go to <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a></li>
                <li>Sign in with your Google account</li>
                <li>Click "Create API Key"</li>
                <li>Copy the generated API key</li>
                <li>Paste it below</li>
              </ol>
            </div>

            <div className="api-key-input">
              <label htmlFor="apiKey">Gemini API Key:</label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                className="api-key-field"
              />
              <button 
                onClick={() => setIsConfigured(true)}
                className="setup-button"
                disabled={!apiKey.trim()}
              >
                Start Chatting
              </button>
            </div>

            <div className="setup-note">
              <p><strong>Note:</strong> Your API key is stored locally and not sent to our servers.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="header-content">
          <h1 className="chatbot-title">🤖 Transparatech AI Assistant</h1>
          <p className="chatbot-subtitle">Powered by Google Gemini AI</p>
        </div>
        <div className="header-actions">
          <button onClick={clearChat} className="clear-button">
            Clear Chat
          </button>
          <button onClick={() => setIsConfigured(false)} className="settings-button">
            Settings
          </button>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}-message`}>
            <div className="message-avatar">
              {message.type === 'user' ? '👤' : '🤖'}
            </div>
            <div className="message-content">
              <div className="message-text">{message.content}</div>
              <div className="message-timestamp">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message bot-message">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <div className="input-wrapper">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (Press Enter to send)"
            className="message-input"
            rows="2"
            disabled={isLoading}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="send-button"
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;