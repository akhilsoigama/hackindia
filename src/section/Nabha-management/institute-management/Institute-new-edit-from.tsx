import { useForm, FormProvider, SubmitHandler, Resolver } from 'react-hook-form';
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
  FaEdit,
} from 'react-icons/fa';
import { toast } from 'sonner';
import RHFFormField from '../../../components/hook-form/RHFFormFiled';
import RHFDropDown from '../../../components/hook-form/RHFDropDown';
import { useMemo, useEffect, useState } from 'react';
import { useRouter } from '../../../hooks/useRouter';
import { IInstitute, ICreateInstitute, IUpdateInstitute } from '../../../types/Institute';
import { mutate } from 'swr';
import { endpoints } from '../../../utils/axios';
import { createInstituteService, updateInstituteService } from '../../../action/institute';
import { useTheme as useAppTheme } from '@/theme/AppThemeProvider';
import { ParticleButton } from '../../../components/ui/particle-button';
import { Translated } from '../../../components/common/translator/translator';

import RHFCheckbox from '../../../components/hook-form/RHFCheckbox';

// Conditional schema based on edit mode
const createInstituteSchema = () =>
  z.object({
    instituteName: z.string().min(3, 'Institute name must be at least 3 characters'),
    instituteCode: z.string().min(2, 'Institute code must be at least 2 characters'),
    instituteType: z.string().min(1, 'Please select institute type'),
    instituteAddress: z.string().min(5, 'Address must be at least 5 characters'),
    instituteCity: z.string().min(2, 'City must be at least 2 characters'),
    instituteState: z.string().min(2, 'State must be at least 2 characters'),
    instituteCountry: z.string().min(2, 'Country must be at least 2 characters'),
    institutePinCode: z.string().min(4, 'Pincode must be at least 4 characters'),
    institutePhone: z.string().min(10, 'Phone number must be at least 10 digits'),
    instituteEmail: z.string().email('Please enter a valid email address'),
    principalName: z.string().min(2, 'Principal name must be at least 2 characters'),
    establishedYear: z.preprocess(
      (value) => (value === undefined || value === null || value === '' ? '' : String(value).trim()),
      z
        .string()
        .min(1, 'Established year is required')
        .refine((val) => /^\d{4}$/.test(val), 'Established year must be a 4-digit year')
        .refine((val) => {
          const year = Number(val);
          const currentYear = new Date().getFullYear();
          return Number.isFinite(year) && year >= 1900 && year <= currentYear;
        }, `Established year must be between 1900 and ${new Date().getFullYear()}`)
    ),
    roleId: z.coerce.number().optional(),

    // Optional fields
    instituteWebsite: z.string().url('Please enter a valid URL').optional().or(z.literal('')).nullable(),
    principalEmail: z.string().email('Please enter a valid email address for principal').optional().or(z.literal('')).nullable(),
    principalPhone: z.string().min(10, 'Principal contact must be at least 10 digits').optional().or(z.literal('')).nullable(),
    principalQualification: z.string().optional().or(z.literal('')).nullable(),
    principalExperience: z.string().optional().or(z.literal('')).nullable(),
    affiliation: z.string().optional().or(z.literal('')).nullable(),
    campusArea: z.string().optional().or(z.literal('')).nullable(),
    isActive: z.boolean().default(true).optional(),
  });

type FormData = z.infer<ReturnType<typeof createInstituteSchema>>;

interface InstituteCreateProps {
  currentData?: IInstitute | null;
  onSuccess?: () => void;
}

