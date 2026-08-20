import React, { useState } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus,
  FaTrash,
  FaQuestionCircle,
  FaStar,
  FaCalendarAlt,
  FaUserTie,
  FaBuilding,
  FaCheckCircle,
  FaTimes,
  FaCloudUploadAlt
} from 'react-icons/fa';
import RHFFormField from '../../../components/hook-form/RHFFormFiled';
import RHFDropDown from '../../../components/hook-form/RHFDropDown';
import RHFCheckbox from '../../../components/hook-form/RHFCheckbox';
import { toast } from 'sonner';


const surveySchema = z.object({
  title: z.string().min(1, 'Survey title is required'),
  description: z.string().min(1, 'Survey description is required'),
  department: z.string().min(1, 'Please select a department'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  isPublic: z.boolean(),
  allowAnonymous: z.boolean(),
  coverImage: z.any().optional(),
  questions: z.array(z.object({
    id: z.string(),
    type: z.enum(['text', 'multiple-choice', 'checkbox', 'rating', 'date', 'image']),
    question: z.string().min(1, 'Question text is required'),
    options: z.array(z.string()).optional(),
    required: z.boolean(),
    image: z.any().optional()
  })).min(1, 'At least one question is required')
});

type SurveyFormData = z.infer<typeof surveySchema>;

type QuestionType = 'text' | 'multiple-choice' | 'checkbox' | 'rating' | 'date' | 'image';

const GovtServeyCreate: React.FC = () => {
  const defaultValues = {
    title: '',
    description: '',
    department: '',
    startDate: '',
    endDate: '',
    isPublic: false,
    allowAnonymous: false,
    coverImage: '',
    questions: []
  };

  const methods = useForm({
    resolver: zodResolver(surveySchema),
    defaultValues
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, errors }
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions"
  });

  const [activeTab, setActiveTab] = useState<'details' | 'questions' | 'preview'>('details');
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    type: 'text' as QuestionType,
    question: '',
    required: false
  });

  const addQuestion = () => {
    if (newQuestion.question.trim() === '') return;

    const question = {
      ...newQuestion,
      id: Date.now().toString(),
      options: newQuestion.type === 'multiple-choice' || newQuestion.type === 'checkbox'
        ? ['Option 1', 'Option 2', 'Option 3']
        : undefined,
      image: newQuestion.type === 'image' ? '' : undefined
    };

    append(question);

    setNewQuestion({
      type: 'text',
      question: '',
      required: false
    });

    setShowQuestionModal(false);
  };

  const onSubmit = (data: SurveyFormData) => {
    setTimeout(() => {
      toast.success('Survey created successfully!');
      console.log(data);
      reset(defaultValues);
    }, 1500);
  };

  const handleReset = () => {
    reset(defaultValues);
  };

  const renderQuestionInput = (question: any) => {
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
            placeholder="Text response"
            disabled
          />
        );
      case 'multiple-choice':
        return (
          <div className="mt-2 space-y-2">
            {question.options?.map((option: string, index: number) => (
              <div key={index} className="flex items-center">
                <input type="radio" disabled className="mr-2" />
                <span className="text-gray-700">{option}</span>
              </div>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="mt-2 space-y-2">
            {question.options?.map((option: string, index: number) => (
              <div key={index} className="flex items-center">
                <input type="checkbox" disabled className="mr-2" />
                <span className="text-gray-700">{option}</span>
              </div>
            ))}
          </div>
        );
      case 'rating':
        return (
          <div className="flex mt-2 space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar key={star} className="text-yellow-400 text-xl" />
            ))}
          </div>
        );
      case 'date':
        return (
          <input
            type="date"
            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
            disabled
          />
        );
      case 'image':
        return (
          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
            <FaCloudUploadAlt className="text-gray-400 text-2xl mx-auto mb-2" />
            <p className="text-sm text-gray-500">Upload image</p>
          </div>
        );
      default:
        return null;
    }
  };

  const departmentOptions = [
    { value: '', label: 'Select Department', disabled: true },
    { value: 'health', label: 'Health Department' },
    { value: 'education', label: 'Education Department' },
    { value: 'transport', label: 'Transport Department' },
    { value: 'finance', label: 'Finance Department' },
    { value: 'environment', label: 'Environment Department' },
    { value: 'urban', label: 'Urban Development Department' },
  ];

  const questionTypeOptions = [
    { value: 'text', label: 'Text Input' },
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'checkbox', label: 'Checkboxes' },
    { value: 'rating', label: 'Rating' },
    { value: 'date', label: 'Date' },
    { value: 'image', label: 'Image Upload' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <FaBuilding className="text-2xl md:text-3xl text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Government Survey Creator</h1>
            </div>
            <div className="flex space-x-2 md:space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="flex items-center px-3 py-1 md:px-4 md:py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                <FaTimes className="mr-1 md:mr-2 text-sm md:text-base" />
                <span className="text-sm md:text-base">Reset</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="flex items-center px-3 py-1 md:px-4 md:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-75 transition-colors"
              >
                <FaCheckCircle className="mr-1 md:mr-2 text-sm md:text-base" />
                <span className="text-sm md:text-base">
                  {isSubmitting ? 'Publishing...' : 'Publish Survey'}
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 md:px-4 py-6 md:py-8">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-4 md:mb-6 overflow-x-auto">
              {(['details', 'questions', 'preview'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`px-3 py-2 font-medium capitalize whitespace-nowrap ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* Details Tab */}
              {activeTab === 'details' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-lg shadow-md p-4 md:p-6"
                >
                  <h2 className="text-lg md:text-xl font-semibold mb-4">Survey Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="md:col-span-2">
                      <RHFFormField
                        name="title"
                        label="Survey Title"
                        type="text"
                        placeholder="Enter survey title"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <RHFDropDown
                        name="department"
                        label="Government Department"
                        options={departmentOptions}
                        required
                      />
                    </div>

                    <div>
                      <RHFFormField
                        name="startDate"
                        label="Start Date"
                        type="date"
                        required
                      />
                    </div>

                    <div>
                      <RHFFormField
                        name="endDate"
                        label="End Date"
                        type="date"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      {/* <RHFDropzoneField value={field.value as string | undefined}
                        onChange={(url) => field.onChange(url)} /> */}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        {...methods.register('description')}
                        rows={4}
                        className="w-full p-2 md:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Describe the purpose of this survey"
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <RHFCheckbox
                        name="isPublic"
                        label="Make this survey public"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <RHFCheckbox
                        name="allowAnonymous"
                        label="Allow anonymous responses"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Questions Tab */}
              {activeTab === 'questions' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-lg shadow-md p-4 md:p-6"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 space-y-4 md:space-y-0">
                    <h2 className="text-lg md:text-xl font-semibold">Survey Questions</h2>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowQuestionModal(true)}
                      className="flex items-center px-3 py-1 md:px-4 md:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors"
                    >
                      <FaPlus className="mr-1 md:mr-2 text-sm md:text-base" />
                      <span className="text-sm md:text-base">Add Question</span>
                    </motion.button>
                  </div>

                  {fields.length === 0 ? (
                    <div className="text-center py-8 md:py-12 text-gray-500">
                      <FaQuestionCircle className="text-4xl md:text-5xl mx-auto mb-3 md:mb-4 opacity-50" />
                      <p className="text-sm md:text-base">No questions added yet. Click "Add Question" to get started.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 md:space-y-6">
                      {fields.map((field, index) => (
                        <motion.div
                          key={field.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border border-gray-200 rounded-lg p-3 md:p-4"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium flex items-center text-sm md:text-base">
                              <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs md:text-sm mr-2">
                                {index + 1}
                              </span>
                              {field.question}
                              {field.required && <span className="text-red-500 ml-1 md:ml-2">*</span>}
                            </h3>
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-500 hover:text-red-700 text-sm md:text-base transition-colors"
                            >
                              <FaTrash />
                            </button>
                          </div>
                          <div className="mt-2 md:mt-3">
                            {renderQuestionInput(field)}
                          </div>
                          <div className="mt-1 md:mt-2 text-xs text-gray-500 capitalize">
                            {field.type} {field.required && '(Required)'}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  {errors.questions && (
                    <p className="mt-4 text-sm text-red-600">{errors.questions.message}</p>
                  )}
                </motion.div>
              )}

              {/* Preview Tab */}
              {activeTab === 'preview' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-lg shadow-md p-4 md:p-6"
                >
                  <h2 className="text-lg md:text-xl font-semibold mb-4">Survey Preview</h2>

                  {fields.length === 0 ? (
                    <div className="text-center py-8 md:py-12 text-gray-500">
                      <p className="text-sm md:text-base">No questions to preview. Add questions in the Questions tab.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 md:space-y-6">
                      {/* Cover Image Preview */}
                      {methods.watch('coverImage') && (
                        <div className="mb-4 md:mb-6">
                          <img
                            src={methods.watch('coverImage')}
                            alt="Survey Cover"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}

                      <div className="bg-blue-50 p-4 md:p-6 rounded-lg mb-4 md:mb-6">
                        <h1 className="text-xl md:text-2xl font-bold text-blue-800 mb-2">
                          {methods.watch('title') || 'Survey Title'}
                        </h1>
                        <p className="text-gray-700 text-sm md:text-base">
                          {methods.watch('description') || 'Survey description will appear here.'}
                        </p>
                        <div className="flex items-center mt-3 text-xs md:text-sm text-gray-600">
                          <FaUserTie className="mr-1 md:mr-2" />
                          <span>{methods.watch('department') || 'Government Department'}</span>
                        </div>
                        <div className="flex items-center mt-1 md:mt-2 text-xs md:text-sm text-gray-600">
                          <FaCalendarAlt className="mr-1 md:mr-2" />
                          <span>
                            {methods.watch('startDate') || 'Start Date'} to {methods.watch('endDate') || 'End Date'}
                          </span>
                        </div>
                      </div>

                      {fields.map((field, index) => (
                        <div key={field.id} className="border border-gray-200 rounded-lg p-4 md:p-6">
                          <h3 className="font-medium mb-3 md:mb-4 flex items-center text-sm md:text-base">
                            <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 md:w-7 md:h-7 flex items-center justify-center text-xs md:text-sm mr-2">
                              {index + 1}
                            </span>
                            {field.question}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </h3>
                          <div className="mt-2 md:mt-3">
                            {renderQuestionInput(field)}
                          </div>
                        </div>
                      ))}

                      <div className="mt-4 md:mt-6">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-2 md:py-3 bg-blue-500 text-white rounded-md opacity-50 cursor-not-allowed font-medium"
                          disabled
                        >
                          Submit Survey
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add Question Modal */}
            <AnimatePresence>
              {showQuestionModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-gray-100/5 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-3 md:px-4 z-50"
                  onClick={() => setShowQuestionModal(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-lg shadow-xl p-4 md:p-6 w-full max-w-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Add New Question</h3>

                    <div className="mb-3 md:mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                      <select
                        value={newQuestion.type}
                        onChange={(e) => setNewQuestion({
                          ...newQuestion,
                          type: e.target.value as QuestionType // Cast to QuestionType
                        })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        {questionTypeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3 md:mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                      <input
                        type="text"
                        value={newQuestion.question}
                        onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Enter your question"
                      />
                    </div>

                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id="required"
                        checked={newQuestion.required}
                        onChange={(e) => setNewQuestion({ ...newQuestion, required: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="required" className="ml-2 block text-sm text-gray-900">
                        Required question
                      </label>
                    </div>

                    <div className="flex justify-end space-x-2 md:space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowQuestionModal(false)}
                        className="px-3 py-1 md:px-4 md:py-2 text-gray-700 hover:text-gray-900 text-sm md:text-base transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={addQuestion}
                        className="px-3 py-1 md:px-4 md:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 text-sm md:text-base transition-colors"
                      >
                        Add Question
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </FormProvider>
      </main>
    </div>
  );
};

export default GovtServeyCreate;