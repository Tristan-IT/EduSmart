import { cn } from '@/lib/utils';
import { Lightbulb, BookOpen, Globe, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuickPrompt {
  id: string;
  text: string;
  icon: React.ReactNode;
  gradient: string;
}

interface QuickPromptsProps {
  onPromptClick: (text: string) => void;
  className?: string;
}

export const QuickPrompts = ({ onPromptClick, className }: QuickPromptsProps) => {
  const prompts: QuickPrompt[] = [
    {
      id: '1',
      text: 'Jelaskan konsep ini dengan cara sederhana',
      icon: <Lightbulb className="h-5 w-5" />,
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      id: '2',
      text: 'Berikan contoh soal dan pembahasannya',
      icon: <BookOpen className="h-5 w-5" />,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: '3',
      text: 'Apa hubungannya dengan kehidupan sehari-hari?',
      icon: <Globe className="h-5 w-5" />,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      id: '4',
      text: 'Tips dan trik untuk mengerjakan lebih cepat',
      icon: <Zap className="h-5 w-5" />,
      gradient: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-100 mb-2">Prompt Cepat</h3>
        <p className="text-sm text-gray-400">
          Pilih prompt untuk memulai percakapan dengan cepat
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {prompts.map((prompt, index) => (
          <motion.button
            key={prompt.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onPromptClick(prompt.text)}
            className={cn(
              'group relative p-4 rounded-xl bg-gray-900/50 border border-gray-800',
              'hover:bg-gray-800 hover:border-gray-700',
              'transition-all duration-300 cursor-pointer',
              'text-left overflow-hidden'
            )}
          >
            {/* Gradient overlay on hover */}
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300',
                prompt.gradient
              )}
            />

            {/* Icon */}
            <div
              className={cn(
                'inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3',
                'bg-gradient-to-br text-white',
                prompt.gradient
              )}
            >
              {prompt.icon}
            </div>

            {/* Text */}
            <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
              {prompt.text}
            </p>

            {/* Arrow indicator */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
