export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export type EventListItem = {
  id: number;
  eventTitle: string;
  eventDescription?: string | null;
  eventOrganizer: string;
  organizerLogo?: string | null;
  eventVenue: string;
  eventLocation: string;
  registrationLink?: string | null;
  eventFee?: string | null;
  eventDuration: number;
  eventDate: string;
  eventCategory: string;
  eventSubCategory: string;
  eventContact: string;
  eventEmail: string;
  eventPhone: string;
  eventStatus: EventStatus;
  isOnline: boolean;
  isFree: boolean;
  isFeatured: boolean;
  tags?: string | null;
  priority?: number | null;
  viewCount?: number | null;
  eventBanner: string;
  createdAt?: string | null;
};
