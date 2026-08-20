import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

// Define the Assignment type
interface Assignment {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  status: 'submitted' | 'in-progress' | 'not-started' | 'late';
  points: number;
  description: string;
}

const Assignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    // Simulating data fetch
    const mockAssignments: Assignment[] = [
      {
        id: 1,
        title: 'React Component Design',
        subject: 'Web Development',
        dueDate: '2023-06-15',
        status: 'submitted',
        points: 100,
        description: 'Create a responsive React component with animations'
      },
      {
        id: 2,
        title: 'Database Schema',
        subject: 'Database Systems',
        dueDate: '2023-06-18',
        status: 'in-progress',
        points: 90,
        description: 'Design a normalized database schema for an e-commerce platform'
      },
      {
        id: 3,
        title: 'Algorithm Analysis',
        subject: 'Data Structures',
        dueDate: '2023-06-20',
        status: 'not-started',
        points: 85,
        description: 'Analyze time complexity of sorting algorithms'
      },
      {
        id: 4,
        title: 'UI/UX Prototype',
        subject: 'Design',
        dueDate: '2023-06-12',
        status: 'late',
        points: 95,
        description: 'Create a Figma prototype for a mobile application'
      },
      {
        id: 5,
        title: 'Research Paper',
        subject: 'Computer Science',
        dueDate: '2023-06-25',
        status: 'not-started',
        points: 100,
        description: 'Write a 10-page paper on ethical AI development'
      }
    ];
    setAssignments(mockAssignments);
    console.log('Assignments page loaded');
  }, []);

  const filteredAssignments = assignments.filter(assignment => {
    const matchesFilter = filter === 'all' || assignment.status === filter;
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'submitted': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'not-started': return 'bg-gray-100 text-gray-800';
      case 'late': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'submitted': return 'Submitted';
      case 'in-progress': return 'In Progress';
      case 'not-started': return 'Not Started';
      case 'late': return 'Late';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateDaysLeft = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <motion.header
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Assignments</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your coursework and deadlines</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center justify-center space-x-2 shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <span>+ New Assignment</span>
          </motion.button>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters and Stats */}
        <motion.div 
          className="lg:col-span-1 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Search Box */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-medium text-gray-700 mb-2">Search</h3>
            <input
              type="text"
              placeholder="Search assignments..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-medium text-gray-700 mb-2">Filter by Status</h3>
            <div className="space-y-2">
              {['all', 'not-started', 'in-progress', 'submitted', 'late'].map((status) => (
                <div key={status} className="flex items-center">
                  <input
                    type="radio"
                    id={status}
                    name="status"
                    checked={filter === status}
                    onChange={() => setFilter(status)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor={status} className="ml-2 text-gray-700 capitalize">
                    {status === 'all' ? 'All Assignments' : getStatusText(status)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-medium text-gray-700 mb-4">Assignment Stats</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Total Assignments</span>
                  <span>{assignments.length}</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Completed</span>
                  <span>{assignments.filter(a => a.status === 'submitted').length}</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(assignments.filter(a => a.status === 'submitted').length / assignments.length) * 100 || 0}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>In Progress</span>
                  <span>{assignments.filter(a => a.status === 'in-progress').length}</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(assignments.filter(a => a.status === 'in-progress').length / assignments.length) * 100 || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Assignments List */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
              <h2 className="font-semibold text-gray-800">Your Assignments</h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              <AnimatePresence>
                {filteredAssignments.length > 0 ? (
                  filteredAssignments.map((assignment) => (
                    <motion.div 
                      key={assignment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{assignment.subject}</p>
                          <p className="text-sm text-gray-600 mt-2">{assignment.description}</p>
                          
                          <div className="flex items-center mt-4 space-x-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              <span>Due {formatDate(assignment.dueDate)}</span>
                              <span className={`ml-3 ${calculateDaysLeft(assignment.dueDate) < 3 ? 'text-red-500 font-medium' : ''}`}>
                                ({calculateDaysLeft(assignment.dueDate)} {calculateDaysLeft(assignment.dueDate) === 1 ? 'day' : 'days'} left)
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              <span>{assignment.points} points</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-4 flex-shrink-0">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                            {getStatusText(assignment.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex space-x-3">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-md hover:bg-indigo-200 transition-colors"
                        >
                          View Details
                        </motion.button>
                        {assignment.status !== 'submitted' && (
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-md hover:bg-green-200 transition-colors"
                          >
                            {assignment.status === 'not-started' ? 'Start' : 'Continue'}
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 text-center"
                  >
                    <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No assignments found</h3>
                    <p className="mt-1 text-gray-500">Try changing your filters or search term</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Assignments;