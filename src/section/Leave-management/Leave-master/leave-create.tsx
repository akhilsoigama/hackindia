import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaPaperPlane, 
  FaCalendarAlt, 
  FaClock, 
  FaFileAlt, 
  FaArrowLeft,
  FaPlus,
  FaTimes
} from 'react-icons/fa';

const LeaveCreate = () => {
  const [formData, setFormData] = useState({
    leaveType: 'sick',
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '17:00',
    reason: '',
    substituteTeacher: '',
    contactNumber: '',
    emergencyContact: '',
    documents: [] as string[],
    isHalfDay: false,
    halfDayType: 'first-half'
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [newDocument, setNewDocument] = useState('');

  // Sample data
  const leaveTypes = [
    { value: 'sick', label: 'Sick Leave' },
    { value: 'casual', label: 'Casual Leave' },
    { value: 'emergency', label: 'Emergency Leave' },
    { value: 'personal', label: 'Personal Leave' },
    { value: 'maternity', label: 'Maternity Leave' },
    { value: 'paternity', label: 'Paternity Leave' },
    { value: 'other', label: 'Other' }
  ];

  const substituteTeachers = [
    'Sarah Johnson',
    'Michael Brown',
    'Emily Davis',
    'Robert Wilson',
    'Jennifer Lee',
    'David Miller'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleAddDocument = () => {
    if (newDocument.trim()) {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, newDocument.trim()]
      }));
      setNewDocument('');
    }
  };

  const handleRemoveDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Leave application submitted:', formData);
    // Here you would typically send the data to your backend
    alert('Leave application submitted successfully!');
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Calculate number of days between dates
  const calculateLeaveDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
    
    return formData.isHalfDay ? diffDays * 0.5 : diffDays;
  };

  // Check if end date is before start date
  const isEndDateValid = () => {
    if (!formData.startDate || !formData.endDate) return true;
    return new Date(formData.endDate) >= new Date(formData.startDate);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
            <FaPaperPlane className="mr-3 text-indigo-600" />
            Apply for Leave
          </h1>
          <p className="text-gray-600 mt-2">Submit your leave application for approval</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3].map(step => (
              <div key={step} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                <span className="text-sm mt-2 text-gray-600">
                  {step === 1 && 'Leave Details'}
                  {step === 2 && 'Additional Info'}
                  {step === 3 && 'Review'}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <motion.div 
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-md p-6 mb-6"
          >
            {/* Step 1: Leave Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Leave Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type *</label>
                    <select
                      name="leaveType"
                      value={formData.leaveType}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {leaveTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center mt-6">
                    <input
                      type="checkbox"
                      id="isHalfDay"
                      name="isHalfDay"
                      checked={formData.isHalfDay}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                    />
                    <label htmlFor="isHalfDay" className="ml-2 text-sm text-gray-700">
                      Half Day Leave
                    </label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FaCalendarAlt className="mr-2 text-indigo-500" />
                      Start Date *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FaCalendarAlt className="mr-2 text-indigo-500" />
                      End Date *
                      {!isEndDateValid() && (
                        <span className="ml-2 text-red-500 text-xs">(Must be after start date)</span>
                      )}
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                      min={formData.startDate || new Date().toISOString().split('T')[0]}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                
                {formData.isHalfDay && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Half Day Type</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="halfDayType"
                          value="first-half"
                          checked={formData.halfDayType === 'first-half'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-gray-700">First Half (9 AM - 1 PM)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="halfDayType"
                          value="second-half"
                          checked={formData.halfDayType === 'second-half'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-gray-700">Second Half (1 PM - 5 PM)</span>
                      </label>
                    </div>
                  </div>
                )}
                
                {!formData.isHalfDay && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaClock className="mr-2 text-indigo-500" />
                        Start Time
                      </label>
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaClock className="mr-2 text-indigo-500" />
                        End Time
                      </label>
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Leave *</label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    rows={3}
                    required
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Please provide a detailed reason for your leave"
                  />
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Leave Summary</h3>
                  <div className="text-sm text-blue-600">
                    <div>Total Days: {calculateLeaveDays()} day(s)</div>
                    {formData.isHalfDay && (
                      <div>Half Day: {formData.halfDayType === 'first-half' ? 'First Half' : 'Second Half'}</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Additional Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Additional Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Substitute Teacher</label>
                  <select
                    name="substituteTeacher"
                    value={formData.substituteTeacher}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select a substitute teacher (optional)</option>
                    {substituteTeachers.map(teacher => (
                      <option key={teacher} value={teacher}>{teacher}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">If you have arranged for a substitute, please select them here</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Your contact number during leave"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Emergency contact person"
                    />
                  </div>
                </div>
                
                <div>
                  <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FaFileAlt className="mr-2 text-indigo-500" />
                    Supporting Documents (optional)
                  </label>
                  <div className="mb-2">
                    <div className="flex">
                      <input
                        type="text"
                        value={newDocument}
                        onChange={(e) => setNewDocument(e.target.value)}
                        placeholder="Document name or description"
                        className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddDocument}
                        className="bg-indigo-600 text-white px-3 rounded-r-lg hover:bg-indigo-700"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Add documents like medical certificates, etc.</p>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                        <span className="text-sm text-gray-700">{doc}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDocument(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Review Your Leave Application</h2>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3">Leave Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex mb-2">
                        <span className="w-32 font-medium text-gray-600">Leave Type:</span>
                        <span>{leaveTypes.find(t => t.value === formData.leaveType)?.label}</span>
                      </div>
                      <div className="flex mb-2">
                        <span className="w-32 font-medium text-gray-600">Duration:</span>
                        <span>
                          {formData.isHalfDay ? 'Half Day' : 'Full Day'} 
                          ({calculateLeaveDays()} day(s))
                        </span>
                      </div>
                      {formData.isHalfDay && (
                        <div className="flex mb-2">
                          <span className="w-32 font-medium text-gray-600">Half Day:</span>
                          <span>{formData.halfDayType === 'first-half' ? 'First Half' : 'Second Half'}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex mb-2">
                        <span className="w-32 font-medium text-gray-600">Start Date:</span>
                        <span>{formData.startDate || 'Not specified'}</span>
                      </div>
                      <div className="flex mb-2">
                        <span className="w-32 font-medium text-gray-600">End Date:</span>
                        <span>{formData.endDate || 'Not specified'}</span>
                      </div>
                      {!formData.isHalfDay && (
                        <div className="flex mb-2">
                          <span className="w-32 font-medium text-gray-600">Time:</span>
                          <span>{formData.startTime} - {formData.endTime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex mb-2">
                        <span className="w-32 font-medium text-gray-600">Substitute:</span>
                        <span>{formData.substituteTeacher || 'Not specified'}</span>
                      </div>
                      <div className="flex mb-2">
                        <span className="w-32 font-medium text-gray-600">Contact:</span>
                        <span>{formData.contactNumber || 'Not specified'}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex mb-2">
                        <span className="w-32 font-medium text-gray-600">Emergency Contact:</span>
                        <span>{formData.emergencyContact || 'Not specified'}</span>
                      </div>
                      <div className="flex mb-2">
                        <span className="w-32 font-medium text-gray-600">Documents:</span>
                        <span>{formData.documents.length} attached</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3">Reason for Leave</h3>
                  <p className="text-sm text-gray-600">{formData.reason || 'No reason provided'}</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg flex items-center ${currentStep === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              <FaArrowLeft className="mr-2" />
              Previous
            </button>
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!formData.startDate || !formData.endDate || !formData.reason || !isEndDateValid()}
                className={`px-6 py-2 rounded-lg flex items-center ${!formData.startDate || !formData.endDate || !formData.reason || !isEndDateValid() ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
              >
                Next
              </button>
            ) : (
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
              >
                <FaPaperPlane className="mr-2" />
                Submit Application
              </motion.button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveCreate;