import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
    FiBook,
    FiCalendar,
    FiCheckCircle,
    FiMessageSquare,
    FiSearch,
    FiTag,
    FiUser,
} from 'react-icons/fi';
import { Question, AnsweredQuestionsProps } from '../../../types/Student-Queries';
import { useTheme as useAppTheme } from '@/theme/AppThemeProvider';
import { Translated } from '../../../components/common/translator/translator';
import { useStudentQueries } from '../../../action/studentQuery';

const AnsweredQuestions: React.FC<AnsweredQuestionsProps> = ({ onQuestionSelect }) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCourse, setSelectedCourse] = useState<string>('all');
    const [questions, setQuestions] = useState<Question[]>([]);
    const { queries } = useStudentQueries();
    const { mode } = useAppTheme();
    const isDark = mode === 'dark';

    const courses: string[] = Array.from(new Set(queries.map((q) => q.category).filter(Boolean))) as string[];

    useEffect(() => {
        const mapped: Question[] = queries
            .filter((q) => q.status === 'resolved' || q.status === 'closed')
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
                response: q.response || null,
                answeredBy: q.assignedFaculty?.facultyName || null,
                resolvedAt: q.resolvedAt || null,
                priority: q.priority,
                instituteId: q.instituteId,
                assignedFacultyId: q.assignedFacultyId,
                resolvedByUserId: q.resolvedByUserId,
                isActive: q.isActive,
                updatedAt: q.updatedAt,
            }));

        setQuestions(mapped);
    }, [queries]);

    const filteredQuestions: Question[] = questions.filter((question) => {
        const matchesSearch: boolean =
            searchQuery === '' ||
            question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            question.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            question.studentName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCourse: boolean = selectedCourse === 'all' || question.category === selectedCourse;

        return matchesSearch && matchesCourse;
    });

    const handleQuestionClick = (question: Question): void => {
        if (onQuestionSelect) {
            onQuestionSelect(question);
        }
    };

    return (
        <div
            className={`min-h-screen p-4 sm:p-6 md:p-8 transition-colors duration-300 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'
                }`}
        >
            <motion.header
                className="mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
                    <div>
                        <h1 className={`text-2xl font-bold sm:text-3xl ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
                            <Translated text="Answered Questions" />
                        </h1>
                        <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            <Translated text="Review previously answered student queries" />
                        </p>
                    </div>
                    <div className="mt-4 flex items-center space-x-4 sm:mt-0">
                        <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                            <Translated text="Total:" /> <span className="font-semibold text-green-600">{filteredQuestions.length}</span>{' '}<Translated text="answered questions" />
                        </span>
                    </div>
                </div>

                <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                        <FiSearch
                            className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-gray-400'}`}
                        />
                        <input
                            type="text"
                            placeholder="Search answered questions..."
                            className={`w-full rounded-lg border py-2 pl-10 pr-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${isDark
                                ? 'border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-400'
                                : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400'
                                }`}
                            value={searchQuery}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <select
                        className={`rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${isDark ? 'border-slate-700 bg-slate-900 text-slate-100' : 'border-gray-300 bg-white text-gray-900'
                            }`}
                        value={selectedCourse}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCourse(e.target.value)}
                    >
                        <option value="all"><Translated text="All Courses" /></option>
                        {courses.map((course) => (
                            <option key={course} value={course}>
                                <Translated text={course} />
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
                {filteredQuestions.map((question: Question, index: number) => {
                    return (
                        <motion.div
                            key={question.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className={`cursor-pointer rounded-xl border p-6 shadow-sm transition-all hover:shadow-md ${isDark ? 'border-slate-800 bg-slate-900 hover:border-slate-700' : 'border-green-200 bg-white'}`}
                            onClick={() => handleQuestionClick(question)}
                        >
                            <div className="mb-4 flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`flex items-center rounded-full px-3 py-1 text-sm ${isDark ? 'bg-green-500/15 text-green-300' : 'bg-green-100 text-green-800'}`}
                                    >
                                        <FiCheckCircle className="mr-2" size={14} />
                                        <Translated text="Answered" />
                                    </div>
                                    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                        <Translated
                                            text={`By ${question.answeredBy || ''} on ${question.resolvedAt ? new Date(question.resolvedAt).toLocaleDateString() : ''}`} />
                                    </span>
                                </div>
                            </div>

                            <h3 className={`mb-3 text-xl font-semibold ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
                                <Translated text={question.title} />
                            </h3>

                            <div className="mb-4">
                                <h4 className={`mb-2 font-medium ${isDark ? 'text-slate-200' : 'text-gray-700'}`}><Translated text="Question:" /></h4>
                                <p className={`rounded-lg p-3 ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-gray-50 text-gray-600'}`}>
                                    <Translated text={question.description} />
                                </p>
                            </div>

                            <div className="mb-4">
                                <h4 className={`mb-2 font-medium ${isDark ? 'text-slate-200' : 'text-gray-700'}`}><Translated text="Answer:" /></h4>
                                <p
                                    className={`rounded-lg border p-3 ${isDark ? 'border-green-500/30 bg-green-500/10 text-slate-200' : 'border-green-200 bg-green-50 text-gray-700'}`}
                                >
                                    <Translated text={question.response ?? null} />
                                </p>
                            </div>

                            <div className="mb-4 flex flex-wrap gap-2">
                                <span
                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${isDark ? 'bg-blue-500/15 text-blue-300' : 'bg-blue-100 text-blue-800'}`}
                                >
                                    <FiTag size={10} className="mr-1" />
                                    <Translated text={question.priority} />
                                </span>
                            </div>

                            <div
                                className={`flex flex-col justify-between text-sm sm:flex-row sm:items-center ${isDark ? 'text-slate-400' : 'text-gray-500'}`}
                            >
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
                                <div className="mt-2 flex items-center sm:mt-0">
                                    <FiCalendar className="mr-1" size={14} />
                                    <Translated text={`Asked on ${new Date(question.createdAt ?? '').toLocaleDateString()}`} />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {filteredQuestions.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`rounded-xl border py-12 text-center ${isDark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'
                            }`}
                    >
                        <FiMessageSquare className={`mx-auto mb-4 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} size={48} />
                        <h3 className={`mb-2 text-lg font-medium ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
                            <Translated text="No answered questions found" />
                        </h3>
                        <p className={`${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            {searchQuery || selectedCourse !== 'all'
                                ? <Translated text="Try adjusting your search or filters" />
                                : <Translated text="No questions have been answered yet" />}
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default AnsweredQuestions;
