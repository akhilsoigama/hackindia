import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useProgressReport } from "../action/progressReport";
import { useUser } from "../atoms/userAtom";
import {
  TrendingUp,
  EmojiEvents,
  BarChart,
  MenuBook,
  AutoGraph,
  CheckCircle,
  Assignment,
  Quiz,
  AccessTime,
  Star,
  Warning,
  School,
} from "@mui/icons-material";
import { useTheme } from "@/theme/AppThemeProvider";

type Timeframe = "week" | "month" | "all";

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const glassCard = (isDark: boolean) =>
  cn(
    "rounded-2xl border backdrop-blur-sm shadow-sm",
    isDark
      ? "border-white/10 bg-slate-950/70 shadow-black/30"
      : "border-slate-200/80 bg-white/90 shadow-slate-200/70",
  );

const subText = (isDark: boolean) =>
  isDark ? "text-slate-400" : "text-slate-500";
const primaryText = (isDark: boolean) =>
  isDark ? "text-slate-100" : "text-slate-900";

const toneChip = (isDark: boolean, tone: "amber" | "emerald" | "teal" | "sky" | "rose") => {
  const map = {
    amber: isDark
      ? "border-amber-400/20 bg-amber-500/10 text-amber-300"
      : "border-amber-200 bg-amber-50 text-amber-700",
    emerald: isDark
      ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
      : "border-emerald-200 bg-emerald-50 text-emerald-700",
    teal: isDark
      ? "border-teal-400/20 bg-teal-500/10 text-teal-300"
      : "border-teal-200 bg-teal-50 text-teal-700",
    sky: isDark
      ? "border-sky-400/20 bg-sky-500/10 text-sky-300"
      : "border-sky-200 bg-sky-50 text-sky-700",
    rose: isDark
      ? "border-rose-400/20 bg-rose-500/10 text-rose-300"
      : "border-rose-200 bg-rose-50 text-rose-700",
  };

  return cn("rounded-full border px-2.5 py-1 text-xs font-medium", map[tone]);
};

const getStatusColor = (status: string, isDark: boolean) => {
  const statusMap: Record<string, "amber" | "emerald" | "teal" | "sky" | "rose"> = {
    excellent: "emerald",
    good: "teal",
    average: "amber",
    needs_help: "rose",
  };
  return toneChip(isDark, statusMap[status?.toLowerCase()] || "sky");
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 60) return "text-teal-600 dark:text-teal-400";
  if (score >= 40) return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
};

const getProgressBarColor = (score: number) => {
  if (score >= 80) return "bg-gradient-to-r from-emerald-500 to-teal-500";
  if (score >= 60) return "bg-gradient-to-r from-teal-500 to-blue-500";
  if (score >= 40) return "bg-gradient-to-r from-amber-500 to-orange-500";
  return "bg-gradient-to-r from-rose-500 to-red-500";
};

