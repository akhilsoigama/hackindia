import { useGetAllGovtEvents } from "@/action/govtEvent";
import { useGetInstituteEvents } from "@/action/instituteEvent";
import { useUser } from "@/atoms/userAtom";
import EventCard from "@/components/common/event-list/EventCard";
import RegistrationModal from "@/components/common/event-list/RegistrationModal";
import SearchAndFilter from "@/components/common/SearchAndFilter";
import { IGovtEvent } from "@/types/govtEvent";
import { IInstituteEvent } from "@/types/instituteEvent";



import { useState, useMemo, useCallback } from "react";
import { useTheme } from '@/theme/AppThemeProvider';
const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const InstituteWithGovtEventListView = () => {

  const { user } = useUser();
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const { govtEvents = [], govtEventsLoading } = useGetAllGovtEvents();
  const { instituteEvents = [], instituteEventsLoading } = useGetInstituteEvents();

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [eventType, setEventType] = useState("all");

  // Registration modal state
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Filtered events
  const filteredInstituteEvents = useMemo(() => {
    if (eventType === "govt") return [];
    const base = user?.instituteId
      ? instituteEvents.filter((evt: IInstituteEvent) => evt.instituteId === user.instituteId)
      : [];
    return base.filter((event) => {
      const matchesSearch =
        searchTerm === "" ||
        event.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.eventDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.eventCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.eventOrganizer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || event.eventStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [instituteEvents, user?.instituteId, searchTerm, statusFilter, eventType]);

  const filteredGovtEvents = useMemo(() => {
    if (eventType === "institute") return [];
    return govtEvents.filter((event) => {
      const matchesSearch =
        searchTerm === "" ||
        event.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.eventDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.eventCategory.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || event.eventStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [govtEvents, searchTerm, statusFilter, eventType]);

  const handleReset = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("all");
    setEventType("all");
  }, []);

  return (
    <div className={`p-4 md:p-6 min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <h2 className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Institute with Govt Events</h2>

        <div className="flex-1">
          <SearchAndFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onReset={handleReset}
            filterOptions={{ status: statusOptions }}
          />
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredGovtEvents.map((event: IGovtEvent) => (
          <EventCard
            key={"govt-" + event.id}
            event={event}
            timeLabel={event.eventTime || ""}
            showViewAction={false}
            showEditAction={false}
            showDeleteAction={false}
            eventTypeBadge="Govt Event"
            ctaLabel="Registration"
            onView={() => {
              setSelectedEvent(event);
              setRegistrationOpen(true);
            }}
          />
        ))}
        {filteredInstituteEvents.map((event: IInstituteEvent) => (
          <EventCard
            key={"inst-" + event.id}
            event={event}
            timeLabel={`${event.eventStartTime} - ${event.eventEndTime}`}
            showViewAction={false}
            showEditAction={false}
            showDeleteAction={false}
            eventTypeBadge="Institute Event"
            ctaLabel="Registration"
            onView={() => {
              setSelectedEvent(event);
              setRegistrationOpen(true);
            }}
          />
        ))}

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={registrationOpen}
        onClose={() => setRegistrationOpen(false)}
        event={selectedEvent}
      />
      </div>
      {(govtEventsLoading || instituteEventsLoading) && <div className={isDark ? "text-white" : "text-gray-900"}>Loading events...</div>}
      {filteredGovtEvents.length === 0 && filteredInstituteEvents.length === 0 && !(govtEventsLoading || instituteEventsLoading) && (
        <div className={isDark ? "text-white" : "text-gray-900"}>No events found.</div>
      )}
    </div>
  );
};

export default InstituteWithGovtEventListView;
