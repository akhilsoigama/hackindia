import { motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FiMessageSquare } from 'react-icons/fi';
import SearchAndFilter from '../../../components/common/SearchAndFilter';
import RHFDropDown from '../../../components/hook-form/RHFDropDown';
import RHFFormField from '../../../components/hook-form/RHFFormFiled';
import { useTheme as useAppTheme } from '@/theme/AppThemeProvider';
import {
  deleteStudentQuery,
  updateStudentQuery,
  useStudentQueries,
} from '../../../action/studentQuery';
import { NewQuestion, Question } from '../../../types/Student-Queries';
import StudentQueryQuestionCard from './components/StudentQueryQuestionCard';
import StudentQueryStats from './components/StudentQueryStats';

const statusFilterOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'resolved', label: 'Answered' },
  { value: 'open', label: 'Pending' },
];

const isAnsweredStatus = (status: Question['status']) => status === 'resolved' || status === 'closed';

const StudentQuestions: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);

  const { queries, queriesLoading, queriesMutate } = useStudentQueries();

  const editMethods = useForm<NewQuestion>({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      subject: '',
      priority: 'medium',
    },
    mode: 'onChange',
  });

  const questions = useMemo<Question[]>(() => {
    return queries.map((q) => ({
      id: q.id,
      title: q.title,
      description: q.description,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
      studentId: q.studentId,
      instituteId: q.instituteId,
      assignedFacultyId: q.assignedFacultyId,
      resolvedByUserId: q.resolvedByUserId,
      resolvedAt: q.resolvedAt ?? undefined,
      subject: q.subject ?? 'General',
      response: q.response ?? undefined,
      status: q.status,
      category: q.category ?? undefined,
      priority: q.priority,
      isActive: q.isActive,
      studentName: q.student?.studentName || 'You',
      answeredBy: q.assignedFaculty?.facultyName || undefined,
    }));
  }, [queries]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const normalizedSearch = searchQuery.trim().toLowerCase();
      const matchesSearch =
        normalizedSearch.length === 0 ||
        question.title.toLowerCase().includes(normalizedSearch) ||
        question.description.toLowerCase().includes(normalizedSearch) ||
        (question.subject || '').toLowerCase().includes(normalizedSearch) ||
        (question.category || '').toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'resolved'
          ? isAnsweredStatus(question.status)
          : question.status === 'open' || question.status === 'in_progress');

      return matchesSearch && matchesStatus;
    });
  }, [questions, searchQuery, selectedStatus]);

  const stats = useMemo(
    () => ({
      total: questions.length,
      answered: questions.filter((q) => isAnsweredStatus(q.status)).length,
      pending: questions.filter((q) => q.status === 'open' || q.status === 'in_progress').length,
    }),
    [questions]
  );

  const canEditOrDelete = (question: Question) => !isAnsweredStatus(question.status);

  const handleStartEdit = (question: Question) => {
    if (!canEditOrDelete(question)) {
      return;
    }

    setEditingQuestion(question);
    editMethods.reset({
      title: question.title,
      description: question.description,
      category: question.category || '',
      subject: question.subject || '',
      priority: question.priority,
    });
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
    editMethods.reset({
      title: '',
      description: '',
      category: '',
      subject: '',
      priority: 'medium',
    });
  };

  const onSubmitEdit = editMethods.handleSubmit(async (formData) => {
    if (!editingQuestion) {
      return;
    }

    setIsSaving(true);
    const updated = await updateStudentQuery(editingQuestion.id, {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      subject: formData.subject,
      priority: formData.priority,
    });

    setIsSaving(false);

    if (!updated) {
      return;
    }

    await queriesMutate();
    handleCancelEdit();
  });

  const handleDelete = async (question: Question) => {
    if (!canEditOrDelete(question)) {
      return;
    }

    const shouldDelete = window.confirm('Delete this question? This action cannot be undone.');
    if (!shouldDelete) {
      return;
    }

    setIsDeletingId(question.id);
    const deleted = await deleteStudentQuery(question.id);
    setIsDeletingId(null);

    if (!deleted) {
      return;
    }

    await queriesMutate();
    if (editingQuestion?.id === question.id) {
      handleCancelEdit();
    }
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 md:p-8 `}>
      <motion.header
        className="mx-auto mb-8 max-w-6xl"
        initial={reduceMotion ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0.15 : 0.28 }}
      >
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              My Queries
            </div>
            <h1 className={`text-3xl font-semibold tracking-tight sm:text-4xl ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Track submitted questions</h1>
            <p className={`mt-2 max-w-2xl text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Search quickly, filter by dynamic subjects, and manage your pending queries in one place.
            </p>
          </div>
          <StudentQueryStats total={stats.total} answered={stats.answered} pending={stats.pending} />
        </div>

        <SearchAndFilter
          searchTerm={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={selectedStatus}
          onStatusFilterChange={setSelectedStatus}
          onReset={() => {
            setSearchQuery('');
            setSelectedStatus('all');
          }}
          filterOptions={{ status: statusFilterOptions }}
          placeholder="Search title, description, category, or subject"
        />

      </motion.header>

      {editingQuestion && (
        <div className={`mx-auto mb-6 max-w-6xl rounded-2xl border p-6 ${isDark ? 'border-slate-700 bg-slate-900/70' : 'border-slate-200 bg-white'}`}>
          <div className="mb-4 flex items-center justify-between">
            <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>You can update pending queries only.</span>
          </div>

          <FormProvider {...editMethods}>
            <form onSubmit={onSubmitEdit} className="grid gap-4 md:grid-cols-2">
              <RHFFormField name="category" label="Department / Class" placeholder="Example: BCA 3rd Sem" required />
              <RHFFormField name="subject" label="Subject / Unit" placeholder="Example: Unit 2 DBMS" required />
              <div className="md:col-span-2">
                <RHFFormField name="title" label="Question Title" placeholder="Update your title" required />
              </div>
              <div className="md:col-span-2">
                <RHFFormField
                  name="description"
                  label="Question Details"
                  type="textarea"
                  placeholder="Update your question details"
                  required
                />
              </div>
              <RHFDropDown
                name="priority"
                label="Priority"
                options={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                ]}
              />

              <div className="md:col-span-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold ${isDark ? 'border-slate-600 bg-slate-800 text-slate-100 hover:bg-slate-700' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !editMethods.formState.isValid}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? 'Updating...' : 'Update Question'}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      )}

      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0.12 : 0.22 }}
        className="mx-auto max-w-6xl space-y-4"
      >
        {filteredQuestions.map((question) => {
          const disabled = !canEditOrDelete(question) || isDeletingId === question.id;

          return (
            <StudentQueryQuestionCard
              key={question.id}
              question={question}
              expanded={expandedQuestion === question.id}
              onToggle={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
              showActions
              actionDisabled={disabled}
              onEdit={handleStartEdit}
              onDelete={handleDelete}
            />
          );
        })}

        {!queriesLoading && filteredQuestions.length === 0 && (
          <div className={`rounded-4xl border p-12 text-center shadow-[0_16px_40px_rgba(15,23,42,0.08)] ${isDark ? 'border-slate-700 bg-slate-900/70' : 'border-slate-200 bg-white'}`}>
            <FiMessageSquare className={`mx-auto mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} size={48} />
            <h3 className={`mb-2 text-lg font-medium ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>No questions found</h3>
            <p className={isDark ? 'text-slate-300' : 'text-slate-500'}>
              {searchQuery || selectedStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'You have not asked any questions yet'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StudentQuestions;
