import { FaPlus, FaEdit, FaTrash, FaEye, FaImage, FaCalendarAlt, FaUniversity, FaPoll } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface SurveyData {
  id: number;
  title: string;
  institute: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive';
  imageUrl?: string;
  responses?: number;
  questions?: number;
}

const InstituteSurveyList = () => {
  const surveys: SurveyData[] = [
    {
      id: 1,
      title: 'Annual Feedback 2025',
      institute: 'ABC University',
      type: 'Feedback',
      startDate: '2025-01-15',
      endDate: '2025-01-30',
      status: 'active',
      responses: 245,
      questions: 15,
      imageUrl: 'https://www.ilga-europe.org/files/uploads/2025/02/ilga-europe-annual-review-2025_h.jpg'
    },
    {
      id: 2,
      title: 'Course Evaluation Survey',
      institute: 'XYZ College',
      type: 'Evaluation',
      startDate: '2025-02-01',
      endDate: '2025-02-10',
      status: 'inactive',
      responses: 120,
      questions: 10,
      imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 3,
      title: 'Student Satisfaction Survey',
      institute: 'DEF Institute',
      type: 'Feedback',
      startDate: '2025-03-01',
      endDate: '2025-03-15',
      status: 'active',
      responses: 178,
      questions: 12,
      imageUrl: 'https://josephscollege.ac.in/wp-content/uploads/2020/07/f3.jpg'
    },
  ];

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold  bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Institute Surveys
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base max-w-2xl">
              Manage and track all institutional surveys in one place. Monitor response rates and survey status at a glance.
            </p>
          </div>
          <motion.button
            className="flex items-center justify-center px-5 py-3 rounded-xl shadow-sm text-sm sm:text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:transform-none disabled:cursor-not-allowed mx-auto sm:mx-0 w-full sm:w-auto"
            disabled
            title="Feature temporarily disabled"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaPlus className="mr-2 text-sm" /> Create New Survey
          </motion.button>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="bg-white rounded-2xl p-5 shadow-md border border-gray-100"
          >
            <div className="flex items-center">
              <div className="rounded-lg bg-blue-100 p-3 mr-4">
                <FaPoll className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{surveys.length}</h3>
                <p className="text-gray-600 text-sm">Total Surveys</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="bg-white rounded-2xl p-5 shadow-md border border-gray-100"
          >
            <div className="flex items-center">
              <div className="rounded-lg bg-green-100 p-3 mr-4">
                <FaCalendarAlt className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{surveys.filter(s => s.status === 'active').length}</h3>
                <p className="text-gray-600 text-sm">Active Surveys</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="bg-white rounded-2xl p-5 shadow-md border border-gray-100"
          >
            <div className="flex items-center">
              <div className="rounded-lg bg-purple-100 p-3 mr-4">
                <FaUniversity className="text-purple-600 text-xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">3</h3>
                <p className="text-gray-600 text-sm">Institutes</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Survey Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {surveys.length === 0 ? (
            <motion.div
              className="col-span-full text-center text-gray-500 p-10 bg-white rounded-2xl shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <FaImage className="text-4xl mx-auto text-gray-300 mb-3" />
              <p className="text-lg">No surveys found.</p>
              <p className="text-sm mt-1">Create your first survey to get started.</p>
            </motion.div>
          ) : (
            surveys.map((survey) => (
              <motion.div
                key={survey.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ y: -4 }}
              >
                {/* Survey Image */}
                <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                  {survey.imageUrl ? (
                    <img 
                      src={survey.imageUrl} 
                      alt={survey.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-indigo-300">
                      <FaImage className="text-5xl mb-2" />
                      <span className="text-sm">No image available</span>
                    </div>
                  )}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${survey.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}
                  </div>
                </div>
                
                {/* Card Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{survey.title}</h3>
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <FaUniversity className="mr-2 text-indigo-500" />
                        <span>{survey.institute}</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                      {survey.type}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Responses</p>
                      <p className="text-lg font-bold text-gray-800">{survey.responses}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">Questions</p>
                      <p className="text-lg font-bold text-gray-800">{survey.questions}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-5">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2 text-blue-500" />
                      <span>{formatDate(survey.startDate)}</span>
                    </div>
                    <span className="text-gray-400">→</span>
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2 text-blue-500" />
                      <span>{formatDate(survey.endDate)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4 border-t border-gray-100">
                    <button
                      className="flex items-center justify-center text-gray-400 p-2 rounded-lg bg-gray-100 cursor-not-allowed"
                      title="View (disabled)"
                      aria-label={`View ${survey.title} (disabled)`}
                      disabled
                    >
                      <FaEye className="text-lg" />
                    </button>
                    <button
                      className="flex items-center justify-center text-gray-400 p-2 rounded-lg bg-gray-100 cursor-not-allowed"
                      title="Edit (disabled)"
                      aria-label={`Edit ${survey.title} (disabled)`}
                      disabled
                    >
                      <FaEdit className="text-lg" />
                    </button>
                    <button
                      className="flex items-center justify-center text-gray-400 p-2 rounded-lg bg-gray-100 cursor-not-allowed"
                      title="Delete (disabled)"
                      aria-label={`Delete ${survey.title} (disabled)`}
                      disabled
                    >
                      <FaTrash className="text-lg" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default InstituteSurveyList;