import React, { memo, useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from '@/theme/AppThemeProvider';
import SearchAndFilter from "../../../components/common/SearchAndFilter";
import EventListHeader from "../../../components/common/event-list/EventListHeader";
import EventCard from "../../../components/common/event-list/EventCard";
import EventDetailsModal from "../../../components/common/event-list/EventDetailsModal";
import EmptyState from "../../../components/common/event-list/EmptyState";
import { IInstituteEvent } from "../../../types/instituteEvent";
import { Translated } from "../../../components/common/translator/translator";

interface InstituteEventListProps {
  instituteEvents: IInstituteEvent[];
  onEdit?: (event: IInstituteEvent) => void;
  onDelete?: (id: number) => void;
  onCreate?: () => void;
  isLoading?: boolean;
}

const InstituteEventList: React.FC<InstituteEventListProps> = memo(({
  instituteEvents = [],
  onEdit,
  onDelete,
  onCreate,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<IInstituteEvent | null>(null);
  const { mode } = useTheme();
  const isDark = mode === "dark";

  const statusOptions = useMemo(
    () => [
      { value: "all", label: "All Statuses" },
      { value: "upcoming", label: "Upcoming" },
      { value: "ongoing", label: "Ongoing" },
      { value: "completed", label: "Completed" },
      { value: "cancelled", label: "Cancelled" },
    ],
    []
  );

  const handleReset = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("all");
  }, []);

  const filteredEvents = useMemo(() => {
    return instituteEvents.filter((event) => {
      const matchesSearch =
        searchTerm === "" ||
        event.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.eventDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.eventCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.eventOrganizer.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || event.eventStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [instituteEvents, searchTerm, statusFilter]);

  const showDetails = useCallback((event: IInstituteEvent) => {
    setSelectedEvent(event);
  }, []);

  const closeDetails = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  return (
    <div className={`min-h-screen p-4 md:p-6 ${isDark ? "bg-salte-950/70" : "bg-salte-50"}`}>
      <div className="max-w-full mx-auto">
        <EventListHeader title={<Translated text="Institute Events"/>} count={instituteEvents.length} onCreate={onCreate} />

        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}  
          onReset={handleReset}
          filterOptions={{ status: statusOptions }}
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 4xl:grid-cols-5 gap-5"
        >
          {filteredEvents.length === 0 ? (
            <EmptyState />
          ) : (
            filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <EventCard
                  event={event}
                  timeLabel={`${event.eventStartTime} - ${event.eventEndTime}`}
                  registerLink={event.registrationLink}
                  onView={showDetails}
                  onEdit={onEdit}
                  onDelete={(evt) => onDelete?.(evt.id)}
                />
              </motion.div>
            ))
          )}
        </motion.div>

        <AnimatePresence>
          {selectedEvent && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EventDetailsModal
                event={selectedEvent}
                timeLabel={`${selectedEvent.eventStartTime} - ${selectedEvent.eventEndTime}`}
                registrationLink={selectedEvent.registrationLink}
                onClose={closeDetails}
                onEdit={onEdit}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

InstituteEventList.displayName = "InstituteEventList";

export default InstituteEventList;