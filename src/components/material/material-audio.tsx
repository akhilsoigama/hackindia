import { motion } from "framer-motion";
import { Headphones, Download, Clock } from "lucide-react";
import { ILecture } from "../../types/material";
import { formatDuration } from "../../utils/formet-duration";
import { useRef, useState } from "react";
import { useTheme } from '@/theme/AppThemeProvider';

const AudioDetailView = ({ lecture }: { lecture: ILecture }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { mode } = useTheme();
  const isDark = mode === "dark";

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const handleDownload = () => {
    if (!lecture.contentUrl) return;
    const link = document.createElement("a");
    link.href = lecture.contentUrl;
    link.download = lecture.title ? `${lecture.title}.mp3` : "audio.mp3";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${isDark ? 'bg-linear-to-r from-purple-900 to-pink-900' : 'bg-linear-to-r from-purple-600 to-pink-600'} text-white`}
    >
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-opacity-20 rounded-2xl p-4">
            <Headphones className="w-12 h-12" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">{lecture.title}</h3>
            {lecture.durationInSeconds && (
              <div className={`flex items-center gap-2 transition-colors duration-300 ${isDark ? 'text-purple-200' : 'text-purple-100'}`}>
                <Clock className="w-5 h-5" />
                <span>{formatDuration(lecture.durationInSeconds)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {lecture.description && (
          <p className={`text-lg mb-8 leading-relaxed transition-colors duration-300 ${isDark ? 'text-purple-200' : 'text-purple-100'}`}>
            {lecture.description}
          </p>
        )}

        {/* ✅ Audio Player Section */}
        <div className={`rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 ${isDark ? 'bg-purple-800/30' : 'bg-white bg-opacity-10'}`}>
          {/* Native Audio Player */}
          <audio
            ref={audioRef}
            src={lecture.contentUrl || ""}
            className="w-full mb-4"
            controls
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={handleEnded}
          />

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlayPause}
              className={`flex items-center gap-2 rounded-full px-5 py-2 font-semibold shadow-lg transition-all ${isDark ? 'bg-white text-purple-700 hover:bg-purple-100' : 'bg-white text-purple-600 hover:bg-purple-50'}`}
            >
              {isPlaying ? "Pause" : "Play"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              disabled={!lecture.contentUrl}
              className={`rounded-lg p-3 transition-all ${isDark ? 'bg-purple-700/40 hover:bg-purple-600/50' : 'bg-white bg-opacity-20 hover:bg-opacity-30'}`}
              title="Download audio"
            >
              <Download className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AudioDetailView;
