import React, { useState, useMemo, memo, useCallback } from 'react';
import { useTheme } from '@/theme/AppThemeProvider';import { motion, AnimatePresence } from 'framer-motion';
import { IGovtEvent } from '../../../types/govtEvent';
import SearchAndFilter from '../../../components/common/SearchAndFilter';
import EventListHeader from '../../../components/common/event-list/EventListHeader';
import EventCard from '../../../components/common/event-list/EventCard';
import EventDetailsModal from '../../../components/common/event-list/EventDetailsModal';
import EmptyState from '../../../components/common/event-list/EmptyState';

interface GovtEventListProps {
  govtEvents: IGovtEvent[];
  onEdit?: (event: IGovtEvent) => void;
  onDelete?: (id: number) => void;
  onCreate?: () => void;
  isLoading?: boolean;
}

const GovtEventList: React.FC<GovtEventListProps> = memo(({
  govtEvents = [],
  onEdit,
  onDelete,
  onCreate,
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<IGovtEvent | null>(null);
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  
  const statusOptions = useMemo(
    () => [
      { value: 'all', label: 'All Statuses' },
      { value: 'upcoming', label: 'Upcoming' },
      { value: 'ongoing', label: 'Ongoing' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' }
    ],
    []
  );

  const handleReset = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('all');
  }, []);
  const filteredEvents = useMemo(() => {
    return govtEvents.filter((event) => {
      const matchesSearch = searchTerm === '' ||
        event.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.eventDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.eventCategory.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || event.eventStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [govtEvents, searchTerm, statusFilter]);

  const showDetails = useCallback((event: IGovtEvent) => {
    setSelectedEvent(event);
  }, []);

  const closeDetails = useCallback(() => {
    setSelectedEvent(null);
  }, []);


  if (isLoading) {
    return (
      <div className={`min-h-screen p-6 ${isDark ? 'bg-slate-950/70' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className={`h-8 rounded w-1/4 mb-6 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
            <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`rounded-xl shadow-sm p-4 ${isDark ? 'bg-slate-800' : 'bg-white'}`}> 
                  <div className={`h-40 rounded mb-4 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                  <div className={`h-4 rounded w-3/4 mb-2 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                  <div className={`h-3 rounded w-1/2 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 md:p-6 ${isDark ? 'bg-slate-950/70' : 'bg-slate-50'}`}>
      <div className="max-w-full mx-auto">
        <EventListHeader title="Government Events" count={govtEvents.length} onCreate={onCreate} />

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
              <motion.div key={event.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }}>
                <EventCard
                  event={event}
                  timeLabel={event.eventTime}
                  registerLink={event.registrationLink || event.eventLink}
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
                timeLabel={selectedEvent.eventTime}
                onlineLink={selectedEvent.eventLink}
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

GovtEventList.displayName = 'GovtEventList';

export default GovtEventList;