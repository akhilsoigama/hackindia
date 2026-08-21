import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  FiSearch,
  FiUser,
  FiBook,
  FiCalendar,
  FiClock,
  FiMessageSquare,
  FiTag,
  FiSend,
} from 'react-icons/fi';
import { Question, UnansweredQuestionsProps } from '../../../types/Student-Queries';
import { Translated } from '../../../components/common/translator/translator';
import { useTheme as useAppTheme } from '@/theme/AppThemeProvider';
import { resolveStudentQuery, useStudentQueries } from '../../../action/studentQuery';

const UnansweredQuestions: React.FC<UnansweredQuestionsProps> = ({
  onAnswerSubmit
}) => {
  const location = useLocation();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [answerText, setAnswerText] = useState<string>('');
  const { queries, queriesMutate } = useStudentQueries();
  const selectedQueryId = (location.state as { queryId?: number } | null)?.queryId;

  const courses: string[] = Array.from(new Set(queries.map((q) => q.category).filter(Boolean))) as string[];
  const priorities: string[] = ['all', 'high', 'medium', 'low'];

  useEffect(() => {
    const mapped = queries
      .filter((q) => q.status === 'open' || q.status === 'in_progress')
      .map((q) => ({
        id: q.id,
        studentName: q.student?.studentName || `Student ${q.studentId}`,
        studentId: q.student?.studentId || String(q.studentId),
        category: q.category || 'General',
        subject: q.subject || 'General',
        title: q.title,
        description: q.description,
        createdAt: q.createdAt,
        status: q.status,
        response: q.response,
        resolvedAt: q.resolvedAt,
        priority: q.priority,
        instituteId: q.instituteId,
        assignedFacultyId: q.assignedFacultyId,
        resolvedByUserId: q.resolvedByUserId,
        isActive: q.isActive,
        updatedAt: q.updatedAt,
      }));

    setQuestions(mapped);
  }, [queries]);

  useEffect(() => {
    if (!selectedQueryId || questions.length === 0) {
      return;
    }

    const existsInList = questions.some((q) => q.id === selectedQueryId);
    if (existsInList) {
      setExpandedQuestion(selectedQueryId);
    }
  }, [selectedQueryId, questions]);

  const filteredQuestions: Question[] = questions.filter(question => {
    const matchesSearch: boolean = searchQuery === '' ||
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.studentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourse: boolean = selectedCourse === 'all' || question.category === selectedCourse;
    const matchesPriority: boolean = selectedPriority === 'all' || question.priority === selectedPriority;

    return matchesSearch && matchesCourse && matchesPriority;
  });

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return isDark ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return isDark ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' : 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return isDark ? 'bg-green-500/20 text-green-300 border-green-500/40' : 'bg-green-100 text-green-800 border-green-200';
      default: return isDark ? 'bg-slate-700 text-slate-200 border-slate-600' : 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAnswerSubmit = async (questionId: number): Promise<void> => {
    if (!answerText.trim()) return;

    const updated = await resolveStudentQuery(questionId, answerText.trim());
    if (!updated) return;

    if (onAnswerSubmit) {
      onAnswerSubmit(questionId, answerText.trim());
    }

    await queriesMutate();
    setAnswerText('');
    setExpandedQuestion(null);
  };

  const handleQuestionClick = (questionId: number): void => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 md:p-8 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      <motion.header
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-gray-900'}`}><Translated text="Unanswered Questions" /></h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}><Translated text="Answer pending student queries" /></p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              <Translated text="Pending" />: <span className={`font-semibold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{filteredQuestions.length}</span> <Translated text="questions" />
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search unanswered questions..."
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDark
                ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-400'
                : 'bg-white border-gray-300 text-gray-900'
                }`}
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDark
              ? 'bg-slate-900 border-slate-700 text-slate-100'
              : 'bg-white border-gray-300 text-gray-900'
              }`}
            value={selectedCourse}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCourse(e.target.value)}
          >
            <option value="all"><Translated text="All Courses" /></option>
            {courses.map(course => (
              <option key={course} value={course}><Translated text={course} /></option>
            ))}
          </select>

          <select
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDark
              ? 'bg-slate-900 border-slate-700 text-slate-100'
              : 'bg-white border-gray-300 text-gray-900'
              }`}
            value={selectedPriority}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedPriority(e.target.value)}
          >
            <option value="all"><Translated text="All Priorities" /></option>
            {priorities.filter(p => p !== 'all').map(priority => (
              <option key={priority} value={priority}>
                <Translated text={priority.charAt(0).toUpperCase() + priority.slice(1)} /> Priority
              </option>
            ))}
          </select>
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid gap-6"
      >
        {filteredQuestions.map((question: Question, index: number) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`rounded-xl border shadow-sm overflow-hidden ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-orange-200'
              }`}
          >
            <div
              className={`p-6 cursor-pointer transition-colors ${isDark ? 'hover:bg-slate-800/70' : 'hover:bg-orange-50'}`}
              onClick={() => handleQuestionClick(question.id)}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(question.priority)}`}>
                      {question.priority.toUpperCase()}
                    </span>
                    <div className={`flex items-center px-3 py-1 rounded-full text-sm ${isDark ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-100 text-orange-800'
                      }`}>
                      <FiClock className="mr-2" size={14} />
                      <Translated text="Pending Answer" />
                    </div>
                    <div className={`flex items-center text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                      {question.priority}
                    </div>
                  </div>

                  <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
                    <Translated text={question.title} />
                  </h3>

                  <p className={`mb-4 line-clamp-2 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                    <Translated text={question.description} />
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800'
                      }`}>
                      <FiTag size={10} className="mr-1" />
                      <Translated text={question.priority} />
                    </span>
                  </div>

                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <FiUser className="mr-1" size={14} />
                        <Translated text={question.studentName} /> ({question.studentId})
                      </div>
                      <div className="flex items-center">
                        <FiBook className="mr-1" size={14} />
                        <Translated text={question.category || 'General'} /> • <Translated text={question.subject || 'General'} />
                      </div>
                    </div>
                    <div className="flex items-center mt-2 sm:mt-0">
                      <FiCalendar className="mr-1" size={14} />
                      {new Date(question.createdAt ?? '').toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {expandedQuestion === question.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`border-t p-6 ${isDark ? 'border-slate-700 bg-slate-900/80' : 'border-orange-200 bg-orange-50'}`}
              >
                <div className="mb-4">
                  <h4 className={`font-semibold mb-2 ${isDark ? 'text-slate-100' : 'text-gray-900'}`}><Translated text="Original Question" /></h4>
                  <div className={`rounded-lg p-4 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-orange-200'}`}>
                    <p className={`whitespace-pre-wrap ${isDark ? 'text-slate-300' : 'text-gray-700'}`}><Translated text={question.description} /></p>
                  </div>
                </div>

                <div>
                  <h4 className={`font-semibold mb-2 ${isDark ? 'text-slate-100' : 'text-gray-900'}`}><Translated text="Your Answer" /></h4>
                  <textarea
                    className={`w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${isDark
                      ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-400'
                      : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    placeholder="Type your detailed answer here... You can use Markdown formatting for better readability."
                    value={answerText}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAnswerText(e.target.value)}
                  />
                  <div className="flex justify-end gap-3 mt-3">
                    <button
                      className={`px-4 py-2 border rounded-lg transition-colors ${isDark
                        ? 'border-slate-600 text-slate-200 hover:bg-slate-800'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      onClick={() => {
                        setAnswerText('');
                        setExpandedQuestion(null);
                      }}
                    >
                      <Translated text="Cancel" />
                    </button>
                    <button
                      className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      onClick={() => handleAnswerSubmit(question.id)}
                      disabled={!answerText.trim()}
                    >
                      <FiSend className="mr-2" size={16} />
                      <Translated text="Submit Answer" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}

        {filteredQuestions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-12 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
              }`}
          >
            <FiMessageSquare className={`mx-auto mb-4 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} size={48} />
            <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-slate-100' : 'text-gray-900'}`}><Translated text="No unanswered questions found" /></h3>
            <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>
              {searchQuery || selectedCourse !== 'all' || selectedPriority !== 'all'
                ? <Translated text="Try adjusting your search or filters" />
                : <Translated text="All questions have been answered!" />
              }
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default UnansweredQuestions;