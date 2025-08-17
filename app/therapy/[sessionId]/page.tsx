"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, scale } from "framer-motion";
import ReactMarkdown from "react-markdown";

const glowAnimation = {
  initial: { opacity: 0.5, scale: 1 },
  animate: {
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.05, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function TherapyPage() {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatPaused] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  useEffect(() => {
    if (!isTyping) {
      scrollToBottom();
    }
  }, [messages, isTyping]);

  return (
    <div className="relative max-w-7xl mx-auto px-4">
      <div className="flex h-[calc(100vh-4rem)] mt-20 gap-6">
        <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[hsl(200,50%,3%)] rounded-lg border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[hsl(150,30%,60%)]/10 text-[hsl(150,30%,60%)] flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold">AI Therapist</h2>
              <p className="text-sm text-[hsl(215,16%,45%)]">
                {messages.length} messages
              </p>
            </div>
          </div>

          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="max-w-2xl w-full space-y-8">
                <div className="text-center space-y-4">
                  <div className="relative inline-flex flex-col items-center">
                    <motion.div
                      className="absolute inset-0 bg-[hsl(150,30%,60%)]/20 blur-2xl rounded-full"
                      initial="initial"
                      animate="animate"
                      variants={glowAnimation as any}
                    />
                    <div className="relative flex items-center gap-2 text-2xl font-semibold">
                      <div className="relative">
                        <Sparkles className="w-6 h-6 text-[hsl(150,30%,60%)]" />
                        <motion.div
                          className="absolute inset-0 text-[hsl(150,30%,60%)]"
                          initial="initial"
                          animate="animate"
                          variants={glowAnimation as any}
                        >
                          <Sparkles className="w-6 h-6" />
                        </motion.div>
                      </div>
                      <span className="bg-gradient-to-r from-[hsl(150,30%,60%)]/90 to-[hsl(150,30%,60%)] bg-clip-text text-transparent">
                        AI Therapist
                      </span>
                    </div>
                    <p className="text-[hsl(215,16%,45%)] mt-2">
                      How can I assist you today?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto scroll-smooth">
              <div className="max-w-3xl mx-auto">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.timestamp.toISOString()}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "px-6 py-8",
                        msg.role === "assistant"
                          ? "bg-[hsl(210,20%,96%)]/30"
                          : "bg-[hsl(180,20%,99%)]"
                      )}
                    >
                      <div className="flex gap-4">
                        <div className="w-8 h-8 shrink-0 mt-1">
                          {msg.role === "assistant" ? (
                            <div className="w-8 h-8 rounded-full bg-[hsl(150,30%,60%)]/10 text-[hsl(150,30%,60%)] flex items-center ring-1 ring-[hsl(150,30%,60%)]/20">
                              <Bot className="w-5 h-5" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[hsl(250,20%,96%)] text-[hsl(250,10%,30%)] flex items-center justify-center ">
                              <User className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-2 overflow-hidden min-h-[2rem]">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">
                              {msg.role === "assistant"
                                ? "AI Therapist"
                                : "You"}
                            </p>
                          </div>
                          <div className="prose prose-sm dark:prose-invert leading-relaxed">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-6 py-8 flex gap-4 bg-[hsl(210,20%,96%)]/30"
                  >
                    <div className="w-8 h-8 shrink-0">
                      <div className="w-8 h-8 rounded-full bg-[hsl(150,30%,60%)]/10 text-[hsl(150,30%,60%)] flex items-center justify-center ring-1 ring-[hsl(150,30%,60%)]/20">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="font-medium text-sm">AI Therapist</p>
                      <p className="text-sm text-[hsl(215,16%,45%)]">
                        Typing...
                      </p>
                    </div>
                  </motion.div>
                )}
                <div ref={messageEndRef} />
              </div>
            </div>
          )}

          <div className="border-t bg-[hsl(180,20%,99%)]/50 dark:bg-[hsl(200,50%,3%)]/80 backdrop-blur supports-[backdrop-filter]:bg-[hsl(180,20%,99%)]/50 dark:supports-[backdrop-filter]:bg-[hsl(200,50%,3%)]/80 p-4">
            <form
              action=""
              onSubmit={() => {}}
              className="max-w-3xl mx-auto flex gap-4 items-end relative"
            >
              <div className="flex-1 relative group">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    isChatPaused
                      ? "Complete the activity to continue..."
                      : "Ask me anything.."
                  }
                  className={cn(
                    "w-full resize-none rounded-2xl border bg-[hsl(180,20%,99%)] dark:bg-[hsl(200,50%,3%)] dark:text-white",
                    "p-3 pr-12 min-h-[48px] max-h-[200px]",
                    "focus:outline-none focus:ring-2 focus:ring-[hsl(150,30%,60%)]/50",
                    "transition-all duration-200",
                    "placeholder:text-[hsl(215,16%,45%)]/70 dark:placeholder:text-[hsl(215,16%,75%)]/70",
                    (isTyping || isChatPaused) &&
                      "opacity-50 cursor-not-allowed"
                  )}
                  rows={1}
                  disabled={isTyping || isChatPaused}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  className={cn(
                    "absolute right-1.5 bottom-3.5 h-[36px] w-[36px]",
                    "rounded-xl transition-all duration-200",
                    "bg-[hsl(150,30%,70%)] hover:bg-[hsl(150,30%,70%)]/90",
                    "shadow-sm shadow-[hsl(150,30%,70%)]",
                    (isTyping || isChatPaused || !message.trim()) &&
                    "opacity-50 cursor-not-allowed",
                    "group-hover:scale-105 group-focus-within:scale-105"
                  )}
                  disabled={isTyping || isChatPaused || !message.trim()}
                //   onClick={(e) => {
                //     e.preventDefault();
                //     handleSubmit(e);
                //   }}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
