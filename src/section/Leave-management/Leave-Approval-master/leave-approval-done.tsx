import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaClock,
  FaCalendarAlt,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEnvelope,
  FaPhone,
  FaFileDownload,
  FaCheck,
  FaTimes,
  FaExclamationTriangle
} from 'react-icons/fa';

// Define the Leave interface
interface Leave {
  id: string;
  teacherName: string;
  teacherId: string;
  teacherEmail: string;
  teacherPhone: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  submittedDate: string;
  reviewedBy?: string;
  reviewDate?: string;
  comments?: string;
  substituteTeacher?: string;
  emergencyContact?: string;
  documents: string[];
  priority: 'low' | 'medium' | 'high';
}

const LeaveApprovalDone = () => {
  // Sample leave data
  const [leaves, setLeaves] = useState<Leave[]>([
    {
      id: '1',
      teacherName: 'Sarah Johnson',
      teacherId: 'T2023001',
      teacherEmail: 's.johnson@school.edu',
      teacherPhone: '+1 555-1234',
      department: 'Mathematics',
      leaveType: 'Sick Leave',
      startDate: '2023-11-20',
      endDate: '2023-11-21',
      duration: 2,
      reason: 'Medical appointment and recovery',
      status: 'approved',
      submittedDate: '2023-11-15',
      reviewedBy: 'Admin Office',
      reviewDate: '2023-11-16',
      comments: 'Approved. Please ensure lesson plans are submitted.',
      substituteTeacher: 'Michael Brown',
      emergencyContact: 'Dr. Smith (555-5678)',
      documents: ['Medical Certificate.pdf'],
      priority: 'medium'
    },
    {
      id: '2',
      teacherName: 'Robert Wilson',
      teacherId: 'T2023002',
      teacherEmail: 'r.wilson@school.edu',
      teacherPhone: '+1 555-2345',
      department: 'Science',
      leaveType: 'Personal Leave',
      startDate: '2023-12-05',
      endDate: '2023-12-05',
      duration: 1,
      reason: 'Family event',
      status: 'pending',
      submittedDate: '2023-11-25',
      emergencyContact: 'Spouse (555-6789)',
      documents: [],
      priority: 'low'
    },
    {
      id: '3',
      teacherName: 'Emily Davis',
      teacherId: 'T2023003',
      teacherEmail: 'e.davis@school.edu',
      teacherPhone: '+1 555-3456',
      department: 'English',
      leaveType: 'Professional Development',
      startDate: '2023-11-28',
      endDate: '2023-11-29',
      duration: 2,
      reason: 'Attending educational conference',
      status: 'approved',
      submittedDate: '2023-11-10',
      reviewedBy: 'Principal Smith',
      reviewDate: '2023-11-12',
      comments: 'Approved. Please share learnings with department.',
      substituteTeacher: 'Jennifer Lee',
      documents: ['Conference Invitation.pdf'],
      priority: 'medium'
    },
    {
      id: '4',
      teacherName: 'Michael Brown',
      teacherId: 'T2023004',
      teacherEmail: 'm.brown@school.edu',
      teacherPhone: '+1 555-4567',
      department: 'History',
      leaveType: 'Emergency Leave',
      startDate: '2023-11-22',
      endDate: '2023-11-22',
      duration: 1,
      reason: 'Urgent family matter',
      status: 'rejected',
      submittedDate: '2023-11-21',
      reviewedBy: 'Admin Office',
      reviewDate: '2023-11-21',
      comments: 'Rejected due to insufficient substitute coverage.',
      emergencyContact: 'Brother (555-7890)',
      documents: [],
      priority: 'high'
    },
    {
      id: '5',
      teacherName: 'Jennifer Lee',
      teacherId: 'T2023005',
      teacherEmail: 'j.lee@school.edu',
      teacherPhone: '+1 555-5678',
      department: 'Art',
      leaveType: 'Maternity Leave',
      startDate: '2024-01-15',
      endDate: '2024-04-15',
      duration: 90,
      reason: 'Maternity leave',
      status: 'approved',
      submittedDate: '2023-11-05',
      reviewedBy: 'HR Department',
      reviewDate: '2023-11-08',
      comments: 'Approved. Congratulations!',
      substituteTeacher: 'David Miller (Long-term substitute)',
      documents: ['Doctor Note.pdf', 'Maternity Form.pdf'],
      priority: 'low'
    },
    {
      id: '6',
      teacherName: 'David Miller',
      teacherId: 'T2023006',
      teacherEmail: 'd.miller@school.edu',
      teacherPhone: '+1 555-6789',
      department: 'Physical Education',
      leaveType: 'Sick Leave',
      startDate: '2023-11-25',
      endDate: '2023-11-27',
      duration: 3,
      reason: 'Seasonal flu',
      status: 'pending',
      submittedDate: '2023-11-24',
      emergencyContact: 'Clinic (555-9012)',
      documents: ['Doctor Note.pdf'],
      priority: 'high'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Leave; direction: 'ascending' | 'descending' } | null>(null);
  const [expandedLeave, setExpandedLeave] = useState<string | null>(null);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [selectedSubstitute, setSelectedSubstitute] = useState<string>('');

  // Available filters
  const departments = ['Mathematics', 'Science', 'English', 'History', 'Art', 'Physical Education'];
  // const statusOptions = ['pending', 'approved', 'rejected', 'cancelled'];
  const priorityOptions = ['low', 'medium', 'high'];
  const substituteTeachers = [
    'Sarah Johnson',
    'Michael Brown',
    'Emily Davis',
    'Robert Wilson',
    'Jennifer Lee',
    'David Miller'
  ];

  // Handle sorting
  const handleSort = (key: keyof Leave) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Get sorted leaves
  const getSortedLeaves = () => {
    if (!sortConfig) return leaves;

    return [...leaves].sort((a, b) => {
      const { key, direction } = sortConfig;
      const aValue = a[key];
      const bValue = b[key];

      // Handle undefined or null values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return direction === 'ascending' ? -1 : 1;
      if (bValue == null) return direction === 'ascending' ? 1 : -1;

      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        // String comparison (case-insensitive)
        return direction === 'ascending'
          ? aValue.localeCompare(bValue, undefined, { sensitivity: 'base' })
          : bValue.localeCompare(aValue, undefined, { sensitivity: 'base' });
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        // Number comparison
        return direction === 'ascending' ? aValue - bValue : bValue - aValue;
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        // Date comparison
        return direction === 'ascending'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      // Fallback for mixed types or other cases
      if (aValue < bValue) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'ascending' ? 1 : -1;
      }

      return 0;
    });
  };

  // Filter leaves based on search term and filters
  const filteredLeaves = getSortedLeaves().filter(leave => {
    const matchesSearch = leave.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || leave.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || leave.department === departmentFilter;
    const matchesPriority = priorityFilter === 'all' || leave.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesDepartment && matchesPriority;
  });

  // Approve a leave application
  const approveLeave = (id: string) => {
    if (!reviewComment.trim()) {
      alert('Please add a comment before approving.');
      return;
    }

    setLeaves(leaves.map(leave =>
      leave.id === id ? {
        ...leave,
        status: 'approved',
        reviewedBy: 'Administrator',
        reviewDate: new Date().toISOString().split('T')[0],
        comments: reviewComment,
        substituteTeacher: selectedSubstitute || leave.substituteTeacher
      } : leave
    ));

    setReviewComment('');
    setSelectedSubstitute('');
    alert('Leave application approved successfully!');
  };

  // Reject a leave application
  const rejectLeave = (id: string) => {
    if (!reviewComment.trim()) {
      alert('Please add a comment before rejecting.');
      return;
    }

    setLeaves(leaves.map(leave =>
      leave.id === id ? {
        ...leave,
        status: 'rejected',
        reviewedBy: 'Administrator',
        reviewDate: new Date().toISOString().split('T')[0],
        comments: reviewComment
      } : leave
    ));

    setReviewComment('');
    alert('Leave application rejected.');
  };

  // Get status badge style and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          style: 'bg-green-100 text-green-800',
          icon: <FaCheckCircle className="text-green-500" />,
          label: 'Approved'
        };
      case 'pending':
        return {
          style: 'bg-yellow-100 text-yellow-800',
          icon: <FaClock className="text-yellow-500" />,
          label: 'Pending'
        };
      case 'rejected':
        return {
          style: 'bg-red-100 text-red-800',
          icon: <FaTimesCircle className="text-red-500" />,
          label: 'Rejected'
        };
      case 'cancelled':
        return {
          style: 'bg-gray-100 text-gray-800',
          icon: <FaTimesCircle className="text-gray-500" />,
          label: 'Cancelled'
        };
      default:
        return {
          style: 'bg-gray-100 text-gray-800',
          icon: <FaClock className="text-gray-500" />,
          label: 'Unknown'
        };
    }
  };

  // Get priority badge style
  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          style: 'bg-red-100 text-red-800',
          icon: <FaExclamationTriangle className="text-red-500" />,
          label: 'High'
        };
      case 'medium':
        return {
          style: 'bg-yellow-100 text-yellow-800',
          icon: <FaExclamationTriangle className="text-yellow-500" />,
          label: 'Medium'
        };
      case 'low':
        return {
          style: 'bg-green-100 text-green-800',
          icon: <FaExclamationTriangle className="text-green-500" />,
          label: 'Low'
        };
      default:
        return {
          style: 'bg-gray-100 text-gray-800',
          icon: <FaExclamationTriangle className="text-gray-500" />,
          label: 'Unknown'
        };
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if leave is upcoming
  const isUpcoming = (startDate: string) => {
    return new Date(startDate) > new Date();
  };

  // Check if leave is current
  const isCurrent = (startDate: string, endDate: string) => {
    const today = new Date();
    return new Date(startDate) <= today && new Date(endDate) >= today;
  };

  // Render sort icon
  const renderSortIcon = (key: keyof Leave) => {
    if (!sortConfig || sortConfig.key !== key) return <FaSort className="ml-1 opacity-50" />;
    if (sortConfig.direction === 'ascending') return <FaSortUp className="ml-1" />;
    return <FaSortDown className="ml-1" />;
  };

  // Toggle leave expansion
  const toggleLeaveExpansion = (leaveId: string) => {
    setExpandedLeave(expandedLeave === leaveId ? null : leaveId);
    setReviewComment('');
    setSelectedSubstitute('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
            <FaCheckCircle className="mr-3 text-indigo-600" />
            Leave Approval Management
          </h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
            Review and manage teacher leave applications
          </p>
        </div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search leaves..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center">
                <FaFilter className="text-gray-400 mr-2" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="all">All Priorities</option>
                {priorityOptions.map(priority => (
                  <option key={priority} value={priority}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</option>
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
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
            <div className="rounded-full bg-indigo-100 p-3 mr-4">
              <FaClock className="text-indigo-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Pending Approval</p>
              <p className="text-xl md:text-2xl font-bold">{leaves.filter(l => l.status === 'pending').length}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Approved</p>
              <p className="text-xl md:text-2xl font-bold">{leaves.filter(l => l.status === 'approved').length}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <FaTimesCircle className="text-red-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Rejected</p>
              <p className="text-xl md:text-2xl font-bold">{leaves.filter(l => l.status === 'rejected').length}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
            <div className="rounded-full bg-yellow-100 p-3 mr-4">
              <FaExclamationTriangle className="text-yellow-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">High Priority</p>
              <p className="text-xl md:text-2xl font-bold">{leaves.filter(l => l.priority === 'high').length}</p>
            </div>
          </div>
        </motion.div>

        {/* Leaves List */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 border-b border-gray-200 font-semibold text-gray-700 bg-gray-50">
            <div
              className="col-span-2 flex items-center cursor-pointer"
              onClick={() => handleSort('teacherName')}
            >
              Teacher {renderSortIcon('teacherName')}
            </div>
            <div
              className="col-span-2 flex items-center cursor-pointer"
              onClick={() => handleSort('department')}
            >
              Department {renderSortIcon('department')}
            </div>
            <div
              className="col-span-2 flex items-center cursor-pointer"
              onClick={() => handleSort('leaveType')}
            >
              Leave Type {renderSortIcon('leaveType')}
            </div>
            <div
              className="col-span-2 flex items-center cursor-pointer"
              onClick={() => handleSort('startDate')}
            >
              Dates {renderSortIcon('startDate')}
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

          {/* Leave Items */}
          {filteredLeaves.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No leave applications found. Try adjusting your search or filters.
            </div>
          ) : (
            filteredLeaves.map((leave) => {
              const statusInfo = getStatusInfo(leave.status);
              const priorityInfo = getPriorityInfo(leave.priority);
              const upcoming = isUpcoming(leave.startDate);
              const current = isCurrent(leave.startDate, leave.endDate);

              return (
                <div key={leave.id} className="border-b border-gray-100 last:border-b-0">
                  {/* Leave Summary */}
                  <div
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                    onClick={() => toggleLeaveExpansion(leave.id)}
                  >
                    <div className="md:col-span-2">
                      <div className="font-medium text-gray-900">{leave.teacherName}</div>
                      <div className="text-sm text-gray-500 mt-1">{leave.teacherId}</div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <FaEnvelope className="mr-1" />
                        <span className="truncate">{leave.teacherEmail}</span>
                      </div>
                    </div>

                    <div className="md:col-span-2 flex items-center">
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {leave.department}
                      </span>
                    </div>

                    <div className="md:col-span-2">
                      <div className="text-sm text-gray-700">{leave.leaveType}</div>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityInfo.style}`}>
                          {priorityInfo.icon}
                          <span className="ml-1">{priorityInfo.label}</span>
                        </span>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <div className="text-sm text-gray-500">
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          <span>{formatDate(leave.startDate)}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <span>to {formatDate(leave.endDate)}</span>
                          <span className="mx-2">•</span>
                          <span>{leave.duration} day(s)</span>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.style}`}>
                          {statusInfo.icon}
                          <span className="ml-1">{statusInfo.label}</span>
                        </span>
                      </div>
                      {current && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                          <FaClock className="mr-1" />
                          On Leave Now
                        </span>
                      )}
                      {upcoming && leave.status === 'approved' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                          Upcoming
                        </span>
                      )}
                    </div>

                    <div className="md:col-span-2 flex items-center justify-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                        title="View Details"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLeaveExpansion(leave.id);
                        }}
                      >
                        <FaEye />
                      </motion.button>

                      {leave.status === 'pending' && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              approveLeave(leave.id);
                            }}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-full"
                            title="Approve Leave"
                          >
                            <FaCheck />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              rejectLeave(leave.id);
                            }}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                            title="Reject Leave"
                          >
                            <FaTimes />
                          </motion.button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Expanded Leave Details */}
                  <AnimatePresence>
                    {expandedLeave === leave.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-50 p-4 border-t border-gray-200"
                      >
                        <h3 className="font-medium text-gray-800 mb-3">Leave Application Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Leave Information</h4>
                            <div className="text-sm text-gray-600 space-y-2">
                              <div><span className="font-medium">Teacher:</span> {leave.teacherName} ({leave.teacherId})</div>
                              <div><span className="font-medium">Department:</span> {leave.department}</div>
                              <div><span className="font-medium">Type:</span> {leave.leaveType}</div>
                              <div><span className="font-medium">Duration:</span> {leave.duration} day(s)</div>
                              <div><span className="font-medium">Period:</span> {formatDate(leave.startDate)} to {formatDate(leave.endDate)}</div>
                              <div><span className="font-medium">Submitted:</span> {formatDate(leave.submittedDate)}</div>
                              {leave.reviewDate && (
                                <div><span className="font-medium">Reviewed:</span> {formatDate(leave.reviewDate)} by {leave.reviewedBy}</div>
                              )}
                            </div>

                            <h4 className="font-medium text-gray-700 mt-4 mb-2">Contact Information</h4>
                            <div className="text-sm text-gray-600 space-y-2">
                              <div className="flex items-center">
                                <FaEnvelope className="mr-2 text-indigo-500" />
                                <span>{leave.teacherEmail}</span>
                              </div>
                              <div className="flex items-center">
                                <FaPhone className="mr-2 text-indigo-500" />
                                <span>{leave.teacherPhone}</span>
                              </div>
                              {leave.emergencyContact && (
                                <div><span className="font-medium">Emergency Contact:</span> {leave.emergencyContact}</div>
                              )}
                              {leave.substituteTeacher && (
                                <div><span className="font-medium">Substitute:</span> {leave.substituteTeacher}</div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Reason</h4>
                            <p className="text-sm text-gray-600 mb-4">{leave.reason}</p>

                            {leave.comments && (
                              <>
                                <h4 className="font-medium text-gray-700 mb-2">Admin Comments</h4>
                                <p className="text-sm text-gray-600 mb-4">{leave.comments}</p>
                              </>
                            )}

                            {leave.documents.length > 0 && (
                              <>
                                <h4 className="font-medium text-gray-700 mt-4 mb-2">Attached Documents</h4>
                                <ul className="text-sm text-gray-600">
                                  {leave.documents.map((doc, index) => (
                                    <li key={index} className="flex items-center mb-1">
                                      <FaFileDownload className="mr-2 text-indigo-500" />
                                      {doc}
                                    </li>
                                  ))}
                                </ul>
                              </>
                            )}

                            {leave.status === 'pending' && (
                              <>
                                <h4 className="font-medium text-gray-700 mt-4 mb-2">Review Actions</h4>
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Substitute Teacher (Optional)</label>
                                    <select
                                      value={selectedSubstitute}
                                      onChange={(e) => setSelectedSubstitute(e.target.value)}
                                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                      <option value="">Select a substitute teacher</option>
                                      {substituteTeachers.map(teacher => (
                                        <option key={teacher} value={teacher}>{teacher}</option>
                                      ))}
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Comments *</label>
                                    <textarea
                                      value={reviewComment}
                                      onChange={(e) => setReviewComment(e.target.value)}
                                      rows={3}
                                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                      placeholder="Add your comments here..."
                                      required
                                    />
                                  </div>

                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => approveLeave(leave.id)}
                                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                                    >
                                      <FaCheck className="mr-2" />
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => rejectLeave(leave.id)}
                                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                                    >
                                      <FaTimes className="mr-2" />
                                      Reject
                                    </button>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LeaveApprovalDone;