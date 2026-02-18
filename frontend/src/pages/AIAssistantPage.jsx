import { useState, useEffect } from 'react';
import { getConversationHistory, clearConversation } from '../services/api';
import AnimatedAIChat from '../components/ui/animated-ai-chat';
import { AIAssistantSidebar } from '../components/AIAssistantSidebar';

/**
 * AI Assistant Page - Main interface for AI-powered features
 * Replaced with Animated AI Chat interface
 */
function AIAssistantPage({ user }) {
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [currentConversation, setCurrentConversation] = useState(null);

  // Load conversation history
  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    try {
      const data = await getConversationHistory(user.uid);
      setConversationHistory(data.history || []);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const handleClearHistory = async () => {
    if (confirm('Clear all conversation history?')) {
      try {
        await clearConversation(user.uid);
        setConversationHistory([]);
        setCurrentConversation(null);
        alert('History cleared');
      } catch (error) {
        console.error('Error clearing history:', error);
      }
    }
  };

  const handleNewChat = () => {
    setCurrentConversation(null);
    window.location.reload();
  };

  const handleSelectConversation = (conversation) => {
    setCurrentConversation(conversation);
  };

  return (
    <div className="flex bg-black h-[calc(100vh-9rem)] md:h-[calc(100vh-4rem)] w-full overflow-hidden">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden h-full bg-black border-r border-neutral-800`}>
        <AIAssistantSidebar
          history={conversationHistory}
          onClearHistory={handleClearHistory}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 relative h-screen w-full">
        <AnimatedAIChat
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          currentConversation={currentConversation}
        />
      </div>
    </div>
  );
}

export default AIAssistantPage;
