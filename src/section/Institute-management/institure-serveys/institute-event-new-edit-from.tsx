import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import * as z from "zod";
import {
  FaSave,
  FaTimes,
  FaBuilding,
  FaMapMarkerAlt,
  FaLink,
  FaPhone,
  FaEnvelope,
  FaMoneyBill,
  FaCalendarAlt,
} from "react-icons/fa";
import { toast } from "sonner";
import RHFDropDown from "../../../components/hook-form/RHFDropDown";
import RHFFormField from "../../../components/hook-form/RHFFormFiled";
import { useTheme } from "@/theme/AppThemeProvider";
import RHFDropzoneField from "../../../components/hook-form/RHFImageUpload";
import RHFContentFormField from "../../../components/hook-form/RHFContent";
import RHFCheckbox from "../../../components/hook-form/RHFCheckbox";
import { Translated } from "../../../components/common/translator/translator";
import {
  ICreateInstituteEvent,
  IInstituteEvent,
  IUpdateInstituteEvent,
} from "../../../types/instituteEvent";
import { useEffect, useMemo } from "react";
import {
  useCreateInstituteEvent,
  useInstituteEvent,
  useInstituteEventMutation,
  useUpdateInstituteEvent,
} from "../../../action/instituteEvent";
import { useRouter } from "../../../hooks/useRouter";
import { useUser } from "../../../atoms/userAtom";

const instituteEventSchema = z
  .object({
    id: z.number().positive().optional(),
    instituteId: z.number().positive(),
    eventTitle: z.string().min(3, "Event title must be at least 3 characters"),
    eventDescription: z
      .string()
      .min(10, "Event description must be at least 10 characters"),
    eventSlug: z.string().min(3, "Slug must be at least 3 characters"),
    eventOrganizer: z
      .string()
      .min(3, "Event organizer must be at least 3 characters"),
    eventStatus: z
      .enum(["upcoming", "ongoing", "completed", "cancelled"])
      .optional(),
    eventVenue: z.string().min(3, "Event venue is required"),
    eventLocation: z.string().min(3).optional(),
    registrationLink: z.string().url().optional().or(z.literal("")),
    eventFee: z.string().optional(),
    eventDuration: z.coerce
      .number()
      .min(1, "Event Duration is required"),
    eventDate: z.string().min(1, "Event date is required"),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    eventStartTime: z.string().min(3, "Start time is required"),
    eventEndTime: z.string().min(3, "End time is required"),
    eventBanner: z.string().min(3, "Event banner is required"),
    eventCategory: z.string().min(3, "Category is required"),
    eventSubCategory: z.string().min(3, "Sub category is required"),
    tags: z.string().optional(),
    eventContact: z.string().min(3, "Contact person is required"),
    eventEmail: z.string().email("Invalid email address"),
    eventPhone: z.string().min(10, "Phone must be at least 10 digits"),
    priority: z.number().optional(),
    viewCount: z.number().optional(),
    isOnline: z.boolean(),
    isFree: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    isPublished: z.boolean().optional(),
    createdBy: z.number().optional(),
    updatedBy: z.number().optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) =>
      new Date(`1970-01-01T${data.eventStartTime}`) <
      new Date(`1970-01-01T${data.eventEndTime}`),
    {
      message: "End time must be after start time",
      path: ["eventEndTime"],
    },
  );

type instituteEventFormData = z.output<typeof instituteEventSchema>;


