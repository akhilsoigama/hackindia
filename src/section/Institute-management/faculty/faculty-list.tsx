import { IfacultyItem } from "../../../types/Faculty";
import {
  FaUser,
  FaPlus,
  FaSpinner,
  FaEdit,
  FaTrash,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  useFaculties,
  deleteFaculty,
} from "../../../action/faculty";

const FacultyList = () => {
  
  const {
    faculties,
    facultiesError: error,
    facultiesLoading: isLoading,
    facultiesMutate,
  } = useFaculties();

  // Handle deletion
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this faculty member?')) return;

    try {
      const success = await deleteFaculty(id);
      if (success) {
        toast.success('Faculty deleted successfully');
        facultiesMutate({ data: faculties.filter((f : IfacultyItem) => f.id !== id) }, false);
      }
    } catch (err) {
      console.error("Failed to delete faculty:", err);
    }
  };

  return (
    <motion.div
      className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
              <FaUser className="mr-2 sm:mr-3 text-blue-600 text-lg sm:text-xl" />
              Faculty List
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              View and manage all faculty members in the system.
            </p>
          </motion.div>
          <Link to="/dashboard/institute-management/faculty/create">
            <motion.button
              className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-md shadow hover:bg-blue-700 transition-colors w-fit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus className="mr-1 sm:mr-2 text-sm sm:text-base" />
              Add Faculty
            </motion.button>
          </Link>
        </motion.div>

        {/* Mobile: Card Layout, Desktop: Table */}
        <motion.div
          className="block lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {faculties && faculties.length === 0 ? (
            <div className="text-center text-gray-500 p-6 bg-white rounded-lg shadow-md">
              No faculty members found.
            </div>
          ) : null}
          {isLoading && (
            <div className="flex justify-center items-center p-10">
              <FaSpinner className="animate-spin text-4xl text-blue-600" />
            </div>
          )}
          {error && (
            <div className="text-center text-red-500 p-6 bg-red-50 rounded-lg shadow-md">
              Failed to load faculty data. Please try again.
            </div>
          )}
          {!isLoading && !error && faculties && (
            <AnimatePresence>
              {faculties.map((f: IfacultyItem, index: number) => (
                <motion.div
                  key={f.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="mb-4 p-4 bg-white rounded-lg shadow-md border border-gray-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {f.facultyName}
                      </h3>
                      <p className="text-sm text-gray-600">ID: {f.facultyId}</p>
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        className="text-blue-600 hover:text-blue-800 p-1"
                        aria-label={`Edit ${f.facultyName}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaEdit className="text-lg" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(f.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        aria-label={`Delete ${f.facultyName}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaTrash className="text-lg" />
                      </motion.button>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600 space-y-2">
                    <p>
                      <span className="font-medium">Designation:</span>{" "}
                      {f.designation}
                    </p>
                    <p>
                      <span className="font-medium">Department:</span>{" "}
                      {f.department.departmentName}
                    </p>
                    <p className="flex items-center">
                      <FaEnvelope className="mr-2 text-gray-400" />{" "}
                      {f.facultyEmail}
                    </p>
                    <p className="flex items-center">
                      <FaPhone className="mr-2 text-gray-400" />{" "}
                      {f.facultyMobile}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          f.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {f.isActive ? "Active" : "Inactive"}
                      </span>
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>

        {/* Desktop: Table Layout */}
        <motion.div
          className="hidden lg:block bg-white shadow-md rounded-lg overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="overflow-x-auto scrollbar-hide">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-sm font-semibold text-gray-700">
                    Faculty ID
                  </th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-sm font-semibold text-gray-700">
                    Designation
                  </th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-sm font-semibold text-gray-700">
                    Department
                  </th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-sm font-semibold text-gray-700">
                    Contact
                  </th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading && (
                  <tr>
                    <td colSpan={7} className="text-center p-10">
                      <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto" />
                    </td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center text-red-500 p-6 bg-red-50"
                    >
                      Failed to load faculty data. Please try again.
                    </td>
                  </tr>
                )}
                {!isLoading && !error && faculties && (
                  <AnimatePresence>
                    {faculties.map((f: IfacultyItem, index: number) => (
                      <motion.tr
                        layout
                        key={f.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm text-gray-800">
                          {f.facultyName}
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm text-gray-600">
                          {f.facultyId}
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm text-gray-600">
                          {f.designation}
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm text-gray-600">
                          {f.department.departmentName}
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm text-gray-600">
                          <div className="flex flex-col">
                            <span className="flex items-center">
                              <FaEnvelope className="mr-2 text-gray-400" />{" "}
                              {f.facultyEmail}
                            </span>
                            <span className="flex items-center mt-1">
                              <FaPhone className="mr-2 text-gray-400" />{" "}
                              {f.facultyMobile}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm">
                          <span
                            className={`px-2 inline-flex text-xs sm:text-sm font-semibold rounded-full ${
                              f.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {f.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="flex justify-center items-center px-4 py-3 sm:px-6 sm:py-4 space-x-2">
                          <motion.button
                            className="text-blue-600 hover:text-blue-800 p-1"
                            aria-label={`Edit ${f.facultyName}`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaEdit className="text-lg" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(f.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            aria-label={`Delete ${f.facultyName}`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaTrash className="text-lg" />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
                {!isLoading && !error && faculties?.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-3 sm:px-6 sm:py-4 text-center text-gray-500"
                    >
                      No faculty members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FacultyList;
