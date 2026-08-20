import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import * as z from 'zod';
import {
  FaUser,
  FaIdCard,
  FaBriefcase,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaSave,
  FaTimes,
} from 'react-icons/fa';
import RHFDropDown from '../../../components/hook-form/RHFDropDown';
import { toast } from 'sonner';
import RHFFormField from '../../../components/hook-form/RHFFormFiled';
import { IDepartment } from '../../../types/department';
import { IcreateFaculty } from '../../../types/Faculty';
import { createFaculty } from '../../../action/faculty';
import { useGetUserRolePermissions } from '../../../action/RollPermission';
import {  useDepartments } from '../../../action/department';

// ✅ Validation schema
const facultySchema = z.object({
  facultyName: z.string().min(1, 'Faculty name is required'),
  facultyId: z.string().min(1, 'Faculty ID is required'),
  facultyEmail: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  facultyMobile: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
  facultyPassword: z.string().min(6, 'Password must be at least 6 characters'),
  designation: z.string().min(1, 'Designation is required'),
  departmentId: z.number('Department is required'),
  instituteId: z.number('Institute is required'),
  roleId: z.number('Role is required'),
});

type FacultyFormData = z.infer<typeof facultySchema>;

const FacultyCreate = () => {

  // ✅ Fetch departments and roles
  const { department } = useDepartments()
  const { userRolePermissions } = useGetUserRolePermissions()

  const departmentOptions =
    department?.map((dept: IDepartment) => ({
      value: dept.id,
      label: dept.departmentName,
    })) ?? [];

  const roleOptions =
    userRolePermissions?.map((role) => ({
      value: role.id,
      label: role.roleName,
    })) ?? [];

  // ✅ Form setup
  const methods = useForm<FacultyFormData>({
    resolver: zodResolver(facultySchema),
    defaultValues: {
      facultyName: '',
      facultyId: '',
      designation: '',
      facultyEmail: '',
      facultyMobile: '',
      facultyPassword: '',
      departmentId: undefined as unknown as number,
      roleId: undefined as unknown as number,
      instituteId: 1,
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;


  const onSubmit = async (data: IcreateFaculty) => {
    try {
      const payload = { ...data, instituteId: 1 };
      const result = await createFaculty(payload);

      if (result) {
        reset();
        toast.success('Faculty created successfully');
      }
    } catch (error) {
      toast.error('error while creating faculty');
      console.error('Error during faculty creation submission:', error);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FaUser className="mr-3 text-blue-600" />
            Create New Faculty
          </h1>
          <p className="text-gray-600 mt-2">
            Add a new faculty member to the system. Fill in all the required
            details below.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } },
                }}
              >
                <div className="md:col-span-2">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">
                    Basic Information
                  </h2>
                </div>

                <RHFFormField
                  name="facultyName"
                  label="Faculty Name"
                  placeholder="Enter full name"
                  required
                  icon={<FaUser />}
                />
                <RHFFormField
                  name="facultyId"
                  label="Faculty ID"
                  placeholder="Enter unique ID"
                  required
                  icon={<FaIdCard />}
                />
                <RHFFormField
                  name="designation"
                  label="Designation"
                  placeholder="Professor / Lecturer"
                  required
                  icon={<FaBriefcase />}
                />

                <RHFDropDown
                  name="departmentId"
                  label="Department"
                  options={departmentOptions}
                  placeholder="Select a department"
                  required
                />

                <div className="md:col-span-2 mt-6">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">
                    Contact Information
                  </h2>
                </div>

                <RHFFormField
                  name="facultyEmail"
                  label="Email"
                  type="email"
                  placeholder="Email address"
                  required
                  icon={<FaEnvelope />}
                />
                <RHFFormField
                  name="facultyMobile"
                  label="Phone"
                  type="tel"
                  placeholder="Phone number"
                  required
                  icon={<FaPhone />}
                  max={10}
                />

                <RHFDropDown
                  name="roleId"
                  label="Role"
                  options={roleOptions}
                  placeholder="Select a role"
                  required
                />

                <RHFFormField
                  name="facultyPassword"
                  label="Password"
                  type="password"
                  placeholder="Enter a secure password"
                  required
                  icon={<FaLock />}
                />
              </motion.div>

              {/* Buttons */}
              <motion.div
                className="mt-8 flex justify-end space-x-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  type="button"
                  onClick={() => reset()}
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
                  {isSubmitting ? 'Creating...' : 'Create Faculty'}
                </motion.button>
              </motion.div>
            </form>
          </FormProvider>
        </motion.div>

        {/* Info box */}
        <motion.div
          className="bg-blue-50 rounded-lg p-4 border border-blue-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-medium text-blue-800">Information</h3>
          <p className="text-blue-700 text-sm mt-1">
            After creating the faculty, you can assign them to courses,
            departments, and roles within the institute management section.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FacultyCreate;
