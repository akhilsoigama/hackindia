import { memo, useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Plus, Search } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import DeleteModal from "../../../components/common/deleteModel";
import { useTheme } from '@/theme/AppThemeProvider';
import type { QuizDetails } from "../../../types/quizApi";
import QuizCard, {  type QuizCardActionPermissions } from "./quiz-card";
import { Translated } from "../../../components/common/translator/translator";

type QuizListProps = {
  quizzes: QuizDetails[];
  isLoading?: boolean;
  onCreate?: () => void;
  onEdit?: (quiz: QuizDetails) => void;
  onView?: (quiz: QuizDetails) => void;
  onDelete?: (id: number) => void | Promise<void>;
  onToggleActive?: (quizId: number, isActive: boolean) => void;
  actionPermissions?: QuizCardActionPermissions;
};

type SegmentedProps = {
  label: string;
  options: Array<{ label: string; value: string }>;
  value: string;
  onChange: (value: string) => void;
  isDark: boolean;
};

function SegmentedControl({ label, options, value, onChange, isDark }: SegmentedProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`min-w-16 text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>{label}</span>
      <div
        className={`inline-flex flex-wrap rounded-xl border p-1 ${isDark ? "border-slate-700 " : "border-slate-200 bg-slate-50"
          }`}
      >
        {options.map((option) => {
          const active = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${active
                ? isDark
                  ? "bg-slate-700 text-slate-100 shadow-sm"
                  : "bg-white text-slate-900 shadow-sm"
                : isDark
                  ? "text-slate-300 hover:text-slate-100"
                  : "text-slate-600 hover:text-slate-900"
                }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  isDark,
}: {
  title: string;
  value: string;
  subtitle: string;
  isDark: boolean;
}) {
  return (
    <div
      className={`p-5 shadow-sm ${isDark ? "border-slate-700 " : "border-slate-200 bg-white"
        }`}
    >
      <p className={`text-xs font-medium uppercase tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"}`}><Translated text={title} /></p>
      <p className={`mt-2 text-2xl font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>{value}</p>
      <p className={`mt-1 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}><Translated text={subtitle} /></p>
    </div>
  );
}

