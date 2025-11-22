/**
 * AI Mentor Chat Component - Live Integration
 * Chat interface with real AI streaming
 */

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, User, Sparkles, AlertCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAiStream } from "@/hooks/useAiStream";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface AiMentorChatLiveProps {
  sessionId?: string;
  className?: string;
  onSessionUpdate?: (sessionId: string) => void;
}

export function AiMentorChatLive({ 
  sessionId,
  className,
  onSessionUpdate,
}: AiMentorChatLiveProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [feedbackSent, setFeedbackSent] = useState<Set<number>>(new Set());

  const { messages, isStreaming, error, sendMessage, reset } = useAiStream("ai/mentor/chat", {
    sessionId,
    onComplete: (newSessionId) => {
      onSessionUpdate?.(newSessionId);
    },
  });

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const input = inputRef.current?.value.trim();
    if (!input || isStreaming) return;

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    await sendMessage(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFeedback = async (messageIndex: number, type: "positive" | "negative") => {
    if (feedbackSent.has(messageIndex)) {
      toast.info("Feedback sudah dikirim untuk pesan ini");
      return;
    }

    const message = messages[messageIndex];
    if (!message || message.role !== "assistant") return;

    try {
      const token = localStorage.getItem("token");
      await fetch("/api/ai/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId: sessionId || "default",
          messageId: `msg-${message.timestamp}`,
          feedbackType: "rating",
          rating: type === "positive" ? 5 : 1,
          comment: type === "positive" ? "Helpful response" : "Not helpful",
        }),
      });

      setFeedbackSent((prev) => new Set([...prev, messageIndex]));
      toast.success(type === "positive" ? "Terima kasih atas feedback positifnya!" : "Terima kasih, kami akan tingkatkan");
    } catch (err) {
      toast.error("Gagal mengirim feedback");
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
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="m-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error.message}. <button onClick={reset} className="underline ml-2">Reset chat</button>
            </AlertDescription>
          </Alert>
        )}

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Tanya AI Mentor tentang topik pembelajaran atau minta saran!</p>
              </div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((msg, index) => {
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
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-70">
                          {new Date(msg.timestamp).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {isAi && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "h-6 w-6 p-0 hover:bg-green-500/20",
                                feedbackSent.has(index) && "opacity-50"
                              )}
                              onClick={() => handleFeedback(index, "positive")}
                              disabled={feedbackSent.has(index)}
                            >
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "h-6 w-6 p-0 hover:bg-red-500/20",
                                feedbackSent.has(index) && "opacity-50"
                              )}
                              onClick={() => handleFeedback(index, "negative")}
                              disabled={feedbackSent.has(index)}
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Typing Indicator */}
            <AnimatePresence>
              {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
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
              ref={inputRef}
              onKeyPress={handleKeyPress}
              placeholder="Tanya AI Mentor..."
              disabled={isStreaming}
              className="flex-1"
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleSend}
                disabled={isStreaming}
                size="icon"
                className="shrink-0"
              >
                {isStreaming ? (
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
