import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChatSession } from '@/data/aiChatData';
import {
  MessageSquare,
  Pin,
  Trash2,
  Search,
  Plus,
  Clock,
  Hash,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatHistoryProps {
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession?: (sessionId: string) => void;
  onPinSession?: (sessionId: string) => void;
}

export const ChatHistory = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onPinSession,
}: ChatHistoryProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredSessions = sessions.filter((session) =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedSessions = filteredSessions.filter((s) => s.isPinned);
  const regularSessions = filteredSessions.filter((s) => !s.isPinned);

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 1) return 'Baru saja';
    if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`;
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    if (diffInDays < 7) return `${diffInDays} hari lalu`;
    
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getTopicColor = (topic: string) => {
    const colors: Record<string, string> = {
      'Algorithms': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'AI & ML': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      'Data Structures': 'bg-green-500/10 text-green-400 border-green-500/20',
      'Web Development': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      'Programming': 'bg-red-500/10 text-red-400 border-red-500/20',
      'Database': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      'Python': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    };
    return colors[topic] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  const SessionItem = ({ session }: { session: ChatSession }) => {
    const isActive = session.id === currentSessionId;
    const isHovered = hoveredId === session.id;

    return (
      <div
        className={cn(
          'group relative rounded-lg p-3 cursor-pointer transition-all duration-200',
          'hover:bg-gray-800 border',
          isActive
            ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30'
            : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
        )}
        onClick={() => onSelectSession(session.id)}
        onMouseEnter={() => setHoveredId(session.id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        {/* Pin Icon */}
        {session.isPinned && (
          <Pin className="absolute top-2 right-2 h-3 w-3 text-blue-400 fill-blue-400" />
        )}

        {/* Topic Badge */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className={cn(
              'text-xs px-2 py-0.5 rounded-full border flex items-center gap-1',
              getTopicColor(session.topic)
            )}
          >
            <Hash className="h-3 w-3" />
            {session.topic}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-sm font-medium text-gray-200 mb-1 line-clamp-2 pr-6">
          {session.title}
        </h4>

        {/* Last Message */}
        <p className="text-xs text-gray-500 mb-2 line-clamp-1">
          {session.lastMessage}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {session.messageCount}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(session.timestamp)}
            </span>
          </div>
        </div>

        {/* Hover Actions */}
        {isHovered && !isActive && (
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onPinSession && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 hover:bg-blue-900/30"
                onClick={(e) => {
                  e.stopPropagation();
                  onPinSession(session.id);
                }}
              >
                <Pin className="h-3 w-3" />
              </Button>
            )}
            {onDeleteSession && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 hover:bg-red-900/30 hover:text-red-400"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-950 border-r border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-100">Chat History</h2>
          <Button
            size="sm"
            onClick={onNewChat}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Chat
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Cari percakapan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-800 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* Pinned Sessions */}
          {pinnedSessions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 px-1">
                <Pin className="h-3 w-3 text-blue-400" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Pinned
                </span>
              </div>
              <div className="space-y-2">
                {pinnedSessions.map((session) => (
                  <SessionItem key={session.id} session={session} />
                ))}
              </div>
            </div>
          )}

          {/* Regular Sessions */}
          {regularSessions.length > 0 && (
            <div>
              {pinnedSessions.length > 0 && (
                <div className="flex items-center gap-2 mb-2 px-1">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Recent
                  </span>
                </div>
              )}
              <div className="space-y-2">
                {regularSessions.map((session) => (
                  <SessionItem key={session.id} session={session} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredSessions.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-700 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                {searchQuery
                  ? 'Tidak ada percakapan yang ditemukan'
                  : 'Belum ada percakapan'}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
