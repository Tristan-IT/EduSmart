import { cn } from '@/lib/utils';
import { QuickAction } from '@/data/aiChatData';
import { motion } from 'framer-motion';

interface QuickActionsGridProps {
  actions: QuickAction[];
  onActionClick: (action: QuickAction) => void;
  className?: string;
}

export const QuickActionsGrid = ({
  actions,
  onActionClick,
  className,
}: QuickActionsGridProps) => {
  const getActionGradient = (action: string) => {
    const gradients: Record<string, string> = {
      'generate-quiz': 'from-blue-500 to-blue-600',
      'explain-analogy': 'from-yellow-500 to-orange-500',
      'code-review': 'from-purple-500 to-purple-600',
      'visual-diagram': 'from-green-500 to-emerald-500',
      'study-plan': 'from-pink-500 to-rose-500',
      'coding-challenge': 'from-red-500 to-orange-600',
      'eli5': 'from-cyan-500 to-blue-500',
      'resources': 'from-indigo-500 to-purple-600',
    };
    return gradients[action] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-100 mb-2">Quick Actions</h3>
        <p className="text-sm text-gray-400">
          Fitur cepat untuk meningkatkan pengalaman belajar kamu
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onActionClick(action)}
            className={cn(
              'group relative p-4 rounded-xl bg-gray-900/50 border border-gray-800',
              'hover:bg-gray-800 hover:border-gray-700 hover:scale-105',
              'transition-all duration-300 cursor-pointer',
              'text-center overflow-hidden'
            )}
          >
            {/* Gradient overlay */}
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300',
                getActionGradient(action.action)
              )}
            />

            {/* Icon */}
            <div
              className={cn(
                'inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 mx-auto',
                'bg-gradient-to-br text-white text-xl',
                getActionGradient(action.action)
              )}
            >
              {action.icon}
            </div>

            {/* Label */}
            <p className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors mb-1">
              {action.label}
            </p>

            {/* Description */}
            <p className="text-xs text-gray-500 line-clamp-2">
              {action.description}
            </p>

            {/* Hover effect */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/10 rounded-xl transition-all duration-300" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};
