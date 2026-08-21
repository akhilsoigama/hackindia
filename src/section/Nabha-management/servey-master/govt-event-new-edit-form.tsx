import { useEffect, useMemo } from "react";
import {
  useForm,
  FormProvider,
  SubmitHandler,
  Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  FaUserTie,
  FaBuilding,
  FaTimes,
  FaMapMarkerAlt,
  FaLink,
  FaPhone,
  FaEnvelope,
  FaMoneyBill,
  FaUsers,
  FaEdit,
  FaSave,
} from "react-icons/fa";
import RHFFormField from "../../../components/hook-form/RHFFormFiled";
import RHFCheckbox from "../../../components/hook-form/RHFCheckbox";
import { toast } from "sonner";
import {
  IGovtEvent,
  ICreateGovtEvent,
  IUpdateGovtEvent,
} from "../../../types/govtEvent";
import {
  useGetGovtEvent,
  createGovtEvent,
  updateGovtEvent,
  useGovtEventMutations,
} from "../../../action/govtEvent";
import DetailsSection from "./sections/DetailsSection";
import { Translated } from "../../../components/common/translator/translator";
import RHFDropzoneField from "../../../components/hook-form/RHFImageUpload";
import {
  formatDateForInput,
  formatTimeForInput,
  cleanCloudinaryUrl,
} from "../../../utils/utils";
import { useRouter } from "../../../hooks/useRouter";
import { useTheme } from "@/theme/AppThemeProvider";
const eventSchema = z
  .object({
    eventTitle: z.string().min(1, "Event title is required"),
    eventSlug: z.string().min(1, "Event slug is required"),
    eventDescription: z.string().optional(),

    eventDate: z.string().min(1, "Event date is required"),
    eventTime: z.string().min(1, "Event time is required"),
    eventDuration: z.union([z.string(), z.number()])
    .transform((val) => (typeof val === "number" ? val : Number(val)))
    .refine((val) => Number.isFinite(val) && val >= 1, {
      message: "Event duration is required",
    }),

    eventBanner: z.string().optional(),
    eventLink: z.string().url().optional().or(z.literal("")),
    registrationLink: z.string().url().optional().or(z.literal("")),

    eventOrganizer: z.string().min(1, "Event organizer is required"),
    organizerLogo: z.string().optional(),

    eventContact: z.string().min(1, "Contact person is required"),
    eventEmail: z.string().email("Invalid email"),
    eventPhone: z.string().min(1, "Phone number is required"),

    eventCategory: z.string().min(1, "Category is required"),
    eventSubCategory: z.string().min(1, "Sub-category is required"),
    tags: z.string().optional(),

    eventVenue: z.string().min(1, "Venue is required"),
    eventLocation: z.string().min(1, "Location is required"),
    latitude: z.string().optional(),
    longitude: z.string().optional(),

    viewCount: z.coerce.number().optional(),
    isOnline: z.boolean(),
    eventFee: z.string().optional().refine(
      (val) => {
        if (!val || val.trim() === "") return true; // allow empty since it's optional
        const num = Number(val);
        return !isNaN(num) && num > 0;
      },
      { message: "Event fee must be a positive number" }
    ),
    isFree: z.boolean(),

    eventStatus: z.enum(["upcoming", "ongoing", "completed", "cancelled"]),
    priority: z.coerce
      .number()
      .min(0, "Priority must be at least 0")
      .max(10, "Priority must be at most 10")
      .default(0),
    isFeatured: z.boolean(),
    isActive: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.isFree && data.eventFee?.trim()) {
        return false;
      }
      return true;
    },
    {
      message: "Free events cannot have a fee",
      path: ["eventFee"],
    },
  );

type EventFormData = z.infer<typeof eventSchema>;

interface GovtEventCreateProps {
  currentData?: IGovtEvent | null;
  onSuccess?: () => void;
  govtEventId?: number;
}

