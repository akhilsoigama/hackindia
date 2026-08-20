import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUpload, 
  FaFileAlt, 
  FaCalendarAlt, 
  FaCheckCircle,
  FaArrowLeft,
  FaPaperclip,
  FaTimes,
  FaCloudUploadAlt
} from 'react-icons/fa';

// Types
interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  dueTime: string;
  description: string;
  status: 'pending' | 'submitted' | 'late';
  instructions: string;
  maxPoints: number;
}

interface FileWithPreview {
  file: File;
  preview: string;
  id: string;
}

const AssignmentUploadCreate = () => {
  const [activeTab, setActiveTab] = useState<'details' | 'upload'>('details');
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [comments, setComments] = useState('');

  // Sample assignment data
  const assignment: Assignment = {
    id: 'assign-2023-101',
    title: 'Algebra Homework #5',
    course: 'Mathematics 101',
    dueDate: '2023-12-15',
    dueTime: '23:59',
    description: 'Complete problems 1-25 from Chapter 5. Show all your work for full credit.',
    status: 'pending',
    instructions: 'Submit your work as a PDF document. Make sure your name and student ID are on the first page.',
    maxPoints: 100
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));
    
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  // Remove a file
  const handleRemoveFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== id));
  };

  // Simulate upload process
  const handleUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsSubmitted(true);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  // Format due date
  const formatDueDate = (dateString: string, timeString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return `${date.toLocaleDateString('en-US', options)} at ${timeString}`;
  };

  // Reset and go back to details
  const handleReset = () => {
    setSelectedFiles([]);
    setUploadProgress(0);
    setIsUploading(false);
    setIsSubmitted(false);
    setComments('');
    setActiveTab('details');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
            <FaFileAlt className="mr-3 text-indigo-600" />
            Assignment Submission
          </h1>
          <p className="text-gray-600 mt-2">Submit your work for grading</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-3 px-6 font-medium text-sm flex items-center ${activeTab === 'details' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('details')}
          >
            <FaFileAlt className="mr-2" />
            Assignment Details
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm flex items-center ${activeTab === 'upload' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('upload')}
            disabled={isSubmitted}
          >
            <FaUpload className="mr-2" />
            Upload Submission
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'details' ? (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6 mb-6"
            >
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{assignment.title}</h2>
                  <p className="text-indigo-600 font-medium">{assignment.course}</p>
                </div>

                <div className="flex items-center text-gray-600">
                  <FaCalendarAlt className="mr-2 text-indigo-500" />
                  <span>Due: {formatDueDate(assignment.dueDate, assignment.dueTime)}</span>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600">{assignment.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Instructions</h3>
                  <p className="text-gray-600">{assignment.instructions}</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Grading Information</h3>
                  <p className="text-blue-600">Maximum points: {assignment.maxPoints}</p>
                  <p className="text-blue-600 mt-1">Accepted file types: PDF, DOC, DOCX, ZIP</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('upload')}
                  disabled={isSubmitted}
                  className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center ${
                    isSubmitted ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  <FaUpload className="mr-2" />
                  {isSubmitted ? 'Assignment Submitted' : 'Proceed to Upload'}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6 mb-6"
            >
              {!isSubmitted ? (
                <div className="space-y-6">
                  <button
                    onClick={() => setActiveTab('details')}
                    className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-4"
                  >
                    <FaArrowLeft className="mr-2" />
                    Back to Assignment Details
                  </button>

                  <h2 className="text-2xl font-bold text-gray-800">Upload Your Submission</h2>

                  {/* File Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600">
                        <span className="font-medium text-indigo-600">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        PDF, DOC, DOCX, ZIP up to 10MB each
                      </p>
                    </label>
                  </div>

                  {/* Selected Files */}
                  {selectedFiles.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Selected Files</h3>
                      <div className="space-y-3">
                        {selectedFiles.map((file) => (
                          <motion.div
                            key={file.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                          >
                            <div className="flex items-center">
                              <FaPaperclip className="text-gray-400 mr-3" />
                              <div>
                                <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                                  {file.file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(file.file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveFile(file.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTimes />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Comments */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comments (Optional)
                    </label>
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      rows={3}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Add any comments about your submission..."
                    />
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Uploading files...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <motion.div 
                          className="bg-indigo-600 h-2.5 rounded-full"
                          initial={{ width: '0%' }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3 }}
                        ></motion.div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUpload}
                    disabled={selectedFiles.length === 0 || isUploading}
                    className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center ${
                      selectedFiles.length === 0 || isUploading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FaUpload className="mr-2" />
                        Submit Assignment
                      </>
                    )}
                  </motion.button>
                </div>
              ) : (
                /* Success Message */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="flex justify-center mb-6"
                  >
                    <div className="bg-green-100 p-4 rounded-full">
                      <FaCheckCircle className="h-16 w-16 text-green-600" />
                    </div>
                  </motion.div>
                  
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Assignment Submitted Successfully!</h2>
                  <p className="text-gray-600 mb-6">
                    Your assignment has been uploaded and submitted for grading.
                  </p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                    <h3 className="font-medium text-gray-800 mb-2">Submission Details</h3>
                    <p className="text-gray-600">
                      <span className="font-medium">Assignment:</span> {assignment.title}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Submitted Files:</span> {selectedFiles.length} file(s)
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Submission Time:</span>{' '}
                      {new Date().toLocaleString()}
                    </p>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReset}
                    className="py-2 px-6 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                  >
                    Submit Another Assignment
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AssignmentUploadCreate;