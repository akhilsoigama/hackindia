import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import * as z from 'zod';
import {
  FaCode,
  FaBuilding,
  FaInfoCircle,
  FaSave,
  FaTimes,
} from 'react-icons/fa';
import { toast } from 'sonner';
import RHFFormField from '../../../components/hook-form/RHFFormFiled';

const departmentSchema = z.object({
  departmentName: z.string().min(1, 'Department name is required').min(3, 'Department name must be at least 3 characters'),
  departmentCode: z.string().min(1, 'Department code is required').regex(/^[A-Z0-9]+$/, 'Department code must be uppercase alphanumeric'),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;


const DepartmentCreate = () => {
  const methods = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      departmentName: '',
      departmentCode: '',
      description: '',
      status: 'active',
    },
  });

  const { control, handleSubmit, reset, formState: { isSubmitting } } = methods;

  const onSubmit = async (data: DepartmentFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Department created successfully!');
      console.log(data);
      reset();
    } catch (error) {
      console.error('Error creating department:', error);
      toast.error('Failed to create department.');
    }
  };

  const handleReset = () => {
    reset();
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div className="mb-8" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FaBuilding className="mr-3 text-blue-600" />
            Create New Department
          </h1>
          <p className="text-gray-600 mt-2">
            Add a new department to the system. Fill in all the required details below.
          </p>
        </motion.div>

        <motion.div className="bg-white rounded-lg shadow-md p-6 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
                <div className="md:col-span-2">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">
                    Department Information
                  </h2>
                </div>

                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFFormField
                  name="departmentName"
                  label="Department Name"
                  placeholder="Enter department name"
                  required
                  icon={<FaBuilding />}
                /></motion.div>
                
                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFFormField
                  name="departmentCode"
                  label="Department Code"
                  placeholder="e.g., CS01, MTH02"
                  required
                  icon={<FaCode />}
                 
                /></motion.div>
                
               

              

                <motion.div className="md:col-span-2" variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                  <RHFFormField
                    name="description"
                    label="Description (Optional)"
                    placeholder="Brief description of the department"
                    icon={<FaInfoCircle />}
                  />
                </motion.div>

                <div className="md:col-span-2 mt-6">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">
                    Status
                  </h2>
                </div>

                <motion.div className="md:col-span-2" variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department Status</label>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        {...control.register('status')}
                        value="active"
                        className="text-blue-600 focus:ring-blue-500"
                        defaultChecked
                      />
                      <span className="ml-2">Active</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        {...control.register('status')}
                        value="inactive"
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2">Inactive</span>
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Active departments will be available for course assignments and faculty allocations.
                  </p>
                </motion.div>
              </motion.div>

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
                  {isSubmitting ? 'Creating...' : 'Create Department'}
                </motion.button>
              </motion.div>
            </form>
          </FormProvider>
        </motion.div>

        <motion.div className="bg-blue-50 rounded-lg p-4 border border-blue-200" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <h3 className="font-medium text-blue-800">Information</h3>
          <p className="text-blue-700 text-sm mt-1">
            After creating the department, you can assign faculty members, manage courses, and configure department-specific settings.
            Department codes should be unique uppercase alphanumeric identifiers (e.g., "CS01", "MTH02").
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DepartmentCreate;