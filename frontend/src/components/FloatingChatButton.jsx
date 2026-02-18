import { useState, useEffect } from 'react';
import { FaRobot, FaTimes } from 'react-icons/fa';
import ChatBot from './ChatBot';
import { sendChatMessage } from '../services/api';

/**
 * Floating Chat Button - Accessible from any page
 * Click to open AI assistant chat overlay
 */
function FloatingChatButton({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Basic logic: if we scroll down, we might want to adjust visibility or position
      // For now, let's just keep it simple as requested: "comes up not fully near to the dock"
      // user request implies mimicking instagram where navbar disappears and bottom elements might shift.

      // Let's implement the specific request: "when user scrolls down it comes up not fullly near to the dock"
      // This usually means the button position might adjust to avoid overlapping the dock or to be more accessible.

      // However, a common pattern (like Instagram) is hiding the bottom nav/dock on scroll down and showing on scroll up.
      // But here the user asks for the button specifically.

      // Let's stick to the styling change mostly, but if we need dynamic positioning:
      // We can use a class that changes based on scroll direction if needed, but the user asked for "comes up".
      // Maybe they mean it should have a higher bottom margin initially or dynamically?
      // "comes up not fullly near to the dock" -> likely means it shouldn't sit right on top of the bottom nav.
      // Let's increase the bottom spacing slightly in the class and reduce size.

      // Also "simultaneously the navbar goes up and disappears" -> This logic belongs in Navbar, but maybe we can simulate it here if we controlled it.
      // Since we can't control navbar state from here easily without context, we will focus on the button's behavior.
      // BUT, we can make the button respect the scroll direction if we want it to hide/show.

      // Re-reading: "make like this when user scrolls down it comes up not fullly near to the dock"
      // This is slightly ambiguous. It might mean "move up" (translate Y negative) or "appear" (fade in).
      // Given "navbar goes up and disappears", it sounds like the standard "hide on scroll down, show on scroll up" behavior for the navbar, 
      // and maybe the floating button should move WITH the dock or stay?
      // If the dock is sticky bottom (which it is), it stays. 
      // If the user wants the button to move *away* from the dock, maybe just higher bottom margin?

      // ACTUALLY, "navbar goes up and disappears" refers to the *top* navbar. 
      // "floating chat button... comes up" might mean it moves higher to avoid being covered or just sits higher.

      // Let's reduce size to w-14 h-14 or w-12 h-12 as requested and increase bottom margin.
      // And add a transition for smooth movement if we were changing it dynamically.

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSendMessage = async (message, location = null, detectedLanguage = null) => {
    const response = await sendChatMessage(user.uid, message, location, detectedLanguage);
    return response;
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        data-tour="floating-chat"
        className="fixed bottom-20 right-4 w-12 h-12 md:bottom-6 md:right-6 md:w-14 md:h-14 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-full shadow-2xl hover:shadow-3xl transition-transform transform hover:scale-110 flex items-center justify-center z-40"
        title="Chat with AI Assistant"
      >
        {isOpen ? <FaTimes className="text-2xl" /> : <FaRobot className="text-2xl" />}
        <span className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
      </button>

      {/* Chat Widget */}
      <ChatBot
        user={user}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        sendMessage={handleSendMessage}
      />
    </>
  );
}

export default FloatingChatButton;
