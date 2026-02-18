"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import {
    SendIcon,
    LoaderIcon,
    Sparkles,
    MapPin,
    Menu,
} from "lucide-react";
import { motion } from "framer-motion";
import { sendChatMessage } from '../../services/api';
import { getAuth } from 'firebase/auth';

// Markdown renderer for chat messages
// Markdown renderer for chat messages
const MarkdownText = ({ content }) => {
    // Basic markdown parsing
    const parseLine = (text) => {
        // Process **bold**
        const parts = [];
        let lastIndex = 0;
        const boldRegex = /\*\*(.*?)\*\*/g;
        let match;

        while ((match = boldRegex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push(text.substring(lastIndex, match.index));
            }
            parts.push(
                <strong key={match.index} className="font-semibold text-white">
                    {match[1]}
                </strong>
            );
            lastIndex = match.index + match[0].length;
        }

        if (lastIndex < text.length) {
            parts.push(text.substring(lastIndex));
        }

        return parts.length > 0 ? parts : text;
    };

    const lines = content.split('\n');
    const elements = [];
    let currentList = [];

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();

        // Check for list items (* or -)
        if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
            currentList.push(
                <li key={`li-${index}`} className="flex items-start gap-2 ml-1">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                    <span>{parseLine(trimmedLine.substring(2))}</span>
                </li>
            );
        } else {
            // Flush any pending list
            if (currentList.length > 0) {
                elements.push(
                    <ul key={`ul-${index}`} className="space-y-1 my-2 pl-2">
                        {currentList}
                    </ul>
                );
                currentList = [];
            }

            if (trimmedLine) {
                elements.push(
                    <p key={`p-${index}`} className="leading-relaxed text-white/90 my-1">
                        {parseLine(line)}
                    </p>
                );
            } else {
                elements.push(<div key={`br-${index}`} className="h-2" />);
            }
        }
    });

    // Flush remaining list
    if (currentList.length > 0) {
        elements.push(
            <ul key="ul-end" className="space-y-1 my-2 pl-2">
                {currentList}
            </ul>
        );
    }

    return <div className="space-y-1 text-[15px]">{elements}</div>;
};

export function AnimatedAIChat({ isSidebarOpen, onToggleSidebar, currentConversation }) {
    const [value, setValue] = useState("");
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hello! I'm your AalayaX AI assistant. I can help you discover products, dining options, entertainment, and more. How can I assist you today?",
            timestamp: new Date()
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    // Load conversation when selected from history
    useEffect(() => {
        if (currentConversation) {
            // Load the conversation messages
            const conversationMessages = [];

            // Add user message
            if (currentConversation.userMessage) {
                conversationMessages.push({
                    role: 'user',
                    content: currentConversation.userMessage,
                    timestamp: new Date(currentConversation.createdAt || Date.now())
                });
            } else if (currentConversation.message) {
                conversationMessages.push({
                    role: 'user',
                    content: currentConversation.message,
                    timestamp: new Date(currentConversation.timestamp || Date.now())
                });
            }

            // Add assistant response
            if (currentConversation.aiResponse) {
                conversationMessages.push({
                    role: 'assistant',
                    content: currentConversation.aiResponse,
                    timestamp: new Date(currentConversation.createdAt || Date.now())
                });
            } else if (currentConversation.response) {
                conversationMessages.push({
                    role: 'assistant',
                    content: currentConversation.response,
                    timestamp: new Date(currentConversation.timestamp || Date.now())
                });
            }

            if (conversationMessages.length > 0) {
                setMessages(conversationMessages);
            } else {
                // Fallback if structure is unknown
                setMessages([
                    {
                        role: 'assistant',
                        content: '👋 Resuming conversation...',
                        timestamp: new Date()
                    }
                ]);
            }
        }
    }, [currentConversation]);

    // Get user location on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    console.log('Location captured:', position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.log('Location permission denied:', error);
                }
            );
        }
    }, []);

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim()) {
                handleSendMessage();
            }
        }
    };

    const handleSendMessage = async () => {
        if (!value.trim() || isLoading) return;

        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            alert('Please log in to use the AI assistant');
            return;
        }

        const userMessage = {
            role: 'user',
            content: value,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setValue("");
        setIsLoading(true);

        try {
            const response = await sendChatMessage(user.uid, value, userLocation);

            // Filter out system logs/thought process lines like (ACCESSING API...)
            const cleanResponse = (text) => {
                if (!text) return "";
                return text.replace(/^\s*\(.*?\)\s*$/gm, "").trim();
            };

            const assistantMessage = {
                role: 'assistant',
                content: cleanResponse(response.response),
                timestamp: new Date(),
                recommendations: response.recommendations || []
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
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

    return (
        <div className="h-full flex flex-col w-full bg-black text-white relative overflow-hidden">
            {/* Background gradients */}
            {/* Background gradients removed for pure black theme */}

            {/* Header */}
            <div className="relative z-10 border-b border-white/10 bg-black/50 backdrop-blur-xl flex-shrink-0">
                <div className="max-w-4xl mx-auto px-4 py-2 md:px-6 md:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {/* Hamburger Menu */}
                            <button
                                onClick={onToggleSidebar}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                title={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                            >
                                <Menu className="w-5 h-5 text-white" />
                            </button>
                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-white">AalayaX AI Assistant</h1>
                                <p className="text-xs text-white/50">Powered by Gemini 2.0 Flash</p>
                            </div>
                        </div>
                        {userLocation && (
                            <div className="flex items-center gap-2 text-xs text-white/50">
                                <MapPin className="w-4 h-4" />
                                <span>Location enabled</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div
                className="flex-1 overflow-y-auto relative z-10 custom-scrollbar"
                style={{ scrollbarWidth: 'auto', scrollbarColor: '#4b5563 #000000' }}
            >
                <div className="max-w-4xl mx-auto px-4 py-4 md:px-6 md:py-8 space-y-4 md:space-y-6">
                    {messages.map((message, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={cn(
                                    "max-w-[85%] md:max-w-[80%] p-3 md:p-4 rounded-2xl",
                                    message.role === 'user'
                                        ? 'bg-white text-black rounded-br-none'
                                        : message.error
                                            ? 'bg-red-500/20 border border-red-500/30 text-red-200 rounded-bl-none'
                                            : 'bg-white/5 border border-white/10 text-white rounded-bl-none backdrop-blur-xl'
                                )}
                            >
                                {message.role === 'user' ? (
                                    <p className="text-sm leading-relaxed text-black">{message.content}</p>
                                ) : (
                                    <MarkdownText content={message.content} />
                                )}
                                <p className={cn(
                                    "text-xs mt-2 opacity-50",
                                    message.role === 'user' ? 'text-black' : 'text-white'
                                )}>
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </motion.div>
                    ))}

                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                        >
                            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-bl-none backdrop-blur-xl">
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <div className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-xl flex-shrink-0 pb-2 md:pb-0">
                <div className="max-w-4xl mx-auto px-4 py-2 md:px-6 md:py-4">
                    <div className="relative backdrop-blur-2xl bg-white/[0.02] rounded-2xl border border-white/[0.08] shadow-2xl">
                        <textarea
                            ref={textareaRef}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask me anything... Try 'biryani near me' or 'best tech products'"
                            className={cn(
                                "w-full px-4 py-3 pr-12 md:px-6 md:py-4 md:pr-14",
                                "resize-none",
                                "bg-transparent",
                                "border-none",
                                "text-white/90 text-sm caret-white",
                                "focus:outline-none",
                                "placeholder:text-white/30",
                                "min-h-[44px] max-h-[150px] md:min-h-[60px] md:max-h-[200px]"
                            )}
                            rows={1}
                            style={{ height: 'auto' }}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!value.trim() || isLoading}
                            className={cn(
                                "absolute right-3 bottom-3",
                                "w-10 h-10 rounded-xl",
                                "flex items-center justify-center",
                                "transition-all duration-200",
                                value.trim() && !isLoading
                                    ? 'bg-slate-100 text-black hover:bg-white shadow-lg'
                                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                            )}
                        >
                            {isLoading ? (
                                <LoaderIcon className="w-5 h-5 animate-spin" />
                            ) : (
                                <SendIcon className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    <p className="text-[10px] md:text-xs text-white/30 mt-2 text-center hidden md:block">
                        AI can make mistakes. Verify important information.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AnimatedAIChat;
