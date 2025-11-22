import { useState } from 'react';
import { AiStudentChat } from '@/components/AiStudentChat';
import { ChatHistory } from '@/components/ChatHistory';
import {
  currentChatMessages,
  chatHistory,
  suggestedQuestions,
  quickActions,
  ChatMessage,
  QuickAction,
} from '@/data/aiChatData';
import { motion, AnimatePresence } from 'framer-motion';

export default function AiStudentChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(currentChatMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState('session-1');
  const [showSidebar, setShowSidebar] = useState(true);

  // Mock responses untuk demo
  const mockResponses = [
    `Pertanyaan bagus! Mari kita bahas dengan cara yang mudah dipahami.

Pertama, kita perlu memahami konsep dasarnya terlebih dahulu. Bayangkan seperti ini...

**Poin-poin Penting:**
- Konsep pertama yang perlu dipahami
- Hubungan antara konsep A dan B
- Aplikasi praktisnya dalam kehidupan sehari-hari

Mau saya jelaskan lebih detail bagian mana yang masih membingungkan?`,
    
    `Wah, kamu cepat sekali memahaminya! 🎉

Untuk memperdalam pemahaman kamu, coba kerjakan latihan berikut:

\`\`\`python
# Challenge: Implement this function
def solve_problem(input_data):
    # Your code here
    pass
\`\`\`

**Hints:**
1. Mulai dengan kasus sederhana dulu
2. Pertimbangkan edge cases
3. Optimasi complexity nya

Setelah selesai, paste kodenya di sini ya! Aku akan review dan kasih feedback. 💪`,
  ];

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);

    // Simulate AI typing
    setIsTyping(true);
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    // In real app, load messages for this session
    // For now, just show current messages
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentSessionId('new-session');
  };

  const handleQuickAction = (action: QuickAction) => {
    // Handle quick action
    const actionMessages: Record<string, string> = {
      'generate-quiz': 'Buatkan saya quiz untuk menguji pemahaman tentang topik yang sedang kita bahas!',
      'explain-analogy': 'Jelaskan konsep ini dengan menggunakan analogi yang mudah dipahami',
      'code-review': 'Saya mau review code saya, boleh?',
      'visual-diagram': 'Buatkan diagram visual untuk menjelaskan konsep ini',
      'study-plan': 'Buatkan study plan yang dipersonalisasi untuk saya',
      'coding-challenge': 'Berikan saya coding challenge yang sesuai dengan level saya',
      'eli5': 'Jelaskan seperti saya anak usia 5 tahun',
      'resources': 'Rekomendasikan resource belajar untuk topik ini',
    };

    handleSendMessage(actionMessages[action.action] || action.description);
  };

  return (
    <div className="h-screen flex bg-gray-950 text-gray-100">
      {/* Sidebar - Chat History */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 overflow-hidden"
          >
            <ChatHistory
              sessions={chatHistory}
              currentSessionId={currentSessionId}
              onSelectSession={handleSelectSession}
              onNewChat={handleNewChat}
              onDeleteSession={(id) => console.log('Delete session:', id)}
              onPinSession={(id) => console.log('Pin session:', id)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        <AiStudentChat
          messages={messages}
          suggestedQuestions={suggestedQuestions}
          quickActions={quickActions}
          onSendMessage={handleSendMessage}
          onQuickAction={handleQuickAction}
          isTyping={isTyping}
          showSidebar={showSidebar}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
        />
      </div>
    </div>
  );
}
