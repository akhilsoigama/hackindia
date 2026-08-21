import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiUser,
  FiBook,
  FiCalendar,
  FiMessageSquare,
  FiTag
} from 'react-icons/fi';
import { AllQuestionsProps, Question } from '../../../types/Student-Queries';
import { useTheme as useAppTheme } from '@/theme/AppThemeProvider';
import { Translated } from '../../../components/common/translator/translator';
import { useStudentQueries } from '../../../action/studentQuery';

const AllQuestions: React.FC<AllQuestionsProps> = ({ onTabChange, onQuestionSelect }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [questions, setQuestions] = useState<Question[]>([]);
  const { queries } = useStudentQueries();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';

  const courses: string[] = Array.from(new Set(queries.map((q) => q.category).filter(Boolean))) as string[];
  const priorities: string[] = ['all', 'high', 'medium', 'low'];

  useEffect(() => {
    const mapped: Question[] = queries.map((q) => ({
      id: q.id,
      studentName: q.student?.studentName || `Student ${q.studentId}`,
      studentId: q.student?.studentId || String(q.studentId),
      category: q.category || 'General',
      subject: q.subject || 'General',
      title: q.title,
      description: q.description,
      status: q.status,
      response: q.response || undefined,
      answeredBy: q.assignedFaculty?.facultyName || undefined,
      resolvedAt: q.resolvedAt || undefined,
      priority: q.priority,
      instituteId: q.instituteId,
      assignedFacultyId: q.assignedFacultyId,
      resolvedByUserId: q.resolvedByUserId,
      isActive: q.isActive,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
    }));

    setQuestions(mapped);
  }, [queries]);

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
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string): string => {
    return status === 'resolved' || status === 'closed'
      ? 'bg-green-100 text-green-800 border border-green-200'
      : 'bg-orange-100 text-orange-800 border border-orange-200';
  };

  const handleQuestionClick = (question: Question): void => {
    if (onQuestionSelect) {
      onQuestionSelect(question);
    }
  };

  const handleAnswerClick = (e: React.MouseEvent, question: Question): void => {
    e.stopPropagation();
    const isAnswered = question.status === 'resolved' || question.status === 'closed';

    if (onTabChange) {
      onTabChange(isAnswered ? 'answered' : 'unanswered');
      return;
    }

    if (isAnswered) {
      navigate('/dashboard/qna/teacher/answered', { state: { queryId: question.id } });
      return;
    }

    navigate('/dashboard/qna/teacher/unanswered', { state: { queryId: question.id } });
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 md:p-8 transition-colors duration-300 ${isDark ? 'bg-gray-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      <motion.header
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-gray-900'}`}><Translated text="All Student Questions"/></h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}><Translated text="Manage all student queries in one place"/></p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              <Translated text="Total" />: <span className="font-semibold">{filteredQuestions.length}</span> <Translated text="questions" />
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search questions, students, or topics..."
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${isDark ? 'border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-400' : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400'}`}
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${isDark ? 'border-slate-700 bg-slate-900 text-slate-100' : 'border-gray-300 bg-white text-gray-900'}`}
            value={selectedCourse}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCourse(e.target.value)}
          >
            <option value="all"><Translated text="All Courses"/></option>
            {courses.map(course => (
              <option key={course} value={course}><Translated text={course} /></option>
            ))}
          </select>

          <select
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${isDark ? 'border-slate-700 bg-slate-900 text-slate-100' : 'border-gray-300 bg-white text-gray-900'}`}
            value={selectedPriority}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedPriority(e.target.value)}
          >
            <option value="all"><Translated text="All Priorities"/></option>
            {priorities.filter(p => p !== 'all').map(priority => (
              <option key={priority} value={priority}>
                <Translated text={priority} />
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
            className={`rounded-xl border shadow-sm p-6 hover:shadow-md transition-all cursor-pointer ${isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-gray-200'}`}
            onClick={() => handleQuestionClick(question)}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(question.priority)}`}>
                    <Translated text={question.priority} />
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(question.status)}`}>
                    {question.status === 'resolved' || question.status === 'closed' ? <Translated text="Answered" /> : <Translated text="Pending" />}
                  </span>
                </div>

                <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
                  <Translated text={question.title} />
                </h3>

                <p className={`mb-4 line-clamp-2 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                  <Translated text={question.description} />
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${isDark ? 'bg-blue-500/15 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
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
                    <Translated text={new Date(question.createdAt || '').toLocaleDateString()} />
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col gap-2 justify-end">
                <button
                  className={`px-4 py-2 rounded-lg transition-colors text-sm ${isDark ? 'bg-blue-500 text-white hover:bg-blue-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  onClick={(e: React.MouseEvent) => handleAnswerClick(e, question)}
                >
                  {question.status === 'resolved' || question.status === 'closed' ? <Translated text="View Answer" /> : <Translated text="Answer Now" />}
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredQuestions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-12 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}
          >
            <FiMessageSquare className={`mx-auto mb-4 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} size={48} />
            <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>No questions found</h3>
            <p className={`mb-4 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              {searchQuery || selectedCourse !== 'all' || selectedPriority !== 'all'
                ? <Translated text="Try adjusting your search or filters" />
                : <Translated text="No questions have been asked yet" />
              }
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AllQuestions;