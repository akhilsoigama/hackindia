import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';
import { Translated } from '../common/translator/translator';
import { useTheme } from '@/theme/AppThemeProvider';

interface EmptyStateProps {
  searchTerm: string;
  onCreate: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ searchTerm, onCreate }) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        text-center py-20 rounded-3xl border transition-all duration-300
        ${isDark
          ? 'bg-white/4 border-white/10'
          : 'bg-white border-slate-200 shadow-sm'}
      `}
    >
      <div className="mb-6 flex justify-center">
        <div
          className={`
            w-20 h-20 rounded-2xl flex items-center justify-center text-4xl
            ${isDark
              ? 'bg-indigo-500/10 border border-indigo-400/20'
              : 'bg-indigo-50 border border-indigo-100'}
          `}
        >
          📚
        </div>
      </div>

      <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white/85' : 'text-slate-800'}`}>
        {searchTerm ? <Translated text="No materials found"/> : <Translated text="No materials yet"/>}
      </h3>

      <p className={`text-sm mb-8 max-w-md mx-auto ${isDark ? 'text-white/45' : 'text-slate-500'}`}>
        {searchTerm 
          ? <Translated text='Try adjusting your search terms or browse different categories'/> 
          : <Translated text='Start building your educational content library'/>
        }
      </p>

      {!searchTerm && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreate}
          className="inline-flex items-center gap-2 mx-auto px-5 py-2.5 text-sm font-medium rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors duration-200"
        >
          <FaPlus /> <Translated text="Create First Material" />
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;