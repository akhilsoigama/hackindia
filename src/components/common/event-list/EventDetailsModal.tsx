import { memo, useEffect, useRef } from "react";
import {
  FaGlobe,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaUserTie,
  FaEnvelope,
  FaPhone,
  FaTag,
  FaStar,
  FaArrowRight,
  FaExternalLinkAlt,
  FaTimes,
  FaEdit,
} from "react-icons/fa";
import { formatDate } from "./utils";
import { useTheme } from '@/theme/AppThemeProvider';
import { EventListItem } from "./types";
import { cleanCloudinaryUrl } from "../../../utils/utils";
import MarkdownPreview from "@/components/markdown/markdown";
import { ParticleButton } from "@/components/ui/particle-button";

interface EventDetailsModalProps<T extends EventListItem> {
  event: T;
  timeLabel: string;
  onClose: () => void;
  onEdit?: (event: T) => void;
  onlineLink?: string | null;
  registrationLink?: string | null;
}

const EventDetailsModalInner = <T extends EventListItem>({
  event,
  timeLabel,
  onClose,
  onEdit,
  onlineLink,
  registrationLink,
}: EventDetailsModalProps<T>) => {
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    closeBtnRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const getStatusColorClass = (status: string) => {
    const normalized = (status || "").toLowerCase().trim();
    switch (normalized) {
      case 'upcoming':
        return isDark
          ? 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
          : 'bg-linear-to-r from-slate-100 to-slate-50 text-slate-700 border border-slate-200';
      case 'ongoing':
        return isDark
          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          : 'bg-linear-to-r from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-200';
      case 'completed':
        return isDark
          ? 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
          : 'bg-linear-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200';
      case 'cancelled':
        return isDark
          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          : 'bg-linear-to-r from-rose-100 to-rose-50 text-rose-700 border border-rose-200';
      default:
        return isDark
          ? 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
          : 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
      ref={modalRef}
      className="fixed inset-0 overflow-y-auto z-100 flex items-center justify-center p-4 md:p-6 animate-fadeIn"
    >
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${isDark ? "bg-black/40" : "bg-black/40"}`}
        onClick={onClose}
      ></div>

      <div
        className={`relative rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] scrollbar-hide overflow-hidden animate-slideUp ${isDark ? "bg-gray-900" : "bg-white"}`}
      >
        <div
          className={`sticky top-0 z-50 border-b px-4 sm:px-6 md:px-8 py-4 sm:py-6 flex justify-between items-center backdrop-blur-sm ${isDark ? "bg-linear-to-r from-gray-900 to-gray-800 border-gray-700/50" : "bg-linear-to-r from-white to-gray-50 border-gray-200/50"}`}
        >
          <div className="flex items-center gap-3">
            <div className=" p-3 bg-slate-500 rounded-xl">
              <FaCalendarAlt className=" text-white text-lg" />
            </div>
            <div>
              <h3
                id="event-modal-title"
                className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {event.eventTitle}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColorClass(event.eventStatus)}`}
                >
                  {event.eventStatus.charAt(0).toUpperCase() + event.eventStatus.slice(1)}
                </span>
                {event.isFeatured && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${isDark ? "bg-linear-to-r from-yellow-900 to-yellow-800 text-yellow-300" : "bg-linear-to-r from-amber-100 to-amber-50 text-amber-700"}`}
                  >
                    <FaStar className="text-xs" />
                    Featured Event
                  </span>
                )}
              </div>
            </div>
          </div>
          <ParticleButton
            type="button"
            onClick={onClose}
            aria-label="Close event details"
                  className={`flex items-center px-4 py-2 border rounded-lg text-sm font-medium ${isDark ? "text-slate-200 bg-slate-900 border-slate-800 hover:bg-slate-800" : "text-slate-700 bg-white border-slate-200 hover:bg-slate-50"}`}
          >
            <FaTimes className="text-xl" />
          </ParticleButton>
        </div>

        <div className={`overflow-y-auto scrollbar-hide max-h-[calc(90vh-140px)] p-4 sm:p-6 md:p-8 ${isDark ? "bg-gray-900" : ""}`}>
          <div className="mb-8 relative rounded-2xl overflow-hidden">
            <div className="h-48 sm:h-64 md:h-72 w-full relative">
              <img
                src={
                  cleanCloudinaryUrl(event.eventBanner) ||
                  "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop"
                }
                alt={event.eventTitle}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div
                className={`absolute inset-0 ${isDark ? "bg-linear-to-t from-gray-900/80 to-transparent" : "bg-linear-to-t from-black/30 to-transparent"}`}
              ></div>
              <div className="absolute bottom-6 left-6 flex items-center gap-3">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm ${isDark ? "bg-gray-800/90" : "bg-white/90"}`}
                >
                  <FaTag className="text-slate-600" />
                  <span
                    className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-800"}`}
                  >
                    {event.eventCategory}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm ${isDark ? "bg-gray-800/90" : "bg-white/90"}`}
                >
                  <FaTag className="text-teal-600" />
                  <span
                    className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-800"}`}
                  >
                    {event.eventSubCategory}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="lg:col-span-1 space-y-6">
              {event.eventDescription && (
                <div
                  className={`rounded-2xl p-6 border ${isDark ? "bg-linear-to-br from-gray-800 to-gray-900 border-gray-700/50" : "bg-linear-to-br from-gray-50 to-white border-gray-200/50"}`}
                >
                  <h4
                    className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                    Event Description
                  </h4>
                  <p
                    className={`leading-relaxed whitespace-pre-line ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    <MarkdownPreview content={event.eventDescription} />
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6">
                <div
                  className={`rounded-2xl p-6 border ${isDark ? "bg-linear-to-br from-slate-900 to-gray-900 border-slate-900/50" : "bg-linear-to-br from-slate-50 to-white border-slate-100"}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-linear-to-br from-slate-500 to-cyan-500 rounded-xl">
                      <FaCalendarAlt className="text-white text-lg" />
                    </div>
                    <div>
                      <h5 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                        Date & Time
                      </h5>
                      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        When it's happening
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p
                      className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {formatDate(event.eventDate)}
                    </p>
                    <div
                      className={`flex items-center gap-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      <FaClock className="text-slate-500" />
                      <span>{timeLabel}</span>
                    </div>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Duration: {event.eventDuration}
                    </p>
                  </div>
                </div>

                <div
                  className={`rounded-2xl p-6 border ${isDark ? "bg-linear-to-br from-green-900 to-gray-900 border-green-900/50" : "bg-linear-to-br from-green-50 to-white border-green-100"}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-linear-to-br from-green-500 to-emerald-500 rounded-xl">
                      {event.isOnline ? (
                        <FaGlobe className="text-white text-lg" />
                      ) : (
                        <FaMapMarkerAlt className="text-white text-lg" />
                      )}
                    </div>
                    <div>
                      <h5 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                        Location
                      </h5>
                      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        Where to find it
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p
                      className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {event.eventVenue}
                    </p>
                    <p className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      {event.eventLocation}
                    </p>
                    {event.isOnline && onlineLink && (
                      <a
                        href={onlineLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 text-sm font-medium ${isDark ? "text-slate-300 hover:text-slate-400" : "text-slate-600 hover:text-slate-700"}`}
                      >
                        Join Online Meeting <FaExternalLinkAlt className="text-xs" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`rounded-2xl p-6 border ${isDark ? "bg-linear-to-br from-teal-900 to-gray-900 border-teal-900/50" : "bg-linear-to-br from-teal-50 to-white border-teal-100"}`}
            >
              <h4
                className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                Organizer Details
              </h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-teal-100 rounded-lg">
                    {event.organizerLogo ? (
                      <div className="mt-4">
                        <img
                          src={cleanCloudinaryUrl(event.organizerLogo)}
                          alt={event.eventOrganizer}
                          className="h-12 object-contain"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <FaUserTie className="text-teal-600 text-lg" />
                    )}
                  </div>
                  <div>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      Organization
                    </p>
                    <p className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      {event.eventOrganizer}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`rounded-2xl p-6 border ${isDark ? "bg-linear-to-br from-cyan-900 to-gray-900 border-cyan-900/50" : "bg-linear-to-br from-cyan-50 to-white border-cyan-100"}`}
            >
              <h4
                className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                Contact Information
              </h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-cyan-100 rounded-lg">
                    <FaUserTie className="text-cyan-600" />
                  </div>
                  <div>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      Contact Person
                    </p>
                    <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                      {event.eventContact}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-100 rounded-lg">
                    <FaEnvelope className="text-slate-600" />
                  </div>
                  <div>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      Email
                    </p>
                    <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                      {event.eventEmail}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-green-100 rounded-lg">
                    <FaPhone className="text-green-600" />
                  </div>
                  <div>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      Phone
                    </p>
                    <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                      {event.eventPhone}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`rounded-2xl p-6 border ${isDark ? "bg-linear-to-br from-gray-800 to-gray-900 border-gray-700/50" : "bg-linear-to-br from-gray-50 to-white border-gray-200"}`}
              >
                <h4 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Event Stats
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`text-center p-3 rounded-xl ${isDark ? "bg-slate-900/30" : "bg-slate-50"}`}>
                    <p className={`text-2xl font-bold ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                      {event.priority ?? 0}
                    </p>
                    <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Priority
                    </p>
                  </div>
                  <div className={`text-center p-3 rounded-xl ${isDark ? "bg-emerald-900/30" : "bg-emerald-50"}`}>
                    <p className={`text-2xl font-bold ${isDark ? "text-emerald-300" : "text-emerald-600"}`}>
                      {event.viewCount || 0}
                    </p>
                    <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Views
                    </p>
                  </div>
                  <div className={`text-center p-3 rounded-xl ${isDark ? "bg-yellow-900/30" : "bg-amber-50"}`}>
                    <p className={`text-2xl font-bold ${isDark ? "text-yellow-300" : "text-amber-600"}`}>
                      {event.isFree ? "Free" : "Paid"}
                    </p>
                    <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Fee Type
                    </p>
                  </div>
                  <div className={`text-center p-3 rounded-xl ${isDark ? "bg-teal-900/30" : "bg-teal-50"}`}>
                    <p className={`text-2xl font-bold ${isDark ? "text-teal-300" : "text-teal-600"}`}>
                      {event.isOnline ? "Online" : "Offline"}
                    </p>
                    <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Mode
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {registrationLink && (
            <div
              className={`mt-6 mb-10 p-4 sm:p-6 rounded-2xl border ${isDark ? "bg-linear-to-r from-slate-900 to-cyan-900 border-slate-900/50" : "bg-linear-to-r from-slate-50 to-cyan-50 border-slate-200"}`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className={`font-semibold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                    Ready to join this event?
                  </h4>
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Register now to secure your spot
                  </p>
                </div>
                <a
                  href={registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Register for event"
                  className={`w-full sm:w-auto group inline-flex items-center justify-center gap-3 px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${isDark ? "bg-linear-to-r from-slate-800 to-cyan-800 hover:from-slate-900 hover:to-cyan-900 text-white" : "bg-linear-to-r from-slate-600 to-cyan-600 hover:from-slate-700 hover:to-cyan-700 text-white"}`}
                >
                  Register Now
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
            </div>
          )}
        </div>

        <div
          className={`sticky bottom-0 px-4 sm:px-6 md:px-8 py-4 sm:py-5 border-t ${isDark ? "bg-linear-to-r from-gray-900 to-gray-800 border-gray-700/50" : "bg-linear-to-r from-white to-gray-50 border-gray-200/50"}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className={`flex items-center gap-2 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              <span>Event ID: #{event.id}</span>
              <span className="mx-2">•</span>
              {event.createdAt && <span>Created: {formatDate(event.createdAt)}</span>}
            </div>
            <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 ${onEdit ? "w-full sm:w-auto" : "w-full sm:w-auto"}`}>
              {onEdit && (
                <ParticleButton
            type="button"
                  onClick={() => onEdit(event)}
className={`px-4 flex gap-3 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
            isDark
              ? "bg-white text-slate-900 hover:bg-gray-100 shadow-sm"
              : "bg-slate-800/80 text-white hover:bg-gray-800 shadow-sm"
          }`}                >
                  <FaEdit className="text-sm" />
                  <span>Edit Event</span>
                </ParticleButton>
              )}
              <ParticleButton
            type="button"
                onClick={onClose}
                  className={`flex items-center px-4 py-2 border rounded-lg text-sm font-medium ${isDark ? "text-slate-200 bg-slate-900 border-slate-800 hover:bg-slate-800" : "text-slate-700 bg-white border-slate-200 hover:bg-slate-50"}`}
              >
                Close
              </ParticleButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventDetailsModal = memo(EventDetailsModalInner) as typeof EventDetailsModalInner;

export default EventDetailsModal;