function EmptyState({
  searchQuery,
  onCreate,
  isDark,
}: {
  searchQuery: string;
  onCreate?: () => void;
  isDark: boolean;
}) {
  return (
    <div
      className={`px-6 py-16 text-center shadow-sm ${isDark ? "border-slate-700" : "border-slate-200 bg-slate-50/60"
        }`}
    >
      <div
        className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl shadow-sm ${isDark ? "" : "bg-white"
          }`}
      >
        <BookOpen className={`h-10 w-10 ${isDark ? "text-slate-300" : "text-slate-500"}`} />
      </div>
      <h3 className={`text-2xl font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
        {searchQuery.length > 0 ? <Translated text="No quizzes found" /> : <Translated text="No quizzes yet" />}
      </h3>
      <p className={`mx-auto mt-3 max-w-md text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
        {searchQuery.length > 0
          ? <Translated text="Try adjusting your search and filters to find the right quiz." />
          : <Translated text="Create your first quiz and start tracking assessments in one place." />}
      </p>
      {searchQuery.length === 0 && (
        <Button onClick={onCreate}
          className={`mt-6 gap-2 rounded-xl ${isDark
            ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-sm'
            : 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm'
            }`}
        >
          <Plus className="h-4 w-4" />
          <Translated text="Create Quiz" />
        </Button>
      )}
    </div>
  );
}

const QuizList = memo(function QuizList({
  quizzes,
  onCreate,
  onEdit,
  onView,
  onDelete,
  onToggleActive,
  actionPermissions,
}: QuizListProps) {
  const { mode } = useTheme();
  const isDark = mode === "dark";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedStandard, setSelectedStandard] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [activeOverrides, setActiveOverrides] = useState<Record<number, boolean>>({});
  const [deleteTarget, setDeleteTarget] = useState<QuizDetails | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const effectiveActive = useCallback(
    (quiz: QuizDetails): boolean => activeOverrides[quiz.id] ?? Boolean(quiz.isActive),
    [activeOverrides],
  );

  const subjectOptions = useMemo(
    () => [
      { label: "All", value: "all" },
      ...Array.from(new Set(quizzes.map((quiz) => (quiz.subject || "").trim()).filter(Boolean))).map(
        (subject) => ({ label: subject, value: subject }),
      ),
    ],
    [quizzes],
  );

  const standardOptions = useMemo(
    () => [
      { label: "All", value: "all" },
      ...Array.from(new Set(quizzes.map((quiz) => (quiz.std || "").trim()).filter(Boolean))).map((std) => ({
        label: std,
        value: std,
      })),
    ],
    [quizzes],
  );

  const statusOptions = useMemo(
    () => [
      { label: "All", value: "all" },
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
    [],
  );

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      const title = quiz.quizTitle.toLowerCase();
      const search = searchQuery.trim().toLowerCase();

      if (search.length > 0 && !title.includes(search)) {
        return false;
      }

      if (selectedSubject !== "all" && quiz.subject !== selectedSubject) {
        return false;
      }

      if (selectedStandard !== "all" && quiz.std !== selectedStandard) {
        return false;
      }

      if (selectedStatus === "active" && !effectiveActive(quiz)) {
        return false;
      }

      if (selectedStatus === "inactive" && effectiveActive(quiz)) {
        return false;
      }

      return true;
    });
  }, [effectiveActive, quizzes, searchQuery, selectedStatus, selectedStandard, selectedSubject]);

  const stats = useMemo(() => {
    const summary = quizzes.reduce(
      (acc, quiz) => {
        const isActive = effectiveActive(quiz);

        acc.total += 1;
        acc.marks += quiz.marks ?? 0;

        if (isActive) {
          acc.active += 1;
        } else {
          acc.inactive += 1;
        }

        return acc;
      },
      { total: 0, active: 0, inactive: 0, marks: 0 },
    );

    const avgMarks = summary.total > 0 ? Math.round(summary.marks / summary.total) : 0;

    return {
      ...summary,
      avgMarks,
    };
  }, [effectiveActive, quizzes]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedSubject("all");
    setSelectedStandard("all");
    setSelectedStatus("all");
  };

  const handleToggleActive = (quizId: number, isActive: boolean) => {
    setActiveOverrides((prev) => ({ ...prev, [quizId]: isActive }));
    onToggleActive?.(quizId, isActive);
  };

  const handleRequestDelete = (id: number) => {
    const target = quizzes.find((quiz) => quiz.id === id) || null;
    setDeleteTarget(target);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setIsDeleteLoading(true);

    try {
      await onDelete?.(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <div className={`min-h-screen `}>
      <div className="mx-auto max-w-full px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className={`text-3xl sm:text-4xl  font-bold ${isDark ? 'text-gray-100' : 'text-slate-950/70'} flex items-center gap-3`}><Translated text="Quiz Management" /></h1>
            <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              <Translated text="Manage quiz lifecycle, monitor readiness, and keep assessment operations clean." />
            </p>
          </div>

          <Button onClick={onCreate}
            className={`px-4 flex gap-3 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${isDark
              ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-sm'
              : 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm'
              }`}>
            <Plus className="h-4 w-4" />
            <Translated text="Create Quiz" />
          </Button>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Quizzes" value={String(stats.total)} subtitle="All quizzes" isDark={isDark} />
          <StatCard title="Active" value={String(stats.active)} subtitle="Live now" isDark={isDark} />
          <StatCard title="Inactive" value={String(stats.inactive)} subtitle="Currently paused" isDark={isDark} />
          <StatCard title="Avg. Marks" value={String(stats.avgMarks)} subtitle="Across quizzes" isDark={isDark} />


        </div>

        <div className={`mb-8 p-5 shadow-sm ${isDark ? "border-slate-700 " : "border-slate-200 bg-white"}`}>
          <div className="mb-4 flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search quiz title..."
                className={`h-11 rounded-xl pl-10 transition focus:ring-2 focus:ring-primary/30 ${isDark
                  ? "border-slate-700  text-slate-100"
                  : "border-slate-200 bg-white text-slate-900"
                  }`}
              />
            </div>

            <Button
              variant="outline"
              onClick={resetFilters}
              className={`h-11 rounded-xl ${isDark ? "border-slate-700" : "border-slate-200"}`}
            >
              Clear Filters
            </Button>
          </div>

          <div className="space-y-3">
            <SegmentedControl
              label="Subject"
              options={subjectOptions}
              value={selectedSubject}
              onChange={setSelectedSubject}
              isDark={isDark}
            />
            <SegmentedControl
              label="Standard"
              options={standardOptions}
              value={selectedStandard}
              onChange={setSelectedStandard}
              isDark={isDark}
            />
            <SegmentedControl
              label="Status"
              options={statusOptions}
              value={selectedStatus}
              onChange={setSelectedStatus}
              isDark={isDark}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {filteredQuizzes.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EmptyState searchQuery={searchQuery} onCreate={onCreate} isDark={isDark} />
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
            >
              {filteredQuizzes.map((quiz, index) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: index * 0.035 }}
                >
                  <QuizCard
                    quiz={quiz}
                    onEdit={onEdit}
                    onView={onView}
                    onDelete={handleRequestDelete}
                    onToggleActive={handleToggleActive}
                    permissions={actionPermissions}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <DeleteModal
        isOpen={deleteTarget !== null}
        onClose={() => {
          if (!isDeleteLoading) {
            setDeleteTarget(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        title="Delete quiz"
        description="This action cannot be undone. This will permanently remove the quiz and related attempts."
        itemName={deleteTarget?.quizTitle}
        isLoading={isDeleteLoading}
        confirmText="Delete Quiz"
        cancelText="Cancel"
      />
    </div>
  );
});

export default QuizList;
