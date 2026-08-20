import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FaSave,
  FaPlus,
  FaTrash,
  FaClock,
  FaChalkboardTeacher,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import RHFFormField from '../../../components/hook-form/RHFFormFiled';
import RHFDropDown from '../../../components/hook-form/RHFDropDown';
import RHFCheckbox from '../../../components/hook-form/RHFCheckbox';
import RHFOption from '../../../components/hook-form/RHFOption';

// Zod schema for validation
const quizSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  gradeLevel: z.string().min(1, 'Grade level is required'),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  instructions: z.string().optional(),
  questions: z.array(z.object({
    id: z.number(),
    type: z.enum(['multiple-choice', 'true-false', 'short-answer', 'essay']),
    question: z.string().min(1, 'Question text is required'),
    options: z.array(z.string()),
    correctAnswer: z.number(),
    points: z.number().min(0, 'Points must be non-negative'),
    explanation: z.string().optional()
  })).min(1, 'At least one question is required'),
  shuffleQuestions: z.boolean(),
  shuffleOptions: z.boolean(),
  showResults: z.enum(['after-submission', 'after-deadline', 'manual']),
  attempts: z.number().min(1, 'At least 1 attempt is required'),
  dueDate: z.string().optional(),
  availableFrom: z.string().optional(),
  availableTo: z.string().optional()
});

type QuizFormData = z.infer<typeof quizSchema>;

