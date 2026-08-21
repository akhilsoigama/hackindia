import {
  memo,
  useEffect,
  useMemo,
  useState,
  useTransition,
  Suspense,
  useCallback,
} from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { useTheme } from "../theme/AppThemeProvider";
import { Translated } from "../components/common/translator/translator";
import {
  dashboardThemeAtom,
  userDisplayNameAtom,
} from "../atoms/dashboard.atoms";
import { DashboardIcon } from "../components/dashboard/DashboardIcon";
import { ParticleButton } from "@/components/ui/particle-button";
import {
  BookOpen,
  ClipboardList,
  Brain,
  GraduationCap,
  Calendar,
} from "lucide-react";
import { FaChalkboardTeacher } from "react-icons/fa";
import { useOverview } from "@/action/overview";
import { useUser } from "@/atoms/userAtom";
import KPICard from "@/components/dashboard/charts/KPIchart";
import BarChartComponent from "@/components/dashboard/charts/piechart";
import type { IPeriodData, IGrowthData } from "@/types/overview";

interface KpiCardData {
  title: string;
  value: number;
  icon: React.ElementType;
  growth: number;
  color: string;
  sparklineData: { value: number }[];
}

const formatDate = (date: Date) =>
  date.toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const generateSparklineData = (current: number) => {
  const base = Math.max(0, current * 0.7);
  return [0.6, 0.8, 0.75, 0.9, 0.85, 0.95, 1].map((m) => ({
    value: Math.max(0, base * m),
  }));
};

const buildKpiCards = (
  role: string,
  current: IPeriodData | null,
  growth: IGrowthData,
): KpiCardData[] => {
  if (!current) return [];

  switch (role) {
    case "institute":
      return [
        {
          title: "Total Students",
          value: current.totalStudents || 0,
          icon: GraduationCap,
          growth: growth.students || 0,
          color: "from-blue-500/20 to-blue-600/20",
          sparklineData: generateSparklineData(current.totalStudents || 0),
        },
        {
          title: "Total Faculties",
          value: current.totalFaculties || 0,
          icon: FaChalkboardTeacher,
          growth: growth.faculties || 0,
          color: "from-purple-500/20 to-purple-600/20",
          sparklineData: generateSparklineData(current.totalFaculties || 0),
        },
        {
          title: "Departments",
          value: current.totalDepartments || 0,
          icon: BookOpen,
          growth: growth.departments || 0,
          color: "from-green-500/20 to-green-600/20",
          sparklineData: generateSparklineData(current.totalDepartments || 0),
        },
        {
          title: "Events",
          value: current.totalEvents || 0,
          icon: Calendar,
          growth: growth.events || 0,
          color: "from-amber-500/20 to-amber-600/20",
          sparklineData: generateSparklineData(current.totalEvents || 0),
        },
      ];

    case "faculty":
      return [
        {
          title: "Assignments",
          value: current.totalAssignments || 0,
          icon: ClipboardList,
          growth: growth.assignments || 0,
          color: "from-rose-500/20 to-rose-600/20",
          sparklineData: generateSparklineData(current.totalAssignments || 0),
        },
        {
          title: "Quizzes",
          value: current.totalQuizzes || 0,
          icon: Brain,
          growth: growth.quizzes || 0,
          color: "from-violet-500/20 to-violet-600/20",
          sparklineData: generateSparklineData(current.totalQuizzes || 0),
        },
        {
          title: "Leaves",
          value: current.totalLeaves || 0,
          icon: Calendar,
          growth: growth.leaves || 0,
          color: "from-sky-500/20 to-sky-600/20",
          sparklineData: generateSparklineData(current.totalLeaves || 0),
        },
        {
          title: "Lectures",
          value: current.totalLectures || 0,
          icon: FaChalkboardTeacher,
          growth: growth.lectures || 0,
          color: "from-emerald-500/20 to-emerald-600/20",
          sparklineData: generateSparklineData(current.totalLectures || 0),
        },
      ];

    case "student":
      return [
        {
          title: "Assignments Submitted",
          value: current.totalAssignmentsSubmitted || 0,
          icon: ClipboardList,
          growth: growth.assignmentsSubmitted || 0,
          color: "from-rose-500/20 to-rose-600/20",
          sparklineData: generateSparklineData(
            current.totalAssignmentsSubmitted || 0,
          ),
        },
        {
          title: "Quiz Attempts",
          value: current.totalQuizAttempts || 0,
          icon: Brain,
          growth: growth.quizAttempts || 0,
          color: "from-violet-500/20 to-violet-600/20",
          sparklineData: generateSparklineData(current.totalQuizAttempts || 0),
        },
      ];

    default:
      return [];
  }
};

const buildChartData = (role: string, current: IPeriodData | null) => {
  if (!current) return [];

  switch (role) {
    case "institute":
      return [
        { name: "Students", value: current.totalStudents || 0 },
        { name: "Faculties", value: current.totalFaculties || 0 },
        { name: "Departments", value: current.totalDepartments || 0 },
        { name: "Events", value: current.totalEvents || 0 },
      ];
    case "faculty":
      return [
        { name: "Assignments", value: current.totalAssignments || 0 },
        { name: "Quizzes", value: current.totalQuizzes || 0 },
        { name: "Leaves", value: current.totalLeaves || 0 },
        { name: "Lectures", value: current.totalLectures || 0 },
      ];
    case "student":
      return [
        {
          name: "Assignments Submitted",
          value: current.totalAssignmentsSubmitted || 0,
        },
        { name: "Quiz Attempts", value: current.totalQuizAttempts || 0 },
      ];
    default:
      return [];
  }
};

