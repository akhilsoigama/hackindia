import { useCallback, useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FaUser,
  FaIdCard,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaSave,
  FaVenusMars,
  FaSchool,
  FaCity,
  FaMapMarkerAlt,
  FaFlag,
  FaTimes,
} from "react-icons/fa";
import RHFDropDown from "../../../components/hook-form/RHFDropDown";
import RHFFormField from "../../../components/hook-form/RHFFormFiled";
import { toast } from "sonner";
import {
  IStudent,
  IcreateStudent,
  IupdateStudent,
} from "../../../types/student";
import {
  createStudent,
  getAllStudents,
  updateStudent,
} from "../../../action/student";
import { mutate } from "swr";
import { endpoints } from "../../../utils/axios";
import { useRouter } from "../../../hooks/useRouter";
import { useDepartments } from "../../../action/department";
import { useInstitute } from "../../../action/institute";
import { useUser } from "../../../atoms/userAtom";
import { useTheme } from "@/theme/AppThemeProvider";
import { Translated } from "../../../components/common/translator/translator";
import {
  buildCollegeStudentStd,
  COMMERCE_SPECIALIZATION_OPTIONS,
  getCollegeDegreeOptions,
  getSemesterOptionsForDegree,
  getStudentStandardOptions,
  normalizeInstituteType,
  parseCollegeStudentStd,
} from "../../../constants/student-education-options";

interface StudentNewEditFormProps {
  currentData?: IStudent | null;
  onSuccess?: () => void;
}

