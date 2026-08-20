import  { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  FaSave,
  FaChalkboardTeacher,
  FaPlus,
  FaTimes,
} from 'react-icons/fa';
import RHFFormField from '../../../components/hook-form/RHFFormFiled';
import RHFDropDown from '../../../components/hook-form/RHFDropDown';
import RHFCheckbox from '../../../components/hook-form/RHFCheckbox';
// import RHFImageUpload from '../../../../components/hook-form/RHFImageUpload';


// Define Zod schema for validation
const assignmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  dueTime: z.string().optional(),
  points: z.number().min(0, 'Points cannot be negative'),
  assignmentType: z.string().min(1, 'Assignment type is required'),
  instructions: z.string().optional(),
  attachments:z.any(),
  assignedTo: z.enum(['all', 'specific']),
  specificStudents: z.array(z.string()).optional(),
  allowLateSubmission: z.boolean(),
  rubric: z.string().optional(),
});

// Infer TypeScript type from Zod schema
type AssignmentFormData = z.infer<typeof assignmentSchema>;

const AssignmentCreate = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [newStudent, setNewStudent] = useState('');

  // Sample data
  const subjects = [
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
    { value: 'english', label: 'English' },
    { value: 'history', label: 'History' },
    { value: 'art', label: 'Art' },
    { value: 'physical_education', label: 'Physical Education' },
  ];
  const students = [
    { value: 'john_doe', label: 'John Doe' },
    { value: 'jane_smith', label: 'Jane Smith' },
    { value: 'robert_johnson', label: 'Robert Johnson' },
    { value: 'emily_davis', label: 'Emily Davis' },
    { value: 'michael_wilson', label: 'Michael Wilson' },
    { value: 'sarah_brown', label: 'Sarah Brown' },
  ];
  const assignmentTypes = [
    { value: 'homework', label: 'Homework' },
    { value: 'project', label: 'Project' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'exam', label: 'Exam' },
    { value: 'presentation', label: 'Presentation' },
    { value: 'essay', label: 'Essay' },
  ];

  const formMethods = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: '',
      description: '',
      subject: '',
      dueDate: '',
      dueTime: '',
      points: 100,
      assignmentType: 'homework',
      instructions: '',
      attachments: [],
      assignedTo: 'all',
      specificStudents: [],
      allowLateSubmission: false,
      rubric: '',
    },
  });

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = formMethods;

  // Watch form values
  const formValues = watch();
  const assignedTo = watch('assignedTo');
  const specificStudents = watch('specificStudents') || [];

  const handleAddStudent = () => {
    if (newStudent && !specificStudents.includes(newStudent)) {
      setValue('specificStudents', [...specificStudents, newStudent]);
      setNewStudent('');
    }
  };

  const handleRemoveStudent = (student: string) => {
    setValue('specificStudents', specificStudents.filter((s: string) => s !== student));
  };

  const onSubmit = async (data: AssignmentFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Assignment created:', data);
      toast.success('Assignment created successfully!');
      reset();
      setCurrentStep(1);
    } catch (error) {
      toast.error('Failed to create assignment. Please try again.');
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
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
            <FaChalkboardTeacher className="mr-3 text-indigo-600" />
            Create New Assignment
          </h1>
          <p className="text-gray-600 mt-2">Create and assign tasks to your students</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </div>
                <span className="text-sm mt-2 text-gray-600">
                  {step === 1 && 'Details'}
                  {step === 2 && 'Settings'}
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

        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6 mb-6"
            >
              {/* Step 1: Assignment Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Assignment Details</h2>

                  <RHFFormField
                    name="title"
                    label="Title"
                    type="text"
                    placeholder="Enter assignment title"
                    required
                  />

                  <RHFFormField
                    name="description"
                    label="Description"
                    type="text"
                    placeholder="Describe the assignment to your students"
                  />

                  <RHFDropDown
                    name="subject"
                    label="Subject"
                    options={subjects}
                    placeholder="Select a subject"
                    required
                  />

                  <RHFDropDown
                    name="assignmentType"
                    label="Assignment Type"
                    options={assignmentTypes}
                    placeholder="Select assignment type"
                  />

                  <RHFFormField
                    name="instructions"
                    label="Instructions"
                    type="text"
                    placeholder="Provide detailed instructions for the assignment"
                  />
                </div>
              )}

              {/* Step 2: Settings & Configuration */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Settings & Configuration</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <RHFFormField
                      name="dueDate"
                      label="Due Date"
                      type="date"
                      required
                    />

                    <RHFFormField
                      name="dueTime"
                      label="Due Time"
                      type="time"
                    />
                  </div>

                  <RHFFormField
                    name="points"
                    label="Points"
                    type="number"
                    min={0}
                  />

                  <RHFCheckbox
                    name="allowLateSubmission"
                    label="Allow late submission"
                  />

                  <div>
                    <RHFDropDown
                      name="assignedTo"
                      label="Assign To"
                      options={[
                        { value: 'all', label: 'All Students' },
                        { value: 'specific', label: 'Specific Students' },
                      ]}
                      placeholder="Select assignment scope"
                    />

                    {assignedTo === 'specific' && (
                      <div className="mt-4">
                        <div className="flex mb-2">
                          <RHFDropDown
                            name="newStudent"
                            options={students}
                            placeholder="Select a student"
                            value={newStudent}
                            
                          />
                          <button
                            type="button"
                            onClick={handleAddStudent}
                            className="bg-indigo-600 text-white px-3 rounded-r-lg hover:bg-indigo-700 flex items-center"
                          >
                            <FaPlus />
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {specificStudents.map((student: string) => (
                            <span
                              key={student}
                              className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full flex items-center"
                            >
                              {students.find((s) => s.value === student)?.label || student}
                              <button
                                type="button"
                                onClick={() => handleRemoveStudent(student)}
                                className="ml-2 text-indigo-600 hover:text-indigo-800"
                              >
                                <FaTimes size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <RHFFormField
                    name="rubric"
                    label="Rubric/Grading Criteria"
                    type="text"
                    placeholder="Describe how this assignment will be graded"
                  />
                </div>
              )}

              {/* Step 3: Attachments & Review */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Attachments & Review</h2>

                  {/* <RHFImageUpload
                    name="attachments"
                    label="Attachments"
                    accept="image/*,application/pdf"
                    maxSize={5}
                  /> */}

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-3">Assignment Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex">
                        <span className="w-32 font-medium text-gray-600">Title:</span>
                        <span>{formValues.title || <span className="text-gray-400">Not provided</span>}</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 font-medium text-gray-600">Subject:</span>
                        <span>
                          {subjects.find((s) => s.value === formValues.subject)?.label || (
                            <span className="text-gray-400">Not provided</span>
                          )}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="w-32 font-medium text-gray-600">Type:</span>
                        <span>
                          {assignmentTypes.find((t) => t.value === formValues.assignmentType)?.label || (
                            <span className="text-gray-400">Not provided</span>
                          )}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="w-32 font-medium text-gray-600">Due Date:</span>
                        <span>{formValues.dueDate || <span className="text-gray-400">Not provided</span>}</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 font-medium text-gray-600">Points:</span>
                        <span>{formValues.points}</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 font-medium text-gray-600">Assigned To:</span>
                        <span>
                          {formValues.assignedTo === 'all'
                            ? 'All Students'
                            : `${formValues.specificStudents?.length || 0} students`}
                        </span>
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
                className={`px-6 py-2 rounded-lg ${
                  currentStep === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
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
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center disabled:opacity-50"
                >
                  <FaSave className="mr-2" />
                  {isSubmitting ? 'Creating...' : 'Create Assignment'}
                </motion.button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default AssignmentCreate;
