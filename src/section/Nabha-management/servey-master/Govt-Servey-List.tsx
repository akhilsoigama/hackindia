import React, { useState, ReactElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaEye,
  FaChartBar,
  FaCalendarAlt,
  FaUserTie,
  FaBuilding,
  FaPlus,
  FaFileAlt,
  FaUsers,
  FaClipboardList,
} from 'react-icons/fa';

// Import static images
const departmentImages = {
  health: 'https://health-e.in/wp-content/uploads/2023/09/family-shape-figure-with-heart-stethoscope.webp',
  education: 'https://www.makemyassignments.com/blog/wp-content/uploads/2023/04/1633521512banner.jpg',
  transport: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=200&fit=crop&crop=center',
  finance: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop&crop=center',
  environment: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=300&h=200&fit=crop&crop=center',
  default: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop&crop=center',
};

// Type definitions
interface Survey {
  id: string;
  title: string;
  department: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  responses: number;
  createdAt: string;
  endDate: string;
  questions: number;
}

const GovtServeyList: React.FC = () => {
  // Sample survey data
  const [surveys] = useState<Survey[]>([
    {
      id: '1',
      title: 'Public Health Infrastructure Feedback',
      department: 'health',
      status: 'active',
      responses: 1245,
      createdAt: '2023-10-15',
      endDate: '2023-12-15',
      questions: 12,
    },
    {
      id: '2',
      title: 'Education Policy Satisfaction Survey',
      department: 'education',
      status: 'active',
      responses: 876,
      createdAt: '2023-11-01',
      endDate: '2023-12-31',
      questions: 15,
    },
    {
      id: '3',
      title: 'Transportation System Improvement',
      department: 'transport',
      status: 'draft',
      responses: 0,
      createdAt: '2023-11-20',
      endDate: '2024-02-20',
      questions: 10,
    },
    {
      id: '4',
      title: 'Taxation System Feedback',
      department: 'finance',
      status: 'completed',
      responses: 2103,
      createdAt: '2023-08-10',
      endDate: '2023-10-10',
      questions: 18,
    },
    {
      id: '5',
      title: 'Public Parks Usage Patterns',
      department: 'environment',
      status: 'archived',
      responses: 542,
      createdAt: '2023-05-22',
      endDate: '2023-07-22',
      questions: 8,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);

  // Filter surveys based on search term and filters
  const filteredSurveys = surveys.filter((survey) => {
    const matchesSearch = survey.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || survey.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || survey.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Get department name from key
  const getDepartmentName = (key: string) => {
    const departments: Record<string, string> = {
      health: 'Health Department',
      education: 'Education Department',
      transport: 'Transport Department',
      finance: 'Finance Department',
      environment: 'Environment Department',
    };
    return departments[key] || key;
  };

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-700 border border-gray-300',
      active: 'bg-blue-50 text-blue-700 border border-blue-200',
      completed: 'bg-green-50 text-green-700 border border-green-200',
      archived: 'bg-purple-50 text-purple-700 border border-purple-200',
    };
    return statusStyles[status] || 'bg-gray-100 text-gray-700 border border-gray-300';
  };

  const getStatusIcon = (status: string) => {
    const statusIcons: Record<string, ReactElement> = {
      draft: <FaFileAlt className="text-gray-500" />,
      active: <FaChartBar className="text-blue-500" />,
      completed: <FaFileAlt className="text-green-500" />,
      archived: <FaFileAlt className="text-purple-500" />,
    };
    return statusIcons[status] || <FaFileAlt className="text-gray-500" />;
  };

  // Get department image
  const getDepartmentImage = (department: string) => {
    return departmentImages[department as keyof typeof departmentImages] || departmentImages.default;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate days remaining
  const getDaysRemaining = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days left` : 'Ended';
  };

  // Handle view survey
  const showDetails = (survey: Survey) => {
    setSelectedSurvey(survey);
  };

  // Close modal
  const closeDetails = () => {
    setSelectedSurvey(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                <div className="bg-blue-600 p-2 rounded-lg mr-3 shadow-md">
                  <FaClipboardList className="text-white text-xl md:text-2xl" />
                </div>
                Government Survey Dashboard
              </h1>
              <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
                Manage and track all government surveys in one place
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 md:mt-0 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors font-medium"
            >
              <FaPlus className="mr-2" />
              Create New Survey
            </motion.button>
          </div>
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6"
        >
          <div className="bg-white rounded-xl shadow-sm p-4 flex items-center border border-gray-100 hover:shadow-md transition-shadow">
            <div className="rounded-xl bg-blue-100 p-3 mr-4">
              <FaClipboardList className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Surveys</p>
              <p className="text-xl md:text-2xl font-bold text-gray-800">{surveys.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 flex items-center border border-gray-100 hover:shadow-md transition-shadow">
            <div className="rounded-xl bg-green-100 p-3 mr-4">
              <FaChartBar className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Active Surveys</p>
              <p className="text-xl md:text-2xl font-bold text-gray-800">
                {surveys.filter((s) => s.status === 'active').length}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 flex items-center border border-gray-100 hover:shadow-md transition-shadow">
            <div className="rounded-xl bg-purple-100 p-3 mr-4">
              <FaUsers className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Responses</p>
              <p className="text-xl md:text-2xl font-bold text-gray-800">
                {surveys.reduce((acc, s) => acc + s.responses, 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 flex items-center border border-gray-100 hover:shadow-md transition-shadow">
            <div className="rounded-xl bg-gray-100 p-3 mr-4">
              <FaFileAlt className="text-gray-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Draft Surveys</p>
              <p className="text-xl md:text-2xl font-bold text-gray-800">
                {surveys.filter((s) => s.status === 'draft').length}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-5 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search surveys by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-lg mr-2">
                  <FaFilter className="text-blue-600" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none w-full transition-colors text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-lg mr-2">
                  <FaBuilding className="text-blue-600" />
                </div>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none w-full transition-colors text-sm"
                >
                  <option value="all">All Departments</option>
                  <option value="health">Health Department</option>
                  <option value="education">Education Department</option>
                  <option value="transport">Transport Department</option>
                  <option value="finance">Finance Department</option>
                  <option value="environment">Environment Department</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Survey Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filteredSurveys.length === 0 ? (
            <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-xl shadow-sm">
              <FaSearch className="text-3xl mx-auto mb-3 text-gray-300" />
              <p className="text-base font-medium">No surveys found</p>
              <p className="text-xs">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredSurveys.map((survey, index) => (
              <motion.div
                key={survey.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300"
              >
                {/* Department Image - Reduced height */}
                <div className="h-28 overflow-hidden">
                  <img
                    src={getDepartmentImage(survey.department)}
                    alt={getDepartmentName(survey.department)}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Card Content */}
                <div className="p-4">
                  {/* Department Name */}
                  <div className="mb-2">
                    <div className="flex items-center text-xs text-blue-600 font-medium">
                      <FaUserTie className="mr-1 text-xs" />
                      <span>{getDepartmentName(survey.department)}</span>
                    </div>
                  </div>

                  {/* Survey Title */}
                  <h3 className="font-semibold text-base text-gray-900 mb-3 leading-tight line-clamp-2">
                    {survey.title}
                  </h3>

                  {/* Status Badge */}
                  <div className="mb-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                        survey.status
                      )}`}
                    >
                      {getStatusIcon(survey.status)}
                      <span className="ml-1">{survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-base font-bold text-gray-800">{survey.responses.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Responses</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-base font-bold text-gray-800">{survey.questions}</div>
                      <div className="text-xs text-gray-500">Questions</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-1 text-purple-500 text-xs" />
                      <span>Created: {formatDate(survey.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-1 text-blue-500 text-xs" />
                      <span>Ends: {formatDate(survey.endDate)}</span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        survey.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {getDaysRemaining(survey.endDate)}
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => showDetails(survey)}
                    className="px-3 py-1 text-blue-600 bg-blue-50 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors cursor-pointer"
                    title="View Survey"
                  >
                    <FaEye className="inline mr-1 text-xs" /> View
                  </motion.button>

                  <div className="flex space-x-1">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-1.5 text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
                      title="Edit Survey (Disabled)"
                      disabled
                    >
                      <FaEdit className="text-xs" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-1.5 text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
                      title="Delete Survey (Disabled)"
                      disabled
                    >
                      <FaTrash className="text-xs" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Survey Details Modal */}
        <AnimatePresence>
          {selectedSurvey && (
            <div className="fixed inset-0 overflow-y-auto scrollbar-hide z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/10  backdrop-blur-sm bg-opacity-50 transition-opacity"
                onClick={closeDetails}
              ></motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative bg-white rounded-xl scrollbar-hide shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
                  <h3 className="text-xl font-semibold text-gray-800">{selectedSurvey.title}</h3>
                  <button
                    onClick={closeDetails}
                    className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
                      Survey Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <span className="block text-sm font-medium text-gray-500">Survey ID</span>
                          <p className="mt-1 text-gray-900">{selectedSurvey.id}</p>
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-gray-500">Department</span>
                          <p className="mt-1 text-gray-900">{getDepartmentName(selectedSurvey.department)}</p>
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-gray-500">Status</span>
                          <span
                            className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                              selectedSurvey.status
                            )}`}
                          >
                            {getStatusIcon(selectedSurvey.status)}
                            <span className="ml-1">
                              {selectedSurvey.status.charAt(0).toUpperCase() + selectedSurvey.status.slice(1)}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <span className="block text-sm font-medium text-gray-500">Responses</span>
                          <p className="mt-1 text-gray-900">{selectedSurvey.responses.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-gray-500">Questions</span>
                          <p className="mt-1 text-gray-900">{selectedSurvey.questions}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
                      Date Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <span className="block text-sm font-medium text-gray-500">Created Date</span>
                        <p className="mt-1 text-gray-900">{formatDate(selectedSurvey.createdAt)}</p>
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-500">End Date</span>
                        <p className="mt-1 text-gray-900">{formatDate(selectedSurvey.endDate)}</p>
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-500">Days Remaining</span>
                        <p
                          className={`mt-1 text-gray-900 px-2 py-1 rounded text-sm inline-block ${
                            selectedSurvey.status === 'active'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {getDaysRemaining(selectedSurvey.endDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
                      Department Image
                    </h4>
                    <img
                      src={getDepartmentImage(selectedSurvey.department)}
                      alt={getDepartmentName(selectedSurvey.department)}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                </div>

                <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={closeDetails}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GovtServeyList;
