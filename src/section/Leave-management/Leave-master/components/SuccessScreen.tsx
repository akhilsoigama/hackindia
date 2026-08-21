import { motion } from 'framer-motion';
import { Add, CheckCircle } from '@mui/icons-material';
import { Translated } from '../../../../components/common/translator/translator';

const cn = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ');
const subText = (isDark: boolean) => (isDark ? 'text-slate-400' : 'text-slate-500');
const primaryText = (isDark: boolean) => (isDark ? 'text-slate-100' : 'text-slate-900');

interface SuccessScreenProps {
  isDark: boolean;
  glassCard: (isDark: boolean) => string;
  onReset: () => void;
}

export default function SuccessScreen({ isDark, glassCard, onReset }: SuccessScreenProps) {
  return (
    <div className={cn('relative min-h-screen overflow-hidden px-4 py-10 sm:px-6 md:px-10', isDark ? 'bg-slate-950' : 'bg-slate-50')}>
      <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0', isDark ? 'bg-[radial-gradient(circle_at_50%_40%,rgba(59,130,246,0.18),transparent_55%)]' : 'bg-[radial-gradient(circle_at_50%_40%,rgba(59,130,246,0.1),transparent_55%)]')} />
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={cn(glassCard(isDark), 'relative mx-auto max-w-md p-10 text-center')}>
        <div className={cn('mx-auto flex h-16 w-16 items-center justify-center rounded-full', isDark ? 'bg-emerald-500/15' : 'bg-emerald-100')}>
          <CheckCircle className="text-emerald-500" fontSize="large" />
        </div>
        <h2 className={cn('mt-5 text-2xl font-semibold', primaryText(isDark))}>
          <Translated text="Application submitted!" />
        </h2>
        <p className={cn('mt-2 text-sm', subText(isDark))}>
          <Translated text="Your leave request has been sent for approval. You will be notified shortly." />
        </p>
        <button
          type="button"
          onClick={onReset}
          className={cn('mt-8 inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-all duration-150', isDark ? 'border-white/10 bg-slate-900/80 text-slate-200 hover:border-white/20 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50')}
        >
          <Add fontSize="small" />
          <Translated text="New Application" />
        </button>
      </motion.div>
    </div>
  );
}
