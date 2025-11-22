import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChatMessage } from '@/components/ChatMessage';
import { QuickPrompts } from '@/components/QuickPrompts';
import { SuggestedQuestions } from '@/components/SuggestedQuestions';
import { QuickActionsGrid } from '@/components/QuickActionsGrid';
import { TypingIndicator } from '@/components/TypingIndicator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from 'react-router-dom';
import {
  ChatMessage as ChatMessageType,
  SuggestedQuestion,
  QuickAction,
  studentProfile,
} from '@/data/aiChatData';
import {
  Send,
  Paperclip,
  Mic,
  Image as ImageIcon,
  Code,
  MoreVertical,
  Settings,
  Sparkles,
  Bot,
  PanelLeftClose,
  PanelLeft,
  ArrowLeft,
  Home,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AiStudentChatProps {
  messages: ChatMessageType[];
  suggestedQuestions: SuggestedQuestion[];
  quickActions: QuickAction[];
  onSendMessage: (message: string) => void;
  onQuickAction: (action: QuickAction) => void;
  isTyping?: boolean;
  showSidebar?: boolean;
  onToggleSidebar?: () => void;
  className?: string;
}

export const AiStudentChat = ({
  messages,
  suggestedQuestions,
  quickActions,
  onSendMessage,
  onQuickAction,
  isTyping = false,
  showSidebar = true,
  onToggleSidebar,
  className,
}: AiStudentChatProps) => {
  const [inputValue, setInputValue] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasMessages = messages.length > 0;

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [inputValue]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePromptClick = (text: string) => {
    setInputValue(text);
    textareaRef.current?.focus();
  };

  return (
    <div className={cn('flex flex-col h-full bg-gray-950', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {/* Back to Dashboard Button */}
          <Link to="/dashboard-siswa">
            <Button
              size="sm"
              variant="ghost"
              className="hover:bg-gray-800 gap-2"
              title="Kembali ke Dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
              <Home className="h-4 w-4" />
            </Button>
          </Link>
          
          <div className="h-6 w-px bg-gray-700" /> {/* Separator */}
          
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
              AdaptiAI
              <Sparkles className="h-4 w-4 text-yellow-500" />
            </h2>
            <p className="text-xs text-gray-400">
              Personal Learning Mentor untuk {studentProfile.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onToggleSidebar && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onToggleSidebar}
              className="hover:bg-gray-800"
              title={showSidebar ? 'Sembunyikan History' : 'Tampilkan History'}
            >
              {showSidebar ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeft className="h-4 w-4" />
              )}
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowQuickActions(!showQuickActions)}
            className={cn(
              'hover:bg-gray-800',
              showQuickActions && 'bg-gray-800'
            )}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Quick Actions
          </Button>
          <Button size="sm" variant="ghost" className="hover:bg-gray-800">
            <Settings className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="hover:bg-gray-800">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Actions Panel (Collapsible) */}
      <AnimatePresence>
        {showQuickActions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-gray-800 bg-gray-900/30 overflow-hidden"
          >
            <div className="p-6">
              <QuickActionsGrid
                actions={quickActions}
                onActionClick={onQuickAction}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-6">
        <div className="py-6 max-w-4xl mx-auto">
          {!hasMessages ? (
            // Welcome Screen
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Welcome Message */}
              <div className="text-center mb-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Bot className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-100 mb-2">
                  Halo, {studentProfile.name}! 👋
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Saya AdaptiAI, mentor pribadi kamu yang siap membantu perjalanan belajar kamu.
                  Saya tahu kamu suka belajar dengan cara <span className="text-blue-400 font-semibold">{studentProfile.learningStyle}</span>,
                  jadi saya akan sesuaikan penjelasan dengan gaya belajar kamu! 🚀
                </p>
              </div>

              {/* Student Profile Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700/30">
                  <div className="text-2xl mb-2">💪</div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Kekuatan Kamu</h3>
                  <div className="flex flex-wrap gap-1">
                    {studentProfile.strengths.slice(0, 3).map((strength, i) => (
                      <span key={i} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700/30">
                  <div className="text-2xl mb-2">🎯</div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Minat Kamu</h3>
                  <div className="flex flex-wrap gap-1">
                    {studentProfile.interests.slice(0, 3).map((interest, i) => (
                      <span key={i} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700/30">
                  <div className="text-2xl mb-2">📈</div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Level & XP</h3>
                  <div className="text-2xl font-bold text-green-400">
                    Level {studentProfile.currentLevel}
                  </div>
                  <div className="text-xs text-gray-400">{studentProfile.xp} XP</div>
                </div>
              </div>

              {/* Quick Prompts */}
              <QuickPrompts onPromptClick={handlePromptClick} />

              {/* Suggested Questions */}
              <SuggestedQuestions
                questions={suggestedQuestions.slice(0, 4)}
                onQuestionClick={handlePromptClick}
              />
            </motion.div>
          ) : (
            // Messages
            <div className="space-y-4">
              {messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isLatest={index === messages.length - 1}
                />
              ))}
              {isTyping && <TypingIndicator />}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto">
          {/* Suggested Questions (when there are messages) */}
          {hasMessages && (
            <div className="mb-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {suggestedQuestions.slice(0, 3).map((question) => (
                <button
                  key={question.id}
                  onClick={() => handlePromptClick(question.question)}
                  className="flex-shrink-0 px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-750 text-gray-300 rounded-full border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  {question.icon} {question.question}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="relative flex items-end gap-2">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tanya apa saja... (Shift + Enter untuk baris baru)"
                className="min-h-[52px] max-h-[200px] resize-none bg-gray-800 border-gray-700 focus:border-blue-500 text-gray-100 pr-28"
                rows={1}
              />

              {/* Attachment Buttons */}
              <div className="absolute right-2 bottom-2 flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-gray-700"
                  title="Attach File"
                >
                  <Paperclip className="h-4 w-4 text-gray-400" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-gray-700"
                  title="Attach Image"
                >
                  <ImageIcon className="h-4 w-4 text-gray-400" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-gray-700"
                  title="Attach Code"
                >
                  <Code className="h-4 w-4 text-gray-400" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-gray-700"
                  title="Voice Input"
                >
                  <Mic className="h-4 w-4 text-gray-400" />
                </Button>
              </div>
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className={cn(
                'h-[52px] px-6 rounded-xl',
                inputValue.trim()
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                  : 'bg-gray-800 cursor-not-allowed'
              )}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>

          {/* Tips */}
          <div className="mt-2 text-xs text-gray-500 text-center">
            💡 Tips: Jelaskan masalah dengan detail untuk jawaban yang lebih akurat
          </div>
        </div>
      </div>
    </div>
  );
};
