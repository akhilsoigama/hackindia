import { motion } from 'framer-motion';
import { Play, Share, MessageSquareReply, Send, ShieldCheck, MessageCircle } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ILecture } from '../../types/material';
import { formatDuration } from '../../utils/formet-duration';
import { CloudinaryMedia } from '../common/cloudinary-media';
import { useUser } from '../../atoms/userAtom';
import { useTheme } from '@/theme/AppThemeProvider';
import { DynamicWatermark } from '../ui/watermark';

type VideoReply = {
  id: string;
  lectureId: number;
  authorName: string;
  authorRole: string;
  message: string;
  createdAt: string;
};

const getReplyStorageKey = (lectureId: number) => `lecture-replies:${lectureId}`;

const VideoDetailView = ({ lecture }: { lecture: ILecture }) => {
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState<VideoReply[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { user, isSuperAdmin, isInstitute } = useUser();
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const canReply = useMemo(() => isSuperAdmin || isInstitute, [isSuperAdmin, isInstitute]);

  useEffect(() => {
    if (!lecture?.id) {
      setReplies([]);
      return;
    }

    try {
      const raw = localStorage.getItem(getReplyStorageKey(lecture.id));
      const parsed = raw ? (JSON.parse(raw) as VideoReply[]) : [];
      setReplies(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error('Failed to load video replies:', error);
      setReplies([]);
    }
  }, [lecture?.id]);

  const persistReplies = (nextReplies: VideoReply[]) => {
    if (!lecture?.id) return;

    setReplies(nextReplies);
    localStorage.setItem(getReplyStorageKey(lecture.id), JSON.stringify(nextReplies));
  };

  const handleSubmitReply = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const message = replyText.trim();
    if (!message || !lecture?.id) return;

    setIsSubmitting(true);

    try {
      const nextReply: VideoReply = {
        id: crypto.randomUUID(),
        lectureId: lecture.id,
        authorName: user?.fullName || 'School Admin',
        authorRole: user?.roleName || user?.userType || 'institute',
        message,
        createdAt: new Date().toISOString(),
      };

      const nextReplies = [nextReply, ...replies];
      persistReplies(nextReplies);
      setReplyText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlay = () => {
    setShowThumbnail(false);
  };

  const handleEnded = () => {
    setShowThumbnail(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-black rounded-xl overflow-hidden shadow-lg"
    >
      <div className="relative cursor-pointer bg-gray-900">
        <div className="relative h-full ">
          {/* Native Video Element */}
          <video
            ref={videoRef}
            src={lecture.contentUrl || ''}
            className="w-full h-full object-cover"
            controls
            crossOrigin="anonymous"
            preload="metadata"
            onPlay={handlePlay}
            onEnded={handleEnded}
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
          />
          {/* Dynamic User Watermark Overlay */}
          <DynamicWatermark />


          {showThumbnail && (
            <div className="absolute inset-0 z-10">
              {lecture.thumbnailUrl ? (
                <CloudinaryMedia
                  src={lecture.thumbnailUrl}
                  type="image"
                  className="w-full h-full"
                  fallback="/default-thumbnail.jpg"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <div className="text-center text-white">
                    <motion.button
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-white rounded-full p-4 shadow-2xl mb-4"
                      onClick={() => setShowThumbnail(false)}
                    >
                      <Play className="w-6 h-6 text-gray-800 ml-0.5" />
                    </motion.button>
                    <p className="text-sm font-medium">Click to play video</p>
                  </div>
                </div>
              )}

              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white rounded-full p-4 shadow-2xl"
                  onClick={() => setShowThumbnail(false)}
                >
                  <Play className="w-6 h-6 text-gray-800 ml-0.5" />
                </motion.button>
              </div>

              {/* Duration Badge */}
              {lecture.durationInSeconds && (
                <div className="absolute bottom-3 right-3 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-sm font-medium">
                  {formatDuration(lecture.durationInSeconds)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Video Info Section */}
      <div className={`p-3 transition-colors duration-300 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-sm line-clamp-2 mb-1 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {lecture.title}
            </h3>
            {lecture.description && (
              <p className={`text-xs line-clamp-1 mb-2 transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                {lecture.description}
              </p>
            )}
            <div className={`flex items-center gap-4 text-xs transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              {lecture.subject && <span className="font-medium">{lecture.subject}</span>}
              {lecture.durationInSeconds && (
                <span>• {formatDuration(lecture.durationInSeconds)}</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {/* Download button disabled for copyright protection 
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className={`p-2 rounded-lg transition-all duration-300 ${isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
              disabled={!lecture.contentUrl}
              title="Download video"
            >
              <Download className="w-4 h-4" />
            </motion.button>
            */}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg transition-all duration-300 ${isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
              title="Share video"
            >
              <Share className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      <div className={`border-t px-4 pb-4 pt-3 transition-all duration-300 ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-gray-100 bg-slate-50'}`}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className={`flex items-center gap-2 text-sm font-semibold transition-colors duration-300 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            <MessageSquareReply className={`h-4 w-4 ${isDark ? 'text-sky-400' : 'text-blue-600'}`} />
            Answers & Replies
          </div>
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 ${isDark ? 'bg-slate-700/50 text-slate-300 ring-slate-600/50' : 'bg-white text-slate-500 ring-slate-200'} shadow-sm ring-1`}>
            <MessageCircle className="h-3.5 w-3.5" />
            {replies.length} reply{replies.length === 1 ? '' : 'ies'}
          </span>
        </div>

        {canReply && (
          <form onSubmit={handleSubmitReply} className={`mb-4 rounded-2xl border shadow-sm p-4 transition-all duration-300 ${isDark ? 'border-sky-900/50 bg-slate-900/50' : 'border-blue-100 bg-white'}`}>
            <div className={`mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide transition-colors duration-300 ${isDark ? 'text-sky-400' : 'text-blue-700'}`}>
              <ShieldCheck className="h-4 w-4" />
              School admin response
            </div>
            <textarea
              value={replyText}
              onChange={(event) => setReplyText(event.target.value)}
              placeholder="Write the answer or response for this video..."
              rows={4}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 ${isDark ? 'border-slate-700 bg-slate-900 text-slate-100 focus:border-sky-500 focus:bg-slate-800 focus:ring-sky-500/30' : 'border-slate-200 bg-slate-50 text-slate-800 focus:border-blue-400 focus:bg-white focus:ring-blue-100'}`}
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                This reply is saved against this lecture and appears below the video.
              </p>
              <button
                type="submit"
                disabled={!replyText.trim() || isSubmitting}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${isDark ? 'bg-sky-600 text-white hover:bg-sky-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? 'Submitting...' : 'Post Reply'}
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {replies.length > 0 ? (
            replies.map((reply) => (
              <div key={reply.id} className={`rounded-2xl border shadow-sm p-4 transition-all duration-300 ${isDark ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-white'}`}>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className={`text-sm font-semibold transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {reply.authorName}
                    </p>
                    <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {reply.authorRole}
                    </p>
                  </div>
                  <span className={`text-xs transition-colors duration-300 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {new Date(reply.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className={`whitespace-pre-wrap text-sm leading-6 transition-colors duration-300 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {reply.message}
                </p>
              </div>
            ))
          ) : (
            <div className={`rounded-2xl border border-dashed p-5 text-sm transition-all duration-300 ${isDark ? 'border-slate-700/50 bg-slate-900/30 text-slate-400' : 'border-slate-300 bg-white text-slate-500'}`}>
              No replies yet. School admin answers will appear here below the video.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default VideoDetailView;