const GovtEventNewEditForm = ({
  currentData,
  onSuccess,
  govtEventId,
}: GovtEventCreateProps) => {
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const router = useRouter();
  const resolver = zodResolver(eventSchema) as Resolver<EventFormData>;

  const methods = useForm<EventFormData>({
    resolver,
    defaultValues: {
      priority: 0,
      isOnline: false,
      isFree: false,
      isFeatured: false,
      isActive: true,
      eventStatus: "upcoming",
      viewCount: 0,
    },
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  const isFree = watch("isFree");

  const shouldFetchId = currentData ? 0 : (govtEventId ?? 0);
  const { govtEvent, govtEventLoading, govtEventError, govtEventMutate } =
    useGetGovtEvent(shouldFetchId);
  const { refreshgovtEvents } = useGovtEventMutations();

  const sourceData = currentData ?? govtEvent ?? null;

  const mergedDefaultValues: Partial<EventFormData> = useMemo(
    () => ({
      eventTitle: sourceData?.eventTitle || "",
      eventSlug: sourceData?.eventSlug || "",
      eventDescription: sourceData?.eventDescription || "",

      eventDate: formatDateForInput(sourceData?.eventDate) || "",
      eventTime: formatTimeForInput(sourceData?.eventTime) || "",
      eventDuration: Number(sourceData?.eventDuration ?? 1),

      eventBanner: cleanCloudinaryUrl(sourceData?.eventBanner) || "",
      eventLink: sourceData?.eventLink || "",
      registrationLink: sourceData?.registrationLink || "",

      eventOrganizer: sourceData?.eventOrganizer || "",
      organizerLogo: sourceData?.organizerLogo || "",

      eventContact: sourceData?.eventContact || "",
      eventEmail: sourceData?.eventEmail || "",
      eventPhone: sourceData?.eventPhone || "",

      eventCategory: sourceData?.eventCategory || "",
      eventSubCategory: sourceData?.eventSubCategory || "",
      tags: sourceData?.tags || "",

      eventVenue: sourceData?.eventVenue || "",
      eventLocation: sourceData?.eventLocation || "",
      latitude: sourceData?.latitude || "",
      longitude: sourceData?.longitude || "",

      isOnline: sourceData?.isOnline || false,
      eventFee: sourceData?.eventFee || "",
      isFree: sourceData?.isFree || false,
      viewCount: sourceData?.viewCount || 0,

      eventStatus: sourceData?.eventStatus || "upcoming",
      priority: sourceData?.priority ? Number(sourceData.priority) : 0,
      isFeatured: sourceData?.isFeatured || false,
      isActive: sourceData?.isActive ?? true,
    }),
    [sourceData],
  );

  useEffect(() => {
    reset(mergedDefaultValues);
  }, [reset, mergedDefaultValues]);

  if (!currentData && govtEventId && govtEventLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loader mb-3">
            <Translated text="Loading event..." />
          </div>
          <p className="text-sm text-slate-600">
            <Translated text="Fetching event details..." />
          </p>
        </div>
      </div>
    );
  }

  if (govtEventError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-3">
            <Translated text="Failed to load event data." />
          </p>
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => govtEventMutate && govtEventMutate()}
              className="px-3 py-1 bg-blue-600 text-white rounded-md"
            >
              <Translated text="Retry" />
            </button>
            <button
              onClick={() => {
                if (onSuccess) onSuccess();
              }}
              className="px-3 py-1 bg-slate-200 text-slate-800 rounded-md"
            >
              <Translated text="Close" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const onSubmit: SubmitHandler<EventFormData> = async (data) => {
    try {
      const submissionData: Partial<IGovtEvent> = {
        ...data,
        priority: Number(data.priority) || 0,
        viewCount: Number(data.viewCount) || 0,
        eventDescription: data.eventDescription || undefined,
        eventLink: data.eventLink || undefined,
        registrationLink: data.registrationLink || undefined,
        organizerLogo: data.organizerLogo || undefined,
        tags: data.tags || undefined,
        latitude: data.latitude || undefined,
        longitude: data.longitude || undefined,
        eventFee: data.eventFee || undefined,
      };

      if (sourceData?.id) {
        const updated = await updateGovtEvent(
          sourceData.id,
          submissionData as IUpdateGovtEvent,
        );
        if (updated) {
          await refreshgovtEvents();
          if (govtEventMutate) await govtEventMutate();
          if (onSuccess) onSuccess();
          router.push("/dashboard/admin/govtEvent-master/list");
        }
      } else {
        const created = await createGovtEvent(
          submissionData as ICreateGovtEvent,
        );
        if (created) {
          await refreshgovtEvents();
          if (onSuccess) onSuccess();
          reset(mergedDefaultValues);
        }
      }
    } catch (error) {
      toast.error(<Translated text="Failed to save event" />);
      console.error(<Translated text="Error submitting event:" />, error);
    }
  };

  const handleReset = () => {
    reset(mergedDefaultValues);
  };

  const categoryOptions = [
    { value: "", label: "Select Category", disabled: true },
    { value: "health", label: "Health & Wellness" },
    { value: "education", label: "Education & Training" },
    { value: "infrastructure", label: "Infrastructure" },
    { value: "finance", label: "Finance & Economy" },
    { value: "environment", label: "Environment & Sustainability" },
    { value: "urban", label: "Urban Development" },
    { value: "agriculture", label: "Agriculture" },
    { value: "technology", label: "Technology & Innovation" },
    { value: "security", label: "Public Safety & Security" },
    { value: "culture", label: "Culture & Heritage" },
  ];

  const subCategoryOptions = [
    { value: "", label: "Select Sub-Category", disabled: true },
    { value: "seminar", label: "Seminar/Workshop" },
    { value: "conference", label: "Conference" },
    { value: "training", label: "Training Program" },
    { value: "awareness", label: "Awareness Campaign" },
    { value: "launch", label: "Product/Service Launch" },
    { value: "meeting", label: "Public Meeting" },
    { value: "ceremony", label: "Ceremony/Inauguration" },
    { value: "exhibition", label: "Exhibition/Fair" },
    { value: "competition", label: "Competition" },
    { value: "consultation", label: "Public Consultation" },
  ];
  return (
    <div className={`min-h-screen `}>
      <main
        className={`container${isDark ? "bg-slate-950/70 border border-slate-700" : "bg-white border border-slate-200"} rounded-xl shadow-lg p-4 md:p-6 mb-6 mx-auto px-2 sm:px-3 md:px-4 py-2`}
      >
        <header>
          <div
            className={`container ${isDark ? "bg-slate-950/70 " : "bg-white border"} mx-auto px-3 sm:px-4 py-3 rounded-xl sm:py-4 md:py-6`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <FaBuilding
                  className={` text-xl ${isDark ? "text-white" : "text-slate-950/70"}`}
                />
                <h1
                  className={`text-3xl font-bold ${isDark ? "text-slate-100" : "text-slate-950/70"} flex items-center`}
                >
                  {sourceData ? (
                    <Translated text="Edit Government Event" />
                  ) : (
                    <Translated text="Create Government Event" />
                  )}
                </h1>
              </div>
              <div />
            </div>
          </div>
        </header>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4 md:mb-6" />

            <>
              <DetailsSection
                categoryOptions={categoryOptions}
                subCategoryOptions={subCategoryOptions}
              />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`${isDark ? "bg-slate-950/70" : "bg-white border border-slate-200"} rounded-xl shadow-lg p-4 md:p-6 mb-6`}
              >
                <h2
                  className={`${isDark ? "text-slate-100" : "text-slate-900"} text-lg sm:text-xl md:text-2xl font-semibold mb-4 md:mb-6`}
                >
                  <Translated text="Location Details" />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <RHFFormField
                        name="eventVenue"
                        label={<Translated text="Venue Name" />}
                        type="text"
                        placeholder="e.g., Convention Center, City Hall"
                        required
                        icon={<FaBuilding />}
                      />
                      <RHFFormField
                        name="eventLocation"
                        label={<Translated text="Full Address" />}
                        type="text"
                        placeholder="Street, City, State, ZIP Code"
                        required
                        icon={<FaMapMarkerAlt />}
                      />
                    </div>
                  </div>

                  <div className="col-span-1 sm:col-span-1">
                    <RHFFormField
                      name="latitude"
                      label={<Translated text="Latitude" />}
                      type="text"
                      placeholder="e.g., 40.7128"
                    />
                  </div>

                  <div className="col-span-1 sm:col-span-1">
                    <RHFFormField
                      name="longitude"
                      label={<Translated text="Longitude" />}
                      type="text"
                      placeholder="e.g., -74.0060"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <RHFCheckbox
                      name="isOnline"
                      label={
                        <Translated text="This is an online/virtual event" />
                      }
                    />
                  </div>

                  {watch("isOnline") && (
                    <>
                      <div className="col-span-1 md:col-span-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <RHFFormField
                            name="eventLink"
                            label={<Translated text="Event Link/URL" />}
                            type="url"
                            placeholder="https://meet.example.com/event"
                            icon={<FaLink />}
                          />
                          <RHFFormField
                            name="registrationLink"
                            label={<Translated text="Registration Link" />}
                            type="url"
                            placeholder="https://register.example.com"
                            icon={<FaUsers />}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`${isDark ? "bg-slate-950/70 " : "bg-white border"} p-4 md:p-6 mb-6`}
              >
                <h2
                  className={`${isDark ? "text-slate-100" : "text-slate-900"} text-lg sm:text-xl md:text-2xl font-semibold mb-4 md:mb-6`}
                >
                  <Translated text="Organizer Details" />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <RHFFormField
                      name="eventOrganizer"
                      label={<Translated text="Organizer Name" />}
                      type="text"
                      placeholder="Government Department/Agency"
                      required
                      icon={<FaUserTie />}
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="w-full">
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          <Translated text="Organizer Logo" />
                        </label>
                        <div>
                          <RHFDropzoneField name="organizerLogo" />
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                          <Translated text="Recommended: Square format, min 200x200px" />
                        </p>
                      </div>

                      <div className="w-full">
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          <Translated text="Event Banner Image" />
                        </label>
                        <div>
                          <RHFDropzoneField name="eventBanner" />
                        </div>
                        {errors.eventBanner && (
                          <p className={`mt-2 text-xs font-semibold flex items-center gap-1.5 px-2.5 py-1.5 rounded-md leading-tight ${isDark
                            ? 'text-red-300 bg-red-950/50 border border-red-800/60'
                            : 'text-red-700 bg-red-50 border border-red-200'
                            }`}>
                            <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                            </svg>
                            {errors.eventBanner.message}
                          </p>
                        )}
                        <p className="text-xs text-slate-500 mt-2">
                          <Translated text="Recommended: 16:9 aspect ratio, min 1200x675px" />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                      <div>
                        <RHFFormField
                          name="eventContact"
                          label={<Translated text="Contact Person" />}
                          type="text"
                          placeholder="John Doe"
                          required
                          icon={<FaUserTie />}
                        />
                      </div>

                      <div>
                        <RHFFormField
                          name="eventEmail"
                          label={<Translated text="Contact Email" />}
                          type="email"
                          placeholder="contact@example.com"
                          required
                          icon={<FaEnvelope />}
                        />
                      </div>

                      <div>
                        <RHFFormField
                          name="eventPhone"
                          label={<Translated text="Contact Phone" />}
                          type="tel"
                          placeholder="+1234567890"
                          required
                          icon={<FaPhone />}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`${isDark ? "bg-slate-950/70 " : "bg-white border "} shadow-lg p-4 md:p-6 mb-6`}
              >
                <h2
                  className={`${isDark ? "text-slate-100" : "text-slate-900"} text-lg sm:text-xl md:text-2xl font-semibold mb-4 md:mb-6`}
                >
                  Event Settings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <RHFCheckbox
                      name="isFree"
                      label={<Translated text="Free Event" />}
                    />
                  </div>

                  {!isFree && (
                    <div className="col-span-1 sm:col-span-1">
                      <RHFFormField
                        name="eventFee"
                        label={<Translated text="Event Fee" />}
                        type="text"
                        placeholder="e.g., $50, ₹500, Free"
                        icon={<FaMoneyBill />}
                      />
                    </div>
                  )}

                  <div className="col-span-1 sm:col-span-1">
                    <RHFFormField
                      name="priority"
                      label={<Translated text="Event Priority" />}
                      type="number"
                      placeholder="0-10 (0 = Lowest, 10 = Highest)"
                      min={0}
                      max={10}
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <RHFCheckbox
                      name="isFeatured"
                      label={<Translated text="Featured Event" />}
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <RHFCheckbox
                      name="isActive"
                      label={<Translated text="Active Event" />}
                    />
                  </div>
                </div>
              </motion.div>
            </>

            <div>
              <div className="container mx-auto px-2 sm:px-3 md:px-4 flex flex-col-reverse sm:flex-row items-center justify-end gap-2 sm:gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleReset}
                  className={`flex items-center px-4 py-2 border rounded-lg text-sm font-medium ${isDark ? "text-slate-200 bg-slate-900 border-slate-800 hover:bg-slate-800" : "text-slate-700 bg-white border-slate-200 hover:bg-slate-50"}`}
                >
                  <FaTimes className="mr-2 text-sm" />
                  <span>
                    <Translated text="Reset" />
                  </span>
                </motion.button>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 flex  items-center justify-center py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${isDark
                    ? "bg-white text-slate-900 hover:bg-slate-100 shadow-sm"
                    : "bg-slate-800/80 text-white hover:bg-slate-800 shadow-sm"
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {sourceData ? (
                    <FaEdit className="mr-2" />
                  ) : (
                    <FaSave className="mr-2" />
                  )}
                  {isSubmitting ? (
                    sourceData ? (
                      <Translated text="Updating..." />
                    ) : (
                      <Translated text="Creating..." />
                    )
                  ) : sourceData ? (
                    <Translated text="Update Event" />
                  ) : (
                    <Translated text="Create Event" />
                  )}
                </motion.button>
              </div>
            </div>
          </form>
        </FormProvider>
      </main>
    </div>
  );
};

export default GovtEventNewEditForm;
