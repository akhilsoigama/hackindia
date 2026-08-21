import { FormProvider, useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import * as z from "zod";
import {
  FaUser,
  FaIdCard,
  FaBriefcase,
  FaEnvelope,
  FaPhone,
  FaSave,
  FaEdit,
  FaTimes,
  FaCheckCircle,
  FaCertificate,
  FaChalkboard,
} from "react-icons/fa";
import RHFDropDown from "../../../components/hook-form/RHFDropDown";
import { toast } from "sonner";
import RHFFormField from "../../../components/hook-form/RHFFormFiled";
import { IfacultyItem } from "../../../types/Faculty";
import { createFaculty, updateFaculty, useFaculties } from "../../../action/faculty";
import { useDepartments } from "../../../action/department";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "../../../hooks/useRouter";
import { useUser } from "../../../atoms/userAtom";
import { ParticleButton } from "../../../components/ui/particle-button";
import { useTheme } from '@/theme/AppThemeProvider';
import { Translated } from "../../../components/common/translator/translator";
import type { IcreateFaculty } from "../../../types/Faculty";

interface FacultyNewEditFormProps {
  currentData?: IfacultyItem | null;
  onSuccess?: () => void;
}

const FacultyNewCreateForm = ({
  currentData,
  onSuccess,
}: FacultyNewEditFormProps) => {
  const isEdit = currentData ? true : false;
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const { departments } = useDepartments();
  const { user } = useUser();

  const { facultiesMutate } = useFaculties();

  const instituteId = useMemo(() => {
    if (!user) {
      return 1;
    }

    const isInstituteUser = user.userType === 'institute' || user.authType === 'institute' || user.data?.authType === 'institute';
    if (!isInstituteUser) {
      return user.instituteId ?? user.data?.instituteId ?? 1;
    }

    return user.instituteId ?? user.data?.instituteId ?? user.id ?? user.data?.id ?? 1;
  }, [user]);

  const facultySchema = z
    .object({
      facultyName: z.string().min(1, "Faculty name is required"),
      facultyId: z.string().optional(),
      facultyEmail: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address"),
      facultyMobile: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .regex(/^\d+$/, "Phone number must contain only digits"),
      designation: z.string().min(1, "Designation is required"),
      qualification: z.string().optional(),
      experience: z.coerce.number().min(0).max(70).optional(),
      departmentId: z.number().min(1, "Department is required"),
      instituteId: z.number().min(1, "Institute is required"),
      roleId: z.number().optional(),
      isActive: z.boolean(),
    });

  type FacultyFormData = z.infer<typeof facultySchema>;

  const departmentOptions = useMemo(
    () =>
      departments?.map((d) => ({ value: d.id, label: d.departmentName })) ?? [],
    [departments]
  );

  const defaultValues: FacultyFormData = useMemo(
    () => ({
      facultyName: currentData?.facultyName ?? "",
      facultyId: currentData?.facultyId ?? "", 
      facultyEmail: currentData?.facultyEmail ?? "",
      facultyMobile: currentData?.facultyMobile ?? "",
      designation: currentData?.designation ?? "",
      qualification: currentData?.qualification ?? "",
      experience: currentData?.experience ?? 0,
      departmentId: currentData?.departmentId ?? 1,
      instituteId: instituteId,
      roleId: currentData?.roleId ?? 0,
      isActive: currentData?.isActive ?? true,
    }),
    [currentData, instituteId]
  );

  const methods = useForm<FacultyFormData>({
    resolver: zodResolver(facultySchema) as unknown as Resolver<FacultyFormData>,
    defaultValues,
  });

  const {
    handleSubmit,
    reset,

    formState: { isSubmitting, },
  } = methods;

  useEffect(() => {
    if (currentData) {
      reset(defaultValues);
    }
  }, [currentData, defaultValues, reset]);

  const onSubmit = async (data: FacultyFormData) => {
    try {
      const payload: IcreateFaculty = {
        facultyName: data.facultyName,
        designation: data.designation,
        facultyEmail: data.facultyEmail,
        facultyMobile: data.facultyMobile,
        qualification: data.qualification || undefined,
        experience: data.experience ?? undefined,
        departmentId: data.departmentId,
        instituteId: instituteId,
        roleId: data.roleId || undefined,
        isActive: data.isActive,
      };
      
      if (data.facultyId && isEdit) {
        payload.facultyId = data.facultyId;
      }

      if (isEdit && currentData?.id) {
        const result = await updateFaculty(currentData.id, payload);
        if (result) {
          facultiesMutate();
          setIsSuccess(true);
          setTimeout(() => {
            router.push('/dashboard/institute-management/faculty/list');
            setIsSuccess(false);
          }, 1500);
          toast.success(<Translated text="Faculty updated successfully" />);
          onSuccess?.();
        }
      } else {
        const result = await createFaculty(payload);
        if (result) {
          facultiesMutate();
          setIsSuccess(true);
          setTimeout(() => {
            reset();
            setIsSuccess(false);
            onSuccess?.();
          }, 1500);
          toast.success(<Translated text="Faculty created successfully" />);
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        typeof error === 'object' &&
          error !== null &&
          'response' in error &&
          typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Something went wrong";
      toast.error(errorMessage);
    }
  };
  const handleReset = () => {
    reset(defaultValues);
    toast.info(<Translated text='Form reset to default values' />);
  };
  return (
    <div className={`${isDark ? 'min-h-screen  text-slate-100 p-6' : 'min-h-screen bg-slate-50 p-6'}`}>
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            className="fixed inset-0  flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-full mx-4 text-center shadow-xl"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-3xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                "Success!"
              </h3>
              <p className="text-slate-600 mb-4">
                {isEdit ? <Translated text="Faculty updated successfully!" /> : <Translated text="New faculty created successfully!" />}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-full mx-auto">
        {/* Header */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={`text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-950/70'} flex items-center`}>
            <div className="p-3 bg-linear-to-r from-slate-500 to-slate-500 rounded-full mr-4">
              <FaUser className="text-white text-xl" />
            </div>
            {isEdit ? <Translated text="Edit Faculty" /> : <Translated text="Create New Faculty" />}
          </h1>
          <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} mt-2`}>
            {isEdit
              ? <Translated text="Update the faculty member's information" />
              : <Translated text="Add a new faculty member to your institution" />}
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          className={`${isDark ? 'border border-slate-700' : 'bg-white'} rounded-lg shadow-md p-6 mb-8`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Basic Information Section */}
              <div className="mb-8">
                <h2 className={`text-xl font-semibold ${isDark ? 'text-slate-100 border-slate-800' : 'text-slate-800 border-slate-200'} mb-4 pb-2 border-b `}><Translated text="Basic Information" /></h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <RHFFormField
                    name="facultyName"
                    label={<Translated text="Faculty Name" />}
                    placeholder="Enter full name"
                    required
                    icon={<FaUser className="text-slate-400" />}
                  />
                  <RHFFormField
                    name="facultyId"
                    label={<Translated text="Faculty ID" />}
                    placeholder={isEdit ? "Enter unique ID" : "Auto-generated by department"}
                    disabled={!isEdit}
                    icon={<FaIdCard className="text-slate-400" />}
                  />
                  <RHFFormField
                    name="designation"
                    label={<Translated text="Designation" />}
                    placeholder="Professor / Lecturer"
                    required
                    icon={<FaBriefcase className="text-slate-400" />}
                  />
                  <RHFFormField
                    name="qualification"
                    label={<Translated text="Qualification" />}
                    placeholder="B.Tech, M.Tech, PhD, etc."
                    icon={<FaCertificate className="text-slate-400" />}
                  />
                  <RHFFormField
                    name="experience"
                    label={<Translated text="Years of Experience" />}
                    type="number"
                    placeholder="Years (0-70)"
                    icon={<FaChalkboard className="text-slate-400" />}
                  />
                  <RHFDropDown
                    name="departmentId"
                    label={<Translated text="Department" />}
                    options={departmentOptions}
                    placeholder="Select a department"
                    required
                  />
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="mb-8">
                <h2 className={`text-xl font-semibold ${isDark ? 'text-slate-100 border-slate-800' : 'text-slate-800 border-slate-200'} mb-4 pb-2 border-b `}><Translated text="Contact Information" /></h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <RHFFormField
                    name="facultyEmail"
                    label={<Translated text="Email Address" />}
                    type="email"
                    placeholder="email@example.com"
                    required
                    icon={<FaEnvelope className="text-slate-400" />}
                  />
                  <RHFFormField
                    name="facultyMobile"
                    label={<Translated text="Phone Number" />}
                    type="tel"
                    placeholder="10 digit mobile number"
                    required
                    icon={<FaPhone className="text-slate-400" />}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <motion.div className="mt-8 flex justify-end space-x-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <ParticleButton
                  type="button"
                  onClick={() => handleReset()}
                     className={`flex items-center px-4 py-2 border rounded-lg text-sm font-medium ${isDark ? "text-slate-200 bg-slate-900 border-slate-800 hover:bg-slate-800" : "text-slate-700 bg-white border-slate-200 hover:bg-slate-50"}`}
                  successDuration={600}
                >
                  <FaTimes className="mr-2" />
                  {isEdit ? <Translated text='Reset Changes' /> : <Translated text='Reset' />}
                </ParticleButton>

                <ParticleButton
                  type="submit"
                   className={`px-4 flex  items-center justify-center py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                    isDark
                      ? "bg-white text-slate-900 hover:bg-slate-100 shadow-sm"
                      : "bg-slate-800/80 text-white hover:bg-slate-800 shadow-sm"
                  }`}
                  successDuration={800}
                  disabled={isSubmitting}
                >
                  {isEdit ? (
                    <FaEdit className="mr-2" />
                  ) : (
                    <FaSave className="mr-2" />
                  )}
                  {isSubmitting
                    ? (isEdit ? <Translated text='Updating...' /> : <Translated text='Creating...' />)
                    : (isEdit ? <Translated text='Update Faculty' /> : <Translated text='Create Faculty' />)}
                </ParticleButton>
              </motion.div>
            </form>
          </FormProvider>
        </motion.div>
      </div>
    </div>
  );
};

export default FacultyNewCreateForm;
