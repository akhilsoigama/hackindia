import { motion } from 'framer-motion';
import {
  FaFileVideo, FaFilePdf, FaFileAudio, FaFileAlt, FaImage,
  FaEye, FaEdit, FaTrash, FaClock, FaLayerGroup, FaBookOpen,
  FaPlay, FaDownload, FaCamera
} from 'react-icons/fa';
import { ReactNode } from 'react';
import { useTheme } from '@/theme/AppThemeProvider';
import { ILecture } from '../../types/material';
import ActionMenu from '../common/actionMenu';

interface MaterialCardProps {
  lecture: ILecture;
  onEdit?: (lecture: ILecture) => void;
  onDelete?: (id: number) => void;
  onView: (lecture: ILecture) => void;
  index: number;
}
const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return s > 0 ? `${m}m ${s}s` : `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
};

const MaterialCard: React.FC<MaterialCardProps> = ({ lecture, onEdit, onDelete, onView, index }) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const config = getContentTypeConfig(lecture.contentType);
  const waveformBars = [28, 44, 34, 56, 30, 48, 54, 32, 50, 38, 58, 36, 46, 52];

  const actionMenuItems = [
    { label: 'View Content', onClick: () => onView(lecture), icon: <FaEye size={13} />, variant: 'default' as const },
    ...(onEdit ? [{ label: 'Edit', onClick: () => onEdit(lecture), icon: <FaEdit size={13} />, variant: 'default' as const }] : []),
    ...(onDelete ? [{ label: 'Delete', onClick: () => onDelete(lecture.id), icon: <FaTrash size={13} />, variant: 'danger' as const }] : []),
  ];

  const showDuration = Boolean(lecture.durationInSeconds) && (lecture.contentType === 'video' || lecture.contentType === 'audio');

  const renderTypeBadge = () => (
    <div className={`
      absolute top-2.5 left-2.5 flex items-center gap-1.5
      px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide
      bg-black/40 backdrop-blur-md border border-white/20 text-white
    `}>
      <span className="text-[11px]">{config.badgeIcon}</span>
      {lecture.contentType}
    </div>
  );

  const renderDurationBadge = () => {
    if (!showDuration || !lecture.durationInSeconds) return null;
    return (
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-full
        bg-black/40 backdrop-blur-md border border-white/20 text-white text-[10px] font-semibold">
        <FaClock size={8} />
        {formatDuration(lecture.durationInSeconds)}
      </div>
    );
  };

  const renderHeader = () => {
    switch (lecture.contentType) {
      case 'video':
        return (
          <>
            {lecture.thumbnailUrl ? (
              <img
                src={lecture.thumbnailUrl}
                alt={lecture.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center ${config.thumbGradient}`}
                style={{ boxShadow: `inset 0 0 40px ${config.glowColor}` }}
              >
                <div className="opacity-20 text-white text-5xl">{config.icon}</div>
              </div>
            )}

            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200
                w-11 h-11 rounded-full flex items-center justify-center
                bg-white/20 backdrop-blur-md border border-white/30 shadow-[0_6px_18px_rgba(0,0,0,0.3)]">
                <FaPlay className="text-white ml-0.5" size={13} />
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            {renderTypeBadge()}
            {renderDurationBadge()}
          </>
        );

      case 'pdf':
        return (
          <>
            <div className={`w-full h-full relative border-l-[3px] border-white/20 ${isDark ? 'bg-linear-to-br from-blue-600 to-blue-800' : 'bg-linear-to-br from-blue-500 to-blue-600'}`}>
              <div className="relative h-full w-full flex items-center justify-center">
                <svg width="120" height="86" viewBox="0 0 120 86" fill="none" aria-hidden="true">
                  <rect x="26" y="8" width="68" height="70" rx="8" fill="rgba(255,255,255,0.96)" />
                  <rect x="38" y="28" width="44" height="5" rx="2.5" fill="rgba(148,163,184,0.7)" />
                  <rect x="38" y="39" width="38" height="5" rx="2.5" fill="rgba(148,163,184,0.58)" />
                  <rect x="38" y="50" width="46" height="5" rx="2.5" fill="rgba(148,163,184,0.65)" />
                </svg>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {renderTypeBadge()}
          </>
        );

      case 'audio':
        return (
          <>
            <div className="w-full h-full relative bg-linear-to-br from-violet-500 to-indigo-600 overflow-hidden">
              <div className="relative h-full flex items-center justify-center px-5">
                <svg viewBox="0 0 210 64" className="w-full max-w-55 h-16" fill="none" aria-hidden="true">
                  {waveformBars.map((height, i) => {
                    const barWidth = 8;
                    const gap = 7;
                    const x = i * (barWidth + gap);
                    const y = 64 - height;
                    return (
                      <rect
                        key={`wave-${i}`}
                        x={x}
                        y={y}
                        width={barWidth}
                        height={height}
                        rx="3"
                        className="wave-bar"
                        style={{
                          fill: 'rgba(255,255,255,0.7)',
                          animationDelay: `${i * 0.08}s`,
                        }}
                      />
                    );
                  })}
                </svg>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
            </div>

            {renderTypeBadge()}
            {renderDurationBadge()}
          </>
        );

      case 'text':
        return (
          <>
            <div className="w-full h-full relative overflow-hidden bg-linear-to-br from-emerald-500 to-teal-500">
              <div className="relative h-full px-4 py-3.5 flex items-center">
                <div className="w-full">
                  {lecture.textContent ? (
                    <p className="text-[11px] leading-relaxed text-white/80 line-clamp-2 whitespace-pre-line">
                      {lecture.textContent}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <div className="h-2 rounded-full bg-white/30 w-[85%]" />
                      <div className="h-2 rounded-full bg-white/30 w-[70%]" />
                      <div className="h-2 rounded-full bg-white/30 w-[90%]" />
                      <div className="h-2 rounded-full bg-white/30 w-[60%]" />
                      <div className="h-2 rounded-full bg-white/30 w-[75%]" />
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {renderTypeBadge()}
          </>
        );

      case 'image':
        return (
          <>
            {lecture.contentUrl ? (
              <img
                src={lecture.contentUrl}
                alt={lecture.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              />
            ) : (
              <div className="w-full h-full relative">
                <div className="w-full h-full grid grid-cols-2 grid-rows-2">
                  <div className={`${isDark ? 'bg-rose-600/60' : 'bg-rose-400/60'}`} />
                  <div className={`${isDark ? 'bg-violet-600/60' : 'bg-violet-400/60'}`} />
                  <div className={`${isDark ? 'bg-amber-600/60' : 'bg-amber-400/60'}`} />
                  <div className={`${isDark ? 'bg-teal-600/60' : 'bg-teal-400/60'}`} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 8.5A2.5 2.5 0 016.5 6h11A2.5 2.5 0 0120 8.5v7A2.5 2.5 0 0117.5 18h-11A2.5 2.5 0 014 15.5v-7z" stroke="rgba(255,255,255,0.95)" strokeWidth="1.8" />
                    <path d="M9 6l1-1.4h4L15 6" stroke="rgba(255,255,255,0.95)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="2.8" stroke="rgba(255,255,255,0.95)" strokeWidth="1.8" />
                  </svg>
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
            <div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            {renderTypeBadge()}
          </>
        );

      default:
        return (
          <>
            <div
              className={`w-full h-full flex items-center justify-center ${config.thumbGradient}`}
              style={{ boxShadow: `inset 0 0 40px ${config.glowColor}` }}
            >
              <div className="opacity-25 text-white text-5xl">{config.icon}</div>
            </div>
            {renderTypeBadge()}
          </>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.015, transition: { duration: 0.2 } }}
      className="group cursor-pointer h-full"
    >
      <div
        className={`
          relative rounded-2xl overflow-hidden h-full flex flex-col
          transition-all duration-300 ease-out
          ${isDark
            ? [
                'bg-linear-to-br from-[#2a3e66] via-[#16284a] to-[#0a1630]',
                'border border-white/[0.07]',
                'shadow-[0_2px_12px_rgba(0,0,0,0.4),0_8px_32px_rgba(0,0,0,0.55)]',
                'hover:shadow-[0_8px_40px_rgba(0,0,0,0.7),0_2px_12px_rgba(0,0,0,0.5)]',
                'hover:border-white/13',
              ].join(' ')
            : [
                'bg-white',
                'border border-slate-200',
                'shadow-[0_2px_8px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)]',
                'hover:shadow-[0_8px_32px_rgba(0,0,0,0.13),0_2px_8px_rgba(0,0,0,0.07)]',
                'hover:border-slate-300',
              ].join(' ')
          }
        `}
      >
        <style>
          {`
            @media (prefers-reduced-motion: no-preference) {
              @keyframes wave {
                0%, 100% {
                  transform: scaleY(0.4);
                }
                50% {
                  transform: scaleY(1);
                }
              }

              .wave-bar {
                animation: wave 1.4s ease-in-out infinite;
                transform-origin: center bottom;
                transform-box: fill-box;
              }
            }
          `}
        </style>

        {/* ── Content Header ── */}
        <div
          className="relative w-full aspect-video overflow-hidden rounded-t-2xl shrink-0"
          onClick={() => onView(lecture)}
        >
          {renderHeader()}
        </div>

        {/* ── Body ── */}
        <div className="flex-1 flex flex-col p-5 gap-3">

          {/* Title + menu */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1 flex items-start gap-2">
              {lecture.contentType === 'pdf' && (
                <span
                  className={`mt-0.5 shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-md border ${isDark
                    ? 'bg-blue-400/15 text-blue-300 border-blue-300/30'
                    : 'bg-blue-50 text-blue-600 border-blue-200'}`}
                  title="Open PDF"
                >
                  <FaDownload size={11} />
                </span>
              )}
              <h3
                className={`font-semibold text-[14.5px] leading-[1.4] line-clamp-2 flex-1 ${isDark ? 'text-white/90' : 'text-slate-900'}`}
                onClick={() => onView(lecture)}
              >
                {lecture.title}
              </h3>
            </div>
            <div className="shrink-0">
              <ActionMenu items={actionMenuItems} data={lecture} />
            </div>
          </div>

          {/* Description */}
          {lecture.description && (
            <p className={`text-[12.5px] leading-relaxed line-clamp-2 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
              {lecture.description}
            </p>
          )}

          {/* Chapter topic */}
          {lecture.chapterTopic && (
            <div className={`flex items-center gap-1.5 text-[11.5px] ${isDark ? 'text-white/35' : 'text-slate-400'}`}>
              <FaBookOpen size={10} className="shrink-0" />
              <span className="truncate">{lecture.chapterTopic}</span>
            </div>
          )}

          {/* Footer */}
          <div className={`
            mt-auto pt-3 flex items-center justify-between gap-2
            border-t ${isDark ? 'border-white/6' : 'border-slate-100'}
          `}>
            <div className="flex flex-wrap gap-1.5 min-w-0">
              {lecture.subject && (
                <span className={`
                  inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium truncate max-w-25
                  ${isDark
                    ? 'bg-white/6 text-white/55 border border-white/8'
                    : 'bg-slate-50 text-slate-600 border border-slate-200'}
                `}>
                  {lecture.subject}
                </span>
              )}
              {lecture.std && (
                <span className={`
                  inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium
                  ${isDark
                    ? 'bg-white/6 text-white/55 border border-white/8'
                    : 'bg-slate-50 text-slate-600 border border-slate-200'}
                `}>
                  Std {lecture.std}
                </span>
              )}
            </div>

            {lecture.difficultyLevel && (
              <span className={`
                shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border inline-flex items-center gap-1
                ${getDifficultyStyle(lecture.difficultyLevel, isDark)}
              `}>
                <FaLayerGroup size={8} />
                {lecture.difficultyLevel}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Config helpers ── */

const getContentTypeConfig = (contentType: string): {
  icon: ReactNode;
  badgeIcon: ReactNode;
  thumbGradient: string;
  glowColor: string;
} => {
  const map: Record<string, { icon: ReactNode; badgeIcon: ReactNode; thumbGradient: string; glowColor: string }> = {
    video: {
      icon: <FaFileVideo />,
      badgeIcon: <FaFileVideo />,
      thumbGradient: 'bg-linear-to-br from-rose-500 to-pink-600',
      glowColor: 'rgba(244,63,94,0.5)',
    },
    pdf: {
      icon: <FaFilePdf />,
      badgeIcon: <FaFilePdf />,
      thumbGradient: 'bg-linear-to-br from-blue-500 to-cyan-500',
      glowColor: 'rgba(59,130,246,0.5)',
    },
    audio: {
      icon: <FaFileAudio />,
      badgeIcon: <FaFileAudio />,
      thumbGradient: 'bg-linear-to-br from-violet-500 to-indigo-600',
      glowColor: 'rgba(139,92,246,0.5)',
    },
    text: {
      icon: <FaFileAlt />,
      badgeIcon: <FaFileAlt />,
      thumbGradient: 'bg-linear-to-br from-emerald-500 to-teal-500',
      glowColor: 'rgba(16,185,129,0.5)',
    },
    image: {
      icon: <FaImage />,
      badgeIcon: <FaCamera />,
      thumbGradient: 'bg-linear-to-br from-amber-400 to-orange-500',
      glowColor: 'rgba(245,158,11,0.5)',
    },
  };
  return map[contentType] ?? {
    icon: <FaFileAlt />,
    badgeIcon: <FaFileAlt />,
    thumbGradient: 'bg-linear-to-br from-slate-500 to-slate-700',
    glowColor: 'rgba(100,116,139,0.4)',
  };
};

const getDifficultyStyle = (level: string, isDark: boolean): string => {
  const styles: Record<string, { light: string; dark: string }> = {
    Beginner: {
      light: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dark:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    Intermediate: {
      light: 'bg-amber-50 text-amber-700 border-amber-200',
      dark:  'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    Advanced: {
      light: 'bg-rose-50 text-rose-700 border-rose-200',
      dark:  'bg-rose-500/10 text-rose-400 border-rose-500/20',
    },
  };
  const s = styles[level];
  if (!s) return isDark
    ? 'bg-white/10 text-white/50 border-white/15'
    : 'bg-slate-100 text-slate-600 border-slate-200';
  return isDark ? s.dark : s.light;
};

export default MaterialCard;