import { useEffect, useMemo } from "react";
import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import RHFFormField from "../../../components/hook-form/RHFFormFiled";
import RHFDropDown from "../../../components/hook-form/RHFDropDown";
import RHFCheckbox from "../../../components/hook-form/RHFCheckbox";
import { useTheme } from '@/theme/AppThemeProvider';
import { IAssignmentItem, IcreateAssignment } from "../../../types/assignment";
import RHFPDFUpload from "../../../components/hook-form/RHFPDFUpload";
import RHFContentFormField from "../../../components/hook-form/RHFContent";
import { ParticleButton } from "../../../components/ui/particle-button";
import {
  createAssignment,
  updateAssignment,
  useAssignments,
} from "../../../action/assignment";
import { useDepartments } from "../../../action/department";
import { useUser } from "../../../atoms/userAtom";
import { useRouter } from "../../../hooks/useRouter";
import { formatDateForInput } from "../../../utils/utils";
import { Translated } from "../../../components/common/translator/translator";



const assignmentSchema = z.object({
  assignmentTitle: z.string().min(1, "Title is required"),
  assignmentDescription: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  dueDate: z.string().min(1, "Due date is required"),
  assignmentFile: z.string().nullable(),
  facultyId: z.number().min(1, "Faculty is required"),
  departmentId: z.number().min(1, "Department is required"),
  instituteId: z.number().min(1, "Institute is required"),
  std: z.string().min(1, "Standard is required"),
  marks: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "number" ? val : Number(val)))
    .refine((val) => Number.isFinite(val) && val >= 1, {
      message: "Marks must be at least 1",
    }),
  isActive: z.boolean(),
});

interface AssignmentCreateProps {
  currentData?: IAssignmentItem | null;
  onSuccess?: () => void;
}

type AssignmentFormInput = z.input<typeof assignmentSchema>;
type AssignmentFormData = z.output<typeof assignmentSchema>;

const subjects = [
  { value: "mathematics", label: "Mathematics" },
  { value: "science", label: "Science" },
  { value: "english", label: "English" },
  { value: "history", label: "History" },
  { value: "art", label: "Art" },
  { value: "physical_education", label: "Physical Education" },
];

const standards = [
  { value: "1st_grade", label: "1st Grade" },
  { value: "2nd_grade", label: "2nd Grade" },
  { value: "3rd_grade", label: "3rd Grade" },
  { value: "4th_grade", label: "4th Grade" },
  { value: "5th_grade", label: "5th Grade" },
  { value: "6th_grade", label: "6th Grade" },
  { value: "7th_grade", label: "7th Grade" },
  { value: "8th_grade", label: "8th Grade" },
  { value: "9th_grade", label: "9th Grade" },
  { value: "10th_grade", label: "10th Grade" },
  { value: "11th_grade", label: "11th Grade" },
  { value: "12th_grade", label: "12th Grade" },
];

const normalizeValue = (value: string): string => value.toLowerCase().replace(/[\s_-]+/g, "");

const resolveOptionValue = (
  incomingValue: string | undefined,
  options: Array<{ value: string; label: string }>,
): string => {
  if (!incomingValue) {
    return "";
  }

  const normalizedIncoming = normalizeValue(incomingValue);
  const matched = options.find(
    (option) =>
      normalizeValue(option.value) === normalizedIncoming ||
      normalizeValue(option.label) === normalizedIncoming,
  );

  return matched?.value ?? incomingValue;
};