const InstituteCreate = ({ currentData, onSuccess }: InstituteCreateProps) => {
  const isEdit = !!currentData;
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const instituteSchema = useMemo(() => createInstituteSchema(), []);

  const defaultValues: Partial<FormData> = useMemo(
    () => ({
      instituteName: currentData?.instituteName ?? '',
      instituteCode: currentData?.instituteCode ?? '',
      instituteType: currentData?.instituteType ?? '',
      instituteAddress: currentData?.instituteAddress ?? '',
      instituteCity: currentData?.instituteCity ?? '',
      instituteState: currentData?.instituteState ?? '',
      instituteCountry: currentData?.instituteCountry ?? '',
      institutePinCode: currentData?.institutePinCode ?? '',
      institutePhone: currentData?.institutePhone ?? '',
      instituteEmail: currentData?.instituteEmail ?? '',
      instituteWebsite: currentData?.instituteWebsite ?? '',
      principalName: currentData?.principalName ?? '',
      principalEmail: currentData?.principalEmail ?? '',
      principalPhone: currentData?.principalPhone ?? '',
      principalQualification: currentData?.principalQualification ?? '',
      principalExperience: currentData?.principalExperience ?? '',
      establishedYear:
        currentData?.establishedYear !== undefined && currentData?.establishedYear !== null
          ? String(currentData.establishedYear)
          : '',
      affiliation: currentData?.affiliation ?? '',
      campusArea: currentData?.campusArea ?? '',
      roleId: currentData?.roleId ?? 0,
      isActive: currentData?.isActive !== undefined ? currentData.isActive : true,
    }),
    [currentData]
  );

  const methods = useForm<FormData>({
    resolver: zodResolver(instituteSchema) as Resolver<FormData>,
    defaultValues,
  });

  const { mode } = useAppTheme();
  const isDark = mode === 'dark';

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
    trigger,
    getValues,
    watch,
  } = methods;
  const watchedFields = watch();

  const isFormComplete = useMemo(() => {
    const requiredFields = [
      'instituteName',
      'instituteCode',
      'instituteType',
      'instituteAddress',
      'instituteCity',
      'instituteState',
      'instituteCountry',
      'institutePinCode',
      'institutePhone',
      'instituteEmail',
      'principalName',
      'establishedYear',
    ];

    return requiredFields.every((field) => {
      const value = watchedFields[field as keyof FormData];
      return value !== undefined && value !== null && value !== '';
    });
  }, [watchedFields, isEdit]);


  useEffect(() => {
    setActiveStep(0);
    if (currentData) {
      reset(defaultValues);
    }
  }, [currentData, defaultValues, reset]);

  const instituteTypeOptions = [
    { value: '', label: 'Select Type', disabled: true },
    { value: 'school', label: 'School' },
    { value: 'college', label: 'College' },
    { value: 'university', label: 'University' },
    { value: 'training', label: 'Training Institute' },
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

  const steps = useMemo(
    () => [
      {
        title: <Translated text="Basic Information" />,
        estimate: <Translated text="Approx 2 min" />,
        description: <Translated text="Core identity, credentials, and role permissions." />,
        icon: FaUniversity,
      },
      {
        title: <Translated text="Contact Details" />,
        estimate: <Translated text="Approx 3 min" />,
        description: <Translated text="Primary contact and address details." />,
        icon: FaMapMarkerAlt,
      },
      {
        title: <Translated text="Principal Information" />,
        estimate: <Translated text="Approx 2 min" />,
        description: <Translated text="Primary leadership contact and profile." />,
        icon: FaUser,
      },
      {
        title: <Translated text="Review & Submit" />,
        estimate: 'Approx 1 min',
        description: 'Review all details before submitting.',
        icon: FaSave,
      },
    ],
    []
  );

  const stepFields = useMemo<Array<Array<keyof FormData>>>(() => {
    const basicFields: Array<keyof FormData> = [
      'instituteName',
      'instituteCode',
      'instituteType',
      'establishedYear',
      'affiliation',
      'campusArea',
    ];

    return [
      basicFields,
      [
        'instituteAddress',
        'instituteCity',
        'instituteState',
        'institutePinCode',
        'instituteCountry',
        'institutePhone',
        'instituteEmail',
        'instituteWebsite',
      ],
      [
        'principalName',
        'principalPhone',
        'principalEmail',
        'principalQualification',
        'principalExperience',
        'isActive',
      ],
      [],
    ];
  }, [isEdit]);

  const handleNext = async () => {
    const fields = stepFields[activeStep];
    if (fields.length > 0) {
      const isValid = await trigger(fields);
      if (!isValid) return;
    }

    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (isEdit && currentData?.id) {
        const updatePayload: IUpdateInstitute = {
          instituteName: data.instituteName,
          instituteCode: data.instituteCode,
          instituteType: data.instituteType,
          instituteAddress: data.instituteAddress,
          instituteCity: data.instituteCity,
          instituteState: data.instituteState,
          instituteCountry: data.instituteCountry,
          institutePinCode: data.institutePinCode,
          institutePhone: data.institutePhone,
          instituteEmail: data.instituteEmail,
          instituteWebsite: data.instituteWebsite ?? undefined,
          principalName: data.principalName,
          principalEmail: data.principalEmail ?? undefined,
          principalPhone: data.principalPhone ?? undefined,
          principalQualification: data.principalQualification ?? undefined,
          principalExperience: data.principalExperience ?? undefined,
          establishedYear: data.establishedYear,
          affiliation: data.affiliation ?? undefined,
          campusArea: data.campusArea ?? undefined,
          isActive: data.isActive,
        };

        const result = await updateInstituteService(currentData.id, updatePayload);
        if (result) {
          mutate(endpoints.institute.getAll, (currentData: { data: IInstitute[] } | undefined) => {
            if (!currentData?.data) return { data: [result] };
            return {
              data: currentData.data.map(inst => (inst.id === result.id ? result : inst)),
            };
          }, false);

          router.push('/dashboard/admin/institute/list');
          onSuccess?.();
        }
      } else {
        const createPayload: ICreateInstitute = {
          instituteName: data.instituteName,
          instituteCode: data.instituteCode,
          instituteType: data.instituteType,
          instituteAddress: data.instituteAddress,
          instituteCity: data.instituteCity,
          instituteState: data.instituteState,
          instituteCountry: data.instituteCountry,
          institutePinCode: data.institutePinCode,
          institutePhone: data.institutePhone,
          instituteEmail: data.instituteEmail,
          instituteWebsite: data.instituteWebsite ?? undefined,
          principalName: data.principalName,
          principalEmail: data.principalEmail ?? undefined,
          principalPhone: data.principalPhone ?? undefined,
          principalQualification: data.principalQualification ?? undefined,
          principalExperience: data.principalExperience ?? undefined,
          establishedYear: data.establishedYear,
          affiliation: data.affiliation ?? undefined,
          campusArea: data.campusArea ?? undefined,
          isActive: data.isActive,
        };

        const result = await createInstituteService(createPayload);
        if (result) {
          mutate(endpoints.institute.getAll, (currentData: { data: IInstitute[] } | undefined) => {
            return {
              data: currentData?.data ? [result, ...currentData.data] : [result],
            };
          }, false);

          mutate(endpoints.institute.getAll);
          mutate(`${endpoints.institute.getAll}?searchFor=create`);

          reset();
          router.push('/dashboard/admin/institute/list');
          onSuccess?.();
        }
      }
    } catch {
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} institute.`);
    }
  };

  const handleReset = () => {
    reset(defaultValues);
    toast.info('Form reset to default values');
  };

  return (
    <motion.div
      className={`${isDark ? 'min-h-screen text-gray-100' : 'min-h-screen text-gray-900'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative overflow-hidden">
        <div className={`absolute inset-`} />
        <div className="relative px-4 sm:px-6 lg:px-8 py-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
          <motion.div className="mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className={`text-3xl sm:text-4xl  font-bold ${isDark ? 'text-gray-100' : 'text-slate-950/70'} flex items-center gap-3`}>
                  <span className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDark ? 'bg-slate-950/70' : 'bg-white'}`}>
                    <FaUniversity className={`${isDark ? 'text-white' : 'text-slate-950/70'}`} />
                  </span>
                  {isEdit ? <Translated text="Edit Institute" /> : <Translated text="Create Institute" />}
                </h1>
                <p className={`${isDark ? 'text-gray-300' : 'text-slate-950/70'} mt-2 max-w-2xl`}>
                  {isEdit
                    ? <Translated text="Update institute details with guided steps and review before saving." />
                    : <Translated text="Add a new educational institute with a guided, four-step workflow." />}
                </p>
              </div>
              <div className={`px-4 py-3 rounded-xl border ${isDark ? 'border-slate-700 bg-slate-900/70 text-gray-200' : 'border-slate-200 bg-white text-gray-700'} shadow-sm`}>
                <div className="text-xs uppercase tracking-wide text-gray-400"><Translated text="Estimated time" /></div>
                <div className="text-base font-semibold"><Translated text="~8 minutes" /></div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            <div>
              <div className={`sticky top-4 z-10 ${isDark ? 'bg-slate-950/80' : 'bg-white/80'} backdrop-blur-lg rounded-2xl border ${isDark ? 'border-slate-800' : 'border-slate-200'} shadow-sm mb-6`}>
                <div className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                      {(() => {
                        const Icon = steps[activeStep].icon;
                        return <Icon className="w-4 h-4 text-white" />;
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-400"><Translated text="Step" /> {activeStep + 1} <Translated text="of" /> {steps.length}</div>
                      <h2 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} truncate`}>
                        {steps[activeStep].title}
                      </h2>
                      <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>{steps[activeStep].description}</p>
                    </div>
                    <div className={`text-xs px-3 py-1 rounded-full ${isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'}`}>
                      {steps[activeStep].estimate}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    {steps.map((_, index) => (
                      <div key={index} className="flex-1">
                        <div className={`h-2 rounded-full transition-all duration-300 ${index <= activeStep ? 'bg-linear-to-r bg-cyan-950/35 ' : isDark ? 'bg-slate-800' : 'bg-slate-100'}`} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <FormProvider {...methods}>
                <form id="institute-form" onSubmit={handleSubmit(onSubmit)}>
                  <motion.div className={`${isDark ? 'border border-slate-800 bg-slate-950/70' : 'bg-white border border-slate-200'} rounded-2xl shadow-lg p-6 sm:p-8`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <motion.div key={activeStep} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {activeStep === 0 && (
                        <>
                          <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                                <FaUniversity className="w-4 h-4 text-white" />
                              </div>
                              <h3 className="text-lg font-semibold"><Translated text="Basic Information" /></h3>
                              <span className="text-xs text-gray-500 ml-auto">Required fields *</span>
                            </div>
                          </div>

                          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                            <RHFFormField
                              name="instituteName"
                              label={<Translated text="Institute Name" />}
                              type="text"
                              placeholder={"Enter institute name"}
                              required
                              icon={<FaUniversity />}
                            />
                          </motion.div>

                          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                            <RHFFormField
                              name="instituteCode"
                              label={<Translated text="Institute Code" />}
                              type="text"
                              placeholder={"Enter unique code"}
                              required
                              icon={<FaIdCard />}
                              disabled={isEdit}
                            />
                          </motion.div>

                          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                            <RHFDropDown
                              name="instituteType"
                              label={<Translated text="Institute Type" />}
                              options={instituteTypeOptions}
                              required
                            />
                          </motion.div>

                          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                            <RHFFormField
                              name="establishedYear"
                              label={<Translated text="Established Year" />}
                              type="number"
                              placeholder="Year"
                              min="1900"
                              max={new Date().getFullYear()}
                              required
                              icon={<FaCalendar />}
                            />
                          </motion.div>

                          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                            <RHFFormField
                              name="affiliation"
                              label={<Translated text="Affiliation" />}
                              type="text"
                              placeholder="Affiliation body"
                              icon={<FaGraduationCap />}
                            />
                          </motion.div>

                          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                            <RHFFormField
                              name="campusArea"
                              label={<Translated text="Campus Area (sq. ft.)" />}
                              type="text"
                              placeholder="Area in square feet"
                            />
                          </motion.div>

                        </>
                      )}

                      {activeStep === 1 && (
                        <>
                          <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                                <FaMapMarkerAlt className="w-4 h-4 text-white" />
                              </div>
                              <h3 className="text-lg font-semibold"><Translated text="Contact Details" /></h3>
                              <span className="text-xs text-gray-500 ml-auto"><Translated text="Required fields *" /></span>
                            </div>
                          </div>

                          <motion.div className="md:col-span-2" variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                            <RHFFormField
                              name="instituteAddress"
                              label={<Translated text="Address" />}
                              type="text"
                              placeholder="Street address"
                              required
                              icon={<FaMapMarkerAlt />}
                            />
                          </motion.div>

                          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                            <RHFFormField
                              name="instituteCity"
                              label={<Translated text="City" />}
                              type="text"
                              placeholder="City"
                              required
                            />
                          </motion.div>

                          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                            <RHFFormField
                              name="instituteState"
                              label={<Translated text="State" />}
                              type="text"
                              placeholder="State"
                              required
                            />
                          </motion.div>

                          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                            <RHFFormField
                              name="institutePinCode"
                              label={<Translated text="Pincode" />}
                              type="text"
                              placeholder="Pincode"
                              required
                            />
                          </motion.div>

                          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                            <RHFFormField
                              name="instituteCountry"
                              label={<Translated text="Country" />}
                              type="text"
                              placeholder="Country"
                              required
                            />
                          </motion.div>

                          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                            <RHFFormField
                              name="institutePhone"
                              label={<Translated text="Phone" />}
                              type="text"
                              placeholder="Phone number"
                              required
                              icon={<FaPhone />}
                            />
                          </motion.div>

                          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                            <RHFFormField
                              name="instituteEmail"
                              label={<Translated text="Email" />}
                              type="email"
                              placeholder="Email address"
                              required
                              icon={<FaEnvelope />}
                            />
                          </motion.div>

                          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                            <RHFFormField
                              name="instituteWebsite"
                              label={<Translated text="Website" />}
                              type="text"
                              placeholder="Website URL (e.g., https://example.com)"
                              icon={<FaGlobe />}
                            />
                          </motion.div>
                        </>
                      )}

                      {activeStep === 2 && (
                        <>
                          <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                                <FaUser className="w-4 h-4 text-white" />
                              </div>
                              <h3 className="text-lg font-semibold"><Translated text="Principal Information" /></h3>
                              <span className="text-xs text-gray-500 ml-auto"><Translated text="Required fields *" /></span>
                            </div>
                          </div>

                          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                            <RHFFormField
                              name="principalName"
                              label={<Translated text="Principal Name" />}
                              type="text"
                              placeholder="Full name"
                              required
                              icon={<FaUser />}
                            />
                          </motion.div>

                          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                            <RHFFormField
                              name="principalPhone"
                              label={<Translated text="Principal Contact" />}
                              type="text"
                              placeholder="Contact number"
                              icon={<FaPhone />}
                            />
                          </motion.div>

                          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                            <RHFFormField
                              name="principalEmail"
                              label={<Translated text="Principal Email" />}
                              type="email"
                              placeholder="Email address"
                              icon={<FaEnvelope />}
                            />
                          </motion.div>

                          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                            <RHFDropDown
                              name="principalQualification"
                              label={<Translated text="Principal Qualification" />}
                              options={qualificationOptions}
                            />
                          </motion.div>

                          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                            <RHFDropDown
                              name="principalExperience"
                              label={<Translated text="Principal Experience" />}
                              options={experienceOptions}
                            />
                          </motion.div>

                          <motion.div className="md:col-span-2" variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                            <div className={`flex items-center gap-4 p-4 rounded-xl ${isDark ? 'bg-slate-900/60 border border-slate-800' : 'bg-slate-50 border border-slate-200'}`}>
                              <span className={`${isDark ? 'text-gray-200' : 'text-gray-700'} font-medium`}><Translated text="Status" /></span>
                              <RHFCheckbox
                                name="isActive"
                                label={<span className={`${isDark ? 'text-gray-200' : 'ml-2 text-gray-700'}`}><Translated text="Active" /></span>}
                              />
                            </div>
                          </motion.div>
                        </>
                      )}

                      {activeStep === 3 && (
                        <>
                          <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                                <FaSave className="w-4 h-4 text-white" />
                              </div>
                              <h3 className="text-lg font-semibold"><Translated text="Review & Submit" /></h3>
                              <button
                                type="button"
                                onClick={() => setActiveStep(0)}
                                className={`ml-auto rounded-lg border px-3 py-1 text-xs font-medium transition ${isDark ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'}`}
                              >
                                Edit Inputs
                              </button>
                            </div>
                          </div>

                          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                              { label: 'Institute Name', value: getValues('instituteName') },
                              { label: 'Institute Code', value: getValues('instituteCode') },
                              { label: 'Institute Type', value: getValues('instituteType') },
                              { label: 'Established Year', value: getValues('establishedYear') },
                              { label: 'Affiliation', value: getValues('affiliation') || 'N/A' },
                              { label: 'Campus Area', value: getValues('campusArea') || 'N/A' },
                              { label: 'Address', value: getValues('instituteAddress') },
                              { label: 'City', value: getValues('instituteCity') },
                              { label: 'State', value: getValues('instituteState') },
                              { label: 'Country', value: getValues('instituteCountry') },
                              { label: 'Pincode', value: getValues('institutePinCode') },
                              { label: 'Phone', value: getValues('institutePhone') },
                              { label: 'Email', value: getValues('instituteEmail') },
                              { label: 'Website', value: getValues('instituteWebsite') || 'N/A' },
                              { label: 'Principal Name', value: getValues('principalName') },
                              { label: 'Principal Phone', value: getValues('principalPhone') || 'N/A' },
                              { label: 'Principal Email', value: getValues('principalEmail') || 'N/A' },
                              { label: 'Principal Qualification', value: getValues('principalQualification') || 'N/A' },
                              { label: 'Principal Experience', value: getValues('principalExperience') || 'N/A' },
                              { label: 'Status', value: getValues('isActive') ? 'Active' : 'Inactive' },
                            ].map((item) => (
                              <div
                                key={item.label}
                                className={`p-4 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-slate-50'}`}
                              >
                                <div className="text-xs uppercase tracking-wide text-gray-400">{item.label}</div>
                                <div className={`text-sm font-semibold mt-1 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                                  {item.value || 'N/A'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </motion.div>
                  </motion.div>

                  <div className="mt-6 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={activeStep === 0}
                      className={`text-sm font-medium px-4 py-2 rounded-lg border transition-all duration-300 ease-in-out ${activeStep === 0 ? 'opacity-50 cursor-not-allowed bg-transparent' : 'hover:shadow-md'} ${isDark ? 'border-slate-600 text-slate-200 bg-transparent hover:bg-slate-800/60 hover:border-slate-500' : 'border-slate-300 text-slate-700 bg-transparent hover:bg-slate-100 hover:border-slate-400'}`}
                    >
                      <Translated text="Back" />
                    </button>
                    {activeStep < steps.length - 1 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className={`text-sm font-medium px-5 py-2 rounded-lg bg-linear-to-r from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-500/20 hover:shadow-slate-500/40`}
                      >
                        <Translated text="Continue" />
                      </button>
                    ) : (
                      <div className="text-sm text-gray-400"><Translated text="Ready to submit" /></div>
                    )}
                  </div>

                  <div className="h-24" />
                </form>
              </FormProvider>
            </div>

            <div className="space-y-5">
              <div className={`rounded-2xl border ${isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-white'} p-5 shadow-sm`}>
                <div className="text-xs uppercase tracking-wide text-gray-400"><Translated text="Progress" /></div>
                <div className={`mt-2 text-2xl font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  {Math.round(((activeStep + 1) / steps.length) * 100)}%
                </div>
                <div className="mt-4 space-y-3">
                  {steps.map((_, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${index <= activeStep ? 'bg-slate-500 text-white' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${index <= activeStep ? 'text-slate-400' : isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {index + 1}
                        </div>
                        <div className="text-xs text-gray-400">
                          {typeof steps[index].estimate === 'string' ? (
                            <Translated text={steps[index].estimate} />
                          ) : (
                            steps[index].estimate
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`rounded-2xl border ${isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-white'} p-5 shadow-sm`}>
                <div className="text-sm font-semibold mb-2"><Translated text="Guidance" /></div>
                <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm`}>
                  {isEdit
                    ? <Translated text="Institute code cannot be changed after creation. Password is optional in edit mode." />
                    : <Translated text="All required fields must be completed. Institute code is used as the unique identifier." />}
                </p>
              </div>
            </div>
          </div>
        </div>

        {isFormComplete && (
          <motion.div
            className={`fixed bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] sm:w-auto z-20`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl ${isDark ? 'border-slate-800 bg-slate-950/90' : 'border-slate-200 bg-white/90'} backdrop-blur-lg`}>
              <ParticleButton
                type="button"
                onClick={handleReset}
                className={`flex items-center px-4 py-2 border rounded-lg text-sm font-medium ${isDark ? 'text-gray-200 bg-slate-900 border-slate-800 hover:bg-slate-800' : 'text-slate-700 bg-white border-slate-200 hover:bg-slate-50'}`}
                successDuration={600}
              >
                <FaTimes className="mr-2" />
                {isEdit ? 'Reset Changes' : 'Reset'}
              </ParticleButton>

              <ParticleButton
                type="submit"
                form="institute-form"
                className={`px-4 flex gap-3 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                isDark
                  ? "bg-white text-slate-900 hover:bg-gray-100 shadow-sm"
                  : "bg-slate-800/80 text-white hover:bg-gray-800 shadow-sm"
              }`}
                successDuration={800}
                disabled={isSubmitting}
              >
                {isEdit ? <FaEdit className="mr-2" /> : <FaSave className="mr-2" />}
                {isSubmitting
                  ? (isEdit ? <Translated text="Updating..." /> : <Translated text="Creating..." />)
                  : (isEdit ? <Translated text="Update Institute" /> : <Translated text="Create Institute" />)}
              </ParticleButton>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default InstituteCreate;