import { motion } from "framer-motion";
import { ArrowBack, ArrowForward, Send } from "@mui/icons-material";
import { useTheme } from "@/theme/AppThemeProvider";
import { Translated } from "../../../../components/common/translator/translator";
import { ParticleButton } from "@/components/ui/particle-button";

interface FormNavigationProps {
  currentStep: number;
  isSubmitting: boolean;
  isEdit: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export default function FormNavigation({
  currentStep,
  isSubmitting,
  isEdit,
  onPrev,
  onNext,
  onSubmit,
}: FormNavigationProps) {
  const { mode } = useTheme();
  const isDark = mode === "dark";

  // Prevent default form submission for all buttons
  const handlePrevClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPrev();
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onNext();
  };

  const handleSubmitClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSubmit();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col justify-between gap-3 sm:flex-row sm:gap-4"
    >
      <ParticleButton
        type="button"
        disabled={currentStep === 1}
        onClick={handlePrevClick}
        className={`flex items-center px-4 py-2 border rounded-lg text-sm font-medium ${isDark ? "text-gray-200 bg-slate-900 border-slate-800 hover:bg-slate-800" : "text-slate-700 bg-white border-slate-200 hover:bg-slate-50"}`}
        successDuration={400}
      >
        <ArrowBack fontSize="small" />
        <Translated text="Back" />
      </ParticleButton>

      {currentStep < 3 ? (
        <ParticleButton
          type="button"
          onClick={handleNextClick}
          className={`flex items-center px-4 py-2 border rounded-lg text-sm font-medium ${isDark ? "text-gray-200 bg-slate-900 border-slate-800 hover:bg-slate-800" : "text-slate-700 bg-white border-slate-200 hover:bg-slate-50"}`}
          successDuration={500}
        >
          <Translated text="Next" />
          <ArrowForward fontSize="small" />
        </ParticleButton>
      ) : (
        <ParticleButton
          type="button" // Changed from "submit" to "button" to prevent any default behavior
          disabled={isSubmitting}
          onClick={handleSubmitClick}
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
              <Translated
                text={isEdit ? "Update Submission" : "Submit Assignment"}
              />
            </>
          )}
        </ParticleButton>
      )}
    </motion.div>
  );
}