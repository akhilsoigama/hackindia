// components/DepartmentNewEditForm.tsx
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useMemo } from "react";
import * as z from "zod";
import {
  FaCode,
  FaBuilding,
  FaInfoCircle,
  FaSave,
  FaTimes,
  FaEdit,
} from "react-icons/fa";
import { toast } from "sonner";
import { useEffect } from "react";
import RHFFormField from "../../../components/hook-form/RHFFormFiled";
import {
  IDepartment,
  ICreateDepartment,
  IUpdateDepartment,
} from "../../../types/department";
import {
  createDepartmentService,
  updateDepartmentService,
} from "../../../action/department";
import { useRouter } from "../../../hooks/useRouter";
import { mutate } from "swr";
import { endpoints } from "../../../utils/axios";
import { useTheme } from "@/theme/AppThemeProvider";
import { ParticleButton } from "../../../components/ui/particle-button";
import { useUser } from "../../../atoms/userAtom";
import RHFCheckbox from "../../../components/hook-form/RHFCheckbox";
import { Translated } from "../../../components/common/translator/translator";

const departmentSchema = z.object({
  departmentName: z
    .string()
    .min(1, "Department name is required")
    .min(3, "Department name must be at least 3 characters"),
  departmentCode: z
    .string()
    .min(1, "Department code is required")
    .regex(/^[A-Z0-9]+$/, "Department code must be uppercase alphanumeric"),
  description: z.string().optional(),
  instituteId: z.number().min(1, "Institute is required"),
  isActive: z.boolean(),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

interface DepartmentNewEditFormProps {
  currentData?: IDepartment | null;
  onSuccess?: () => void;
}

const DepartmentNewEditForm = ({
  currentData,
  onSuccess,
}: DepartmentNewEditFormProps) => {
  const router = useRouter();
  const isEdit = Boolean(currentData?.id);
  const { user } = useUser();
  const instituteId = useMemo(() => {
    const resolvedInstituteId = user?.instituteId ?? user?.data?.instituteId;
    const parsedInstituteId = Number(resolvedInstituteId);

    if (Number.isFinite(parsedInstituteId) && parsedInstituteId > 0) {
      return parsedInstituteId;
    }

    return 1;
  }, [user?.data?.instituteId, user?.instituteId]);
  const defaultValues: DepartmentFormData = useMemo(
    () => ({
      departmentName: currentData?.departmentName || "",
      departmentCode: currentData?.departmentCode || "",
      description: currentData?.description || "",
      instituteId: currentData?.instituteId ?? instituteId,
      isActive:
        currentData?.isActive !== undefined ? currentData.isActive : true,
    }),
    [currentData, instituteId],
  );
  const methods = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues,
  });

  const { mode } = useTheme();
  const isDark = mode === "dark";

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
    watch,
  } = methods;

  const isActiveValue = watch("isActive");

  useEffect(() => {
    if (currentData && isEdit) {
      reset(defaultValues);
    }
  }, [currentData, isEdit, reset, defaultValues]);

  const onSubmit = async (data: DepartmentFormData) => {
    try {
      if (isEdit && currentData?.id) {
        const updateData: IUpdateDepartment = {
          departmentName: data.departmentName,
          description: data.description,
          instituteId: data.instituteId,
          isActive: data.isActive,
        };

        const result = await updateDepartmentService(
          currentData.id,
          updateData,
        );
        if (result) {
          mutate(
            endpoints.department.getAll,
            (currentData: { data: IDepartment[] } | undefined) => {
              if (!currentData?.data) return { data: [result] };
              return {
                data: currentData.data.map((d) =>
                  d.id === result.id ? result : d,
                ),
              };
            },
            false,
          );

          router.push("/dashboard/institute-management/department/list");
          onSuccess?.();
        }
      } else {
        const createData: ICreateDepartment = {
          departmentName: data.departmentName,
          departmentCode: data.departmentCode,
          description: data.description,
          instituteId: data.instituteId,
          isActive: data.isActive,
        };

        const result = await createDepartmentService(createData);
        if (result) {
          mutate(
            endpoints.department.getAll,
            (currentData: { data: IDepartment[] } | undefined) => {
              return {
                data: currentData?.data
                  ? [result, ...currentData.data]
                  : [result],
              };
            },
            false,
          );

          reset();
          onSuccess?.();
        }
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error(
        <span>
          <Translated text="Failed to" />{" "}
          {isEdit ? <Translated text="update" /> : <Translated text="create" />}{" "}
          <Translated text="Department" />
        </span>,
      );
    }
  };

  const handleReset = () => {
    if (isEdit && currentData) {
      reset({
        departmentName: currentData.departmentName || "",
        departmentCode: currentData.departmentCode || "",
        description: currentData.description || "",
        instituteId: currentData.instituteId ?? instituteId,
        isActive:
          currentData.isActive !== undefined ? currentData.isActive : true,
      });
    } else {
      reset({
        departmentName: "",
        departmentCode: "",
        description: "",
        instituteId,
        isActive: true,
      });
    }
  };

  return (
    <motion.div
      className={`${isDark ? "min-h-screen  text-gray-100 p-6" : "min-h-screen bg-gray-50 p-6"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-full mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1
            className={`text-3xl font-bold ${isDark ? "text-slate-100" : "text-slate-950/70"} flex items-center`}
          >
            {" "}
            <div className="p-3 bg-linear-to-r from-slate-500 to-slate-500 rounded-full mr-4">
              <FaBuilding className="text-white text-xl" />
            </div>
            {isEdit ? (
              <Translated text="Edit Department" />
            ) : (
              <Translated text="Create New Department" />
            )}
          </h1>
          <p className={`${isDark ? "text-slate-300" : "text-slate-600"} mt-2`}>
            {isEdit ? (
              <Translated text="Update the department information below." />
            ) : (
              <Translated text="Add a new department to the system. Fill in all the required details below." />
            )}
          </p>
        </motion.div>

        <motion.div
          className={`${isDark ? "border border-slate-700" : "bg-white"} rounded-lg shadow-md p-6 mb-8`}
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
                  <h2
                    className={`text-xl font-semibold ${isDark ? 'text-slate-100 border-slate-800' : 'text-slate-800 border-slate-200'} mb-4 pb-2 border-b `}
                  >
                    <Translated text="Department Information" />
                  </h2>
                </div>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <RHFFormField
                    name="departmentName"
                    label={<Translated text="Department Name" />}
                    placeholder="Enter department name"
                    required
                    icon={<FaBuilding />}
                  />
                </motion.div>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <RHFFormField
                    name="departmentCode"
                    label={<Translated text="Department Code" />}
                    placeholder="e.g., CS01, MTH02"
                    required
                    icon={<FaCode />}
                    disabled={isEdit}
                  />
                </motion.div>

                <motion.div
                  className="md:col-span-2"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <RHFFormField
                    name="description"
                    label={<Translated text="Description (Optional)" />}
                    placeholder="Brief description of the department"
                    icon={<FaInfoCircle />}
                  />
                </motion.div>

                <div className="md:col-span-2 mt-6">
                  <h2
                    className={`text-xl font-semibold ${isDark ? 'text-slate-100 border-slate-800' : 'text-slate-800 border-slate-200'} mb-4 pb-2 border-b `}
                  >
                    <Translated text="Status" />
                  </h2>
                </div>

                <motion.div
                  className="md:col-span-2"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <label
                    className={`block text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"} mb-1`}
                  >
                    <Translated text="Department Status" />
                  </label>
                  <motion.div
                    className="md:col-span-2"
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <div
                      className={`flex items-center gap-4 p-4 rounded-xl ${isDark ? "bg-slate-900/60 border border-slate-800" : "bg-slate-50 border border-slate-200"}`}
                    >
                      <span
                        className={`${isDark ? "text-gray-200" : "text-gray-700"} font-medium`}
                      >
                        <Translated text="Status" />
                      </span>
                      <RHFCheckbox
                        name="isActive"
                        label={
                          <span
                            className={`${isDark ? "text-gray-200" : "ml-2 text-gray-700"}`}
                          >
                            <Translated text="Active" />
                          </span>
                        }
                      />
                    </div>
                  </motion.div>
                  <p
                    className={`${isDark ? "text-gray-300" : "text-sm text-gray-500"} mt-1`}
                  >
                    {isActiveValue ? (
                      <Translated text="Active departments will be available for course assignments and faculty allocations." />
                    ) : (
                      <Translated text="Inactive departments will not be available for new assignments." />
                    )}
                  </p>
                </motion.div>
              </motion.div>

              <motion.div
                className="mt-8 flex justify-end space-x-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <ParticleButton
                  type="button"
                  onClick={() => handleReset()}
                  className={`flex items-center px-4 py-2 border rounded-lg text-sm font-medium ${isDark ? "text-slate-200 bg-slate-900 border-slate-800 hover:bg-slate-800" : "text-slate-700 bg-white border-slate-200 hover:bg-slate-50"}`}
                  successDuration={600}
                >
                  <FaTimes className="mr-2" />
                  {isEdit ? (
                    <Translated text="Reset Changes" />
                  ) : (
                    <Translated text="Reset" />
                  )}
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
                  {isSubmitting ? (
                    isEdit ? (
                      <Translated text="Updating..." />
                    ) : (
                      <Translated text="Creating..." />
                    )
                  ) : isEdit ? (
                    <Translated text="Update Department" />
                  ) : (
                    <Translated text="Create Department" />
                  )}
                </ParticleButton>
              </motion.div>
            </form>
          </FormProvider>
        </motion.div>

        <motion.div
          className={`${isDark ? "bg-slate-900/10 border border-slate-800 text-slate-200" : "bg-slate-50 border border-slate-200"} rounded-lg p-4`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-medium text-slate-800">
            <Translated text="Information" />
          </h3>
          <p
            className={`${isDark ? "text-slate-200" : "text-slate-700 text-sm"} mt-1`}
          >
            {isEdit ? (
              <Translated text="Updating department information will affect all associated courses and faculty members. Department code cannot be changed after creation." />
            ) : (
              <Translated text='After creating the department, you can assign faculty members, manage courses, and configure department-specific settings. Department codes should be unique uppercase alphanumeric identifiers (e.g., "CS01", "MTH02").' />
            )}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DepartmentNewEditForm;
