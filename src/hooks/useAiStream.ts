import { useState, useCallback, useRef, useEffect } from "react";

export interface AiMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface UseAiStreamOptions {
  sessionId?: string;
  onMessage?: (message: AiMessage) => void;
  onError?: (error: Error) => void;
  onComplete?: (sessionId: string) => void;
}

export function useAiStream(endpoint: string, options: UseAiStreamOptions = {}) {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || isStreaming) return;

      const userMessage: AiMessage = {
        role: "user",
        content: message,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsStreaming(true);
      setError(null);

      abortControllerRef.current = new AbortController();

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            sessionId: options.sessionId,
            message,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("No response body");
        }

        let assistantContent = "";
        let completedSessionId = options.sessionId;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.substring(6);
              try {
                const parsed = JSON.parse(data);

                if (parsed.chunk) {
                  assistantContent += parsed.chunk;
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    const lastMsg = newMessages[newMessages.length - 1];
                    
                    if (lastMsg && lastMsg.role === "assistant") {
                      lastMsg.content = assistantContent;
                    } else {
                      newMessages.push({
                        role: "assistant",
                        content: assistantContent,
                        timestamp: new Date().toISOString(),
                      });
                    }
                    return newMessages;
                  });
                }

                if (parsed.done) {
                  completedSessionId = parsed.sessionId || completedSessionId;
                  options.onComplete?.(completedSessionId!);
                }

                if (parsed.error) {
                  throw new Error(parsed.error);
                }
              } catch (e) {
                // Skip malformed JSON
              }
            }
          }
        }

        const finalMessage: AiMessage = {
          role: "assistant",
          content: assistantContent,
          timestamp: new Date().toISOString(),
        };

        options.onMessage?.(finalMessage);
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log("Stream aborted");
          return;
        }
        
        const error = new Error(err.message || "Failed to stream AI response");
        setError(error);
        options.onError?.(error);
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [endpoint, isStreaming, options]
  );

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const reset = useCallback(() => {
    setMessages([]);
    setError(null);
    setIsStreaming(false);
  }, []);

  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return {
    messages,
    isStreaming,
    error,
    sendMessage,
    cancel,
    reset,
  };
}
