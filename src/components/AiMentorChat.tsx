/**
 * AI Mentor Chat Component
 * Chat interface with typing indicators and message bubbles
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AiMentorSession } from "@/data/mockAi/mentor";

interface AiMentorChatProps {
  session: AiMentorSession;
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export function AiMentorChat({ 
  session, 
  onSendMessage, 
  isLoading = false,
  className 
}: AiMentorChatProps) {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [session.messages]);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    const message = input.trim();
    setInput("");
    setIsSending(true);
    setIsTyping(true);

    try {
      await onSendMessage(message);
    } finally {
      setIsSending(false);
      setTimeout(() => setIsTyping(false), 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className={cn("flex flex-col h-[600px]", className)}>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-5 w-5 text-primary" />
          </motion.div>
          AI Mentor Assistant
          <motion.div
            className="ml-auto flex items-center gap-1 text-xs text-muted-foreground"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Online
          </motion.div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {session.messages.map((msg, index) => {
                const isAi = msg.role === "assistant";
                return (
                  <motion.div
                    key={`${msg.timestamp}-${index}`}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={cn(
                      "flex gap-3",
                      !isAi && "flex-row-reverse"
                    )}
                  >
                    {/* Avatar */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring" }}
                    >
                      <Avatar className={cn(
                        "w-8 h-8",
                        isAi ? "bg-primary" : "bg-accent"
                      )}>
                        <AvatarFallback>
                          {isAi ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>

                    {/* Message Bubble */}
                    <motion.div
                      className={cn(
                        "max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm",
                        isAi
                          ? "bg-muted text-foreground rounded-tl-none"
                          : "bg-primary text-primary-foreground rounded-tr-none"
                      )}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      {msg.followUpAction && (
                        <Button
                          asChild
                          variant="link"
                          size="sm"
                          className="mt-1 h-auto p-0 text-xs"
                        >
                          <a href={msg.followUpAction.href}>{msg.followUpAction.label}</a>
                        </Button>
                      )}
                      <span className="text-xs opacity-70 mt-1 block">
                        {new Date(msg.timestamp).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex gap-3"
                >
                  <Avatar className="w-8 h-8 bg-primary">
                    <AvatarFallback>
                      <Bot className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-muted-foreground rounded-full"
                        animate={{
                          y: [0, -8, 0],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tanya AI Mentor..."
              disabled={isSending || isLoading}
              className="flex-1"
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isSending || isLoading}
                size="icon"
                className="shrink-0"
              >
                {isSending ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </motion.div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Tekan Enter untuk kirim • Shift+Enter untuk baris baru
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
