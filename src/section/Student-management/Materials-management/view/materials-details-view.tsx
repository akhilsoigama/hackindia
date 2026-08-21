import { motion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Share,
  Bookmark,
  Calendar,
  Clock as ClockIcon,
} from "lucide-react";
import { useTheme } from '@/theme/AppThemeProvider';import { ILecture } from "../../../../types/material";
import VideoDetailView from "../../../../components/material/material-video";
import PDFDetailView from "../../../../components/material/material-pdf";
import AudioDetailView from "../../../../components/material/material-audio";
import TextDetailView from "../../../../components/material/material-text";
import ImageDetailView from "../../../../components/material/material-image";
import { formatDate, formatDuration } from "../../../../utils/formet-duration";

// Main Component with Props
interface MaterialDetailsViewProps {
  currentData?: ILecture;
}

export const MaterialDetailsView = ({
  currentData,
}: MaterialDetailsViewProps) => {
  const { mode } = useTheme();
  const isDark = mode === "dark";

  const renderContent = () => {
    if (!currentData) return null;

    switch (currentData.contentType) {
      case "video":
        return <VideoDetailView lecture={currentData} />;
      case "pdf":
        return <PDFDetailView lecture={currentData} />;
      case "audio":
        return <AudioDetailView lecture={currentData} />;
      case "text":
        return <TextDetailView lecture={currentData} />;
      case "image":
        return <ImageDetailView lecture={currentData} />;
      default:
        return <TextDetailView lecture={currentData} />;
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const shareData: ShareData = {
          title: currentData?.title || "Lecture Content",
          text: currentData?.description || undefined,
          url: window.location.href,
        };
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-linear-to-br from-gray-900 to-slate-900" : "bg-linear-to-br from-gray-50 to-blue-50"}`}
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          shadow-sm border-b transition-all duration-300
          ${
            isDark
              ? "bg-linear-to-r from-slate-900 to-slate-800 border-slate-700/50"
              : "bg-white border-gray-200"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div
                className={`h-6 w-px transition-colors duration-300 ${isDark ? "bg-slate-700/50" : "bg-gray-300"}`}
              />

              <div className="flex items-center gap-2">
                <BookOpen
                  className={`w-5 h-5 ${isDark ? "text-sky-400" : "text-blue-500"}`}
                />
                <span
                  className={`font-medium transition-colors duration-300 ${isDark ? "text-slate-100" : "text-gray-900"}`}
                >
                  Study Material
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  p-2 transition-all duration-300
                  ${
                    isDark
                      ? "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  } rounded-lg
                `}
              >
                <Bookmark className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleShare()}
                className={`
                  px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all duration-300
                  ${
                    isDark
                      ? "bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-900/30"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }
                `}
              >
                <Share className="w-5 h-5" />
                Share
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Material Info Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`
            rounded-2xl shadow-lg p-6 mb-8 transition-all duration-300
            ${
              isDark
                ? "bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50"
                : "bg-white"
            }
          `}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap gap-4 text-sm">
                {currentData?.subject && (
                  <div
                    className={`flex items-center gap-2 transition-colors duration-300 ${isDark ? "text-slate-400" : "text-gray-500"}`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{currentData.subject}</span>
                  </div>
                )}

                {currentData?.std && (
                  <div
                    className={`flex items-center gap-2 transition-colors duration-300 ${isDark ? "text-slate-400" : "text-gray-500"}`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Class {currentData.std}</span>
                  </div>
                )}

                {currentData?.durationInSeconds && (
                  <div
                    className={`flex items-center gap-2 transition-colors duration-300 ${isDark ? "text-slate-400" : "text-gray-500"}`}
                  >
                    <ClockIcon className="w-4 h-4" />
                    <span>{formatDuration(currentData.durationInSeconds)}</span>
                  </div>
                )}

                <div
                  className={`flex items-center gap-2 transition-colors duration-300 ${isDark ? "text-slate-400" : "text-gray-500"}`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate()}</span>
                </div>

                {currentData?.difficultyLevel && (
                  <div
                    className={`
                    flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300
                    ${getDifficultyLevelColor(currentData.difficultyLevel, isDark)}
                  `}
                  >
                    <span>📊 {currentData.difficultyLevel}</span>
                  </div>
                )}

                {currentData?.chapterTopic && (
                  <div
                    className={`
                    flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300
                    ${isDark ? "bg-slate-700/50 text-slate-300" : "bg-gray-100 text-gray-700"}
                  `}
                  >
                    📖 {currentData.chapterTopic}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </main>
    </div>
  );
};

const getDifficultyLevelColor = (level: string, isDark: boolean) => {
  const colorMap: Record<string, string> = {
    Beginner: isDark
      ? "bg-green-950/40 text-green-300 border border-green-700/30"
      : "bg-green-100/70 text-green-700",
    Intermediate: isDark
      ? "bg-yellow-950/40 text-yellow-300 border border-yellow-700/30"
      : "bg-yellow-100/70 text-yellow-700",
    Advanced: isDark
      ? "bg-red-950/40 text-red-300 border border-red-700/30"
      : "bg-red-100/70 text-red-700",
  };

  return (
    colorMap[level] ||
    (isDark
      ? "bg-slate-700/50 text-slate-300 border border-slate-600/30"
      : "bg-gray-100 text-gray-700")
  );
};

export default MaterialDetailsView;
