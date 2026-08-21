import { motion } from 'framer-motion';
import { Download, Share, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ILecture } from '../../types/material';
import { useTheme } from '@/theme/AppThemeProvider';

const ImageDetailView = ({ lecture }: { lecture: ILecture }) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const imageUrl = lecture.contentUrl || lecture.thumbnailUrl;
  const hasDescription = !!lecture.description?.trim();
  const imageLabel = lecture.subject || lecture.chapterTopic || 'Study Visual';

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${lecture.title || 'image'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!imageUrl) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: lecture.title,
          text: lecture.description || undefined,
          url: imageUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(imageUrl);
      toast.success('Image link copied');
    } catch {
      toast.error('Unable to share image');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative rounded-3xl border overflow-hidden transition-all duration-300 ${isDark ? 'border-slate-700/70 bg-slate-900/70 shadow-[0_20px_70px_-30px_rgba(56,189,248,0.45)]' : 'border-slate-200 bg-white shadow-[0_20px_70px_-30px_rgba(14,116,144,0.28)]'}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 ${
          isDark
            ? 'bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_40%)]'
            : 'bg-[radial-gradient(circle_at_top_right,rgba(14,116,144,0.12),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.1),transparent_40%)]'
        }`}
      />

      {imageUrl ? (
        <div className="relative group">
          <img
            src={imageUrl}
            alt={lecture.title}
            loading="lazy"
            decoding="async"
            className="w-full h-80 sm:h-95 lg:h-115 object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent" />

          <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
            <span
              className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold backdrop-blur-md border ${
                isDark
                  ? 'bg-slate-900/65 border-slate-500/40 text-slate-100'
                  : 'bg-white/80 border-white/70 text-slate-800'
              }`}
            >
              {imageLabel}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {lecture.difficultyLevel && (
                <span
                  className={`rounded-full px-3 py-1 text-[11px] sm:text-xs font-semibold border ${
                    isDark
                      ? 'bg-emerald-400/15 text-emerald-200 border-emerald-300/35'
                      : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {lecture.difficultyLevel}
                </span>
              )}
              {lecture.std && (
                <span
                  className={`rounded-full px-3 py-1 text-[11px] sm:text-xs font-semibold border ${
                    isDark
                      ? 'bg-slate-900/70 text-slate-100 border-slate-400/35'
                      : 'bg-white/85 text-slate-700 border-white/80'
                  }`}
                >
                  Class {lecture.std}
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={`h-85 sm:h-105 flex flex-col items-center justify-center gap-4 transition-all duration-300 ${isDark ? 'bg-linear-to-br from-slate-900 via-cyan-950 to-emerald-950' : 'bg-linear-to-br from-cyan-400 via-sky-500 to-emerald-400'}`}>
          <ImageIcon className="w-16 h-16 sm:w-20 sm:h-20 text-white/95" />
          <p className="text-white/90 text-sm sm:text-base font-medium">No preview available</p>
        </div>
      )}
      
      <div className="relative p-5 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-6">
          <div className="max-w-3xl">
            <h3 className={`text-2xl sm:text-3xl font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {lecture.title}
            </h3>
            {hasDescription ? (
              <p className={`text-sm sm:text-base leading-relaxed transition-colors duration-300 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {lecture.description}
              </p>
            ) : (
              <p className={`text-sm sm:text-base italic transition-colors duration-300 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                No description added for this image material.
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              disabled={!imageUrl}
              className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${isDark ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-emerald-500 text-white hover:bg-emerald-600'} ${!imageUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              Download
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              disabled={!imageUrl}
              className={`p-2.5 sm:p-3 rounded-xl transition-all ${isDark ? 'border border-slate-600 text-slate-300 hover:bg-slate-700/50' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'} ${!imageUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Share className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-sm">
          <div className={`rounded-2xl p-4 sm:p-5 transition-all duration-300 ${isDark ? 'bg-slate-900/65 border border-slate-700/70 text-slate-300' : 'bg-slate-50 border border-slate-200 text-slate-600'}`}>
            <div className={`font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>Image Details</div>
            <div>Type: Educational Image</div>
            <div>Format: Online Asset</div>
          </div>
          
          <div className={`rounded-2xl p-4 sm:p-5 transition-all duration-300 ${isDark ? 'bg-slate-900/65 border border-slate-700/70 text-slate-300' : 'bg-slate-50 border border-slate-200 text-slate-600'}`}>
            <div className={`font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>Usage</div>
            <div>Educational Purpose</div>
            <div>Free to use</div>
          </div>
          
          <div className={`rounded-2xl p-4 sm:p-5 transition-all duration-300 ${isDark ? 'bg-slate-900/65 border border-slate-700/70 text-slate-300' : 'bg-slate-50 border border-slate-200 text-slate-600'}`}>
            <div className={`font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>Context</div>
            <div>Subject: {lecture.subject || 'General'}</div>
            <div>Topic: {lecture.chapterTopic || 'Not specified'}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ImageDetailView;