const QuizCreate = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [activeQuestion, setActiveQuestion] = useState(0);

  // Sample data
  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Art', 'Physical Education'];
  const gradeLevels = ['Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
    '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'];
  const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'true-false', label: 'True/False' },
    { value: 'short-answer', label: 'Short Answer' },
    { value: 'essay', label: 'Essay' }
  ];
  const resultOptions = [
    { value: 'after-submission', label: 'Immediately after submission' },
    { value: 'after-deadline', label: 'After the deadline' },
    { value: 'manual', label: 'Manually by teacher' }
  ];

  const formMethods = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      subject: '',
      gradeLevel: '',
      duration: 30,
      instructions: '',
      questions: [
        {
          id: 1,
          type: 'multiple-choice',
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          points: 1,
          explanation: ''
        }
      ],
      shuffleQuestions: false,
      shuffleOptions: false,
      showResults: 'after-submission',
      attempts: 1,
      dueDate: '',
      availableFrom: '',
      availableTo: ''
    }
  });

  const { handleSubmit, watch, setValue } = formMethods;
  const formData = watch();

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = {
      ...newQuestions[index],
      [field]: value
    };
    setValue('questions', newQuestions);
  };

  const addQuestion = () => {
    // const newQuestions = [
    //   ...formData.questions,
    //   {
    //     id: formData.questions.length + 1,
    //     type: 'multiple-choice',
    //     question: '',
    //     options: ['', '', '', ''],
    //     correctAnswer: 0,
    //     points: 1,
    //     explanation: ''
    //   }
    // ];
    // setValue('questions', newQuestions);
    setActiveQuestion(formData.questions.length);
  };

  const deleteQuestion = (index: number) => {
    if (formData.questions.length > 1) {
      const newQuestions = formData.questions.filter((_, i) => i !== index);
      setValue('questions', newQuestions);
      setActiveQuestion(Math.max(0, index - 1));
    }
  };

  const deleteOption = (qIndex: number, oIndex: number) => {
    if (formData.questions[qIndex].options.length > 2) {
      const newQuestions = [...formData.questions];
      const newOptions = [...newQuestions[qIndex].options];
      newOptions.splice(oIndex, 1);

      // Adjust correct answer if needed
      let correctAnswer = newQuestions[qIndex].correctAnswer;
      if (oIndex === correctAnswer) {
        correctAnswer = 0;
      } else if (oIndex < correctAnswer) {
        correctAnswer -= 1;
      }

      newQuestions[qIndex] = {
        ...newQuestions[qIndex],
        options: newOptions,
        correctAnswer
      };
      setValue('questions', newQuestions);
    }
  };

  const addOption = (qIndex: number) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex] = {
      ...newQuestions[qIndex],
      options: [...newQuestions[qIndex].options, '']
    };
    setValue('questions', newQuestions);
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) ||
      (direction === 'down' && index === formData.questions.length - 1)) {
      return;
    }

    const newQuestions = [...formData.questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];

    setValue('questions', newQuestions);
    setActiveQuestion(direction === 'up' ? index - 1 : index + 1);
  };

  const onSubmit = (data: QuizFormData) => {
    alert('Quiz created successfully!');
    console.log(data);
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const calculateTotalPoints = () => {
    return formData.questions.reduce((total, question) => total + question.points, 0);
  };
  const handleCorrectChange = (qIndex: number, oIndex: number) => {
    setValue(`questions.${qIndex}.correctAnswer`, oIndex);
  };
  return (
    <FormProvider {...formMethods}>
      <div className="min-h-screen bg-blue-300/5 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
              <FaChalkboardTeacher className="mr-3 text-indigo-600" />
              Create New Quiz
            </h1>
            <p className="text-gray-600 mt-2">Create assessments to evaluate student understanding</p>
          </motion.div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {[1, 2, 3].map(step => (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= step ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                    {step}
                  </div>
                  <span className="text-sm mt-2 text-gray-600">
                    {step === 1 && 'Basic Info'}
                    {step === 2 && 'Questions'}
                    {step === 3 && 'Settings'}
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

          <form onSubmit={handleSubmit(onSubmit)}>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6 mb-6"
            >
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Quiz Information</h2>

                  <RHFFormField
                    name="title"
                    label="Quiz Title"
                    type="text"
                    placeholder="Enter quiz title"
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <RHFDropDown
                      name="subject"
                      label="Subject"
                      options={subjects.map(s => ({ value: s, label: s }))}
                      placeholder="Select a subject"
                      required
                    />

                    <RHFDropDown
                      name="gradeLevel"
                      label="Grade Level"
                      options={gradeLevels.map(l => ({ value: l, label: l }))}
                      placeholder="Select grade level"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <RHFFormField
                      name="duration"
                      label="Time Limit (minutes)"
                      type="number"
                      min={1}
                      icon={<FaClock className="text-indigo-500" />}
                    />

                    <RHFFormField
                      name="attempts"
                      label="Attempts Allowed"
                      type="number"
                      min={1}
                      max={10}
                    />
                  </div>

                  <RHFFormField
                    name="instructions"
                    label="Instructions"
                    type="text"
                    placeholder="Provide instructions for students taking this quiz"
                  />
                </div>
              )}

              {/* Step 2: Questions */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold text-gray-800">Quiz Questions</h2>
                    <div className="text-sm text-gray-600">
                      Total Points: <span className="font-bold">{calculateTotalPoints()}</span>
                    </div>
                  </div>

                  {/* Question Navigation */}
                  <div className="flex overflow-x-auto pb-2">
                    {formData.questions.map((q, index) => (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setActiveQuestion(index)}
                        className={`flex-shrink-0 px-4 py-2 mr-2 rounded-lg ${activeQuestion === index
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                          }`}
                      >
                        Q{index + 1}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="flex-shrink-0 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                    >
                      <FaPlus className="mr-1" />
                      Add Question
                    </button>
                  </div>

                  {/* Active Question */}
                  {formData.questions.map((question, qIndex) => (
                    <div key={question.id} className={`${activeQuestion === qIndex ? 'block' : 'hidden'}`}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-800">Question {qIndex + 1}</h3>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => moveQuestion(qIndex, 'up')}
                            disabled={qIndex === 0}
                            className={`p-2 rounded ${qIndex === 0 ? 'text-gray-400' : 'text-gray-600 hover:bg-gray-100'}`}
                            title="Move up"
                          >
                            <FaArrowUp />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveQuestion(qIndex, 'down')}
                            disabled={qIndex === formData.questions.length - 1}
                            className={`p-2 rounded ${qIndex === formData.questions.length - 1 ? 'text-gray-400' : 'text-gray-600 hover:bg-gray-100'}`}
                            title="Move down"
                          >
                            <FaArrowDown />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteQuestion(qIndex)}
                            disabled={formData.questions.length === 1}
                            className={`p-2 rounded ${formData.questions.length === 1 ? 'text-gray-400' : 'text-red-600 hover:bg-red-100'}`}
                            title="Delete question"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="md:col-span-3">
                          <RHFFormField
                            name={`questions.${qIndex}.question`}
                            label="Question Text"
                            type="text"
                            placeholder="Enter your question"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                          <RHFDropDown
                            name={`questions.${qIndex}.type`}
                            label=""
                            options={questionTypes}/>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <RHFFormField
                            name={`questions.${qIndex}.points`}
                            label="Points"
                            type="number"
                            min="0"
                          />
                        </div>
                      </div>

                      {/* Options for multiple choice and true/false */}
                      {(question.type === 'multiple-choice' || question.type === 'true-false') && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>

                          {question.type === 'true-false' ? (
                            <div className="space-y-2">
                              {['True', 'False'].map((option, oIndex) => (
                                <div key={oIndex} className="flex items-center p-3 border rounded-lg">
                                  <input
                                    type="radio"
                                    name={`question-${qIndex}`}
                                    checked={question.correctAnswer === oIndex}
                                    onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <span className="ml-3 text-gray-700">{option}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {question.options.map((_, oIndex) => (
                                <RHFOption
                                  key={oIndex}
                                  qIndex={qIndex}
                                  oIndex={oIndex}
                                  onDelete={deleteOption}
                                  onCorrectChange={handleCorrectChange} // Use the new handler
                                  isCorrect={question.correctAnswer === oIndex}
                                  canDelete={question.options.length > 2}
                                />
                              ))}

                              <button
                                type="button"
                                onClick={() => addOption(qIndex)}
                                className="mt-2 text-indigo-600 hover:text-indigo-800 flex items-center"
                              >
                                <FaPlus className="mr-1" />
                                Add Option
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <div>
                        <RHFFormField
                          name={`questions.${qIndex}.explanation`}
                          label="Explanation (optional)"
                          type="text"
                          placeholder="Explain why the correct answer is right"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 3: Settings */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Quiz Settings</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-800 mb-3">Availability</h3>

                      <RHFFormField
                        name="availableFrom"
                        label="Available From"
                        type="datetime-local"
                      />

                      <RHFFormField
                        name="dueDate"
                        label="Available To (Due Date)"
                        type="datetime-local"
                      />

                      <RHFDropDown
                        name="showResults"
                        label="Show Results"
                        options={resultOptions}
                      />
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-800 mb-3">Quiz Behavior</h3>

                      <RHFCheckbox
                        name="shuffleQuestions"
                        label="Shuffle questions"
                      />

                      <RHFCheckbox
                        name="shuffleOptions"
                        label="Shuffle answer options"
                      />

                      <div className="bg-gray-50 p-4 rounded-lg mt-6">
                        <h4 className="font-medium text-gray-800 mb-2">Quiz Summary</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Questions:</span>
                            <span className="font-medium">{formData.questions.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Points:</span>
                            <span className="font-medium">{calculateTotalPoints()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Time Limit:</span>
                            <span className="font-medium">{formData.duration} minutes</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Attempts Allowed:</span>
                            <span className="font-medium">{formData.attempts}</span>
                          </div>
                        </div>
                      </div>
                    </div>
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
                className={`px-6 py-2 rounded-lg ${currentStep === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Previous
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
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
                  <FaSave className="mr-2" />
                  Create Quiz
                </motion.button>
              )}
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
};

export default QuizCreate;