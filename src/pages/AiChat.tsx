import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Send, 
  Sparkles, 
  BookOpen, 
  Lightbulb, 
  Trash2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  History,
  Star,
  TrendingUp,
  Brain,
  MessageSquare,
  Zap,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  liked?: boolean;
  disliked?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  topic: string;
  timestamp: Date;
  messageCount: number;
  preview: string;
}

const AiChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Halo Tristan! 👋 Saya EduBot, asisten belajar AI kamu. Saya siap membantu kamu memahami matematika dengan cara yang mudah dan menyenangkan! Mau belajar topik apa hari ini?',
      timestamp: new Date('2025-11-07T09:00:00'),
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatHistory: ChatSession[] = [
    {
      id: 'session-001',
      title: 'Persamaan Kuadrat',
      topic: 'algebra',
      timestamp: new Date('2025-11-07T08:30:00'),
      messageCount: 12,
      preview: 'Bagaimana cara menyelesaikan persamaan kuadrat...'
    },
    {
      id: 'session-002',
      title: 'Teorema Pythagoras',
      topic: 'geometry',
      timestamp: new Date('2025-11-06T14:20:00'),
      messageCount: 8,
      preview: 'Bisa jelaskan teorema pythagoras dengan contoh...'
    },
    {
      id: 'session-003',
      title: 'Statistika Dasar',
      topic: 'statistics',
      timestamp: new Date('2025-11-06T10:15:00'),
      messageCount: 15,
      preview: 'Apa perbedaan mean, median, dan modus...'
    },
    {
      id: 'session-004',
      title: 'Fungsi Trigonometri',
      topic: 'trigonometry',
      timestamp: new Date('2025-11-05T16:45:00'),
      messageCount: 20,
      preview: 'Kenapa sin²θ + cos²θ = 1...'
    },
    {
      id: 'session-005',
      title: 'Limit Fungsi',
      topic: 'calculus',
      timestamp: new Date('2025-11-05T11:00:00'),
      messageCount: 10,
      preview: 'Konsep limit itu apa ya...'
    },
  ];

  const quickPrompts = [
    { icon: Lightbulb, text: 'Jelaskan konsep ini dengan cara sederhana', topic: 'explanation' },
    { icon: BookOpen, text: 'Berikan contoh soal dan pembahasannya', topic: 'practice' },
    { icon: Brain, text: 'Apa hubungannya dengan kehidupan sehari-hari?', topic: 'application' },
    { icon: Zap, text: 'Tips dan trik untuk mengerjakan lebih cepat', topic: 'tips' },
  ];

  const stats = {
    totalChats: 47,
    questionsAsked: 156,
    conceptsLearned: 28,
    averageRating: 4.8,
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (question: string): string => {
    const responses = [
      `Pertanyaan yang bagus, Tristan! 🌟 Mari kita bahas ini step by step:\n\n1. **Konsep Dasar**: ${question.toLowerCase().includes('apa') ? 'Ini adalah konsep fundamental dalam matematika yang sering kita temui.' : 'Untuk memahami ini, kita perlu pahami dasarnya terlebih dahulu.'}\n\n2. **Penjelasan**: Bayangkan kamu punya masalah dimana kamu perlu mencari nilai yang tidak diketahui. Nah, disitulah matematika berperan!\n\n3. **Contoh Praktis**: Misalnya, jika kamu punya uang Rp 50.000 dan ingin beli 3 buku dengan harga yang sama, berapa harga per buku? Ini adalah aplikasi sederhana dari konsep yang kamu tanyakan.\n\n4. **Latihan**: Coba kerjakan soal ini: ...\n\nAda yang masih bingung? Tanya aja! 😊`,
      
      `Wah, topik yang menarik! 📚 Biar aku jelaskan dengan cara yang gampang dimengerti:\n\n**Analogi Sederhana**:\nBayangkan kamu lagi main game dan harus mencari harta karun. Setiap petunjuk yang kamu dapat itu seperti informasi matematika yang membantu kamu mencapai jawaban!\n\n**Langkah-langkahnya**:\n• Langkah 1: Identifikasi apa yang diketahui\n• Langkah 2: Tentukan apa yang ditanya\n• Langkah 3: Pilih rumus atau metode yang tepat\n• Langkah 4: Hitung dengan teliti\n• Langkah 5: Periksa kembali hasilnya\n\n**Pro Tips** 💡:\n- Selalu tulis yang diketahui dan ditanya\n- Jangan skip langkah, kerjakan secara berurutan\n- Cek hasil akhir dengan mensubstitusi kembali\n\nMau latihan soal sekarang?`,
      
      `Oke Tristan, ini penjelasan lengkapnya! 🎯\n\n**Mengapa Ini Penting?**\nKonsep ini adalah fondasi untuk topik-topik matematika yang lebih advanced. Kalau kamu kuasai ini, topik selanjutnya akan jauh lebih mudah!\n\n**Rumus Kunci**:\n\`\`\`\ny = mx + c\n\`\`\`\n\nDimana:\n- y = nilai yang dicari\n- m = konstanta/koefisien\n- x = variabel\n- c = konstanta\n\n**Cara Mudah Mengingatnya**:\nPakai akronim "YMCX" - You Must Calculate eXactly! 😄\n\n**Contoh Soal**:\nSoal: Jika 2x + 3 = 11, berapa nilai x?\n\nJawab:\n2x + 3 = 11\n2x = 11 - 3\n2x = 8\nx = 4 ✓\n\n**Verifikasi**: 2(4) + 3 = 8 + 3 = 11 ✓\n\nPaham kan? Mau coba soal yang lebih challenging?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleLike = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, liked: !msg.liked, disliked: false } : msg
    ));
    toast.success('Terima kasih atas feedback-nya! 👍');
  };

  const handleDislike = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, disliked: !msg.disliked, liked: false } : msg
    ));
    toast.info('Maaf jika jawabannya kurang membantu. Coba tanya dengan cara lain ya! 🙏');
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Pesan berhasil disalin!');
  };

  const handleClearChat = () => {
    if (window.confirm('Hapus semua pesan di chat ini?')) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: 'Chat telah direset! Mau mulai belajar apa sekarang, Tristan? 🚀',
        timestamp: new Date(),
      }]);
      toast.success('Chat berhasil dihapus!');
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
  };

  const handleLoadHistory = (session: ChatSession) => {
    toast.info(`Memuat sesi: ${session.title}`);
    // In real implementation, load messages from this session
  };

  return (
    <SidebarProvider>
      <AppSidebar role="student" />
      <main className="flex-1 w-full">
        {/* Header */}
        <motion.div 
          className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex h-16 items-center gap-4 px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-3 flex-1">
              <div className="relative">
                <Sparkles className="h-5 w-5 text-primary" />
                <motion.div
                  className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  EduBot AI
                </h1>
                <p className="text-xs text-muted-foreground">Asisten belajar pribadimu</p>
              </div>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              {stats.averageRating} Rating
            </Badge>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="container px-6 py-6 max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chat">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="history">
                <History className="h-4 w-4 mr-2" />
                Riwayat
              </TabsTrigger>
              <TabsTrigger value="stats">
                <TrendingUp className="h-4 w-4 mr-2" />
                Statistik
              </TabsTrigger>
            </TabsList>

            {/* Chat Tab */}
            <TabsContent value="chat" className="space-y-4">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Chat */}
                <div className="lg:col-span-2 space-y-4">
                  <Card className="h-[calc(100vh-16rem)]">
                    <CardHeader className="border-b pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-primary" />
                          Chat dengan EduBot
                        </CardTitle>
                        <Button variant="ghost" size="sm" onClick={handleClearChat}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 flex flex-col h-[calc(100%-5rem)]">
                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <AnimatePresence>
                          {messages.map((message, index) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3 }}
                              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                              <Avatar className="h-8 w-8 shrink-0">
                                {message.role === 'assistant' ? (
                                  <>
                                    <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600">
                                      <Sparkles className="h-4 w-4 text-white" />
                                    </AvatarFallback>
                                  </>
                                ) : (
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500">
                                    TF
                                  </AvatarFallback>
                                )}
                              </Avatar>

                              <div className={`flex flex-col gap-2 max-w-[80%] ${message.role === 'user' ? 'items-end' : ''}`}>
                                <div className={`rounded-2xl px-4 py-3 ${
                                  message.role === 'user' 
                                    ? 'bg-primary text-primary-foreground' 
                                    : 'bg-muted'
                                }`}>
                                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">
                                    {message.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  
                                  {message.role === 'assistant' && (
                                    <div className="flex items-center gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={() => handleLike(message.id)}
                                      >
                                        <ThumbsUp className={`h-3 w-3 ${message.liked ? 'fill-primary text-primary' : ''}`} />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={() => handleDislike(message.id)}
                                      >
                                        <ThumbsDown className={`h-3 w-3 ${message.disliked ? 'fill-destructive text-destructive' : ''}`} />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={() => handleCopy(message.content)}
                                      >
                                        <Copy className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>

                        {isTyping && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-3"
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600">
                                <Sparkles className="h-4 w-4 text-white" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="bg-muted rounded-2xl px-4 py-3">
                              <div className="flex gap-1">
                                <motion.div
                                  className="h-2 w-2 bg-muted-foreground rounded-full"
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                />
                                <motion.div
                                  className="h-2 w-2 bg-muted-foreground rounded-full"
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                />
                                <motion.div
                                  className="h-2 w-2 bg-muted-foreground rounded-full"
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                      </div>

                      {/* Input */}
                      <div className="border-t p-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Tanya apa saja tentang matematika..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="flex-1"
                          />
                          <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  {/* Quick Prompts */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Prompt Cepat</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {quickPrompts.map((prompt, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full justify-start text-left h-auto py-3"
                          onClick={() => handleQuickPrompt(prompt.text)}
                        >
                          <prompt.icon className="h-4 w-4 mr-2 shrink-0" />
                          <span className="text-xs">{prompt.text}</span>
                        </Button>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Study Tips */}
                  <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-primary" />
                        Tips Belajar
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-xs space-y-2 text-muted-foreground">
                        <li className="flex gap-2">
                          <span>•</span>
                          <span>Tanya dengan spesifik untuk jawaban yang lebih jelas</span>
                        </li>
                        <li className="flex gap-2">
                          <span>•</span>
                          <span>Minta contoh soal untuk latihan</span>
                        </li>
                        <li className="flex gap-2">
                          <span>•</span>
                          <span>Jangan ragu untuk tanya ulang jika masih bingung</span>
                        </li>
                        <li className="flex gap-2">
                          <span>•</span>
                          <span>Like/dislike pesan untuk membantu AI belajar</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Riwayat Percakapan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {chatHistory.map((session) => (
                    <motion.div
                      key={session.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleLoadHistory(session)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold">{session.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{session.preview}</p>
                        </div>
                        <Badge variant="outline" className="capitalize ml-2">
                          {session.topic}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {session.timestamp.toLocaleDateString('id-ID')}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {session.messageCount} pesan
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats" className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Total Chat</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats.totalChats}</p>
                    <p className="text-xs text-muted-foreground mt-1">Sesi percakapan</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Pertanyaan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats.questionsAsked}</p>
                    <p className="text-xs text-muted-foreground mt-1">Sudah ditanyakan</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Konsep Dipelajari</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats.conceptsLearned}</p>
                    <p className="text-xs text-muted-foreground mt-1">Topik matematika</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Rating Rata-rata</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold flex items-center gap-2">
                      {stats.averageRating}
                      <Star className="h-6 w-6 fill-yellow-500 text-yellow-500" />
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Dari 5 bintang</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Topik yang Sering Ditanyakan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { topic: 'Aljabar', count: 45, percentage: 85 },
                      { topic: 'Geometri', count: 32, percentage: 65 },
                      { topic: 'Trigonometri', count: 28, percentage: 55 },
                      { topic: 'Statistika', count: 25, percentage: 48 },
                      { topic: 'Kalkulus', count: 20, percentage: 38 },
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{item.topic}</span>
                          <span className="text-muted-foreground">{item.count} pertanyaan</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-primary to-purple-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percentage}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </SidebarProvider>
  );
};

export default AiChat;
