import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FaUser,
  FaIdCard,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaSave,
  FaTimes,
} from 'react-icons/fa';
import RHFDropDown from '../../../components/hook-form/RHFDropDown';
import RHFFormField from '../../../components/hook-form/RHFFormFiled';
import { toast } from 'sonner';

// Define Zod schema for validation
const studentFormSchema = z.object({
  name: z.string().min(1, 'Student name is required'),
  studentId: z.string().min(1, 'Student ID is required'),
  department: z.string().min(1, 'Department is required'),
  course: z.string().min(1, 'Course is required'),
  year: z.string().optional(),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().optional(),
  dob: z.string().optional(),
  admissionDate: z.string().optional(),
  status: z.enum(['active', 'inactive']), // Remove .default('active') to align with defaultValues
});

// Infer TypeScript type from Zod schema
type StudentFormData = z.infer<typeof studentFormSchema>;

const StudentCreate = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const formMethods = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: '',
      studentId: '',
      department: '',
      course: '',
      year: '',
      email: '',
      phone: '',
      address: '',
      dob: '',
      admissionDate: '',
      status: 'active', // Default value is handled here
    },
  });

  const { handleSubmit, reset } = formMethods;

  const onSubmit = (data: StudentFormData) => {
    setIsSubmitting(true);
    toast.success('Student created successfully!');
    console.log(data)
  };

  const handleReset = () => {
    reset();
  };

  // Year options for dropdown
  const yearOptions = [
    { value: '', label: 'Select year' },
    { value: '1st', label: '1st Year' },
    { value: '2nd', label: '2nd Year' },
    { value: '3rd', label: '3rd Year' },
    { value: 'final', label: 'Final Year' },
  ];

  // Status options for dropdown
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FaUser className="mr-3 text-blue-600" />
            Create New Student
          </h1>
          <p className="text-gray-600 mt-2">
            Add a new student to the system. Fill in all the required details below.
          </p>
        </motion.div>

        {/* Form Section */}
        <motion.div className="bg-white rounded-lg shadow-md p-6 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <FormProvider {...formMethods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
                {/* Student Basic Information */}
                <div className="md:col-span-2">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">
                    Basic Information
                  </h2>
                </div>

                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFFormField
                  name="name"
                  label="Student Name"
                  type="text"
                  placeholder="Enter full name"
                  required
                  icon={<FaUser />}
                />
                </motion.div><motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFFormField
                  name="studentId"
                  label="Student ID"
                  type="text"
                  placeholder="Enter unique ID"
                  required
                  icon={<FaIdCard />}
                />
                </motion.div><motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFFormField
                  name="department"
                  label="Department"
                  type="text"
                  placeholder="Department name"
                  required
                />
                </motion.div><motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFFormField
                  name="course"
                  label="Course"
                  type="text"
                  placeholder="Course name"
                  required
                />
                </motion.div><motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFDropDown
                  name="year"
                  label="Year"
                  options={yearOptions}
                  placeholder="Select year"
                />
                </motion.div>

                {/* Contact Information */}
                <div className="md:col-span-2 mt-6">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">
                    Contact Information
                  </h2>
                </div>

                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFFormField
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Email address"
                  required
                  icon={<FaEnvelope />}
                />
                </motion.div><motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFFormField
                  name="phone"
                  label="Phone"
                  type="tel"
                  placeholder="Phone number"
                  required
                  icon={<FaPhone />}
                />
                </motion.div><motion.div className="md:col-span-2" variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                  <RHFFormField
                    name="address"
                    label="Address"
                    type="text"
                    placeholder="Residential address"
                    icon={<FaMapMarkerAlt />}
                  />
                </motion.div>

                {/* Dates */}
                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFFormField
                  name="dob"
                  label="Date of Birth"
                  type="date"
                  icon={<FaCalendarAlt />}
                />
                </motion.div><motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFFormField
                  name="admissionDate"
                  label="Admission Date"
                  type="date"
                  icon={<FaCalendarAlt />}
                />
                </motion.div>

                {/* Status */}
                <motion.div className="md:col-span-2" variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                  <RHFDropDown
                    name="status"
                    label="Status"
                    options={statusOptions}
                  />
                </motion.div>
              </motion.div>

              {/* Form Actions */}
              <motion.div className="mt-8 flex justify-end space-x-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <motion.button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTimes className="mr-2" />
                  Reset
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSave className="mr-2" />
                  {isSubmitting ? 'Creating...' : 'Create Student'}
                </motion.button>
              </motion.div>
            </form>
          </FormProvider>
        </motion.div>

        {/* Info */}
        <motion.div className="bg-blue-50 rounded-lg p-4 border border-blue-200" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <h3 className="font-medium text-blue-800">Information</h3>
          <p className="text-blue-700 text-sm mt-1">
            After creating the student, you can enroll them in courses, assign faculty mentors, and track their academic progress in the system.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StudentCreate;