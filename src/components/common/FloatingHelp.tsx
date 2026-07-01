"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, ShieldCheck, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";

export default function FloatingHelp() {
  const { chatOpen, setChatOpen, chatMessages, sendChatMessage } = useStore();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Magnetic button values
  const [btnCoords, setBtnCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setBtnCoords({ x: x * 0.4, y: y * 0.4 });
  };

  const handleMouseLeave = () => {
    setBtnCoords({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    sendChatMessage(inputValue.trim(), "user");
    setInputValue("");
  };

  const handleQuickAction = (text: string) => {
    sendChatMessage(text, "user");
  };

  useEffect(() => {
    if (chatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, chatOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="glass-panel w-[360px] h-[500px] sm:w-[400px] sm:h-[550px] mb-4 flex flex-col overflow-hidden shadow-2xl relative"
          >
            {/* Header */}
            <div className="bg-primary-lux text-white dark:bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-accent-lux flex items-center justify-center font-bold text-lg text-white">
                    HM
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-success-lux border-2 border-primary-lux rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm tracking-wide">Luxury Concierge</h3>
                  <p className="text-[11px] text-white/60 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-success-lux" /> Guaranteed Premium Service
                  </p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-slate-50/50 dark:bg-slate-950/20">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-[18px] px-4 py-3 text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-accent-lux text-white rounded-tr-none"
                        : "bg-white dark:bg-slate-800 text-foreground shadow-sm border border-slate-100 dark:border-slate-700/50 rounded-tl-none"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className={`text-[9px] block mt-1 ${msg.sender === "user" ? "text-white/60 text-right" : "text-slate-400"}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions Suggestions */}
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/30 flex gap-2 overflow-x-auto no-scrollbar border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleQuickAction("Where is my booking?")}
                className="text-[12px] whitespace-nowrap bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full hover:border-accent-lux dark:hover:border-accent-lux hover:text-accent-lux dark:hover:text-accent-lux transition-all duration-300"
              >
                Booking Status
              </button>
              <button
                onClick={() => handleQuickAction("Apply coupon code")}
                className="text-[12px] whitespace-nowrap bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full hover:border-accent-lux dark:hover:border-accent-lux hover:text-accent-lux dark:hover:text-accent-lux transition-all duration-300 flex items-center gap-1"
              >
                <Tag className="w-3 h-3 text-accent-lux" /> Coupon Discounts
              </button>
              <button
                onClick={() => handleQuickAction("Talk to manager")}
                className="text-[12px] whitespace-nowrap bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full hover:border-accent-lux dark:hover:border-accent-lux hover:text-accent-lux dark:hover:text-accent-lux transition-all duration-300"
              >
                Speak with Manager
              </button>
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Ask about booking or services..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-accent-lux dark:focus:border-accent-lux focus:bg-white dark:focus:bg-slate-900 transition-all text-foreground"
              />
              <button
                onClick={handleSendMessage}
                className="w-10 h-10 rounded-full bg-accent-lux hover:bg-accent-lux/90 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setChatOpen(!chatOpen)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
        animate={{
          x: btnCoords.x,
          y: btnCoords.y,
          scale: isHovered ? 1.05 : 1,
        }}
        className="magnetic-btn w-14 h-14 rounded-full bg-primary-lux hover:bg-slate-800 text-white flex items-center justify-center shadow-xl hover:shadow-2xl z-50 border border-white/10 dark:bg-accent-lux dark:hover:bg-accent-lux/95 relative cursor-pointer"
      >
        <AnimatePresence mode="wait">
          {chatOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageSquare className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
