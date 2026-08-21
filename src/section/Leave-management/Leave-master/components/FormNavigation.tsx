import { ArrowBack, ArrowForward, Send } from '@mui/icons-material';
import { Translated } from '../../../../components/common/translator/translator';
import { ParticleButton } from '@/components/ui/particle-button';

const cn = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ');

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  isDark: boolean;
  glassCard: (isDark: boolean) => string;
  onPrev: () => void;
  onNext: () => void;
}

export default function FormNavigation({
  currentStep,
  totalSteps,
  isSubmitting,
  isDark,
  glassCard,
  onPrev,
  onNext,
}: FormNavigationProps) {
  return (
    <div className={cn(glassCard(isDark), 'flex items-center justify-between px-6 py-4')}>
      <ParticleButton
        type="button"
        onClick={onPrev}
        disabled={currentStep === 1}
       className={`flex items-center px-4 py-2 border rounded-lg text-sm font-medium ${isDark ? 'text-gray-200 bg-slate-900 border-slate-800 hover:bg-slate-800' : 'text-slate-700 bg-white border-slate-200 hover:bg-slate-50'}`}
        successDuration={400}
      >
        <ArrowBack fontSize="small" />
        <Translated text="Previous" />
      </ParticleButton>

      {currentStep < totalSteps ? (
        <ParticleButton
          type="button"
          onClick={onNext}
          className={`px-4 flex gap-3 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                isDark
                  ? "bg-white text-slate-900 hover:bg-gray-100 shadow-sm"
                  : "bg-slate-800/80 text-white hover:bg-gray-800 shadow-sm"
              }`}
          successDuration={500}
        >
          <Translated text="Continue" />
          <ArrowForward fontSize="small" />
        </ParticleButton>
      ) : (
        <ParticleButton
          type="submit"
          disabled={isSubmitting}
          className={`px-4 flex gap-3 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                isDark
                  ? "bg-white text-slate-900 hover:bg-gray-100 shadow-sm"
                  : "bg-slate-800/80 text-white hover:bg-gray-800 shadow-sm"
              }`}
          successDuration={800}
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <Translated text="Submitting..." />
            </>
          ) : (
            <>
              <Send fontSize="small" />
              <Translated text="Submit Application" />
            </>
          )}
        </ParticleButton>
      )}
    </div>
  );
}