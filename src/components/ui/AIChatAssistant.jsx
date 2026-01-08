import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

const AIChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: 'ai',
            text: 'Hello! I\'m your CHAKSHURA AI Assistant. How can I help you today?',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const suggestedQueries = [
        'Show me top tech trends',
        'Latest patent filings',
        'Threat analysis report',
        'Global coverage stats'
    ];

    const handleSendMessage = (messageText) => {
        if (!messageText.trim()) return;

        // Add user message
        const userMessage = {
            type: 'user',
            text: messageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        // Simulate AI response
        setIsTyping(true);
        setTimeout(() => {
            const aiResponse = {
                type: 'ai',
                text: `I understand you're interested in "${messageText}". Based on our intelligence database, I can provide you with real-time insights and analytics. This feature is currently being enhanced for the full version.`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <>
            {/* Floating Chat Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-[999] w-14 h-14 bg-gradient-to-r from-neon-cyan to-blue-500 rounded-full shadow-[0_0_30px_rgba(0,243,255,0.5)] hover:shadow-[0_0_40px_rgba(0,243,255,0.7)] transition-shadow flex items-center justify-center group"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                        >
                            <X className="w-6 h-6 text-military-900" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                        >
                            <MessageCircle className="w-6 h-6 text-military-900" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Notification Dot */}
                {!isOpen && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-neon-orange rounded-full ring-2 ring-[#050b14] animate-pulse" />
                )}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-[999] w-full max-w-[380px] h-[500px] bg-[#0a1625] border border-neon-cyan/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-neon-cyan/20 to-blue-500/20 border-b border-neon-cyan/30 p-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-neon-cyan/20 rounded-full flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-neon-cyan" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-military font-bold text-white text-sm">AI Intelligence Assistant</h3>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    <span className="text-[10px] text-gray-400 font-mono">Online</span>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] ${message.type === 'user' ? 'bg-neon-cyan/20 border-neon-cyan/30' : 'bg-white/5 border-white/10'} border rounded-lg p-3`}>
                                        <p className="text-sm text-white">{message.text}</p>
                                        <span className="text-[10px] text-gray-500 mt-1 block">{message.time}</span>
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Suggested Queries */}
                        {messages.length === 1 && (
                            <div className="px-4 pb-2">
                                <p className="text-[10px] text-gray-500 mb-2 font-mono uppercase">Suggested queries:</p>
                                <div className="flex flex-wrap gap-2">
                                    {suggestedQueries.map((query, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSendMessage(query)}
                                            className="text-[10px] px-2 py-1 bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan rounded hover:bg-neon-cyan/20 transition-colors"
                                        >
                                            {query}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <div className="border-t border-white/10 p-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                                    placeholder="Ask anything..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors"
                                />
                                <button
                                    onClick={() => handleSendMessage(inputValue)}
                                    className="w-10 h-10 bg-neon-cyan/20 border border-neon-cyan/30 rounded-lg flex items-center justify-center hover:bg-neon-cyan/30 transition-colors"
                                >
                                    <Send className="w-4 h-4 text-neon-cyan" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AIChatAssistant;
