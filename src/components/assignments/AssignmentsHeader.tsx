import type { AssignmentsRole } from "./AssignmentsLayout";
import { useTheme } from "@/theme/AppThemeProvider";
import { ParticleButton } from "../ui/particle-button";
import { Translated } from "../common/translator/translator";
import { FaPlus } from "react-icons/fa";

interface AssignmentsHeaderProps {
  role: AssignmentsRole;
  onCreate?: () => void;
}

const AssignmentsHeader = ({ role, onCreate }: AssignmentsHeaderProps) => {
  const { mode } = useTheme();
  const isDark = mode === "dark";

  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1
          className={`text-3xl font-bold ${isDark ? "text-slate-100" : "text-slate-950/70"} flex items-center`}
        >
          <Translated text="Assignments" />
        </h1>
        <p
          className={
            isDark
              ? "mt-1 text-sm text-slate-400"
              : "mt-1 text-sm text-slate-500"
          }
        >
          <Translated text="Track assignment progress, due dates, and submissions across your courses." />
        </p>
      </div>
      {role === "faculty" && onCreate ? (
        <ParticleButton
          onClick={onCreate}
          successDuration={1000}
          variant="default"
          className={`px-4 flex gap-2 items-center justify-center py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
            isDark
              ? "bg-white text-slate-900 hover:bg-slate-100 shadow-sm"
              : "bg-slate-800/80 text-white hover:bg-slate-800 shadow-sm"
          }`}
        >
          <FaPlus /> <Translated text="Create Assignment" />
        </ParticleButton>
      ) : null}
    </div>
  );
};

export default AssignmentsHeader;