const getGridClasses = (count: number) => {
  const base = "grid gap-6 w-full";
  if (count === 1) return `${base} grid-cols-1`;
  if (count === 2) return `${base} grid-cols-1 sm:grid-cols-2`;
  if (count === 3) return `${base} grid-cols-1 md:grid-cols-2 lg:grid-cols-3`;
  return `${base} grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`;
};

const LoadingSkeleton = ({ isDark }: { isDark: boolean }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="animate-pulse">
        <div
          className={`${isDark ? "bg-slate-950/70" : "bg-slate-200"} rounded-lg p-4 h-32`}
        />
      </div>
    ))}
  </div>
);

const Overview = () => {
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const setDashboardTheme = useSetAtom(dashboardThemeAtom);
  const displayName = useAtomValue(userDisplayNameAtom);
  const [now, setNow] = useState(() => new Date());
  const [, startTransition] = useTransition();
  const { user } = useUser();

  const role = (user?.authType || user?.userType || "").toLowerCase();
  const { current, growth, periods, isLoading, isValidating, refetch } =
    useOverview({
      userType: role,
      id: user?.id,
    });
  useEffect(() => {
    setDashboardTheme(isDark ? "dark" : "light");
  }, [isDark, setDashboardTheme]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      startTransition(() => setNow(new Date()));
    }, 60000);
    return () => window.clearInterval(timer);
  }, [startTransition]);

  const currentDate = useMemo(() => formatDate(now), [now]);
  const currentTime = useMemo(() => formatTime(now), [now]);

  const kpiCardsData = useMemo(
    () => buildKpiCards(role, current, growth),
    [role, current, growth],
  );

  const chartData = useMemo(
    () => buildChartData(role, current),
    [role, current],
  );

  const handleRefresh = useCallback(() => refetch(), [refetch]);

  const summaryRows = useMemo(() => {
    if (!current) return [];
    switch (role) {
      case "institute":
        return [
          { label: "Total Students", value: current.totalStudents },
          { label: "Total Faculties", value: current.totalFaculties },
          { label: "Total Departments", value: current.totalDepartments },
          { label: "Total Events", value: current.totalEvents },
        ];
      case "faculty":
        return [
          { label: "Assignments", value: current.totalAssignments },
          { label: "Quizzes", value: current.totalQuizzes },
          { label: "Leaves", value: current.totalLeaves },
          { label: "Lectures", value: current.totalLectures },
        ];
      case "student":
        return [
          {
            label: "Assignments Submitted",
            value: current.totalAssignmentsSubmitted,
          },
          { label: "Quiz Attempts", value: current.totalQuizAttempts },
        ];
      default:
        return [];
    }
  }, [current, role]);

  const summaryTitle =
    role === "institute"
      ? "Institute Summary"
      : role === "faculty"
        ? "Faculty Summary"
        : "Student Summary";

  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="mx-auto max-w-full px-4 pb-10 pt-2 sm:px-2 lg:px-2">
        {/* Header */}
        <header className="dashboard-fade-in mb-8 min-h-24">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-h-18">
              <div className="mb-2 flex items-center gap-2">
                <h1
                  className={`text-2xl font-bold sm:text-3xl ${isDark ? "text-slate-100" : "text-slate-950/70"}`}
                >
                  <Translated text={`Welcome ${displayName}`} />
                </h1>
              </div>
              <p
                className={`mt-2 flex font-bold items-center gap-2 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                <DashboardIcon name="clock" className="h-4 w-4" />
                <time dateTime={now.toISOString()}>
                  <Translated text={`${currentDate} • ${currentTime}`} />
                </time>
              </p>
              {periods.current && periods.previous && (
                <p
                  className={`mt-1 text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}
                >
                  Growth: {periods.previous} → {periods.current}
                </p>
              )}
            </div>

            <ParticleButton
              type="button"
              className={`px-4 flex gap-3 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                isDark
                  ? "bg-white text-slate-900 hover:bg-slate-100 shadow-sm"
                  : "bg-slate-800/80 text-white hover:bg-slate-800 shadow-sm"
              }`}
              successDuration={800}
              onClick={handleRefresh}
              disabled={isLoading || isValidating}
            >
              <DashboardIcon name="trendingUp" className="h-4 w-4" />
              <Translated text={isLoading ? "Loading..." : "Refresh Data"} />
            </ParticleButton>
          </div>
        </header>

        {/* KPI Cards */}
        <Suspense fallback={<LoadingSkeleton isDark={isDark} />}>
          {isLoading && !current ? (
            <LoadingSkeleton isDark={isDark} />
          ) : kpiCardsData.length > 0 ? (
            <div className={getGridClasses(kpiCardsData.length)}>
              {kpiCardsData.map((card, index) => (
                <KPICard
                  key={card.title}
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                  growth={card.growth}
                  color={card.color}
                  sparklineData={card.sparklineData}
                  delay={index * 0.1}
                />
              ))}
            </div>
          ) : (
            !isLoading && (
              <p
                className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                No overview data available.
              </p>
            )
          )}
        </Suspense>

        {/* Chart + Summary */}
        <Suspense
          fallback={
            <div className="w-full h-96 animate-pulse bg-slate-200 dark:bg-slate-950/70 rounded-xl mt-6" />
          }
        >
          {!isLoading && current && chartData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <BarChartComponent
                title={`${role.charAt(0).toUpperCase() + role.slice(1)} Overview`}
                data={chartData}
              />

              <div
                className={`p-6 rounded-xl ${isDark ? "bg-slate-900/50" : "bg-white"} shadow-sm`}
              >
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>{summaryTitle}</h3>
                <div className="space-y-3">
                  {summaryRows.map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800 last:border-0"
                    >
                      <span
                        className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}
                        
                      >
                        {label}
                      </span>
                      <span className="font-bold">{value || 0}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default memo(Overview);