// Event status options
const eventStatusOptions = [
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const eventCategoryOptions = [
  { value: "", label: "Select Category", disabled: true },
  { value: "academic", label: "Academic" },
  { value: "cultural", label: "Cultural" },
  { value: "sports", label: "Sports" },
  { value: "technology", label: "Technology" },
  { value: "professional", label: "Professional" },
  { value: "workshop", label: "Workshop" },
];

const eventSubCategoryOptions = [
  { value: "", label: "Select Sub-Category", disabled: true },
  { value: "seminar", label: "Seminar/Workshop" },
  { value: "conference", label: "Conference" },
  { value: "training", label: "Training Program" },
  { value: "lecture", label: "Lecture" },
  { value: "competition", label: "Competition" },
  { value: "exhibition", label: "Exhibition" },
];

interface InstituteEventEditProps {
  currentData?: IInstituteEvent | null;
  onSuccess?: () => void;
  instituteEventId?: number;
}

const InstituteEventNewEditForm = ({
  currentData,
  instituteEventId,
  onSuccess,
}: InstituteEventEditProps) => {
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const router = useRouter();
  const { user } = useUser();

  const instituteId =
    user?.data?.authType === "institute" ? (user.data.instituteId ?? 0) : 0;
  const userId = user?.data?.id;

  const shouldFetchId = currentData ? 0 : (instituteEventId ?? 0);
  const { instituteEvent } = useInstituteEvent(shouldFetchId);
  const { refreshInstituteEvent } = useInstituteEventMutation();
  const { instituteEventMutate } = useInstituteEvent(shouldFetchId);
  const updateInstituteEventMutation = useUpdateInstituteEvent;
  const createInstituteEventMutation = useCreateInstituteEvent;
  const sourceData = currentData ?? instituteEvent ?? null;
  const resolvedInstituteId =
    sourceData?.instituteId ?? (instituteId > 0 ? instituteId : 1);

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  const defaultValues: Partial<instituteEventFormData> = useMemo(
    () => ({
      id: sourceData?.id,
      instituteId: resolvedInstituteId,
      eventTitle: sourceData?.eventTitle ?? "",
      eventDescription: sourceData?.eventDescription ?? "",
      eventSlug: sourceData?.eventSlug ?? "",
      eventOrganizer: sourceData?.eventOrganizer ?? "",
      eventStatus: sourceData?.eventStatus ?? "upcoming",
      eventVenue: sourceData?.eventVenue ?? "",
      eventLocation: sourceData?.eventLocation ?? "",
      registrationLink: sourceData?.registrationLink ?? "",
      eventFee: sourceData?.eventFee ?? "",
      eventDuration: Number(sourceData?.eventDuration ?? 1),
      eventDate: formatDateForInput(sourceData?.eventDate),
      latitude: sourceData?.latitude ?? "",
      longitude: sourceData?.longitude ?? "",
      eventStartTime: sourceData?.eventStartTime ?? "",
      eventEndTime: sourceData?.eventEndTime ?? "",
      eventBanner: sourceData?.eventBanner ?? "",
      eventCategory: sourceData?.eventCategory ?? "",
      eventSubCategory: sourceData?.eventSubCategory ?? "",
      tags: sourceData?.tags ?? "",
      eventContact: sourceData?.eventContact ?? "",
      eventEmail: sourceData?.eventEmail ?? "",
      eventPhone: sourceData?.eventPhone ?? "",
      priority: sourceData?.priority ? Number(sourceData.priority) : undefined,
      viewCount: sourceData?.viewCount
        ? Number(sourceData.viewCount)
        : undefined,
      isOnline: sourceData?.isOnline ?? false,
      isFree: sourceData?.isFree ?? false,
      isFeatured: sourceData?.isFeatured ?? false,
      isPublished: sourceData?.isPublished ?? false,
      createdBy: sourceData?.createdBy,
      updatedBy: sourceData?.updatedBy,
      isActive: sourceData?.isActive ?? true,
    }),
    [sourceData, resolvedInstituteId],
  );

 const methods = useForm<
  z.input<typeof instituteEventSchema>,
  any,
  z.output<typeof instituteEventSchema>
>({
  resolver: zodResolver(instituteEventSchema),
  defaultValues,
});

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
    watch,
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit: SubmitHandler<z.output<typeof instituteEventSchema>> = async (
    data: instituteEventFormData,
  ) => {
    try {
      const payload: ICreateInstituteEvent = {
        ...data,
        eventLocation: data.eventLocation ?? "",
        eventVenue: data.eventVenue ?? "",
        instituteId: data.instituteId,
        createdBy: userId ?? data.createdBy,
        updatedBy: userId ?? data.updatedBy,
        priority: data.priority ? Number(data.priority) : undefined,
        viewCount: data.viewCount ? Number(data.viewCount) : undefined,
        ...(data.tags ? { tags: data.tags } : { tags: null }),
        ...(data.registrationLink
          ? { registrationLink: data.registrationLink }
          : { registrationLink: null }),
        ...(data.eventFee ? { eventFee: data.eventFee } : { eventFee: null }),
        ...(data.latitude ? { latitude: data.latitude } : { latitude: null }),
        ...(data.longitude
          ? { longitude: data.longitude }
          : { longitude: null }),
      };

      if (sourceData?.id) {
        const result = await updateInstituteEventMutation(
          sourceData.id,
          payload as IUpdateInstituteEvent,
        );
        if (result) {
          await refreshInstituteEvent();
          if (instituteEventMutate) await instituteEventMutate();
          if (onSuccess) onSuccess();
          router.push("/dashboard/institute-management/institute-event/list");
        }
      } else {
        const result = await createInstituteEventMutation(payload);
        if (result) {
          if (instituteEventMutate) await instituteEventMutate();
          if (onSuccess) onSuccess();
          reset();
        }
      }
    } catch (error) {
      console.error(<Translated text="Error saving event:" />, error);
      toast.error(<Translated text="Failed to save event." />);
    }
  };

  const handleReset = () => {
    reset(defaultValues);
    toast.info(<Translated text="Form reset successfully." />);
  };

  return (
    <div className={`min-h-screen `}>
      <main className=" mx-auto  py-2">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`${isDark ? "bg-slate-950/70 border border-slate-700" : "bg-white"} rounded-xl shadow-lg p-4 md:p-6 mb-6`}
          >
            <header
              className={`${isDark ? "bg-slate-950/70 border-b border-slate-700 text-white " : "bg-white border-b border-slate-200 "} rounded-b-xl`}
            >
              <div className=" mx-auto px-3 sm:px-4 py-3 sm:py-4 md:py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <div className="p-3 bg-linear-to-r from-slate-500 to-slate-500 rounded-full mr-4">
                      <FaCalendarAlt className="text-white text-xl" />
                    </div>
                    <h1
                      className={`text-3xl font-bold ${isDark ? "text-slate-100" : "text-slate-950/70"} flex items-center`}
                    >
                      {sourceData?.id ? (
                        <Translated text="Edit Institute Event" />
                      ) : (
                        <Translated text="Create Institute Event" />
                      )}
                    </h1>
                  </div>
                  <div />
                </div>
              </div>
            </header>
            <div className="mb-4 md:mb-6" />
            <>
              {/* Basic Information */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={` rounded-xl shadow-lg p-4 md:p-6 mb-6`}
              >
                <h2
                  className={`${isDark ? "text-slate-100" : "text-slate-900"} text-lg sm:text-xl md:text-2xl font-semibold mb-4 md:mb-6`}
                >
                  <Translated text="Basic Information" />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <RHFFormField
                        name="eventTitle"
                        label={"Event Title"}
                        type="text"
                        placeholder="e.g., Annual Conference 2025"
                        required
                      />
                      <RHFFormField
                        name="eventSlug"
                        label="Event Slug"
                        type="text"
                        placeholder="auto-generated from title"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2"></div>

                  <div className="col-span-1 md:col-span-2">
                    <RHFContentFormField
                      name="eventDescription"
                      label="Event Description"
                      required
                    />
                  </div>
                </div>
              </motion.div>

              {/* Event Details */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={` rounded-xl shadow-lg p-4 md:p-6 mb-6`}
              >
                <h2
                  className={`${isDark ? "text-slate-100" : "text-slate-900"} text-lg sm:text-xl md:text-2xl font-semibold mb-4 md:mb-6`}
                >
                  <Translated text="Event Details" />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  <div>
                    <RHFFormField
                      name="eventDate"
                      label={<Translated text="Event Date" />}
                      type="date"
                      required
                      icon={<FaCalendarAlt />}
                      placeholder={undefined}
                    />
                  </div>

                  <div>
                    <RHFFormField
                      name="eventStartTime"
                      label={<Translated text="Start Time" />}
                      type="time"
                      required
                      placeholder={undefined}
                    />
                  </div>

                  <div>
                    <RHFFormField
                      name="eventEndTime"
                      label={<Translated text="End Time" />}
                      type="time"
                      required
                      placeholder={undefined}
                    />
                  </div>

                  <div>
                    <RHFFormField
                      name="eventDuration"
                      label={<Translated text="Duration (hours)" />}
                      type="number"
                      placeholder="e.g., 2"
                      required
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <RHFDropDown
                      name="eventStatus"
                      label={<Translated text="Event Status" />}
                      options={eventStatusOptions}
                      placeholder="Select status"
                      required={false}
                    />
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={` rounded-xl shadow-lg p-4 md:p-6  mb-6`}
              >
                <h2
                  className={`${isDark ? "text-slate-100" : "text-slate-900"} text-lg sm:text-xl md:text-2xl font-semibold mb-4 md:mb-6`}
                >
                  <Translated text="Event Banner" />
                </h2>
                <div>
                  <RHFDropzoneField name="eventBanner" />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  <Translated text="Recommended: 16:9 aspect ratio, min 1200x675px" />
                </p>
              </motion.div>
              {/* Location Details */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={` rounded-xl shadow-lg p-4 md:p-6 mb-6`}
              >
                <h2
                  className={`${isDark ? "text-slate-100" : "text-slate-900"} text-lg sm:text-xl md:text-2xl font-semibold mb-4 md:mb-6`}
                >
                  <Translated text="Location Details" />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <RHFCheckbox
                      name="isOnline"
                      label={
                        <Translated text="This is an online/virtual event" />
                      }
                    />
                  </div>

                  {!watch("isOnline") && (
                    <>
                      <div className="col-span-1 md:col-span-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <RHFFormField
                            name="eventVenue"
                            label={<Translated text="Venue Name" />}
                            type="text"
                            placeholder="e.g., Convention Center, Auditorium"
                            required
                            icon={<FaBuilding />}
                          />
                          <RHFFormField
                            name="eventLocation"
                            label={<Translated text="Full Address" />}
                            type="text"
                            placeholder="Street, City, State, ZIP Code"
                            required={false}
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
                          required={false}
                        />
                      </div>

                      <div className="col-span-1 sm:col-span-1">
                        <RHFFormField
                          name="longitude"
                          label={<Translated text="Longitude" />}
                          type="text"
                          placeholder="e.g., -74.0060"
                          required={false}
                        />
                      </div>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Registration Details */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={` rounded-xl shadow-lg p-4 md:p-6 mb-6`}
              >
                <h2
                  className={`${isDark ? "text-slate-100" : "text-slate-900"} text-lg sm:text-xl md:text-2xl font-semibold mb-4 md:mb-6`}
                >
                  <Translated text="Registration & Pricing" />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <RHFFormField
                      name="registrationLink"
                      label={<Translated text="Registration Link" />}
                      type="url"
                      placeholder="https://register.example.com"
                      icon={<FaLink />}
                      required={false}
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <RHFCheckbox
                      name="isFree"
                      label={<Translated text="Free Event" />}
                    />
                  </div>

                  {!watch("isFree") && (
                    <div className="col-span-1 sm:col-span-1">
                      <RHFFormField
                        name="eventFee"
                        label={<Translated text="Event Fee" />}
                        type="text"
                        placeholder="e.g., $50, ₹500"
                        icon={<FaMoneyBill />}
                        required={false}
                      />
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Categorization */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={` rounded-xl shadow-lg p-4 md:p-6 mb-6`}
              >
                <h2
                  className={`${isDark ? "text-slate-100" : "text-slate-900"} text-lg sm:text-xl md:text-2xl font-semibold mb-4 md:mb-6`}
                >
                  <Translated text="Categorization" />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  <div>
                    <RHFDropDown
                      name="eventCategory"
                      label="Category"
                      options={eventCategoryOptions}
                      placeholder="Select category"
                      required
                    />
                  </div>

                  <div>
                    <RHFDropDown
                      name="eventSubCategory"
                      label="Sub-Category"
                      options={eventSubCategoryOptions}
                      placeholder="Select sub-category"
                      required
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <RHFFormField
                        name="tags"
                        label="Tags"
                        type="text"
                        placeholder="e.g., education, technology, webinar"
                        required={false}
                      />
                      <RHFFormField
                        name="priority"
                        label="Event Priority"
                        type="number"
                        placeholder="0-10 (0 = Lowest, 10 = Highest)"
                        min={0}
                        max={10}
                        required={false}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={` rounded-xl shadow-lg p-4 md:p-6 mb-6`}
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
                      label="Organizer Name"
                      type="text"
                      placeholder="Department/Organization Name"
                      required
                    />
                  </div>

                  <div className="col-span-1 md:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                      <div>
                        <RHFFormField
                          name="eventContact"
                          label="Contact Person"
                          type="text"
                          placeholder="John Doe"
                          required
                        />
                      </div>

                      <div>
                        <RHFFormField
                          name="eventEmail"
                          label="Contact Email"
                          type="email"
                          placeholder="contact@example.com"
                          required
                          icon={<FaEnvelope />}
                        />
                      </div>

                      <div>
                        <RHFFormField
                          name="eventPhone"
                          label="Contact Phone"
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

              {/* Event Settings */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={` rounded-xl shadow-lg p-4 md:p-6 mb-6`}
              >
                <h2
                  className={`${isDark ? "text-slate-100" : "text-slate-900"} text-lg sm:text-xl md:text-2xl font-semibold mb-4 md:mb-6`}
                >
                  <Translated text="Event Settings" />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <RHFCheckbox
                      name="isFeatured"
                      label={<Translated text="Featured Event" />}
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <RHFCheckbox
                      name="isPublished"
                      label={<Translated text="Published" />}
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

            <div className={` mt-6 py-3 rounded-t-xl`}>
              <div className=" mx-auto px-2 sm:px-3 md:px-4 flex flex-col-reverse sm:flex-row items-center justify-end gap-2 sm:gap-3">
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
                  <FaSave className="mr-2" />
                  {isSubmitting ? (
                    sourceData?.id ? (
                      <Translated text="Updating..." />
                    ) : (
                      <Translated text="Creating..." />
                    )
                  ) : sourceData?.id ? (
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

export default InstituteEventNewEditForm;
