'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MessageCircle,
  X,
  Send,
  Plane,
  MapPin,
  Hotel,
  Sparkles,
  Bot,
  User,
  Trash2,
  Phone,
  ArrowDown,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickActions = [
  { icon: MapPin, label: 'Honeymoon Packages', message: 'Show me the best honeymoon packages available' },
  { icon: Plane, label: 'International Tours', message: 'What international tour packages do you have?' },
  { icon: Hotel, label: 'Hotel Deals', message: 'Show me the best hotel deals' },
  { icon: Sparkles, label: 'Budget Trips', message: 'What are the best budget-friendly trips under ₹15,000?' },
];

const suggestedPrompts = [
  '🏖️ Goa beach vacation',
  '🏔️ Kashmir tour packages',
  '🌴 Maldives honeymoon',
  '✈️ Dubai trip deals',
  '🏛️ Golden Triangle tour',
  '🏝️ Andaman adventure',
  '🌸 Kerala houseboat',
  '🎭 Thailand packages',
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [showScrollDown, setShowScrollDown] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize session
  useEffect(() => {
    setSessionId(`wayfare-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      const el = scrollRef.current;
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Track scroll position for "scroll to bottom" button
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
      setShowScrollDown(!isNearBottom);
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  // Welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeTimer = setTimeout(() => {
        setMessages([
          {
            id: 'welcome',
            role: 'assistant',
            content:
              "Welcome to Wayfare! ✈️ I'm your AI travel assistant, here to help you plan your perfect vacation.\n\nI can help you with:\n• 🗺️ **Tour Packages** — Domestic & International\n• 🏨 **Hotel Recommendations** — Luxury to Budget\n• ✈️ **Flight Deals** — Best airfare options\n• 💡 **Trip Planning** — Duration & budget suggestions\n\nHow can I help you today?",
            timestamp: new Date(),
          },
        ]);
      }, 400);
      return () => clearTimeout(welcomeTimer);
    }
  }, [isOpen, messages.length]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: text.trim(),
        }),
      });

      const data = await response.json();

      if (data.success && data.response) {
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content:
            "I'm sorry, I'm having trouble connecting right now. 😔 Please try again in a moment, or call us directly at **+91 98765 43210** for immediate assistance!",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content:
          "Oops! Something went wrong. 😔 Please try again, or reach out to us at **+91 98765 43210** for help!",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = async () => {
    try {
      await fetch(`/api/chat?sessionId=${sessionId}`, { method: 'DELETE' });
    } catch {
      // Ignore
    }
    setMessages([]);
    setSessionId(`wayfare-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
  };

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^• /gm, '<span class="text-teal-400 mr-1">•</span> ')
      .replace(/^(\d+)\. /gm, '<span class="text-amber-400 mr-1">$1.</span> ')
      .replace(/\n/g, '<br/>');
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 shadow-2xl shadow-teal-500/30 transition-all hover:shadow-teal-500/50"
            aria-label="Open chat"
          >
            <MessageCircle className="h-6 w-6 text-white" />
            {/* Notification dot */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[380px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-gray-950 shadow-2xl shadow-black/50 sm:bottom-6 sm:right-6"
            style={{ maxHeight: 'calc(100vh - 120px)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-teal-600/90 to-emerald-600/90 px-4 py-3 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Wayfare AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
                    <span className="text-xs text-white/80">Online • Travel Expert</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  title="Clear chat"
                  aria-label="Clear chat"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <a
                  href="tel:+919876543210"
                  className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  title="Call us"
                  aria-label="Call us"
                >
                  <Phone className="h-4 w-4" />
                </a>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
              style={{ scrollbarWidth: 'thin' }}
            >
              {/* Quick Actions (shown before first user message) */}
              {messages.length <= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3"
                >
                  <p className="text-center text-xs text-gray-500 uppercase tracking-wider">
                    Quick Actions
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => sendMessage(action.message)}
                        className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-3 text-center transition-all hover:border-teal-500/30 hover:bg-teal-500/10 hover:shadow-lg hover:shadow-teal-500/5"
                      >
                        <action.icon className="h-5 w-5 text-teal-400" />
                        <span className="text-xs font-medium text-gray-300">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Messages */}
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-br-md'
                        : 'bg-white/5 text-gray-300 border border-white/10 rounded-bl-md'
                    }`}
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                    />
                  </div>
                  {msg.role === 'user' && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-600">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2.5"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="rounded-2xl rounded-bl-md border border-white/10 bg-white/5 px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-2 w-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-2 w-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Scroll to bottom button */}
              {showScrollDown && (
                <button
                  onClick={scrollToBottom}
                  className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-gray-400 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Suggested Prompts */}
            {messages.length > 1 && messages.length < 6 && (
              <div className="border-t border-white/5 px-4 py-2">
                <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                  {suggestedPrompts.slice(0, 4).map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt.replace(/^[^\s]+\s/, ''))}
                      className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-400 transition-all hover:border-teal-500/30 hover:bg-teal-500/10 hover:text-teal-300"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-white/10 bg-gray-900/80 px-4 py-3"
            >
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about packages, hotels, flights..."
                  disabled={isLoading}
                  className="flex-1 rounded-xl border-white/10 bg-white/5 text-sm text-gray-200 placeholder:text-gray-600 focus:border-teal-500/50 focus:ring-teal-500/20"
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 px-3 text-white hover:from-teal-600 hover:to-emerald-700 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
