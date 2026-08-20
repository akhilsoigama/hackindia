import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { 
  FiTrendingUp, 
  FiAward, 
  FiBarChart2, 
  FiBook,
  FiCheckCircle,
  FiTarget,
} from 'react-icons/fi';

const Progress = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('week');
  
  const overallProgress = {
    completed: 75,
    inProgress: 20,
    notStarted: 5
  };

  const courses = [
    { name: 'Mathematics', progress: 85, hours: 42, assignments: 12, color: 'bg-blue-500' },
    { name: 'Physics', progress: 70, hours: 36, assignments: 8, color: 'bg-green-500' },
    { name: 'Literature', progress: 60, hours: 28, assignments: 10, color: 'bg-purple-500' },
    { name: 'Chemistry', progress: 90, hours: 48, assignments: 15, color: 'bg-orange-500' },
  ];

  const weeklyActivity = [
    { day: 'Mon', hours: 3.5 },
    { day: 'Tue', hours: 2.8 },
    { day: 'Wed', hours: 4.2 },
    { day: 'Thu', hours: 3.1 },
    { day: 'Fri', hours: 2.5 },
    { day: 'Sat', hours: 1.8 },
    { day: 'Sun', hours: 2.0 },
  ];

  const achievements = [
    { id: 1, title: 'Consistent Learner', description: 'Studied for 5 days in a row', icon: <FiAward className="text-yellow-500" /> },
    { id: 2, title: 'Quick Completer', description: 'Submitted assignment early', icon: <FiCheckCircle className="text-green-500" /> },
    { id: 3, title: 'Quiz Master', description: 'Scored 100% on latest quiz', icon: <FiTarget className="text-blue-500" /> },
  ];

  const goals = [
    { id: 1, title: 'Complete Calculus Module', deadline: 'Sep 25', progress: 70 },
    { id: 2, title: 'Finish Literature Essay', deadline: 'Sep 28', progress: 30 },
    { id: 3, title: 'Physics Lab Report', deadline: 'Oct 2', progress: 10 },
  ];

  useEffect(() => {
    console.log('Progress page loaded');
  }, []);

  const maxHours = Math.max(...weeklyActivity.map(day => day.hours));

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <motion.header
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Progress Tracking</h1>
            <p className="text-sm text-gray-500 mt-1">Monitor your learning journey and achievements</p>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            {['week', 'month', 'all'].map(timeframe => (
              <button
                key={timeframe}
                onClick={() => setActiveTimeframe(timeframe)}
                className={`px-3 py-1 rounded-full text-sm ${activeTimeframe === timeframe 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </motion.header>

      {/* Overall Progress */}
      <motion.section
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiTrendingUp className="mr-2 text-blue-500" />
            Overall Progress
          </h2>
          
          <div className="flex items-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#eee"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray={`${overallProgress.completed}, 100`}
                />
                <text x="18" y="20.5" textAnchor="middle" fill="#1f2937" fontSize="8" fontWeight="bold">
                  {overallProgress.completed}%
                </text>
              </svg>
            </div>
            
            <div className="ml-6 space-y-3">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">Completed: {overallProgress.completed}%</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-300 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">In Progress: {overallProgress.inProgress}%</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-200 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">Not Started: {overallProgress.notStarted}%</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">42</p>
              <p className="text-sm text-gray-600">Hours Studied</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">24</p>
              <p className="text-sm text-gray-600">Assignments Done</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">8</p>
              <p className="text-sm text-gray-600">Quizzes Taken</p>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Course Progress */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm h-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiBook className="mr-2 text-purple-500" />
              Course Progress
            </h2>
            
            <div className="space-y-5">
              {courses.map((course, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-800">{course.name}</span>
                    <span className="text-sm font-semibold text-gray-700">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <motion.div 
                      className={`h-2.5 rounded-full ${course.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{course.hours} hours</span>
                    <span>{course.assignments} assignments</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Weekly Activity */}
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm h-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiBarChart2 className="mr-2 text-green-500" />
              Weekly Study Activity
            </h2>
            
            <div className="flex items-end justify-between h-48 mt-6">
              {weeklyActivity.map((day, index) => (
                <div key={index} className="flex flex-col items-center w-10">
                  <div className="text-xs text-gray-500 mb-2">{day.day}</div>
                  <motion.div
                    className="w-8 bg-blue-500 rounded-t-lg"
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.hours / maxHours) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    style={{ maxHeight: '120px' }}
                  />
                  <div className="text-xs text-gray-600 mt-1">{day.hours}h</div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Achievements */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm h-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiAward className="mr-2 text-yellow-500" />
              Recent Achievements
            </h2>
            
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <motion.div 
                  key={achievement.id}
                  className="flex items-center p-3 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="p-2 bg-white rounded-full shadow-sm mr-3">
                    {achievement.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{achievement.title}</p>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Goals & Targets */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm h-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiTarget className="mr-2 text-red-500" />
              Goals & Targets
            </h2>
            
            <div className="space-y-4">
              {goals.map((goal, index) => (
                <motion.div 
                  key={goal.id}
                  className="p-3 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-800">{goal.title}</h3>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      Due: {goal.deadline}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                    <div 
                      className="h-2 rounded-full bg-green-500" 
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{goal.progress}% complete</span>
                    <span>{100 - goal.progress}% remaining</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Progress;