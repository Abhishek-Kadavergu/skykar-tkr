import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaMicrophone, FaTimes, FaRobot } from 'react-icons/fa';

/**
 * Simple Markdown Renderer for Chat Messages
 * Handles: **bold**, line breaks, and emojis
 */
const MarkdownText = ({ content }) => {
  const lines = content.split('\n');
  
  return (
    <div className="space-y-1">
      {lines.map((line, lineIndex) => {
        if (!line.trim()) return <div key={`empty-${lineIndex}`} className="h-1" />;
        
        // Process **bold** text
        const parts = [];
        let lastIndex = 0;
        const boldRegex = /\*\*(.*?)\*\*/g;
        let match;
        
        while ((match = boldRegex.exec(line)) !== null) {
          if (match.index > lastIndex) {
            parts.push(line.substring(lastIndex, match.index));
          }
          parts.push(
            <strong key={`bold-${lineIndex}-${match.index}`} className="font-bold text-slate-900">
              {match[1]}
            </strong>
          );
          lastIndex = match.index + match[0].length;
        }
        
        if (lastIndex < line.length) {
          parts.push(line.substring(lastIndex));
        }
        
        return (
          <div key={`line-${lineIndex}`} className="leading-relaxed">
            {parts.length > 0 ? parts : line}
          </div>
        );
      })}
    </div>
  );
};

/**
 * ChatBot Component - AI-powered virtual assistant 
 * Features: Text & voice input, conversation history, context-aware responses
 */
function ChatBot({ user, isOpen, onClose, sendMessage }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Hey! I\'m your AalayaX AI assistant. I can help you find products, answer questions, and give recommendations. What are you looking for today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Get user's geolocation on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          console.log('📍 Location accessed for AI assistant');
        },
        (error) => {
          console.log('Location not available:', error.message);
        }
      );
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Pass location to AI so it knows user's context
      const response = await sendMessage(input, userLocation);
      
      const assistantMessage = {
        role: 'assistant',
        content: response.response || response,
        timestamp: new Date(),
        recommendations: response.recommendations || null
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <FaRobot className="text-slate-800 text-xl" />
          </div>
          <div>
            <h3 className="font-bold">AalayaX AI Assistant</h3>
            <p className="text-xs text-slate-300">Always here to help</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-slate-700 p-2 rounded-full transition"
        >
          <FaTimes />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-slate-800 text-white rounded-br-none'
                  : message.error
                  ? 'bg-red-100 text-red-800 rounded-bl-none'
                  : 'bg-white text-slate-800 shadow-sm rounded-bl-none border border-gray-200'
              }`}
            >
              {message.role === 'user' ? (
                <p className="text-sm leading-relaxed">{message.content}</p>
              ) : (
                <MarkdownText content={message.content} />
              )}
              <p className="text-xs mt-2 opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
            disabled={isLoading}
          />
          <button
            onClick={toggleVoiceInput}
            className={`p-3 rounded-full transition ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-gray-200 text-slate-700 hover:bg-gray-300'
            }`}
            title="Voice input"
          >
            <FaMicrophone />
          </button>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-slate-800 text-white rounded-full hover:bg-slate-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            title="Send message"
          >
            <FaPaperPlane />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Press Enter to send • Click mic for voice
        </p>
      </div>
    </div>
  );
}

export default ChatBot;
