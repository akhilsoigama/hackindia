import { useState, useEffect } from 'react';
import { FiAward, FiBarChart, FiBook, FiCheckCircle, FiClock, FiFilter, FiSearch, FiTrendingUp, FiUser, FiUsers } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const StudentProgress = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Sample student data with Punjabi names
  const studentsData = [
    {
      id: 1,
      name: 'Simranpreet Kaur',
      avatar: 'SK',
      overallProgress: 85,
      completedModules: 12,
      totalModules: 15,
      completedTasks: 24,
      totalTasks: 30,
      recentActivity: 'Completed Math Module 12',
      lastActive: '2 hours ago',
      subjects: [
        { name: 'Mathematics', progress: 90, color: 'bg-blue-500' },
        { name: 'Physics', progress: 80, color: 'bg-green-500' },
        { name: 'Chemistry', progress: 85, color: 'bg-purple-500' }
      ],
      recentTasks: [
        { task: 'Algebra Assignment', status: 'completed', date: 'Today' },
        { task: 'Geometry Quiz', status: 'completed', date: 'Yesterday' },
        { task: 'Calculus Practice', status: 'pending', date: 'Tomorrow' }
      ]
    },
    {
      id: 2,
      name: 'Harpreet Singh',
      avatar: 'HS',
      overallProgress: 72,
      completedModules: 10,
      totalModules: 15,
      completedTasks: 18,
      totalTasks: 25,
      recentActivity: 'Started Physics Module 11',
      lastActive: '4 hours ago',
      subjects: [
        { name: 'Mathematics', progress: 75, color: 'bg-blue-500' },
        { name: 'Physics', progress: 68, color: 'bg-green-500' },
        { name: 'Chemistry', progress: 72, color: 'bg-purple-500' }
      ],
      recentTasks: [
        { task: 'Motion Laws Quiz', status: 'completed', date: 'Today' },
        { task: 'Force Diagrams', status: 'in-progress', date: 'Today' },
        { task: 'Energy Conservation', status: 'pending', date: 'Friday' }
      ]
    },
    {
      id: 3,
      name: 'Jaspreet Kaur',
      avatar: 'JK',
      overallProgress: 91,
      completedModules: 14,
      totalModules: 15,
      completedTasks: 28,
      totalTasks: 30,
      recentActivity: 'Achieved top score in Chemistry Quiz',
      lastActive: '1 hour ago',
      subjects: [
        { name: 'Mathematics', progress: 95, color: 'bg-blue-500' },
        { name: 'Physics', progress: 88, color: 'bg-green-500' },
        { name: 'Chemistry', progress: 90, color: 'bg-purple-500' }
      ],
      recentTasks: [
        { task: 'Organic Chemistry', status: 'completed', date: 'Today' },
        { task: 'Periodic Table Quiz', status: 'completed', date: 'Yesterday' },
        { task: 'Chemical Bonding', status: 'completed', date: '2 days ago' }
      ]
    },
    {
      id: 4,
      name: 'Gurpreet Singh',
      avatar: 'GS',
      overallProgress: 64,
      completedModules: 8,
      totalModules: 15,
      completedTasks: 15,
      totalTasks: 25,
      recentActivity: 'Working on Mathematics Module 9',
      lastActive: '6 hours ago',
      subjects: [
        { name: 'Mathematics', progress: 60, color: 'bg-blue-500' },
        { name: 'Physics', progress: 65, color: 'bg-green-500' },
        { name: 'Chemistry', progress: 68, color: 'bg-purple-500' }
      ],
      recentTasks: [
        { task: 'Trigonometry Basics', status: 'in-progress', date: 'Today' },
        { task: 'Statistics Assignment', status: 'pending', date: 'Tomorrow' },
        { task: 'Probability Quiz', status: 'pending', date: 'Monday' }
      ]
    },
    {
      id: 5,
      name: 'Manpreet Kaur',
      avatar: 'MK',
      overallProgress: 78,
      completedModules: 11,
      totalModules: 15,
      completedTasks: 20,
      totalTasks: 26,
      recentActivity: 'Submitted Physics Lab Report',
      lastActive: '3 hours ago',
      subjects: [
        { name: 'Mathematics', progress: 82, color: 'bg-blue-500' },
        { name: 'Physics', progress: 75, color: 'bg-green-500' },
        { name: 'Chemistry', progress: 77, color: 'bg-purple-500' }
      ],
      recentTasks: [
        { task: 'Optics Experiment', status: 'completed', date: 'Today' },
        { task: 'Wave Motion Quiz', status: 'completed', date: 'Yesterday' },
        { task: 'Electromagnetic Theory', status: 'in-progress', date: 'Tomorrow' }
      ]
    },
    {
      id: 6,
      name: 'Rajpreet Singh',
      avatar: 'RS',
      overallProgress: 88,
      completedModules: 13,
      totalModules: 15,
      completedTasks: 26,
      totalTasks: 30,
      recentActivity: 'Completed Advanced Calculus Module',
      lastActive: '1 hour ago',
      subjects: [
        { name: 'Mathematics', progress: 92, color: 'bg-blue-500' },
        { name: 'Physics', progress: 85, color: 'bg-green-500' },
        { name: 'Chemistry', progress: 87, color: 'bg-purple-500' }
      ],
      recentTasks: [
        { task: 'Integration Techniques', status: 'completed', date: 'Today' },
        { task: 'Differential Equations', status: 'completed', date: 'Yesterday' },
        { task: 'Vector Calculus', status: 'in-progress', date: 'Tomorrow' }
      ]
    }
  ];

  // Overall statistics
  const overallStats = [
    { 
      title: 'Total Students', 
      value: studentsData.length.toString(), 
      description: 'Active learners', 
      icon: <FiUsers className="text-blue-500" />, 
      color: 'bg-blue-100' 
    },
    { 
      title: 'Avg Progress', 
      value: `${Math.round(studentsData.reduce((acc, student) => acc + student.overallProgress, 0) / studentsData.length)}%`, 
      description: 'Class average', 
      icon: <FiBarChart className="text-green-500" />, 
      color: 'bg-green-100' 
    },
    { 
      title: 'Completed Tasks', 
      value: studentsData.reduce((acc, student) => acc + student.completedTasks, 0).toString(), 
      description: 'Total submissions', 
      icon: <FiCheckCircle className="text-purple-500" />, 
      color: 'bg-purple-100' 
    },
    { 
      title: 'Active Today', 
      value: studentsData.filter(student => student.lastActive.includes('hour')).length.toString(), 
      description: 'Students online', 
      icon: <FiTrendingUp className="text-orange-500" />, 
      color: 'bg-orange-100' 
    }
  ];

  // Filter students based on search term and filter
  const filteredStudents = studentsData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'high' && student.overallProgress >= 80) ||
      (selectedFilter === 'medium' && student.overallProgress >= 60 && student.overallProgress < 80) ||
      (selectedFilter === 'low' && student.overallProgress < 60);
    
    return matchesSearch && matchesFilter;
  });

  const getTaskStatusColor = (status : string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress : number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <motion.header 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Student Progress Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </motion.header>

      {/* Overall Statistics */}
      <motion.section 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {overallStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{stat.title}</h2>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* Filters and Search */}
      <motion.div 
        className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
            />
          </div>
          
          <div className="flex items-center gap-2 flex-row-reverse md:flex-row">
            <FiFilter className="text-gray-500" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Students</option>
              <option value="high">High Performers (80%+)</option>
              <option value="medium">Medium Performers (60-79%)</option>
              <option value="low">Needs Support (60%)</option>
            </select>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          Showing {filteredStudents.length} of {studentsData.length} students
        </div>
      </motion.div>

      {/* Student Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
        {filteredStudents.map((student, index) => (
          <motion.div 
            key={student.id} 
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden"
            layout
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}>
            {/* Student Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {student.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-500">Last active: {student.lastActive}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getProgressColor(student.overallProgress)}`}>
                    {student.overallProgress}%
                  </div>
                  <div className="text-xs text-gray-500">Overall Progress</div>
                </div>
              </div>
              
              {/* Overall Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${student.overallProgress}%` }}
                />
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>Modules: {student.completedModules}/{student.totalModules}</span>
                <span>Tasks: {student.completedTasks}/{student.totalTasks}</span>
              </div>
            </div>

            {/* Subject Progress */}
            <div className="p-6 border-b border-gray-100">
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                <FiBarChart className="mr-2 text-blue-500" />
                Subject Progress
              </h4>
              <div className="space-y-3">
                {student.subjects.map((subject) => (
                  <div key={subject.name} className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <span className="text-sm text-gray-700 w-20">{subject.name}</span>
                      <div className="flex-1 mx-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${subject.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${subject.progress}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-600 w-10">
                        {subject.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Tasks */}
            <div className="p-6">
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                <FiBook className="mr-2 text-green-500" />
                Recent Tasks
              </h4>
              <div className="space-y-2">
                {student.recentTasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      {task.status === 'completed' && <FiCheckCircle className="text-green-500 mr-2 flex-shrink-0" />}
                      {task.status === 'in-progress' && <FiClock className="text-yellow-500 mr-2 flex-shrink-0" />}
                      {task.status === 'pending' && <FiClock className="text-gray-400 mr-2 flex-shrink-0" />}
                      <span className="text-sm text-gray-700">{task.task}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      <span className="text-xs text-gray-500">{task.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Recent Activity */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 flex items-center">
                  <FiAward className="mr-2 text-blue-600" />
                  {student.recentActivity}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <AnimatePresence>
          <motion.div 
            className="text-center py-12 col-span-1 lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}>
            <FiUser className="mx-auto text-gray-400 text-4xl mb-4" />
            <p className="text-gray-500 text-lg">No students found matching your criteria</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filter settings</p>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default StudentProgress;