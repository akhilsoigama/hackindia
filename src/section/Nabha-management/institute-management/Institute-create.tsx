import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { 
  FaUniversity, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaGlobe, 
  FaUser, 
  FaIdCard, 
  FaSave, 
  FaTimes,
  FaCalendar,
  FaGraduationCap,
} from 'react-icons/fa';
import RHFFormField from '../../../components/hook-form/RHFFormFiled';
import RHFDropDown from '../../../components/hook-form/RHFDropDown';

// Define Zod schema for form validation - all fields are required
const instituteSchema = z.object({
  name: z.string().min(1, 'Institute name is required'),
  code: z.string().min(1, 'Institute code is required'),
  type: z.string().min(1, 'Please select institute type'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(1, 'Pincode is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Please enter a valid email address'),
  website: z.string().min(1, 'Website is required').url('Please enter a valid URL'),
  principalName: z.string().min(1, 'Principal name is required'),
  principalContact: z.string().min(1, 'Principal contact is required'),
  principalEmail: z.string().email('Please enter a valid email address for principal'),
  principalQualification: z.string().min(1, 'Principal qualification is required'),
  principalExperience: z.string().min(1, 'Principal experience is required'),
  establishedYear: z.string().min(1, 'Established year is required'),
  affiliation: z.string().optional().nullable(),
  campusArea: z.string().min(1, 'Campus area is required'),
  rolepermission: z.string().min(1, 'Please select a role permission'),
  status: z.enum(['active', 'inactive']),
});

// Infer the TypeScript type from the Zod schema
type FormData = z.infer<typeof instituteSchema>;

const InstituteCreate = () => {
  const methods = useForm<FormData>({
    resolver: zodResolver(instituteSchema),
    defaultValues: {
      status: 'active',
      name: '',
      code: '',
      type: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: '',
      phone: '',
      email: '',
      website: '',
      principalName: '',
      principalContact: '',
      principalEmail: '',
      principalQualification: '',
      principalExperience: '',
      establishedYear: '',
      affiliation: '',
      campusArea: '',
      rolepermission: '',
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('Institute created successfully!');
    console.log(data);
    reset({
      status: 'active',
      name: '',
      code: '',
      type: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: '',
      phone: '',
      email: '',
      website: '',
      principalName: '',
      principalContact: '',
      principalEmail: '',
      principalQualification: '',
      principalExperience: '',
      establishedYear: '',
      affiliation: '',
      campusArea: '',
      rolepermission: '',
    });
  };

  const handleReset = () => {
    // Reset the form with default values
    reset({
      status: 'active',
      name: '',
      code: '',
      type: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: '',
      phone: '',
      email: '',
      website: '',
      principalName: '',
      principalContact: '',
      principalEmail: '',
      principalQualification: '',
      principalExperience: '',
      establishedYear: '',
      affiliation: '',
      campusArea: '',
      rolepermission: '',
    });
  };

  const instituteTypeOptions = [
    { value: '', label: 'Select Type', disabled: true },
    { value: 'school', label: 'School' },
    { value: 'college', label: 'College' },
    { value: 'university', label: 'University' },
    { value: 'training', label: 'Training Institute' },
  ];

  const rolePermissionOptions = [
    { value: '', label: 'Select Permission', disabled: true },
    { value: 'admin', label: 'Admin' },
    { value: 'staff', label: 'Staff' },
    { value: 'student', label: 'Student' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const qualificationOptions = [
    { value: '', label: 'Select Qualification', disabled: true },
    { value: 'phd', label: 'Ph.D' },
    { value: 'masters', label: 'Masters' },
    { value: 'bachelors', label: 'Bachelors' },
    { value: 'diploma', label: 'Diploma' },
  ];

  const experienceOptions = [
    { value: '', label: 'Select Experience', disabled: true },
    { value: '0-5', label: '0-5 years' },
    { value: '5-10', label: '5-10 years' },
    { value: '10-15', label: '10-15 years' },
    { value: '15+', label: '15+ years' },
  ];

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center"
          >
            <FaUniversity className="mr-3 text-blue-600" />
            Create New Institute
          </h1>
          <p className="text-gray-600 mt-2">
            Add a new educational institute to the system. Fill in all the required details below.
          </p>
        </motion.div>
        
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Form Section */}
            <motion.div className="bg-white rounded-lg shadow-md p-6 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
                {/* Institute Basic Information */}
                <div className="md:col-span-2">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">
                    Basic Information
                  </h2>
                </div>

                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFFormField
                  name="name"
                  label="Institute Name"
                  type="text"
                  placeholder="Enter institute name"
                  required
                  icon={<FaUniversity />}
                />
                </motion.div><motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFFormField
                  name="code"
                  label="Institute Code"
                  type="text"
                  placeholder="Enter unique code"
                  required
                  icon={<FaIdCard />}
                />
                </motion.div><motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFDropDown
                  name="type"
                  label="Institute Type"
                  options={instituteTypeOptions}
                  required
                />
                </motion.div><motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFFormField
                  name="establishedYear"
                  label="Established Year"
                  type="number"
                  placeholder="Year"
                  min="1900"
                  max={new Date().getFullYear()}
                  required
                  icon={<FaCalendar />}
                />
                </motion.div><motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFFormField
                  name="affiliation"
                  label="Affiliation"
                  type="text"
                  placeholder="Affiliation body"
                  required
                  icon={<FaGraduationCap />}
                />
                </motion.div><motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFFormField
                  name="campusArea"
                  label="Campus Area (sq. ft.)"
                  type="number"
                  placeholder="Area in square feet"
                  required
                />
                </motion.div><motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFDropDown
                  name="rolepermission"
                  label="Permission"
                  options={rolePermissionOptions}
                  required
                />
                </motion.div>

                {/* Contact Information */}
                <div className="md:col-span-2 mt-6">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">
                    Contact Information
                  </h2>
                </div>

                <motion.div className="md:col-span-2" variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                  <RHFFormField
                    name="address"
                    label="Address"
                    type="text"
                    placeholder="Street address"
                    required
                    icon={<FaMapMarkerAlt />}
                  />
                </motion.div>

                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFFormField
                  name="city"
                  label="City"
                  type="text"
                  placeholder="City"
                  required
                />
                </motion.div><motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFFormField
                  name="state"
                  label="State"
                  type="text"
                  placeholder="State"
                  required
                />
                </motion.div><motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFFormField
                  name="pincode"
                  label="Pincode"
                  type="text"
                  placeholder="Pincode"
                  required
                />
                </motion.div><motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFFormField
                  name="country"
                  label="Country"
                  type="text"
                  placeholder="Country"
                  required
                />
                </motion.div><motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFFormField
                  name="phone"
                  label="Phone"
                  type="text"
                  placeholder="Phone number"
                  required
                  icon={<FaPhone />}
                />
                </motion.div><motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFFormField
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Email address"
                  required
                  icon={<FaEnvelope />}
                />
                </motion.div><motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFFormField
                  name="website"
                  label="Website"
                  type="text"
                  placeholder="Website URL (e.g., https://example.com)"
                  required
                  icon={<FaGlobe />}
                />
                </motion.div>

                {/* Principal Information */}
                <div className="md:col-span-2 mt-6">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">
                    Principal Information
                  </h2>
                </div>

                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFFormField
                  name="principalName"
                  label="Principal Name"
                  type="text"
                  placeholder="Full name"
                  required
                  icon={<FaUser />}
                />
                </motion.div><motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFFormField
                  name="principalContact"
                  label="Principal Contact"
                  type="text"
                  placeholder="Contact number"
                  required
                  icon={<FaPhone />}
                />
                </motion.div><motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFFormField
                  name="principalEmail"
                  label="Principal Email"
                  type="email"
                  placeholder="Email address"
                  required
                  icon={<FaEnvelope />}
                />
                </motion.div><motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFDropDown
                  name="principalQualification"
                  label="Principal Qualification"
                  options={qualificationOptions}
                  required
                />
                </motion.div><motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><RHFDropDown
                  name="principalExperience"
                  label="Principal Experience"
                  options={experienceOptions}
                  required
                />
                </motion.div>

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
                  {isSubmitting ? 'Creating...' : 'Create Institute'}
                </motion.button>
              </motion.div>
            </motion.div>
          </form>
        </FormProvider>

        {/* Additional Info */}
        <motion.div className="bg-blue-50 rounded-lg p-4 border border-blue-200" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <h3 className="font-medium text-blue-800">Information</h3>
          <p className="text-blue-700 text-sm mt-1">
            All fields are mandatory. After creating the institute, you can add departments, courses, and faculty members from the institute management section.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default InstituteCreate;