import { memo } from "react";
import { FaPlus } from "react-icons/fa";
import { useTheme } from '@/theme/AppThemeProvider';
import { Translated } from "../translator/translator";

interface EventListHeaderProps {
  title: string | React.ReactNode;
  count: number;
  onCreate?: () => void;
}

const EventListHeader = memo(({ title, count, onCreate }: EventListHeaderProps) => {
  const { mode } = useTheme();
  const isDark = mode === "dark";

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1
            className={`text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-950/70'} flex items-center`}
          >
            {title}
          </h1>
          <p
            className={`mt-1 md:mt-2 text-sm md:text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            <Translated text={`${count} events found`} />
          </p>
        </div>
        <button
          onClick={onCreate}
           className={`px-4 flex justify-center items-center gap-3 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                    isDark
                      ? "bg-white text-slate-900 hover:bg-gray-100 shadow-sm"
                      : "bg-slate-800/80 text-white hover:bg-gray-800 shadow-sm"
                  }`}
        >
          <FaPlus className="mr-2" />
          <Translated text="Create New Event" />
        </button>
      </div>
    </div>
  );
});

EventListHeader.displayName = "EventListHeader";

export default EventListHeader;
