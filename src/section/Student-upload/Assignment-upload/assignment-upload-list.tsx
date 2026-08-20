import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaFilter,
    FaSort,
    FaSearch,
    FaFilePdf,
    FaFileWord,
    FaFileImage,
    FaFileArchive,
    FaCheckCircle,
    FaClock,
    FaExclamationTriangle,
    FaEllipsisV,
    FaDownload,
    FaEye,
    FaTrash
} from 'react-icons/fa';

// Types
interface Assignment {
    id: string;
    title: string;
    course: string;
    dueDate: string;
    submittedDate?: string;
    status: 'submitted' | 'pending' | 'late' | 'graded';
    fileType: 'pdf' | 'doc' | 'image' | 'zip';
    fileSize: string;
    grade?: string;
    maxPoints: number;
    instructor: string;
}

const AssignmentUploadList = () => {
    const [filter, setFilter] = useState<'all' | 'submitted' | 'pending' | 'late' | 'graded'>('all');
    const [sortBy, setSortBy] = useState<'date' | 'course' | 'status'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

    // Sample assignment data
    const assignments: Assignment[] = [
        {
            id: 'assign-001',
            title: 'Algebra Homework #5',
            course: 'Mathematics 101',
            dueDate: '2023-12-15',
            submittedDate: '2023-12-14',
            status: 'submitted',
            fileType: 'pdf',
            fileSize: '2.4 MB',
            maxPoints: 100,
            instructor: 'Dr. Smith'
        },
        {
            id: 'assign-002',
            title: 'Science Project Report',
            course: 'Science 201',
            dueDate: '2023-12-10',
            submittedDate: '2023-12-11',
            status: 'late',
            fileType: 'doc',
            fileSize: '5.1 MB',
            maxPoints: 100,
            instructor: 'Prof. Johnson'
        },
        {
            id: 'assign-003',
            title: 'Essay: Modern Literature',
            course: 'English 102',
            dueDate: '2023-12-20',
            status: 'pending',
            fileType: 'doc',
            fileSize: '0 MB',
            maxPoints: 100,
            instructor: 'Dr. Williams'
        },
        {
            id: 'assign-004',
            title: 'World History Research Paper',
            course: 'History 151',
            dueDate: '2023-11-30',
            submittedDate: '2023-11-28',
            status: 'graded',
            fileType: 'pdf',
            fileSize: '3.2 MB',
            grade: '92',
            maxPoints: 100,
            instructor: 'Prof. Brown'
        },
        {
            id: 'assign-005',
            title: 'Programming Assignment #3',
            course: 'Computer Science 301',
            dueDate: '2023-12-18',
            status: 'pending',
            fileType: 'zip',
            fileSize: '0 MB',
            maxPoints: 100,
            instructor: 'Dr. Davis'
        },
        {
            id: 'assign-006',
            title: 'Art Portfolio Submission',
            course: 'Art 120',
            dueDate: '2023-12-05',
            submittedDate: '2023-12-04',
            status: 'graded',
            fileType: 'image',
            fileSize: '12.5 MB',
            grade: '88',
            maxPoints: 100,
            instructor: 'Prof. Miller'
        }
    ];

    // Filter assignments based on selected filter and search query
    const filteredAssignments = assignments
        .filter(assignment => {
            if (filter !== 'all' && assignment.status !== filter) return false;
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    assignment.title.toLowerCase().includes(query) ||
                    assignment.course.toLowerCase().includes(query) ||
                    assignment.instructor.toLowerCase().includes(query)
                );
            }
            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'date') {
                return sortOrder === 'asc'
                    ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
                    : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
            } else if (sortBy === 'course') {
                return sortOrder === 'asc'
                    ? a.course.localeCompare(b.course)
                    : b.course.localeCompare(a.course);
            } else {
                return sortOrder === 'asc'
                    ? a.status.localeCompare(b.status)
                    : b.status.localeCompare(a.status);
            }
        });

    // Get file icon based on file type
    const getFileIcon = (fileType: string) => {
        switch (fileType) {
            case 'pdf': return <FaFilePdf className="text-red-500" />;
            case 'doc': return <FaFileWord className="text-blue-500" />;
            case 'image': return <FaFileImage className="text-green-500" />;
            case 'zip': return <FaFileArchive className="text-yellow-500" />;
            default: return <FaFilePdf className="text-gray-500" />;
        }
    };

    // Get status icon and color
    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'submitted':
                return { icon: <FaCheckCircle className="text-green-500" />, color: 'text-green-700', bgColor: 'bg-green-100' };
            case 'pending':
                return { icon: <FaClock className="text-yellow-500" />, color: 'text-yellow-700', bgColor: 'bg-yellow-100' };
            case 'late':
                return { icon: <FaExclamationTriangle className="text-red-500" />, color: 'text-red-700', bgColor: 'bg-red-100' };
            case 'graded':
                return { icon: <FaCheckCircle className="text-blue-500" />, color: 'text-blue-700', bgColor: 'bg-blue-100' };
            default:
                return { icon: <FaClock className="text-gray-500" />, color: 'text-gray-700', bgColor: 'bg-gray-100' };
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Handle assignment selection
    const handleSelectAssignment = (assignment: Assignment) => {
        setSelectedAssignment(assignment);
    };

    // Handle close details
    const handleCloseDetails = () => {
        setSelectedAssignment(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-800">Assignment Submissions</h1>
                    <p className="text-gray-600 mt-2">View and manage your assignment submissions</p>
                </motion.div>

                {/* Filters and Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl shadow-md p-6 mb-6"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaFilter className="text-gray-400" />
                                </div>
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value as any)}
                                    className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="all">All Assignments</option>
                                    <option value="submitted">Submitted</option>
                                    <option value="pending">Pending</option>
                                    <option value="late">Late</option>
                                    <option value="graded">Graded</option>
                                </select>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSort className="text-gray-400" />
                                </div>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="date">Sort by Date</option>
                                    <option value="course">Sort by Course</option>
                                    <option value="status">Sort by Status</option>
                                </select>
                            </div>

                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                            >
                                <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
                            </button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search assignments..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-64"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Assignment List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                    {/* Table Header */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500 uppercase tracking-wider">
                        <div className="col-span-4">Assignment</div>
                        <div className="col-span-2">Course</div>
                        <div className="col-span-2">Due Date</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>

                    {/* Assignment Items */}
                    <div className="divide-y divide-gray-200">
                        <AnimatePresence>
                            {filteredAssignments.length > 0 ? (
                                filteredAssignments.map((assignment) => {
                                    const statusInfo = getStatusInfo(assignment.status);
                                    return (
                                        <motion.div
                                            key={assignment.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer"
                                            onClick={() => handleSelectAssignment(assignment)}
                                        >
                                            <div className="md:col-span-4 flex items-center">
                                                <div className="flex-shrink-0 mr-3">
                                                    {getFileIcon(assignment.fileType)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                                        <span className="mr-2">{assignment.fileSize}</span>
                                                        {assignment.submittedDate && (
                                                            <span>Submitted on {formatDate(assignment.submittedDate)}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="md:col-span-2 flex items-center text-sm text-gray-900">
                                                {assignment.course}
                                            </div>

                                            <div className="md:col-span-2 flex items-center text-sm text-gray-900">
                                                {formatDate(assignment.dueDate)}
                                            </div>

                                            <div className="md:col-span-2 flex items-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                                                    {statusInfo.icon}
                                                    <span className="ml-1 capitalize">{assignment.status}</span>
                                                    {assignment.grade && (
                                                        <span className="ml-1">({assignment.grade}/{assignment.maxPoints})</span>
                                                    )}
                                                </span>
                                            </div>

                                            <div className="md:col-span-2 flex items-center justify-end">
                                                <button className="text-gray-400 hover:text-gray-500 p-1">
                                                    <FaEllipsisV />
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="px-6 py-12 text-center"
                                >
                                    <div className="text-gray-400 text-lg">No assignments found</div>
                                    <p className="text-gray-500 mt-2">Try changing your filters or search query</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Assignment Details Modal */}
                <AnimatePresence>
                    {selectedAssignment && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                            onClick={handleCloseDetails}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <h2 className="text-2xl font-bold text-gray-800">{selectedAssignment.title}</h2>
                                        <button
                                            onClick={handleCloseDetails}
                                            className="text-gray-400 hover:text-gray-500"
                                        >
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Course</h3>
                                            <p className="text-gray-900">{selectedAssignment.course}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Instructor</h3>
                                            <p className="text-gray-900">{selectedAssignment.instructor}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Due Date</h3>
                                            <p className="text-gray-900">{formatDate(selectedAssignment.dueDate)}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Status</h3>
                                            <div className="inline-flex items-center">
                                                {getStatusInfo(selectedAssignment.status).icon}
                                                <span className="ml-2 capitalize">{selectedAssignment.status}</span>
                                            </div>
                                        </div>

                                        {selectedAssignment.submittedDate && (
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Submitted Date</h3>
                                                <p className="text-gray-900">{formatDate(selectedAssignment.submittedDate)}</p>
                                            </div>
                                        )}

                                        {selectedAssignment.grade && (
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Grade</h3>
                                                <p className="text-gray-900">{selectedAssignment.grade}/{selectedAssignment.maxPoints}</p>
                                            </div>
                                        )}

                                        <div className="md:col-span-2">
                                            <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">File Details</h3>
                                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                <div className="mr-3 text-lg">
                                                    {getFileIcon(selectedAssignment.fileType)}
                                                </div>
                                                <div className="flex-grow">
                                                    <p className="text-gray-900">Submission file.{selectedAssignment.fileType}</p>
                                                    <p className="text-sm text-gray-500">{selectedAssignment.fileSize}</p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full">
                                                        <FaEye />
                                                    </button>
                                                    <button className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full">
                                                        <FaDownload />
                                                    </button>
                                                    <button className="p-2 text-red-600 hover:bg-red-100 rounded-full">
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button
                                            onClick={handleCloseDetails}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            Close
                                        </button>
                                        {selectedAssignment.status === 'pending' && (
                                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                                                Submit Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AssignmentUploadList;