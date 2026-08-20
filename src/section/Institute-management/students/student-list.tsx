import { useState } from 'react';
import { FaUserGraduate, FaEnvelope, FaPhone, FaIdCard, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Student {
  id: number;
  name: string;
  studentId: string;
  department: string;
  course: string;
  year: string;
  email: string;
  phone: string;
  status: string;
}

const StudentList = () => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: 'Alice Johnson',
      studentId: 'STU001',
      department: 'Computer Science',
      course: 'B.Tech',
      year: '3rd',
      email: 'alice.johnson@example.com',
      phone: '+91 9876543211',
      status: 'active',
    },
    {
      id: 2,
      name: 'Bob Williams',
      studentId: 'STU002',
      department: 'Mechanical Engineering',
      course: 'B.E.',
      year: '2nd',
      email: 'bob.williams@example.com',
      phone: '+91 9876509876',
      status: 'inactive',
    },
  ]);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter((s) => s.id !== id));
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
              <FaUserGraduate className="mr-2 sm:mr-3 text-blue-600 text-lg sm:text-xl" />
              Student List
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              View and manage all students in the system.
            </p>
          </motion.div>
          <Link to="/dashboard/institute-management/students/create">
            <motion.button
              className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-md shadow hover:bg-blue-700 transition-colors w-fit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus className="mr-1 sm:mr-2 text-sm sm:text-base" />
              Add Student
            </motion.button>
          </Link>
        </motion.div>

        {/* Mobile: Card Layout */}
        <motion.div className="block lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {students.length === 0 ? (
            <div className="text-center text-gray-500 p-6 bg-white rounded-lg shadow-md">
              No students found.
            </div>
          ) : (
            <AnimatePresence>
              {students.map((s, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                key={s.id}
                className="mb-4 p-4 bg-white rounded-lg shadow-md border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{s.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center">
                      <FaIdCard className="mr-2 text-gray-400" /> {s.studentId}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      className="text-blue-600 hover:text-blue-800 p-1"
                      aria-label={`Edit ${s.name}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaEdit className="text-lg" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(s.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      aria-label={`Delete ${s.name}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaTrash className="text-lg" />
                    </motion.button>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600 space-y-2">
                  <p><span className="font-medium">Department:</span> {s.department}</p>
                  <p><span className="font-medium">Course:</span> {s.course}</p>
                  <p><span className="font-medium">Year:</span> {s.year}</p>
                  <p className="flex items-center">
                    <FaEnvelope className="mr-2 text-gray-400" /> {s.email}
                  </p>
                  <p className="flex items-center">
                    <FaPhone className="mr-2 text-gray-400" /> {s.phone}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{' '}
                    <span
                      className={`inline-flex px-2 py-1 text-xs sm:text-sm font-semibold rounded-full ${
                        s.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                    </span>
                  </p>
                </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>

        {/* Desktop: Table Layout */}
        <motion.div className="hidden lg:block bg-white shadow-md rounded-lg overflow-x-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <table className="min-w-full divide-y divide-gray-200 scrollbar-hide">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  Student ID
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  Department
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  Course
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  Year
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  Contact
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {students.map((s, index) => (
                  <motion.tr
                    layout
                    key={s.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50">
                  <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm text-gray-800">{s.name}</td>
                  <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm text-gray-600 flex items-center">
                    <FaIdCard className="mr-2 text-gray-400" /> {s.studentId}
                  </td>
                  <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm text-gray-600">{s.department}</td>
                  <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm text-gray-600">{s.course}</td>
                  <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm text-gray-600">{s.year}</td>
                  <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm text-gray-600">
                    <div className="flex flex-col">
                      <span className="flex items-center">
                        <FaEnvelope className="mr-2 text-gray-400" /> {s.email}
                      </span>
                      <span className="flex items-center mt-1">
                        <FaPhone className="mr-2 text-gray-400" /> {s.phone}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm">
                    <span
                      className={`px-2 inline-flex text-xs sm:text-sm font-semibold rounded-full ${
                        s.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                    </span>
                  </td>
                  <td className="flex justify-center px-4 py-3 sm:px-6 sm:py-4 space-x-2">
                    <motion.button
                      className="text-blue-600 hover:text-blue-800 p-1"
                      aria-label={`Edit ${s.name}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaEdit className="text-lg" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(s.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      aria-label={`Delete ${s.name}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaTrash className="text-lg" />
                    </motion.button>
                  </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {students.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-3 sm:px-6 sm:py-4 text-center text-sm sm:text-base text-gray-500"
                  >
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StudentList;