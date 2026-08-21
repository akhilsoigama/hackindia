export type InstituteEventStatus =
  | "upcoming"
  | "ongoing"
  | "completed"
  | "cancelled";

export type IInstituteEvent = {
  id: number;

  eventTitle: string;
  eventSlug: string;
  eventDescription?: string | null;

  eventOrganizer: string;
  eventVenue: string;
  eventLocation: string;
  registrationLink?: string | null;
  eventFee?: string | null;
  eventDuration: number;
  eventDate: string;
  eventStartTime: string;
  eventEndTime: string;
  eventCategory: string;
  eventSubCategory: string;
  latitude?: string | null;
  longitude?: string | null;
  eventContact: string;
  eventEmail: string;
  eventPhone: string;
  eventStatus: InstituteEventStatus;
  isOnline: boolean;
  isFree: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  tags?: string | null;
  priority: number;
  viewCount: number;
  eventBanner: string;
  instituteId: number;
  createdBy?: number;
  updatedBy?: number;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type ICreateInstituteEvent = {
  eventTitle: string;
  eventSlug: string;
  eventDescription?: string | null;

  eventOrganizer: string;
  eventVenue: string;
  eventLocation: string;
  registrationLink?: string | null;
  eventFee?: string | null;
  eventDuration: number;
  eventDate: string;
  eventStartTime: string;
  eventEndTime: string;
  eventCategory: string;
  eventSubCategory: string;
  latitude?: string | null;
  longitude?: string | null;
  eventContact: string;
  eventEmail: string;
  eventPhone: string;
  eventStatus?: InstituteEventStatus;
  isOnline?: boolean;
  isFree?: boolean;
  isFeatured?: boolean;
  isPublished?: boolean;
  tags?: string | null;
  priority?: number;
  viewCount?: number;
  eventBanner: string;
  instituteId: number;
  createdBy?: number;
  updatedBy?: number;
  isActive?: boolean;
};

export type IUpdateInstituteEvent = Partial<{
  id: number;
  eventTitle: string;
  eventSlug: string;
  eventDescription: string | null;

  eventOrganizer: string;
  eventVenue: string;
  eventLocation: string;
  registrationLink: string | null;
  eventFee: string | null;
  eventDuration: number;
  eventDate: string;
  eventStartTime: string;
  eventEndTime: string;
  eventCategory: string;
  eventSubCategory: string;
  latitude: string | null;
  longitude: string | null;
  eventContact: string;
  eventEmail: string;
  eventPhone: string;
  eventStatus: InstituteEventStatus;
  isOnline: boolean;
  isFree: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  tags: string | null;
  priority: number;
  viewCount: number;
  eventBanner: string;
  instituteId: number;
  updatedBy: number;
  isActive: boolean;
}>;

export type IInstituteEventFilters = {
  search?: string;

  isActive?: boolean;
  isFeatured?: boolean;
  isOnline?: boolean;
  isFree?: boolean;

  eventStatus?: InstituteEventStatus;
  eventCategory?: string;
  eventSubCategory?: string;
  instituteId?: number;

  startDate?: string;
  endDate?: string;
};
