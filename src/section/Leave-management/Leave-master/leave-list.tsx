import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaClock,
  FaPlus,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaHistory,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFileDownload,
} from 'react-icons/fa';

// Define the Leave interface
interface Leave {
  id: string;
  teacherName: string;
  teacherId: string;
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
  contactNumber: string;
  emergencyContact?: string;
  documents: string[];
}

const LeaveList = () => {
  // Sample leave data
  const [leaves, setLeaves] = useState<Leave[]>([
    {
      id: '1',
      teacherName: 'Sarah Johnson',
      teacherId: 'T2023001',
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
      contactNumber: '+1 555-1234',
      emergencyContact: 'Dr. Smith (555-5678)',
      documents: ['Medical Certificate.pdf']
    },
    {
      id: '2',
      teacherName: 'Sarah Johnson',
      teacherId: 'T2023001',
      leaveType: 'Personal Leave',
      startDate: '2023-12-05',
      endDate: '2023-12-05',
      duration: 1,
      reason: 'Family event',
      status: 'pending',
      submittedDate: '2023-11-25',
      contactNumber: '+1 555-2345',
      emergencyContact: 'Spouse (555-6789)',
      documents: []
    },
    {
      id: '3',
      teacherName: 'Sarah Johnson',
      teacherId: 'T2023001',
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
      contactNumber: '+1 555-3456',
      documents: ['Conference Invitation.pdf']
    },
  ]);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Leave; direction: 'ascending' | 'descending' } | null>(null);
  const [expandedLeave, setExpandedLeave] = useState<string | null>(null);

  const leaveTypes = ['Sick Leave', 'Personal Leave', 'Emergency Leave', 'Professional Development', 'Maternity Leave', 'Paternity Leave', 'Other'];


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
    const matchesType = typeFilter === 'all' || leave.leaveType === typeFilter;
    
    // Date filtering
    let matchesDate = true;
    const today = new Date();
    const startDate = new Date(leave.startDate);
    
    if (dateFilter !== 'all') {
      switch (dateFilter) {
        case 'today':
          matchesDate = startDate.toDateString() === today.toDateString();
          break;
        case 'thisWeek':
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(today);
          weekEnd.setDate(today.getDate() + (6 - today.getDay()));
          matchesDate = startDate >= weekStart && startDate <= weekEnd;
          break;
        case 'thisMonth':
          matchesDate = startDate.getMonth() === today.getMonth() && 
                       startDate.getFullYear() === today.getFullYear();
          break;
        case 'upcoming':
          matchesDate = startDate > today;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  // Delete a leave application
  const deleteLeave = (id: string) => {
    if (window.confirm('Are you sure you want to delete this leave application?')) {
      setLeaves(leaves.filter(leave => leave.id !== id));
    }
  };

  // Cancel a leave application
  const cancelLeave = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this leave application?')) {
      setLeaves(leaves.map(leave => 
        leave.id === id ? { ...leave, status: 'cancelled' } : leave
      ));
    }
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
          icon: <FaExclamationCircle className="text-yellow-500" />,
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
          icon: <FaExclamationCircle className="text-gray-500" />,
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
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
            <FaHistory className="mr-3 text-indigo-600" />
            Leave Management
          </h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
            View and manage your leave applications
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
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="all">All Types</option>
                {leaveTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="thisWeek">This Week</option>
                <option value="thisMonth">This Month</option>
                <option value="upcoming">Upcoming</option>
              </select>

              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center">
                <FaPlus className="mr-2" />
                New Application
              </button>
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
              <FaHistory className="text-indigo-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Leaves</p>
              <p className="text-xl md:text-2xl font-bold">{leaves.length}</p>
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
            <div className="rounded-full bg-yellow-100 p-3 mr-4">
              <FaExclamationCircle className="text-yellow-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-xl md:text-2xl font-bold">{leaves.filter(l => l.status === 'pending').length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <FaClock className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Upcoming</p>
              <p className="text-xl md:text-2xl font-bold">{leaves.filter(l => isUpcoming(l.startDate)).length}</p>
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
              className="col-span-3 flex items-center cursor-pointer"
              onClick={() => handleSort('teacherName')}
            >
              Teacher {renderSortIcon('teacherName')}
            </div>
            <div 
              className="col-span-2 flex items-center cursor-pointer"
              onClick={() => handleSort('leaveType')}
            >
              Type {renderSortIcon('leaveType')}
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
            <div className="col-span-3 text-center">
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
              const upcoming = isUpcoming(leave.startDate);
              const current = isCurrent(leave.startDate, leave.endDate);
              
              return (
                <div key={leave.id} className="border-b border-gray-100 last:border-b-0">
                  {/* Leave Summary */}
                  <div 
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                    onClick={() => toggleLeaveExpansion(leave.id)}
                  >
                    <div className="md:col-span-3">
                      <div className="font-medium text-gray-900">{leave.teacherName}</div>
                      <div className="text-sm text-gray-500 mt-1">ID: {leave.teacherId}</div>
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
                    
                    <div className="md:col-span-2 flex items-center">
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {leave.leaveType}
                      </span>
                    </div>
                    
                    <div className="md:col-span-2 flex items-center">
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
                      <div className="text-sm text-gray-500 mt-1">
                        Submitted: {formatDate(leave.submittedDate)}
                      </div>
                    </div>
                    
                    <div className="md:col-span-3 flex items-center justify-center space-x-2">
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
                            className="p-2 text-green-600 hover:bg-green-100 rounded-full"
                            title="Edit Application"
                          >
                            <FaEdit />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelLeave(leave.id);
                            }}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                            title="Cancel Application"
                          >
                            <FaTimesCircle />
                          </motion.button>
                        </>
                      )}
                      
                      {(leave.status === 'approved' && upcoming) && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            cancelLeave(leave.id);
                          }}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                          title="Cancel Leave"
                        >
                          <FaTimesCircle />
                        </motion.button>
                      )}
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-purple-600 hover:bg-purple-100 rounded-full"
                        title="Download"
                      >
                        <FaFileDownload />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteLeave(leave.id);
                        }}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                        title="Delete Application"
                      >
                        <FaTrash />
                      </motion.button>
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
                              <div><span className="font-medium">Type:</span> {leave.leaveType}</div>
                              <div><span className="font-medium">Duration:</span> {leave.duration} day(s)</div>
                              <div><span className="font-medium">Period:</span> {formatDate(leave.startDate)} to {formatDate(leave.endDate)}</div>
                              <div><span className="font-medium">Submitted:</span> {formatDate(leave.submittedDate)}</div>
                              {leave.reviewDate && (
                                <div><span className="font-medium">Reviewed:</span> {formatDate(leave.reviewDate)}</div>
                              )}
                            </div>
                            
                            <h4 className="font-medium text-gray-700 mt-4 mb-2">Contact Information</h4>
                            <div className="text-sm text-gray-600 space-y-2">
                              <div><span className="font-medium">Contact:</span> {leave.contactNumber}</div>
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
                                <div className="text-xs text-gray-500">— {leave.reviewedBy}</div>
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

export default LeaveList;