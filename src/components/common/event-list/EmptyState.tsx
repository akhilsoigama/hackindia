import { memo } from "react";
import { useTheme } from '@/theme/AppThemeProvider';
import { FaSearch } from "react-icons/fa";
import { Translated } from "../../common/translator/translator";

interface EmptyStateProps {
  title?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
}

const EmptyState = memo(({ title = <Translated text="No events found" />, subtitle = <Translated text="Try adjusting your search or filters" /> }: EmptyStateProps) => {
  const { mode } = useTheme();
  const isDark = mode === "dark";

  return (
    <div
      className={`col-span-full p-8 text-center rounded-xl shadow-sm ${isDark ? "bg-gray-900 text-gray-400" : "bg-white text-gray-500"}`}
    >
      <FaSearch
        className={`text-3xl mx-auto mb-3 ${isDark ? "text-gray-700" : "text-gray-300"}`}
      />
      <p className={`text-base font-medium ${isDark ? "text-white" : ""}`}>
        {title}
      </p>
      <p className={`text-xs ${isDark ? "text-gray-400" : ""}`}>
        {subtitle}
      </p>
    </div>
  );
});

EmptyState.displayName = "EmptyState";

export default EmptyState;
