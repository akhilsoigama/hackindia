import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaEye,
  FaClock,
  FaCalendarAlt,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaDownload,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
  FaUserGraduate
} from 'react-icons/fa';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  dueTime: string;
  points: number;
  assignmentType: string;
  status: 'draft' | 'published' | 'completed';
  submissions: number;
  totalStudents: number;
  createdAt: string;
  description: string;
  image: string;
}

const AssignmentList = () => {
  // Sample assignment data with images
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Algebra Homework: Quadratic Equations',
      subject: 'Mathematics',
      dueDate: '2023-11-30',
      dueTime: '23:59',
      points: 100,
      assignmentType: 'Homework',
      status: 'published',
      submissions: 24,
      totalStudents: 30,
      createdAt: '2023-11-20',
      description: 'Solve the quadratic equations using the appropriate method.',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: '2',
      title: 'Science Project: Solar System',
      subject: 'Science',
      dueDate: '2023-12-15',
      dueTime: '23:59',
      points: 150,
      assignmentType: 'Project',
      status: 'published',
      submissions: 18,
      totalStudents: 30,
      createdAt: '2023-11-25',
      description: 'Create a model of the solar system with accurate planet sizes and distances.',
      image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: '3',
      title: 'English Essay: Shakespeare Analysis',
      subject: 'English',
      dueDate: '2023-12-05',
      dueTime: '23:59',
      points: 100,
      assignmentType: 'Essay',
      status: 'draft',
      submissions: 0,
      totalStudents: 30,
      createdAt: '2023-11-28',
      description: 'Analyze the themes in Shakespeare\'s Macbeth.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: '4',
      title: 'History Quiz: World War II',
      subject: 'History',
      dueDate: '2023-11-25',
      dueTime: '23:59',
      points: 50,
      assignmentType: 'Quiz',
      status: 'completed',
      submissions: 28,
      totalStudents: 30,
      createdAt: '2023-11-15',
      description: 'Multiple choice questions about key events in World War II.',
      image: 'https://www.grunge.com/img/gallery/why-world-war-ii-is-discussed-more-than-world-war-i/intro-1690545789.jpg'
    },
    {
      id: '5',
      title: 'Art Assignment: Perspective Drawing',
      subject: 'Art',
      dueDate: '2023-12-10',
      dueTime: '23:59',
      points: 100,
      assignmentType: 'Project',
      status: 'published',
      submissions: 15,
      totalStudents: 25,
      createdAt: '2023-11-22',
      description: 'Create a perspective drawing of a cityscape.',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Assignment; direction: 'ascending' | 'descending' } | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [viewAssignment, setViewAssignment] = useState<Assignment | null>(null);

  // Available filters
  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Art'];
  const assignmentTypes = ['Homework', 'Project', 'Quiz', 'Exam', 'Essay', 'Presentation'];

  // Handle sorting
  const handleSort = (key: keyof Assignment) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Get sorted assignments
  const getSortedAssignments = () => {
    if (!sortConfig) return assignments;
    
    return [...assignments].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  // Filter assignments based on search term and filters
  const filteredAssignments = getSortedAssignments().filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    const matchesSubject = subjectFilter === 'all' || assignment.subject === subjectFilter;
    const matchesType = typeFilter === 'all' || assignment.assignmentType.toLowerCase() === typeFilter;
    
    return matchesSearch && matchesStatus && matchesSubject && matchesType;
  });

  // Delete an assignment
  const deleteAssignment = (id: string) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      setAssignments(assignments.filter(assignment => assignment.id !== id));
    }
  };

  // Get status badge style and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'published':
        return { 
          style: 'bg-green-100 text-green-800',
          icon: <FaCheckCircle className="text-green-500" />
        };
      case 'draft':
        return { 
          style: 'bg-yellow-100 text-yellow-800',
          icon: <FaExclamationCircle className="text-yellow-500" />
        };
      case 'completed':
        return { 
          style: 'bg-blue-100 text-blue-800',
          icon: <FaTimesCircle className="text-blue-500" />
        };
      default:
        return { 
          style: 'bg-gray-100 text-gray-800',
          icon: <FaExclamationCircle className="text-gray-500" />
        };
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if assignment is overdue
  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  // Render sort icon
  const renderSortIcon = (key: keyof Assignment) => {
    if (!sortConfig || sortConfig.key !== key) return <FaSort className="ml-1 opacity-50" />;
    if (sortConfig.direction === 'ascending') return <FaSortUp className="ml-1" />;
    return <FaSortDown className="ml-1" />;
  };

  // View assignment details
  const handleViewAssignment = (assignment: Assignment) => {
    setViewAssignment(assignment);
  };

  // Close view modal
  const handleCloseView = () => {
    setViewAssignment(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <FaChalkboardTeacher className="mr-3 text-indigo-600" />
              Assignments
            </h1>
            <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
              Manage and track all assignments in one place
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500'}`}
              onClick={() => setViewMode('grid')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button 
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500'}`}
              onClick={() => setViewMode('list')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6 border border-gray-100"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center">
                <FaFilter className="text-gray-400 mr-2" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors"
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors"
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors"
              >
                <option value="all">All Types</option>
                {assignmentTypes.map(type => (
                  <option key={type} value={type.toLowerCase()}>{type}</option>
                ))}
              </select>

            </div>
          </div>
        </motion.div>

        {/* Stats Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-white rounded-xl shadow-sm p-4 flex items-center border border-gray-100">
            <div className="rounded-full bg-indigo-100 p-3 mr-4">
              <FaChalkboardTeacher className="text-indigo-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Assignments</p>
              <p className="text-xl md:text-2xl font-bold">{assignments.length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 flex items-center border border-gray-100">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Published</p>
              <p className="text-xl md:text-2xl font-bold">{assignments.filter(a => a.status === 'published').length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 flex items-center border border-gray-100">
            <div className="rounded-full bg-yellow-100 p-3 mr-4">
              <FaExclamationCircle className="text-yellow-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Drafts</p>
              <p className="text-xl md:text-2xl font-bold">{assignments.filter(a => a.status === 'draft').length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 flex items-center border border-gray-100">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <FaClock className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-xl md:text-2xl font-bold">{assignments.filter(a => a.status === 'completed').length}</p>
            </div>
          </div>
        </motion.div>

        {/* Assignments Grid View */}
        {viewMode === 'grid' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6"
          >
            {filteredAssignments.length === 0 ? (
              <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
                No assignments found. Try adjusting your search or filters.
              </div>
            ) : (
              filteredAssignments.map((assignment) => {
                const statusInfo = getStatusInfo(assignment.status);
                const isAssignmentOverdue = isOverdue(assignment.dueDate) && assignment.status !== 'completed';
                const isCompleted = assignment.status === 'completed';
                
                return (
                  <motion.div 
                    key={assignment.id}
                    whileHover={{ y: -3 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-200 hover:shadow-md flex flex-col"
                    style={{ height: '320px' }} // Reduced card height
                  >
                    <div className="relative h-24"> {/* Reduced image height */}
                      <img 
                        src={assignment.image} 
                        alt={assignment.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.style}`}>
                          {statusInfo.icon}
                          <span className="ml-1">{assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 flex-grow flex flex-col"> {/* Reduced padding */}
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded">
                          {assignment.subject}
                        </span>
                        <span className="text-xs font-medium text-gray-500">{assignment.points} pts</span>
                      </div>
                      
                      <h3 className="font-bold text-base mb-1 text-gray-800 line-clamp-1">{assignment.title}</h3>
                      <p className="text-gray-600 text-xs mb-3 line-clamp-2">{assignment.description}</p>
                      
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <FaGraduationCap className="mr-1" />
                        <span>{assignment.assignmentType}</span>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <FaCalendarAlt className="mr-1" />
                        <span>{formatDate(assignment.dueDate)}</span>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <FaClock className="mr-1" />
                        <span className={isAssignmentOverdue ? 'text-red-500 font-medium' : ''}>
                          {assignment.dueTime}
                          {isAssignmentOverdue && ' (Overdue)'}
                        </span>
                      </div>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="relative flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="w-5 h-5 rounded-full bg-indigo-100 border border-white flex items-center justify-center">
                                <FaUserGraduate className="text-indigo-600 text-xs" />
                              </div>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-2">
                            {assignment.submissions}/{assignment.totalStudents}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleViewAssignment(assignment)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="View Assignment"
                          >
                            <FaEye className="text-sm" />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Edit Assignment"
                            disabled={isCompleted}
                          >
                            <FaEdit className={`text-sm ${isCompleted ? 'opacity-50' : ''}`} />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteAssignment(assignment.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete Assignment"
                            disabled={isCompleted}
                          >
                            <FaTrash className={`text-sm ${isCompleted ? 'opacity-50' : ''}`} />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}

        {/* Assignments List View */}
        {viewMode === 'list' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
          >
            {/* Table Header */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 border-b border-gray-200 font-semibold text-gray-700 bg-gray-50">
              <div 
                className="col-span-4 flex items-center cursor-pointer"
                onClick={() => handleSort('title')}
              >
                Assignment {renderSortIcon('title')}
              </div>
              <div 
                className="col-span-2 flex items-center cursor-pointer"
                onClick={() => handleSort('subject')}
              >
                Subject {renderSortIcon('subject')}
              </div>
              <div 
                className="col-span-2 flex items-center cursor-pointer"
                onClick={() => handleSort('dueDate')}
              >
                Due Date {renderSortIcon('dueDate')}
              </div>
              <div 
                className="col-span-2 flex items-center cursor-pointer"
                onClick={() => handleSort('status')}
              >
                Status {renderSortIcon('status')}
              </div>
              <div className="col-span-2 text-center">
                Actions
              </div>
            </div>

            {/* Assignment Items */}
            {filteredAssignments.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No assignments found. Try adjusting your search or filters.
              </div>
            ) : (
              filteredAssignments.map((assignment) => {
                const statusInfo = getStatusInfo(assignment.status);
                const isAssignmentOverdue = isOverdue(assignment.dueDate) && assignment.status !== 'completed';
                const isDraft = assignment.status === 'draft';
                const isCompleted = assignment.status === 'completed';
                
                return (
                  <div key={assignment.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4">
                      <div className="md:col-span-4 flex items-start">
                        <img 
                          src={assignment.image} 
                          alt={assignment.title}
                          className="w-14 h-10 object-cover rounded-md mr-3" // Reduced image size
                        />
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{assignment.title}</div>
                          <div className="text-xs text-gray-500 mt-1 line-clamp-1">{assignment.description}</div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <FaGraduationCap className="mr-1" />
                            <span>{assignment.assignmentType}</span>
                            <span className="mx-1">•</span>
                            <span>{assignment.points} pts</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:col-span-2 flex items-center">
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded">
                          {assignment.subject}
                        </span>
                      </div>
                      
                      <div className="md:col-span-2 flex items-center">
                        <div>
                          <div className="flex items-center text-xs text-gray-500">
                            <FaCalendarAlt className="mr-1" />
                            <span>{formatDate(assignment.dueDate)}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <FaClock className="mr-1" />
                            <span className={isAssignmentOverdue ? 'text-red-500 font-medium' : ''}>
                              {assignment.dueTime}
                              {isAssignmentOverdue && ' (Overdue)'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.style}`}>
                            {statusInfo.icon}
                            <span className="ml-1">{assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}</span>
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {assignment.submissions}/{assignment.totalStudents} submitted
                        </div>
                      </div>
                      
                      <div className="md:col-span-2 flex items-center justify-center space-x-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleViewAssignment(assignment)}
                          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-full"
                          title="View Assignment"
                        >
                          <FaEye className="text-sm" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1.5 text-green-600 hover:bg-green-100 rounded-full"
                          title="Edit Assignment"
                          disabled={isCompleted}
                        >
                          <FaEdit className={`text-sm ${isCompleted ? 'opacity-50' : ''}`} />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1.5 text-purple-600 hover:bg-purple-100 rounded-full"
                          title="Download Submissions"
                          disabled={isDraft || assignment.submissions === 0}
                        >
                          <FaDownload className={`text-sm ${isDraft || assignment.submissions === 0 ? 'opacity-50' : ''}`} />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteAssignment(assignment.id)}
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded-full"
                          title="Delete Assignment"
                          disabled={isCompleted}
                        >
                          <FaTrash className={`text-sm ${isCompleted ? 'opacity-50' : ''}`} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        )}

        {/* View Assignment Modal */}
        <AnimatePresence>
          {viewAssignment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={handleCloseView}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-48">
                  <img 
                    src={viewAssignment.image} 
                    alt={viewAssignment.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={handleCloseView}
                    className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                  >
                    <FaTimesCircle className="text-gray-600 text-xl" />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded">
                        {viewAssignment.subject}
                      </span>
                      <span className="ml-2 bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded">
                        {viewAssignment.assignmentType}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-gray-700">{viewAssignment.points} pts</span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{viewAssignment.title}</h2>
                  <p className="text-gray-600 mb-6">{viewAssignment.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-indigo-500 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Due Date</p>
                        <p className="font-medium">{formatDate(viewAssignment.dueDate)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <FaClock className="text-indigo-500 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Due Time</p>
                        <p className="font-medium">{viewAssignment.dueTime}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <FaUserGraduate className="text-indigo-500 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Submissions</p>
                        <p className="font-medium">{viewAssignment.submissions}/{viewAssignment.totalStudents}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <FaCheckCircle className="text-indigo-500 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium capitalize">{viewAssignment.status}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={handleCloseView}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Close
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                      View Submissions
                    </button>
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

export default AssignmentList;