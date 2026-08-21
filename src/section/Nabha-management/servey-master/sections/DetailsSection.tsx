import { memo } from "react";
import RHFFormField from "../../../../components/hook-form/RHFFormFiled";
import RHFDropDown from "../../../../components/hook-form/RHFDropDown";
import { FaBuilding, FaLink, FaCalendarAlt, FaTag } from "react-icons/fa";
import { useTheme } from "@/theme/AppThemeProvider";
import RHFContentFormField from "../../../../components/hook-form/RHFContent";
import { Translated } from "../../../../components/common/translator/translator";

const STATUS_OPTIONS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];
interface DetailsProps {
  categoryOptions?: { value: string; label: string; disabled?: boolean }[];
  subCategoryOptions?: { value: string; label: string; disabled?: boolean }[];
}

const DetailsSection = ({
  categoryOptions = [],
  subCategoryOptions = [],
}: DetailsProps) => {
  const { mode } = useTheme();
  const isDark = mode === "dark";
  return (
    <div
      className={`${isDark ? "bg-slate-950/70" : "bg-white"} rounded-lg shadow-md p-4 md:p-6 mb-6`}
    >
      <h2
        className={`${isDark ? "text-gray-100" : "text-gray-900"} text-lg sm:text-xl md:text-2xl font-semibold mb-4 md:mb-6`}
      >
        <Translated text="Event Details" />
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <div className="col-span-1 md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <RHFFormField
              name="eventTitle"
              label={<Translated text="Event Title" />}
              type="text"
              placeholder="Enter event title"
              required
              icon={<FaBuilding />}
            />
            <RHFFormField
              name="eventSlug"
              label={<Translated text="Event Slug" />}
              type="text"
              placeholder="event-slug-url"
              required
              icon={<FaLink />}
            />
          </div>
        </div>

        <div className="col-span-1 sm:col-span-1">
          <RHFFormField
            name="eventDate"
            label={<Translated text="Event Date" />}
            type="date"
            required
            icon={<FaCalendarAlt />}
            placeholder={undefined}
          />
        </div>

        <div className="col-span-1 sm:col-span-1">
          <RHFFormField
            name="eventTime"
            label={<Translated text="Event Time" />}
            type="time"
            required
            placeholder={undefined}
          />
        </div>

        <div className="col-span-1 sm:col-span-1 md:col-span-1">
          <RHFFormField
            name="eventDuration"
            label={<Translated text="Duration (minutes)" />}
            type="number"
            placeholder="e.g., 90"
            min={1}
            required
          />
        </div>

        <div className="col-span-1 sm:col-span-1 md:col-span-1">
          <RHFDropDown
            name="eventStatus"
            label={<Translated text="Event Status" />}
            options={STATUS_OPTIONS}
            icon={<FaCalendarAlt />}
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <RHFContentFormField
            name="eventDescription"
            label={<Translated text="Event Description" />}
            required={true}
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <RHFDropDown
              name="eventCategory"
              label={<Translated text="Event Category" />}
              options={categoryOptions}
              required
            />
            <RHFDropDown
              name="eventSubCategory"
              label={<Translated text="Event Sub-Category" />}
              options={subCategoryOptions}
              required
            />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2"></div>

        <div className="col-span-1 md:col-span-2">
          <RHFFormField
            name="tags"
            label={<Translated text="Tags (comma-separated)" />}
            type="text"
            placeholder="tag1, tag2"
            icon={<FaTag />}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(DetailsSection);
