import { memo } from 'react';
import { cn } from '@/lib/utils';
import { ChatMessage as ChatMessageType } from '@/data/aiChatData';
import { Bot, User, Copy, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ChatMessageProps {
  message: ChatMessageType;
  isLatest?: boolean;
}

export const ChatMessage = memo(({ message, isLatest }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const [reaction, setReaction] = useState<'up' | 'down' | null>(null);

  const isUser = message.role === 'user';

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReaction = (type: 'up' | 'down') => {
    setReaction(reaction === type ? null : type);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Render code blocks dengan syntax highlighting
  const renderContent = (content: string) => {
    const parts = content.split(/```(\w+)?\n([\s\S]*?)```/g);
    
    return parts.map((part, index) => {
      // Code block
      if (index % 3 === 2) {
        const language = parts[index - 1] || 'text';
        return (
          <div key={index} className="my-4 relative group">
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                {language}
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-2 bg-gray-800 hover:bg-gray-700"
                onClick={() => handleCopy(part)}
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code className={`language-${language}`}>{part}</code>
            </pre>
          </div>
        );
      }
      
      // Regular text (skip language identifier)
      if (index % 3 === 1) {
        return null;
      }
      
      // Format regular text with markdown-like features
      const formattedText = part
        .split('\n')
        .map((line, i) => {
          // Headers
          if (line.startsWith('**') && line.endsWith('**')) {
            return (
              <h3 key={i} className="font-bold text-lg mt-4 mb-2">
                {line.replace(/\*\*/g, '')}
              </h3>
            );
          }
          
          // Bold text
          const boldFormatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          
          // Bullet points
          if (line.trim().startsWith('-')) {
            return (
              <li
                key={i}
                className="ml-4 mb-1"
                dangerouslySetInnerHTML={{ __html: boldFormatted.replace(/^-\s*/, '') }}
              />
            );
          }
          
          // Table rows
          if (line.includes('|')) {
            const cells = line.split('|').filter(cell => cell.trim());
            if (cells.length > 0) {
              return (
                <tr key={i} className="border-b border-gray-700">
                  {cells.map((cell, j) => (
                    <td key={j} className="px-3 py-2 text-sm">
                      {cell.trim()}
                    </td>
                  ))}
                </tr>
              );
            }
          }
          
          // Regular paragraph
          if (line.trim()) {
            return (
              <p
                key={i}
                className="mb-2"
                dangerouslySetInnerHTML={{ __html: boldFormatted }}
              />
            );
          }
          
          return <br key={i} />;
        });
      
      return <div key={index}>{formattedText}</div>;
    });
  };

  return (
    <div
      className={cn(
        'flex gap-3 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-300',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-purple-600'
            : 'bg-gradient-to-br from-green-500 to-emerald-600'
        )}
      >
        {isUser ? (
          <User className="h-5 w-5 text-white" />
        ) : (
          <Bot className="h-5 w-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          'flex-1 max-w-[80%]',
          isUser ? 'flex flex-col items-end' : 'flex flex-col items-start'
        )}
      >
        {/* Name & Time */}
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-sm font-semibold text-gray-200">
            {isUser ? 'Tristan' : 'AdaptiAI'}
          </span>
          <span className="text-xs text-gray-500">
            {formatTime(message.timestamp)}
          </span>
        </div>

        {/* Message Bubble */}
        <div
          className={cn(
            'rounded-2xl px-4 py-3 max-w-full',
            isUser
              ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-sm'
              : 'bg-gray-800 text-gray-100 rounded-tl-sm border border-gray-700'
          )}
        >
          {message.isTyping ? (
            <div className="flex gap-1 py-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            <div className="prose prose-invert max-w-none">
              {renderContent(message.content)}
            </div>
          )}
        </div>

        {/* Reactions & Actions (only for AI messages) */}
        {!isUser && !message.isTyping && (
          <div className="flex items-center gap-2 mt-2 px-1">
            <Button
              size="sm"
              variant="ghost"
              className={cn(
                'h-7 px-2 text-xs',
                reaction === 'up' && 'bg-green-900/30 text-green-400'
              )}
              onClick={() => handleReaction('up')}
            >
              <ThumbsUp className="h-3 w-3 mr-1" />
              Helpful
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className={cn(
                'h-7 px-2 text-xs',
                reaction === 'down' && 'bg-red-900/30 text-red-400'
              )}
              onClick={() => handleReaction('down')}
            >
              <ThumbsDown className="h-3 w-3 mr-1" />
              Not Helpful
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs"
              onClick={() => handleCopy(message.content)}
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';