const AssignmentCreateNewEditForm = ({
  currentData,
  onSuccess,
}: AssignmentCreateProps) => {
  const isEdit = Boolean(currentData);
  const router = useRouter();
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const { assignmentMutate } = useAssignments();
  const { user } = useUser();
  const { departments } = useDepartments();

  const instituteId = Number(user?.data?.instituteId ?? currentData?.instituteId ?? 0);
  const facultyId = Number(user?.data?.facultyId ?? currentData?.facultyId ?? 0);

  const departmentOptions = useMemo(
    () =>
      (departments || []).map((department) => ({
        value: department.id,
        label: department.departmentName,
      })),
    [departments],
  );

  const defaultValues: AssignmentFormInput = useMemo(
    () => ({
      assignmentTitle: currentData?.assignmentTitle ?? "",
      assignmentDescription: currentData?.assignmentDescription ?? "",
      subject: resolveOptionValue(currentData?.subject, subjects),
      dueDate: currentData?.dueDate ? formatDateForInput(currentData.dueDate instanceof Date ? currentData.dueDate.toISOString() : currentData.dueDate) : "",
      assignmentFile: currentData?.assignmentFile ?? null,
      facultyId,
      departmentId: Number(currentData?.departmentId ?? departmentOptions[0]?.value ?? 0),
      instituteId,
      std: resolveOptionValue(currentData?.std, standards),
      marks: currentData?.marks ?? 1,
      isActive: currentData?.isActive ?? true,
    }),
    [currentData, departmentOptions, facultyId, instituteId],
  );

  const formMethods = useForm<AssignmentFormInput, unknown, AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = formMethods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const toDateTimeString = (dateInput: string): string => {
    const trimmedValue = dateInput.trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
      return `${trimmedValue} 00:00:00`;
    }

    const directDate = new Date(trimmedValue);

    if (!Number.isNaN(directDate.getTime())) {
      return directDate.toISOString().replace('T', ' ').slice(0, 19);
    }

    return trimmedValue;
  };

  const onSubmit: SubmitHandler<AssignmentFormData> = async (data) => {
    const payload: IcreateAssignment = {
      id: currentData?.id ?? 0,
      assignmentTitle: data.assignmentTitle,
      assignmentDescription: data.assignmentDescription ?? "",
      subject: data.subject,
      dueDate: toDateTimeString(data.dueDate),
      assignmentFile: data.assignmentFile,
      std: data.std,
      instituteId,
      facultyId,
      departmentId: Number(data.departmentId),
      marks: Number(data.marks),
      isActive: data.isActive,
    };

    try {
      if (isEdit && currentData?.id) {
        const updated = await updateAssignment(currentData.id, payload);
        if (updated) {
          await assignmentMutate();
          toast.success(<Translated text="assignment.updated.success" />);
          onSuccess?.();
          router.push("/dashboard/faculty-management/assignment/list");
        }
        return;
      }

      const created = await createAssignment(payload);
      if (created) {
        await assignmentMutate();
        toast.success(<Translated text="assignment.created.success" />);
        onSuccess?.();
        reset(defaultValues);
        router.push("/dashboard/faculty-management/assignment/list");
      }
    } catch {
      toast.error(<Translated text="assignment.save.failed" />);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <div className={`min-h-screen  px-3 py-4 sm:px-4 sm:py-6 md:px-6`}>
        <div
          className={`mx-auto max-w-full rounded-xl border p-4 sm:p-5 md:p-6 ${
            isDark ? "border-slate-700 bg-slate-950/70" : "border-slate-200 bg-white"
          }`}
        >
          <h1 className={`text-3xl font-semibold ${isDark ? "text-white" : "text-slate-950/70"}`}>
            {isEdit ? <Translated text="Assignment edit" /> : <Translated text="Assignment create" />}
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <RHFFormField
                name="assignmentTitle"
                label={<Translated text="assignment title" />}
                placeholder="Enter assignment title"
                required
              />

              <RHFDropDown
                name="subject"
                label={<Translated text="assignment subject" />}
                options={subjects}
                placeholder="Select subject"
                required
              />

              <RHFDropDown
                name="std"
                label={<Translated text="assignment standard" />}
                options={standards}
                placeholder="Select standard"
                required
              />

              <RHFDropDown
                name="departmentId"
                label={<Translated text="assignment department" />}
                options={departmentOptions}
                placeholder="Select department"
                required
              />

              <RHFFormField name="dueDate" type="date" label={<Translated text="assignment.dueDate" />} required placeholder={undefined} />

              <RHFFormField
                name="marks"
                type="number"
                label={<Translated text="assignment marks" />}
                placeholder="Enter total marks"
                required
              />
            </div>

            <RHFContentFormField
              name="assignmentDescription"
              label={<Translated text="assignment description" />}
              required
            />

            <RHFPDFUpload
              name="assignmentFile"
              label={<Translated text="assignment pdf Upload" />}
              required
              currentValue={currentData?.assignmentFile ?? ""}
            />

            <div className="mt-5">
              <RHFCheckbox name="isActive" label={<Translated text="assignment active" />} />
            </div>

            <motion.div
              className="mt-8 flex justify-end space-x-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <ParticleButton
                type="button"
                onClick={() => reset(defaultValues)}
                className={`flex items-center px-4 py-2 border rounded-lg text-sm font-medium ${isDark ? "text-slate-200 bg-slate-900 border-slate-800 hover:bg-slate-800" : "text-slate-700 bg-white border-slate-200 hover:bg-slate-50"}`}
                successDuration={600}
              >
                <FaTimes className="mr-2" />
                {isEdit ? <Translated text="reset Changes" /> : <Translated text="reset" />}
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
                {isEdit ? <FaEdit className="mr-2" /> : <FaSave className="mr-2" />}
                {isSubmitting ? (isEdit ? <Translated text="assignment updating" /> : <Translated text="assignment creating" />) : isEdit ? <Translated text="assignment update" /> : <Translated text="assignment create" />}
              </ParticleButton>
            </motion.div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
};
export default AssignmentCreateNewEditForm;