const StudentNewEditForm = ({
  currentData,
  onSuccess,
}: StudentNewEditFormProps) => {
  const isEdit = Boolean(currentData?.id);
  const router = useRouter();
  const { departments } = useDepartments();
  const { user } = useUser();

  const { mode } = useTheme();
  const isDark = mode === "dark";

  const instituteId =
    user?.data?.authType === "institute" ? (user.data.instituteId ?? 1) : 1;
  const { institute } = useInstitute(instituteId);
  const instituteType =
    (user?.data?.institute as { instituteType?: string } | null | undefined)
      ?.instituteType ??
    (user?.data as { instituteType?: string } | null | undefined)
      ?.instituteType ??
    institute?.instituteType ??
    "";
  const normalizedInstituteType = normalizeInstituteType(instituteType);
  const isCollegeInstitute =
    normalizedInstituteType === "college" ||
    normalizedInstituteType === "university";
  const currentYearShort = new Date().getFullYear().toString().slice(-2);
  const currentYearFull = new Date().getFullYear();
  const maxDobDate = useMemo(() => {
    const maxDate = new Date();
    maxDate.setHours(0, 0, 0, 0);
    maxDate.setFullYear(maxDate.getFullYear() - 5);
    return maxDate.toISOString().split("T")[0];
  }, []);

  const studentFormSchema = z
    .object({
      studentName: z
        .string()
        .min(2, "Student name must be at least 2 characters")
        .max(100),
      studentId: z.string().min(1),
      departmentId: z.coerce.number().optional(),
      instituteId: z.coerce.number().positive(),
      roleId: z.coerce.number().optional(),
      studentStd: z.string().min(1, "Standard/Qualification is required"),
      studentDegree: z.string().optional(),
      studentSemester: z.string().optional(),
      commerceSpecialization: z.string().optional(),
      diplomaBranch: z.string().optional(),
      studentGrNo: z.coerce.number().positive(),
      studentGender: z.enum(["Male", "Female", "Other"]),
      studentEmail: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
      studentMobile: z
        .string()
        .min(1, "Phone number is required")
        .regex(/^\d{10,15}$/, "Phone number must be 10 to 15 digits"),
      studentAddress: z
        .string()
        .min(1, "Address is required")
        .min(5, "Address must be at least 5 characters"),
      studentDob: z.string().min(1, "Date of birth is required"),
      studentCity: z.string().optional(),
      studentState: z.string().optional(),
      studentCountry: z.string().optional(),
      studentPincode: z
        .string()
        .min(1, "Pincode is required")
        .regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
      studentAddmissionDate: z.string().optional(),
      isActive: z.boolean(),
    })
    .superRefine((data, ctx) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const dob = new Date(`${data.studentDob}T00:00:00`);
      if (Number.isNaN(dob.getTime())) {
        ctx.addIssue({
          path: ["studentDob"],
          code: "custom",
          message: "Please enter a valid date of birth",
        });
        return;
      }

      if (dob >= today) {
        ctx.addIssue({
          path: ["studentDob"],
          code: "custom",
          message: "Date of birth cannot be today or a future date",
        });
      }

      const ageLimitDate = new Date(today);
      ageLimitDate.setFullYear(ageLimitDate.getFullYear() - 5);

      if (dob > ageLimitDate) {
        ctx.addIssue({
          path: ["studentDob"],
          code: "custom",
          message: "Student must be at least 5 years old",
        });
      }

      if (isCollegeInstitute) {
        if (!data.studentDegree || data.studentDegree.trim().length === 0) {
          ctx.addIssue({
            path: ["studentDegree"],
            code: "custom",
            message: "Degree is required for college students",
          });
        }

        if (!data.studentSemester || data.studentSemester.trim().length === 0) {
          ctx.addIssue({
            path: ["studentSemester"],
            code: "custom",
            message: "Semester is required for college students",
          });
        }
      }

      if (data.studentStd === "Diploma") {
        if (!data.departmentId || data.departmentId <= 0) {
          ctx.addIssue({
            path: ["departmentId"],
            code: "custom",
            message: "Department is required for Diploma students",
          });
        }

        if (!data.diplomaBranch || data.diplomaBranch.trim().length < 2) {
          ctx.addIssue({
            path: ["diplomaBranch"],
            code: "custom",
            message: "Diploma branch is required",
          });
        }
      }

      if (data.studentStd === "12 Commerce") {
        if (!data.commerceSpecialization) {
          ctx.addIssue({
            path: ["commerceSpecialization"],
            code: "custom",
            message: "Please select a commerce specialization",
          });
        }
      }
    });

  type StudentFormInput = z.input<typeof studentFormSchema>;
  type StudentFormData = z.output<typeof studentFormSchema>;

  const generateStudentId = useCallback(
    (students: IStudent[]): string => {
      const currentYearStudentIds = students
        .filter(
          (student) =>
            student.studentId &&
            student.studentId.startsWith(`STD${currentYearShort}`),
        )
        .map((student) => {
          const idPart = student.studentId.replace(
            `STD${currentYearShort}`,
            "",
          );
          return parseInt(idPart) || 0;
        });

      if (currentYearStudentIds.length === 0) {
        return `STD${currentYearShort}0001`;
      }

      const maxNumber = Math.max(...currentYearStudentIds);
      const nextNumber = maxNumber + 1;
      const paddedNumber = nextNumber.toString().padStart(4, "0");
      return `STD${currentYearShort}${paddedNumber}`;
    },
    [currentYearShort],
  );

  const generateGrNo = useCallback(
    (students: IStudent[]): number => {
      const validGrNos = students
        .filter((student) => student.studentGrNo && student.studentGrNo >= 1000)
        .map((student) => student.studentGrNo);

      if (validGrNos.length === 0) {
        return parseInt(`${currentYearFull}001`);
      }

      const maxGrNo = Math.max(...validGrNos);
      const currentYearStart = parseInt(`${currentYearFull}000`);

      if (maxGrNo < currentYearStart) {
        return parseInt(`${currentYearFull}001`);
      }

      const nextGrNo = maxGrNo + 1;
      return nextGrNo;
    },
    [currentYearFull],
  );

  const collegeDefaults = useMemo(() => {
    return isCollegeInstitute
      ? parseCollegeStudentStd(currentData?.studentStd)
      : { degree: "", semester: "" };
  }, [currentData?.studentStd, isCollegeInstitute]);

  const formMethods = useForm<StudentFormInput, unknown, StudentFormData>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: useMemo(
      () => ({
        studentName: currentData?.studentName || "",
        studentId: currentData?.studentId || "",
        departmentId: currentData?.departmentId || 0,
        instituteId,
        studentStd: isCollegeInstitute
          ? buildCollegeStudentStd(
              collegeDefaults.degree,
              collegeDefaults.semester,
            )
          : currentData?.studentStd || "",
        studentDegree: collegeDefaults.degree,
        studentSemester: collegeDefaults.semester,
        commerceSpecialization: "",
        diplomaBranch: "",
        studentGrNo: currentData?.studentGrNo || 0,
        studentGender: currentData?.studentGender || "Other",
        studentEmail: currentData?.studentEmail || "",
        studentMobile: currentData?.studentMobile || "",
        studentAddress: currentData?.studentAddress || "",
        studentCity: currentData?.studentCity || "",
        studentState: currentData?.studentState || "",
        studentCountry: currentData?.studentCountry || "",
        studentPincode: currentData?.studentPincode || "",
        studentDob: currentData?.studentDob
          ? new Date(currentData.studentDob).toISOString().split("T")[0]
          : "",
        studentAddmissionDate: currentData?.studentAddmissionDate
          ? new Date(currentData.studentAddmissionDate)
              .toISOString()
              .split("T")[0]
          : new Date().toISOString().split("T")[0],
        roleId: currentData?.roleId || 0,
        isActive: currentData?.isActive ?? true,
      }),
      [collegeDefaults, currentData, instituteId, isCollegeInstitute],
    ),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    watch,
    setValue,
  } = formMethods;
  const selectedStd = watch("studentStd");
  const selectedDegree = watch("studentDegree");
  const selectedSemester = watch("studentSemester");
  const watchedPincode = watch("studentPincode") || "";
  const isPincodeValid = /^\d{6}$/.test(watchedPincode);
  const isDiplomaSelected = selectedStd === "Diploma";
  const isCommerceSelected = selectedStd === "12 Commerce";

  const standardOptions = useMemo(
    () => getStudentStandardOptions(instituteType),
    [instituteType],
  );
  const degreeOptions = useMemo(() => getCollegeDegreeOptions(), []);
  const semesterOptions = useMemo(
    () => getSemesterOptionsForDegree(selectedDegree),
    [selectedDegree],
  );

  useEffect(() => {
    if (!isCollegeInstitute) return;
    const computedStd = buildCollegeStudentStd(
      selectedDegree,
      selectedSemester,
    );
    setValue("studentStd", computedStd);
  }, [isCollegeInstitute, selectedDegree, selectedSemester, setValue]);

  useEffect(() => {
    if (!isCollegeInstitute) return;
    if (!selectedDegree) {
      setValue("studentSemester", "");
      return;
    }

    const validSemesterValues = semesterOptions
      .map((option) => option.value)
      .filter((value) => value !== "");

    if (selectedSemester && !validSemesterValues.includes(selectedSemester)) {
      setValue("studentSemester", "");
    }
  }, [
    isCollegeInstitute,
    selectedDegree,
    selectedSemester,
    semesterOptions,
    setValue,
  ]);

  useEffect(() => {
    if (isCollegeInstitute) return;
    setValue("studentDegree", "");
    setValue("studentSemester", "");
  }, [isCollegeInstitute, setValue]);

  useEffect(() => {
    if (isDiplomaSelected) {
      setValue("commerceSpecialization", "");
      return;
    }

    if (isCommerceSelected) {
      setValue("diplomaBranch", "");
      return;
    }

    setValue("commerceSpecialization", "");
    setValue("diplomaBranch", "");
  }, [isCommerceSelected, isDiplomaSelected, setValue]);

  useEffect(() => {
    if (!isEdit || !currentData) {
      return;
    }

    const parsedCollegeStd = isCollegeInstitute
      ? parseCollegeStudentStd(currentData.studentStd)
      : { degree: "", semester: "" };

    reset({
      studentName: currentData.studentName || "",
      studentId: currentData.studentId || "",
      departmentId: currentData.departmentId || 0,
      instituteId,
      studentStd: isCollegeInstitute
        ? buildCollegeStudentStd(
            parsedCollegeStd.degree,
            parsedCollegeStd.semester,
          )
        : currentData.studentStd || "",
      studentDegree: parsedCollegeStd.degree,
      studentSemester: parsedCollegeStd.semester,
      commerceSpecialization: "",
      diplomaBranch: "",
      studentGrNo: currentData.studentGrNo || 0,
      studentGender: currentData.studentGender || "Other",
      studentEmail: currentData.studentEmail || "",
      studentMobile: currentData.studentMobile || "",
      studentAddress: currentData.studentAddress || "",
      studentCity: currentData.studentCity || "",
      studentState: currentData.studentState || "",
      studentCountry: currentData.studentCountry || "",
      studentPincode: currentData.studentPincode || "",
      studentDob: currentData.studentDob
        ? new Date(currentData.studentDob).toISOString().split("T")[0]
        : "",
      studentAddmissionDate: currentData.studentAddmissionDate
        ? new Date(currentData.studentAddmissionDate)
            .toISOString()
            .split("T")[0]
        : new Date().toISOString().split("T")[0],
      roleId: currentData.roleId || 0,
      isActive: currentData.isActive ?? true,
    });
  }, [currentData, instituteId, isCollegeInstitute, isEdit, reset]);

  useEffect(() => {
    if (isEdit) return;

    const generateInitialValues = async () => {
      try {
        const students = await getAllStudents();

        const studentId = generateStudentId(students);
        const grNo = generateGrNo(students);
        reset({
          studentName: "",
          studentId,
          departmentId: 0,
          instituteId,
          studentStd: "",
          studentDegree: "",
          studentSemester: "",
          commerceSpecialization: "",
          diplomaBranch: "",
          studentGrNo: grNo,
          studentGender: "Other",
          studentEmail: "",
          studentMobile: "",
          studentAddress: "",
          studentCity: "",
          studentState: "",
          studentCountry: "",
          studentPincode: "",
          studentDob: "",
          studentAddmissionDate: new Date().toISOString().split("T")[0],
          roleId: 0,
          isActive: true,
        });
      } catch (error) {
        console.error("Error generating initial values:", error);
      } finally {
        //
      }
    };

    generateInitialValues();
  }, [isEdit, instituteId, generateStudentId, generateGrNo, reset]);

  const onSubmit = async (data: StudentFormData) => {
    try {
      // Validate 5-year gap between DOB and admission date
      if (data.studentDob && data.studentAddmissionDate) {
        const dob = new Date(data.studentDob);
        const admissionDate = new Date(data.studentAddmissionDate);
        const ageAtAdmission =
          (admissionDate.getTime() - dob.getTime()) /
          (1000 * 60 * 60 * 24 * 365.25);

        if (ageAtAdmission < 5) {
          toast.error(
            "Student must be at least 5 years old at admission date. Please check DOB and admission date.",
          );
          return;
        }
      }

      const transformDate = (dateString: string | undefined) =>
        dateString ? new Date(dateString).toISOString() : undefined;
      const {
        roleId: _roleId,
        commerceSpecialization: _commerceSpecialization,
        diplomaBranch: _diplomaBranch,
        studentDegree: _studentDegree,
        studentSemester: _studentSemester,
        studentStd: _studentStd,
        ...payloadData
      } = data;

      const resolvedStudentStd = isCollegeInstitute
        ? buildCollegeStudentStd(data.studentDegree, data.studentSemester)
        : data.studentStd;

      if (isEdit && currentData?.id) {
        const updateData: IupdateStudent = {
          ...payloadData,
          studentStd: resolvedStudentStd,
          id: currentData.id,
          studentDob: transformDate(payloadData.studentDob),
          studentAddmissionDate: transformDate(
            payloadData.studentAddmissionDate,
          ),
        };

        const result = await updateStudent(currentData.id, updateData);
        if (result) {
          mutate(endpoints.student.getAll);
          toast.success("Student updated successfully");
          router.push("/dashboard/institute-management/student/list");
          onSuccess?.();
        }
      } else {
        const createData: IcreateStudent = {
          ...payloadData,
          studentStd: resolvedStudentStd,
          departmentId: payloadData.departmentId ?? 0,
          studentDob: transformDate(payloadData.studentDob) || "",
          studentAddmissionDate:
            transformDate(payloadData.studentAddmissionDate) ||
            new Date().toISOString(),
        };

        const result = await createStudent(createData);
        if (result) {
          const students = await getAllStudents();

          const nextStudentId = generateStudentId(students);
          const nextGrNo = generateGrNo(students);
          reset({
            studentName: "",
            studentId: nextStudentId,
            departmentId: 0,
            instituteId,
            studentStd: "",
            studentDegree: "",
            studentSemester: "",
            commerceSpecialization: "",
            diplomaBranch: "",
            studentGrNo: nextGrNo,
            studentGender: "Other",
            studentEmail: "",
            studentMobile: "",
            studentAddress: "",
            studentCity: "",
            studentState: "",
            studentCountry: "",
            studentPincode: "",
            studentDob: "",
            studentAddmissionDate: new Date().toISOString().split("T")[0],
            roleId: 0,
            isActive: true,
          });

          mutate(endpoints.student.getAll);
          toast.success("Student created successfully");
          onSuccess?.();
        }
      }
    } catch (error: unknown) {
      console.error(error);
      const errorMessage =
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Failed to submit form";
      toast.error(errorMessage);
    }
  };
  const handleReset = () => {
    reset();
    toast.info("Form reset to default values");
  };
  const statusOptions = [
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" },
  ];

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const departmentOptions = useMemo(
    () =>
      departments?.map((d) => ({
        value: d.id.toString(),
        label: d.departmentName,
      })) ?? [],
    [departments],
  );

  const commerceSpecializationOptions = COMMERCE_SPECIALIZATION_OPTIONS;
  return (
    <motion.div
      className={`${isDark ? "bg-slate-950/70 text-slate-100" : "bg-slate-50"} min-h-screen p-6`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-full mx-auto">
        <motion.div className="mb-8">
          <h1
            className={`text-3xl font-bold ${isDark ? "text-slate-100" : "text-slate-950/70"} flex items-center`}
          >
            <div className="p-3 bg-linear-to-r from-slate-500 to-slate-500 rounded-full mr-4">
              <FaUser className="text-white text-xl" />
            </div>
            {isEdit ? "Edit Student" : "Create New Student"}
          </h1>
          <p className={`${isDark ? "text-slate-300" : "text-slate-600"} mt-2`}>
            {isEdit ? (
              <Translated text="Update the faculty member's information" />
            ) : (
              <Translated text="Add a new student to your institution" />
            )}
          </p>
        </motion.div>

        <motion.div
          className={`${isDark ? "bg-slate-950/70 border border-slate-700" : "bg-white"} rounded-lg shadow-md p-6 mb-8`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FormProvider {...formMethods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3 md:col-span-2">
                  <h2
                    className={`text-xl font-semibold ${isDark ? "text-slate-100 border-slate-800" : "text-slate-800 border-slate-200"} mb-4 pb-2 border-b `}
                  >
                    <Translated text="Basic Information" />
                  </h2>
                </div>

                <RHFFormField
                  name="studentName"
                  label={<Translated text="Student Name" />}
                  type="text"
                  placeholder="Enter full name"
                  required
                  icon={<FaUser />}
                />

                <div>
                  <RHFFormField
                    name="studentId"
                    label={<Translated text="Student ID" />}
                    type="text"
                    placeholder="Auto-generated"
                    required
                    disabled
                    icon={<FaIdCard />}
                  />
                </div>

                <div>
                  <RHFFormField
                    name="studentGrNo"
                    label={<Translated text="GR Number" />}
                    type="number"
                    placeholder="Auto-generated"
                    required
                    disabled
                    icon={<FaSchool />}
                  />
                </div>

                <RHFDropDown
                  name="studentGender"
                  label={<Translated text="Gender" />}
                  options={genderOptions}
                  required
                  icon={<FaVenusMars />}
                />

                {isCollegeInstitute ? (
                  <>
                    <RHFDropDown
                      name="studentDegree"
                      label={<Translated text="Degree" />}
                      options={degreeOptions}
                      required
                      icon={<FaSchool />}
                    />
                    <RHFDropDown
                      name="studentSemester"
                      label={<Translated text="Semester" />}
                      options={semesterOptions}
                      required
                      icon={<FaSchool />}
                    />
                    <input
                      type="hidden"
                      {...formMethods.register("studentStd")}
                    />
                  </>
                ) : (
                  <RHFDropDown
                    name="studentStd"
                    label={<Translated text="Standard" />}
                    options={standardOptions}
                    required
                    icon={<FaSchool />}
                  />
                )}

                {isDiplomaSelected && (
                  <>
                    <RHFDropDown
                      name="departmentId"
                      label={<Translated text="Department" />}
                      options={departmentOptions}
                      required
                    />

                    <RHFFormField
                      name="diplomaBranch"
                      label={<Translated text="Diploma Branch" />}
                      type="text"
                      placeholder="Enter diploma branch"
                      required
                      icon={<FaSchool />}
                    />
                  </>
                )}

                {isCommerceSelected && (
                  <RHFDropDown
                    name="commerceSpecialization"
                    label={<Translated text="Commerce Specialization" />}
                    options={commerceSpecializationOptions}
                    required
                    icon={<FaSchool />}
                  />
                )}

                {!isDiplomaSelected && !isCommerceSelected && (
                  <RHFDropDown
                    name="departmentId"
                    label={<Translated text="Department" />}
                    options={departmentOptions}
                    required
                  />
                )}

                <div className="lg:col-span-3 md:col-span-2 mt-6">
                  <h2
                    className={`text-xl font-semibold ${isDark ? "text-slate-100 border-slate-800" : "text-slate-800 border-slate-200"} mb-4 pb-2 border-b `}
                  >
                    <Translated text="Contact Information" />
                  </h2>
                </div>

                <RHFFormField
                  name="studentEmail"
                  label={<Translated text="Student Email" />}
                  type="email"
                  placeholder="Enter email address"
                  required
                  icon={<FaEnvelope />}
                />

                <RHFFormField
                  name="studentMobile"
                  label={<Translated text="Phone Number" />}
                  type="tel"
                  placeholder="Phone number"
                  required
                  icon={<FaPhone />}
                />
                <RHFFormField
                  name="studentAddress"
                  label={<Translated text="Address" />}
                  type="textarea"
                  placeholder="Enter Student Address"
                  required
                  icon={<FaMapMarkerAlt />}
                />
                <RHFFormField
                  name="studentCity"
                  label={<Translated text="City" />}
                  placeholder="Enter Student City"
                  required
                  icon={<FaCity />}
                />
                <RHFFormField
                  name="studentState"
                  label={<Translated text="State" />}
                  placeholder="Enter Student State"
                  required
                  icon={<FaCity />}
                />
                <RHFFormField
                  name="studentCountry"
                  label={<Translated text="Country" />}
                  placeholder="Enter Student Country"
                  required
                  icon={<FaCity />}
                />
                <RHFFormField
                  name="studentPincode"
                  label={<Translated text="Pincode" />}
                  type="text"
                  placeholder="Enter Student Pincode"
                  required
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  onInput={(event) => {
                    const target = event.currentTarget as HTMLInputElement;
                    target.value = target.value.replace(/\D/g, "").slice(0, 6);
                  }}
                  icon={isPincodeValid ? <FaFlag /> : undefined}
                />
                <div className="lg:col-span-3 md:col-span-2 mt-6">
                  <h2
                    className={`text-xl font-semibold ${isDark ? "text-slate-100 border-slate-800" : "text-slate-800 border-slate-200"} mb-4 pb-2 border-b `}
                  >
                    <Translated text="Dates & Status" />
                  </h2>
                </div>

                <RHFFormField
                  name="studentDob"
                  label={<Translated text="Date of Birth" />}
                  type="date"
                  required
                  max={maxDobDate}
                  icon={<FaCalendarAlt />}
                  placeholder={undefined}
                />

                <RHFFormField
                  name="studentAddmissionDate"
                  label={<Translated text="Admission Date" />}
                  type="date"
                  icon={<FaCalendarAlt />}
                  placeholder={undefined}
                />

                <RHFDropDown
                  name="isActive"
                  label={<Translated text="Status" />}
                  options={statusOptions}
                />

                <input type="hidden" {...formMethods.register("instituteId")} />
              </motion.div>

              <div className="mt-8 flex gap-3 justify-end">
                <motion.button
                  type="button"
                  onClick={handleReset}
                  className={`flex items-center px-4 py-2 border rounded-lg text-sm font-medium ${isDark ? "text-slate-200 bg-slate-900 border-slate-800 hover:bg-slate-800" : "text-slate-700 bg-white border-slate-200 hover:bg-slate-50"}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTimes className="mr-2" />
                  {isEdit ? (
                    <Translated text="Reset Changes" />
                  ) : (
                    <Translated text="Reset" />
                  )}
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 flex  items-center justify-center py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                    isDark
                      ? "bg-white text-slate-900 hover:bg-slate-100 shadow-sm"
                      : "bg-slate-800/80 text-white hover:bg-slate-800 shadow-sm"
                  }`}
                >
                  <FaSave className="mr-2" />
                  {isSubmitting ? (
                    <Translated text="Saving..." />
                  ) : isEdit ? (
                    <Translated text="Update Student" />
                  ) : (
                    <Translated text="Create Student" />
                  )}
                </motion.button>
              </div>
            </form>
          </FormProvider>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StudentNewEditForm;
