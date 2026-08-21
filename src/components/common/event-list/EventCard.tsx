import { memo } from "react";

import SchemaCard from "@/components/ui/schema-card-with-animated-wave-visualizer";
import { EventListItem } from "./types";
import { formatDate } from "@/utils/formet-duration";
import { cleanCloudinaryUrl } from "@/utils/utils";

interface EventCardProps<T extends EventListItem> {
  event: T;
  timeLabel: string;
  registerLink?: string | null;
  onView?: (event: T) => void;
  onEdit?: (event: T) => void;
  onDelete?: (event: T) => void;
  showViewAction?: boolean;
  showEditAction?: boolean;
  showDeleteAction?: boolean;
  eventTypeBadge?: string; // For custom badge (e.g. Govt/Institute Event)
  ctaLabel?: string; // Custom CTA label for button
}

const EventCardInner = <T extends EventListItem>({
  event,
  timeLabel,
  registerLink,
  onView,
  onEdit,
  onDelete,
  showViewAction = true,
  showEditAction = true,
  showDeleteAction = true,
  eventTypeBadge,
  ctaLabel,
}: EventCardProps<T>) => {
  return (
    <div>
      <SchemaCard
        embedded
        badge={eventTypeBadge || event.eventCategory || "Event"}
        title={event.eventTitle}
        description={event.eventDescription || "No description provided."}
        logoUrl={cleanCloudinaryUrl(event.organizerLogo || "")}
        logoAlt={event.eventOrganizer}
        ctaLabel={ctaLabel || "View Details"}
        statusLabel={event.eventStatus}
        href={registerLink ?? event.registrationLink ?? "#"}
        dateLabel={formatDate(event.eventDate)}
        metaLabel={timeLabel}
        extraFields={[
          { label: "Organizer", value: event.eventOrganizer },
          { label: "Venue", value: event.isOnline ? "Online" : event.eventLocation },
          { label: "Duration", value: event.eventDuration },
          { label: "Fee", value: event.isFree ? "Free" : `₹${event.eventFee ?? "0"}` },
        ]}
        imageUrl={
          cleanCloudinaryUrl(event.eventBanner) ||
          "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80"
        }
        imageAlt={event.eventTitle}
        onPrimaryAction={() => onView?.(event)}
        showViewAction={showViewAction}
        showEditAction={showEditAction}
        showDeleteAction={showDeleteAction}
        onViewAction={() => onView?.(event)}
        onEditAction={() => onEdit?.(event)}
        onDeleteAction={() => onDelete?.(event)}
      />
    </div>
  );
};

const EventCard = memo(EventCardInner) as typeof EventCardInner;

export default EventCard;
