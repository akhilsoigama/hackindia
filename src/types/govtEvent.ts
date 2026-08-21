export type GovtEventStatus =
  | 'upcoming'
  | 'ongoing'
  | 'completed'
  | 'cancelled'

export type IGovtEvent = {
  id: number

  eventTitle: string
  eventSlug: string
  eventDescription?: string | undefined

  eventDate: string
  eventTime: string
  eventDuration: number

  eventBanner: string
  eventLink?: string | undefined
  registrationLink?: string | undefined

  eventOrganizer: string
  organizerLogo?: string | undefined

  eventContact: string
  eventEmail: string
  eventPhone: string

  eventCategory: string
  eventSubCategory: string
  tags?: string | undefined

  eventVenue: string
  eventLocation: string
  latitude?: string | undefined
  longitude?: string | undefined

  isOnline: boolean
  eventFee?: string | undefined;
  isFree: boolean

  eventStatus: "upcoming" | "ongoing" | "completed" | "cancelled"

  priority: number
  viewCount?: number

  isActive?: boolean
  isFeatured: boolean

  createdBy?: number | null
  updatedBy?: number | null

  createdAt: string
  updatedAt: string
  deletedAt?: string | undefined
}


export type ICreateGovtEvent = {
  eventTitle: string
  eventSlug: string
  eventDescription?: string

  eventDate: string
  eventTime: string
  eventDuration: number

  eventLocation: string
  eventVenue: string

  eventBanner: string
  eventLink?: string
  registrationLink?: string

  eventOrganizer: string
  organizerLogo?: string

  eventContact: string
  eventEmail: string
  eventPhone: string

  eventCategory: string
  eventSubCategory: string
  tags?: string

  latitude?: string
  longitude?: string

  eventFee?: string
  isFree?: boolean
  isOnline?: boolean

  eventStatus?: "upcoming" | "ongoing" | "completed" | "cancelled"

  priority?: number
  viewCount?: number

  isFeatured?: boolean
  isActive?: boolean

  createdBy?: number
  updatedBy?: number
}

export type IUpdateGovtEvent= Partial<{
  id:number
  eventTitle?: string
  eventSlug?: string
  eventDescription?: string

  eventDate?: string
  eventTime?: string
  eventDuration?: string

  eventLocation?: string
  eventVenue?: string

  eventBanner?: string
  eventLink?: string
  registrationLink?: string

  eventOrganizer?: string
  organizerLogo?: string

  eventContact?: string
  eventEmail?: string
  eventPhone?: string

  eventCategory?: string
  eventSubCategory?: string
  tags?: string

  latitude?: string
  longitude?: string

  eventFee?: string
  isFree?: boolean
  isOnline?: boolean

  eventStatus?: "upcoming" | "ongoing" | "completed" | "cancelled"

  priority?: number
  viewCount?: number

  isFeatured?: boolean
  isActive?: boolean

  updatedBy?: number
}>

export type IGovtEventFilters = {
  search?: string

  isActive?: boolean
  isFeatured?: boolean
  isOnline?: boolean
  isFree?: boolean

  eventStatus?: "upcoming" | "ongoing" | "completed" | "cancelled"
  eventCategory?: string
  eventSubCategory?: string

  startDate?: string
  endDate?: string
}
