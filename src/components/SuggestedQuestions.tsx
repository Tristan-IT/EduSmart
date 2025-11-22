import { cn } from '@/lib/utils';
import { SuggestedQuestion } from '@/data/aiChatData';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';

interface SuggestedQuestionsProps {
  questions: SuggestedQuestion[];
  onQuestionClick: (question: string) => void;
  className?: string;
}

export const SuggestedQuestions = ({
  questions,
  onQuestionClick,
  className,
}: SuggestedQuestionsProps) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Algorithms': 'from-blue-500 to-blue-600',
      'Data Structures': 'from-green-500 to-green-600',
      'AI & ML': 'from-purple-500 to-purple-600',
      'Web Development': 'from-orange-500 to-orange-600',
      'Programming': 'from-red-500 to-red-600',
      'Version Control': 'from-pink-500 to-pink-600',
      'Database': 'from-yellow-500 to-yellow-600',
      'Best Practices': 'from-cyan-500 to-cyan-600',
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-bold text-gray-100">Pertanyaan yang Disarankan</h3>
      </div>

      <div className="space-y-2">
        {questions.map((question, index) => (
          <motion.button
            key={question.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onQuestionClick(question.question)}
            className={cn(
              'group w-full p-4 rounded-lg bg-gray-900/50 border border-gray-800',
              'hover:bg-gray-800 hover:border-gray-700',
              'transition-all duration-200 cursor-pointer',
              'text-left flex items-start gap-3'
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
                'bg-gradient-to-br text-white text-lg',
                getCategoryColor(question.category)
              )}
            >
              {question.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors mb-1">
                {question.question}
              </p>
              <span className="text-xs text-gray-500">
                {question.category}
              </span>
            </div>

            {/* Arrow */}
            <ChevronRight className="flex-shrink-0 h-5 w-5 text-gray-600 group-hover:text-gray-400 transition-colors" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};
