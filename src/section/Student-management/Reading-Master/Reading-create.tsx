import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiCheckCircle, BiPlus, BiEdit, BiArrowBack } from 'react-icons/bi';
import { BsTextParagraph } from 'react-icons/bs';
import PDFDropZone from '../../../components/common/pdfUploader';
import axios from 'axios'; // Assuming you use axios
import { toast } from 'sonner'; // For user feedback

interface ReadingFormData {
  title: string;
  description: string;
  fileUrls: string[];
}

const ReadingCreate: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<'details' | 'preview'>('details');
  const [formData, setFormData] = useState<ReadingFormData>({
    title: '',
    description: '',
    fileUrls: [],
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsUploading(true);
    setUploadProgress(50); // Indicate that something is happening

    try {
      // Replace with your actual API endpoint
      const response = await axios.post('/api/reading-materials', formData);

      if (response.status === 201) {
        setUploadProgress(100);
        toast.success('Reading material created successfully!');

        // Wait a moment to show the success message, then reset
        setTimeout(() => {
          setFormData({
            title: '',
            description: '',
            fileUrls: [],
          });
          setCurrentStep('details');
          setUploadProgress(0); // Reset progress for next time
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to create reading material:', error);
      toast.error('Failed to create reading material. Please try again.');
      setUploadProgress(0); // Reset progress on error
    } finally {
      // Set a timeout to ensure the final state of the progress bar is visible
      setTimeout(() => {
        setIsUploading(false);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 ">
      <div className="w-full md:max-w-screen mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">Create New Reading Material</h1>
            <p className="text-blue-100">{
              currentStep === 'details' 
                ? 'Fill in reading material details and upload PDFs' 
                : 'Review and submit your reading material'
            }</p>
            
            {/* Progress Steps */}
            <div className="flex items-center mt-6">
              <div className={`flex items-center ${currentStep === 'details' ? 'text-white' : 'text-blue-200'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'details' ? 'bg-blue-800' : 'bg-blue-500'}`}>
                  1
                </div>
                <span className="ml-2">Details</span>
              </div>
              <div className="h-1 w-12 mx-2 bg-blue-500"></div>
              <div className={`flex items-center ${currentStep === 'preview' ? 'text-white' : 'text-blue-200'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'preview' ? 'bg-blue-800' : 'bg-blue-500'}`}>
                  2
                </div>
                <span className="ml-2">Submit</span>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {currentStep === 'details' ? (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form className="space-y-6">
                    {/* Title Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reading Material Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter reading material title"
                        required
                      />
                    </div>

                    {/* Description Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Describe your reading material..."
                        required
                      />
                    </div>

                    {/* File Upload Area */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload PDFs *
                      </label>
                      <PDFDropZone
                        value={formData.fileUrls}
                        onChange={(urls) => setFormData(prev => ({ ...prev, fileUrls: urls as string[] }))}
                        maxFiles={5}
                        multiple={true}
                        height="200px"
                      />
                    </div>

                    {/* Continue Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setCurrentStep('preview')}
                      disabled={!formData.title || !formData.description || formData.fileUrls.length === 0}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <span>Continue to Preview</span>
                      <BiArrowBack className="w-5 h-5 rotate-180" />
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Preview Header */}
                  <div className="flex justify-between items-center pb-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Reading Material Preview</h2>
                    <button
                      onClick={() => setCurrentStep('details')}
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <BiEdit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </div>

                  {/* Reading Material Details Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{formData.title}</h3>
                      <p className="text-gray-600 flex items-start">
                        <BsTextParagraph className="w-5 h-5 mr-2 mt-1 flex-shrink-0 text-blue-500" />
                        <span>{formData.description}</span>
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Files:</span>
                          <span className="font-medium">{formData.fileUrls.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Files Preview */}
                  {formData.fileUrls.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Uploaded PDFs</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.fileUrls.map((url, index) => (
                          <motion.div
                            key={`preview-${url}-${index}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center p-3 bg-gray-50 rounded-lg overflow-hidden"
                          >
                            <div className="flex-1 min-w-0">
                              <a 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-sm font-medium text-blue-600 hover:underline truncate">
                                {url.split('/').pop()}
                              </a>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={isUploading}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Uploading... {uploadProgress}%</span>
                      </>
                    ) : (
                      <>
                        <BiPlus className="w-5 h-5" />
                        <span>Publish Reading Material</span>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Message */}
            <AnimatePresence>
              {uploadProgress === 100 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3"
                >
                  <BiCheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Upload Successful!</p>
                    <p className="text-sm text-green-600">Your reading material has been published successfully.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReadingCreate;