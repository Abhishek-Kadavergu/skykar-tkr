import React from 'react';
import { FaHistory, FaTrash, FaPlus } from 'react-icons/fa';

export function AIAssistantSidebar({ history, onClearHistory, onNewChat, onSelectConversation }) {
    return (
        <div className="w-64 bg-black text-white h-full flex flex-col border-r border-neutral-800 flex-shrink-0 transition-all duration-300 z-20 relative">
            <div className="p-4 border-b border-neutral-800 flex-shrink-0">
                <div className="flex items-center gap-3 mb-6 px-2">
                    <div className="w-8 h-8 bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
                        <span className="font-bold text-white">AI</span>
                    </div>
                    <span className="font-bold text-lg tracking-tight">AalayaX</span>
                </div>
                <button
                    onClick={onNewChat}
                    className="w-full flex items-center justify-center gap-2 bg-white hover:bg-neutral-200 text-black px-4 py-2.5 rounded-lg transition-all shadow-lg font-medium text-sm"
                >
                    <FaPlus className="text-xs" />
                    <span>New Chat</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar" style={{ scrollbarWidth: 'auto', scrollbarColor: '#4b5563 #171717' }}>
                <div className="px-2 mb-3 flex items-center justify-between flex-shrink-0">
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Recent</span>
                    <FaHistory className="text-neutral-600 text-xs" />
                </div>
                <div className="space-y-1">
                    {history.length === 0 ? (
                        <div className="text-neutral-600 text-sm px-4 py-8 text-center border-2 border-dashed border-neutral-800 rounded-lg">
                            <p>No history yet</p>
                            <p className="text-xs mt-1 text-neutral-700">Start a conversation!</p>
                        </div>
                    ) : (
                        history.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => onSelectConversation && onSelectConversation(item)}
                                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-neutral-900 text-sm text-neutral-400 hover:text-white truncate transition-all group flex items-center gap-2"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-700 group-hover:bg-white transition-colors"></span>
                                <span className="truncate flex-1">{item.message || `Conversation ${index + 1}`}</span>
                            </button>
                        ))
                    )}
                </div>
            </div>

            <div className="p-4 border-t border-neutral-800 bg-black flex-shrink-0">
                <button
                    onClick={onClearHistory}
                    className="flex items-center gap-2 text-neutral-400 hover:text-red-400 text-sm transition-colors w-full px-2 py-2 rounded-lg hover:bg-neutral-900 group"
                >
                    <FaTrash className="text-xs group-hover:animate-bounce" />
                    <span>Clear History</span>
                </button>
            </div>
        </div>
    );
}