const Progress = () => {
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>("week");
  const { user } = useUser();
  const [status, setStatus] = useState("");
  const [subjectProgress, setSubjectProgress] = useState<any[]>([]);

  const reportFilters = useMemo(() => {
    const rawUser = user?.data as
      | {
          studentId?: number;
          instituteId?: number;
          id?: number;
          student_id?: number;
          institute_id?: number;
        }
      | undefined;
    const studentId = Number(
      rawUser?.studentId ?? rawUser?.student_id ?? user?.id ?? rawUser?.id ?? 0,
    );
    const instituteId = Number(
      rawUser?.instituteId ?? rawUser?.institute_id ?? user?.instituteId ?? 0,
    );

    if (!Number.isFinite(studentId) || studentId <= 0) {
      return null;
    }

    if (!Number.isFinite(instituteId) || instituteId <= 0) {
      return null;
    }

    return { studentId, instituteId };
  }, [user]);

  const { report } = useProgressReport(reportFilters);

  useEffect(() => {
    if (report?.subjectProgress && report.subjectProgress.length > 0) {
      setSubjectProgress(report.subjectProgress);
      const scores = report.subjectProgress.map((s: any) => s.overallScore);
      const avgScore = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
      
      if (avgScore >= 80) setStatus('excellent');
      else if (avgScore >= 60) setStatus('good');
      else if (avgScore >= 40) setStatus('average');
      else setStatus('needs_help');
    }
  }, [report]);

  const overallProgress = useMemo(() => {
    if (!report) {
      return {
        completed: 0,
        inProgress: 0,
        notStarted: 100,
      };
    }
    const score = Math.round(report.totalOverAllScore || 0);
    const stats = report.stats;
    
    const totalTasks = stats?.totalTasks || 1;
    const completedTasks = stats?.completedTasks || 0;
    const taskProgress = (completedTasks / totalTasks) * 100;
    
    const remainingProgress = Math.max(0, 100 - score);
    const inProgressValue = Math.min(remainingProgress, taskProgress);
    
    return {
      completed: score,
      inProgress: Math.round(inProgressValue),
      notStarted: Math.round(Math.max(0, 100 - score - inProgressValue)),
    };
  }, [report]);

  const getStrengthsAndWeaknesses = () => {
    if (!subjectProgress.length) {
      return { strengths: [], weaknesses: [] };
    }
    
    const sorted = [...subjectProgress].sort((a, b) => b.overallScore - a.overallScore);
    const strengths = sorted.filter(s => s.overallScore >= 70);
    const weaknesses = sorted.filter(s => s.overallScore < 60);
    
    return { strengths, weaknesses };
  };

  const { strengths, weaknesses } = getStrengthsAndWeaknesses();

  // Calculate average quiz and assignment scores
  const avgQuizScore = subjectProgress.length > 0
    ? subjectProgress.reduce((sum, subj) => sum + (subj.quizMarksAverage || 0), 0) / subjectProgress.length
    : 0;
  
  const avgAssignmentScore = subjectProgress.length > 0
    ? subjectProgress.reduce((sum, subj) => sum + (subj.assignmentSubmissionMarksAverage || 0), 0) / subjectProgress.length
    : 0;

  // Check if there's any subject needing improvement (score < 60)
  const needsImprovement = subjectProgress.some(subj => subj.overallScore < 60);
  const warningMessage = needsImprovement ? "Some subjects need attention. Focus on improving weaker areas." : null;

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'excellent':
        return <Star className={subText(isDark)} />;
      case 'good':
        return <CheckCircle className={subText(isDark)} />;
      case 'average':
        return <AccessTime className={subText(isDark)} />;
      default:
        return <Warning className={subText(isDark)} />;
    }
  };

  return (
    <div
      className={cn(
        "relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 md:px-8",
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0"
        )}
      />

      <div className="relative mx-auto max-w-7xl space-y-6">
        {/* Warning Banner */}
        {warningMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl p-4 border",
              isDark 
                ? "bg-amber-500/10 border-amber-500/20 text-amber-300" 
                : "bg-amber-50 border-amber-200 text-amber-800"
            )}
          >
            <div className="flex items-center gap-3">
              <Warning className="w-5 h-5" />
              <p className="text-sm font-medium">{warningMessage}</p>
            </div>
          </motion.div>
        )}

        {/* Header Section */}
        <motion.header
          className="mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1
                className={`text-3xl flex gap-2 font-bold ${isDark ? "text-slate-100" : "text-slate-950/70"} flex items-center`}
              >
                <span
                  className={cn(
                    "inline-flex h-11 w-11 items-center justify-center rounded-2xl border",
                    isDark
                      ? "border-teal-400/20 bg-teal-500/10 text-teal-300"
                      : "border-teal-200 bg-teal-50 text-teal-700",
                  )}
                >
                  <TrendingUp />
                </span>
                Progress Tracking
              </h1>
              {report?.student && (
                <div className={cn("mt-2 flex flex-wrap gap-2 text-sm md:text-base", subText(isDark))}>
                  <span className="flex items-center gap-1">
                    <School className="w-4 h-4" />
                    {report.student.studentName}
                  </span>
                  <span>•</span>
                  <span>{report.student.studentStd || 'N/A'}</span>
                  <span>•</span>
                  <span>GR No: {report.student.studentGrNo}</span>
                  {report.student.departmentName && (
                    <>
                      <span>•</span>
                      <span>{report.student.departmentName}</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <div
              className={cn(
                glassCard(isDark),
                "flex w-full gap-2 p-2 sm:w-auto",
              )}
            >
              {(["week", "month", "all"] as Timeframe[]).map((timeframe) => (
                <button
                  key={timeframe}
                  type="button"
                  onClick={() => setActiveTimeframe(timeframe)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
                    activeTimeframe === timeframe
                      ? isDark
                        ? "bg-teal-500/20 text-teal-300 border border-teal-400/30"
                        : "bg-teal-100 text-teal-700 border border-teal-300"
                      : isDark
                        ? "text-slate-300 hover:bg-white/5"
                        : "text-slate-600 hover:bg-slate-100",
                  )}
                >
                  {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.header>

        <motion.section
          className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div
            className={cn(glassCard(isDark), "relative overflow-hidden p-6")}
          >
            <div
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full blur-3xl",
              )}
            />
            <div className="relative">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2
                    className={cn(
                      "flex items-center gap-2 text-lg font-semibold",
                      primaryText(isDark),
                    )}
                  >
                    <AutoGraph
                      className={isDark ? "text-teal-300" : "text-teal-700"}
                      fontSize="small"
                    />
                    Overall Progress
                  </h2>
                  <p className={cn("mt-1 text-sm", subText(isDark))}>
                    Your overall progress across all subjects
                  </p>
                </div>
                {status && (
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status)}
                    <div className={getStatusColor(status, isDark)}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                    </div>
                  </div>
                )}
                
              </div>

              <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center">
                <div className="relative h-32 w-32 shrink-0 mx-auto lg:mx-0">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={isDark ? "#1e293b" : "#e2e8f0"}
                      strokeWidth="3"
                    />
                    <motion.path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={isDark ? "#1ae8b1" : "#1ae8b1"}
                      strokeWidth="3"
                      strokeDasharray={`${overallProgress.completed}, 100`}
                      initial={{ strokeDasharray: "0, 100" }}
                      animate={{
                        strokeDasharray: `${overallProgress.completed}, 100`,
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className={cn(
                        "text-2xl font-bold",
                        primaryText(isDark),
                      )}
                    >
                      {Math.round(overallProgress.completed)}%
                    </span>
                    <span
                      className={cn(
                        "text-[10px] uppercase tracking-wide",
                        subText(isDark),
                      )}
                    >
                      Score
                    </span>
                  </div>
                  <div className="absolute -bottom-5 w-full text-center">
                    <span
                      className={cn(
                        "text-xs font-medium",
                        subText(isDark),
                      )}
                    >
                      {report?.stats?.completedTasks || 0}/{report?.stats?.totalTasks || 0} tasks completed
                    </span>
                  </div>
                </div>

                <div className="grid grow grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className={cn(glassCard(isDark), "p-3 text-center sm:text-left")}>
                    <span className={toneChip(isDark, "teal")}>
                      Completed
                    </span>
                    <p className={cn("mt-2 text-xl font-semibold", primaryText(isDark))}>
                      {report?.stats?.completedTasks || 0}/{report?.stats?.totalTasks || 0}
                    </p>
                    <p className={cn("text-xs", subText(isDark))}>
                      Tasks completed
                    </p>
                  </div>
                  {/* <div className={cn(glassCard(isDark), "p-3 text-center sm:text-left")}>
                    <span className={toneChip(isDark, "amber")}>
                      Attendance
                    </span>
                    <p className={cn("mt-2 text-xl font-semibold", primaryText(isDark))}>
                      {report?.stats?.attendance || 0}%
                    </p>
                    <p className={cn("text-xs", subText(isDark))}>
                      Overall attendance
                    </p>
                  </div> */}
                  <div className={cn(glassCard(isDark), "p-3 text-center sm:text-left")}>
                    <span className={toneChip(isDark, "emerald")}>
                      Modules
                    </span>
                    <p className={cn("mt-2 text-xl font-semibold", primaryText(isDark))}>
                      {report?.stats?.completedModules || 0}/{report?.stats?.totalModules || 0}
                    </p>
                    <p className={cn("text-xs", subText(isDark))}>
                      Modules completed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 ${glassCard(isDark)}`}>
            <h2
              className={cn(
                "flex items-center gap-2 text-lg font-semibold",
                primaryText(isDark),
              )}
            >
              <BarChart
                className={isDark ? "text-teal-300" : "text-teal-700"}
                fontSize="small"
              />
              Performance Summary
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className={subText(isDark)}>Overall Score</span>
                  <span className={cn("text-2xl font-bold", getScoreColor(report?.totalOverAllScore || 0))}>
                    {Math.round(report?.totalOverAllScore || 0)}%
                  </span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className={cn("h-full", getProgressBarColor(report?.totalOverAllScore || 0))}
                    initial={{ width: 0 }}
                    animate={{ width: `${report?.totalOverAllScore || 0}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className={cn("p-3 rounded-xl", isDark ? "bg-slate-900/50" : "bg-slate-100")}>
                  <div className="flex items-center gap-2 mb-2">
                    <Quiz className="w-4 h-4 text-teal-500" />
                    <p className={cn("text-xs font-medium", subText(isDark))}>Quiz Average</p>
                  </div>
                  <p className={cn("text-2xl font-bold", getScoreColor(avgQuizScore))}>
                    {Math.round(avgQuizScore)}%
                  </p>
                  <p className={cn("text-xs mt-1", subText(isDark))}>
                    From {subjectProgress.reduce((sum, subj) => sum + (subj.totalQuizzes || 0), 0)} quizzes
                  </p>
                </div>
                <div className={cn("p-3 rounded-xl", isDark ? "bg-slate-900/50" : "bg-slate-100")}>
                  <div className="flex items-center gap-2 mb-2">
                    <Assignment className="w-4 h-4 text-teal-500" />
                    <p className={cn("text-xs font-medium", subText(isDark))}>Assignment Average</p>
                  </div>
                  <p className={cn("text-2xl font-bold", getScoreColor(avgAssignmentScore))}>
                    {Math.round(avgAssignmentScore)}%
                  </p>
                  <p className={cn("text-xs mt-1", subText(isDark))}>
                    From {subjectProgress.reduce((sum, subj) => sum + (subj.totalAssignments || 0), 0)} assignments
                  </p>
                </div>
              </div>

              {/* Detailed Score Breakdown */}
              <div className={cn("p-3 rounded-xl", isDark ? "bg-slate-900/30" : "bg-slate-50")}>
                <p className={cn("text-xs font-medium mb-2", subText(isDark))}>Score Breakdown</p>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className={subText(isDark)}>Quiz Contributions</span>
                      <span>{Math.round(avgQuizScore)}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500" style={{ width: `${avgQuizScore}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className={subText(isDark)}>Assignment Contributions</span>
                      <span>{Math.round(avgAssignmentScore)}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500" style={{ width: `${avgAssignmentScore}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <div className={cn(glassCard(isDark), "p-5")}>
              <h2
                className={cn(
                  "mb-4 flex items-center gap-2 text-lg font-semibold",
                  primaryText(isDark),
                )}
              >
                <MenuBook
                  className={isDark ? "text-slate-300" : "text-slate-700"}
                  fontSize="small"
                />
                Subject-wise Progress
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {subjectProgress.map((subject, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="border-b last:border-0 pb-4 last:pb-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={cn("font-semibold", primaryText(isDark))}>
                            {subject.subject}
                          </span>
                          {subject.overallScore >= 80 && (
                            <Star className="w-3 h-3 text-amber-500" />
                          )}
                        </div>
                        <div className="flex gap-3 mt-1 text-xs">
                          <span className={cn("flex items-center gap-1", subText(isDark))}>
                            <Quiz fontSize="small" className="w-3 h-3" /> 
                            {subject.totalQuizzes} quizzes
                          </span>
                          <span className={cn("flex items-center gap-1", subText(isDark))}>
                            <Assignment fontSize="small" className="w-3 h-3" /> 
                            {subject.totalAssignments} assignments
                          </span>
                        </div>
                      </div>
                      <div className={getStatusColor(subject.status, isDark)}>
                        {subject.status === 'needs_help' ? 'Needs Help' : subject.status}
                      </div>
                    </div>
                    
                    {/* Quiz and Assignment Score Bars */}
                    <div className="space-y-2 mt-3">
                      {subject.totalQuizzes > 0 && (
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className={subText(isDark)}>Quiz Score</span>
                            <span className={getScoreColor(subject.quizMarksAverage)}>
                              {Math.round(subject.quizMarksAverage)}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-teal-500 rounded-full"
                              style={{ width: `${subject.quizMarksAverage}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {subject.totalAssignments > 0 && (
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className={subText(isDark)}>Assignment Score</span>
                            <span className={getScoreColor(subject.assignmentSubmissionMarksAverage)}>
                              {Math.round(subject.assignmentSubmissionMarksAverage)}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-teal-500 rounded-full"
                              style={{ width: `${subject.assignmentSubmissionMarksAverage}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {subject.overallScore < 60 && (
                      <p className="text-xs text-amber-500 mt-2 flex items-center gap-1">
                        <Warning className="w-3 h-3" /> 
                        Needs improvement - Consider additional practice
                      </p>
                    )}
                  </motion.div>
                ))}
                {subjectProgress.length === 0 && (
                  <div className="text-center py-8">
                    <MenuBook className={cn("w-12 h-12 mx-auto mb-3 opacity-50", subText(isDark))} />
                    <p className={subText(isDark)}>No subject data available yet.</p>
                    <p className={cn("text-xs mt-2", subText(isDark))}>
                      Start taking quizzes and submitting assignments to see your progress!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className={`p-5 ${glassCard(isDark)}`}>
              <h2
                className={cn(
                  "mb-4 flex items-center gap-2 text-lg font-semibold",
                  primaryText(isDark),
                )}
              >
                <EmojiEvents
                  className={isDark ? "text-slate-300" : "text-slate-700"}
                  fontSize="small"
                />
                Insights & Achievements
              </h2>
              
              {/* Strengths */}
              {strengths.length > 0 && (
                <div className="mb-6">
                  <h3 className={cn("text-sm font-semibold mb-3 flex items-center gap-2", primaryText(isDark))}>
                    <CheckCircle fontSize="small" className="text-teal-500" />
                    Top Performing Subjects
                  </h3>
                  <div className="space-y-2">
                    {strengths.map((subject, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={cn("p-3 rounded-xl")}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className={cn("font-medium", primaryText(isDark))}>{subject.subject}</p>
                              <Star className="w-3 h-3 text-amber-500" />
                            </div>
                            <p className="text-xs text-teal-600 dark:text-teal-400 mt-0.5">
                              {subject.totalQuizzes + subject.totalAssignments} total tasks
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-teal-600 dark:text-teal-400">
                              {Math.round(subject.overallScore)}%
                            </p>
                            <p className="text-xs text-teal-600/70 dark:text-teal-400/70">
                              Excellent performance
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Areas for Improvement */}
              {weaknesses.length > 0 && (
                <div className="mb-6">
                  <h3 className={cn("text-sm font-semibold mb-3 flex items-center gap-2", primaryText(isDark))}>
                    <Warning fontSize="small" className="text-amber-500" />
                    Areas for Improvement
                  </h3>
                  <div className="space-y-2">
                    {weaknesses.map((subject, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={cn("p-3 rounded-xl", isDark ? "bg-amber-500/10" : "bg-amber-50")}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className={cn("font-medium", primaryText(isDark))}>{subject.subject}</p>
                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                              Needs more practice
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                              {Math.round(subject.overallScore)}%
                            </p>
                            <p className="text-xs text-amber-600/70 dark:text-amber-400/70">
                              Below average
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Recent Activity */}
              {report?.activities && report.activities.length > 0 && (
                <div>
                  <h3 className={cn("text-sm font-semibold mb-3", primaryText(isDark))}>
                    Recent Activity
                  </h3>
                  <div className="space-y-2">
                    {report.activities.slice(0, 4).map((activity: any, idx: number) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={cn("flex justify-between flex-wrap items-center p-2 rounded-lg", isDark ? "hover:bg-slate-800" : "hover:bg-slate-50")}
                      >
                        <div className="flex-1">
                          <div className="flex items-center flex-wrap gap-2">
                            {activity.type === 'quiz' ? (
                              <Quiz className="w-3 h-3 text-teal-500" />
                            ) : (
                              <Assignment className="w-3 h-3 text-teal-500" />
                            )}
                            <p className={cn("text-sm font-medium", primaryText(isDark))}>{activity.title}</p>
                          </div>
                          <p className={cn("text-xs mt-0.5", subText(isDark))}>{activity.subject}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {(activity.marks !== undefined && activity.marks !== null) && (
                            <span className={cn("text-xs font-semibold", getScoreColor(activity.marks))}>
                              {Math.round(activity.marks)}%
                            </span>
                          )}
                          {activity.score !== undefined && activity.score !== null && (
                            <span className={cn("text-xs font-semibold", getScoreColor(activity.score))}>
                              {Math.round(activity.score)}%
                            </span>
                          )}
                          <span className={cn("text-xs px-2 py-1 rounded-full", 
                            activity.status === "completed" 
                              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                              : activity.status === "submitted"
                              ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                              : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                          )}>
                            {activity.status}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              
              {strengths.length === 0 && weaknesses.length === 0 && !report?.activities?.length && (
                <div className="text-center py-8">
                  <EmojiEvents className={cn("w-12 h-12 mx-auto mb-3 opacity-50", subText(isDark))} />
                  <p className={subText(isDark)}>No data available yet.</p>
                  <p className={cn("text-xs mt-2", subText(isDark))}>
                    Complete some activities to see your insights!
                  </p>
                </div>
              )}
            </div>
          </motion.section>
        </div>

        {/* Footer with timestamp */}
        {report?.generatedAt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs opacity-60 pt-4"
          >
            Report generated on: {new Date(report.generatedAt).toLocaleString()}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Progress;