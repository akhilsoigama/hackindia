import { motion } from "framer-motion";
import { FileText, Download, Share } from "lucide-react";
import { ILecture } from "../../types/material";
import { useTheme } from '@/theme/AppThemeProvider';

const PDFDetailView = ({ lecture }: { lecture: ILecture }) => {
  const { mode } = useTheme();
  const isDark = mode === "dark";

  // Download handler
  const handleDownload = () => {
    if (!lecture?.contentUrl) return;
    const link = document.createElement("a");
    link.href = lecture.contentUrl;
    link.download = `${lecture.title || "document"}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Share handler
  const handleShare = async () => {
    if (navigator.share && lecture?.contentUrl) {
      try {
        await navigator.share({
          title: lecture.title,
          text: lecture.description || "",
          url: lecture.contentUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      alert("Sharing not supported on this device/browser.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl shadow-2xl border overflow-hidden transition-all duration-300 ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-white'}`}
    >
      {/* Header */}
      <div className={`p-8 text-center transition-colors duration-300 ${isDark ? 'bg-red-950/30' : 'bg-red-50'}`}>
        <FileText className={`w-24 h-24 mx-auto mb-6 transition-colors duration-300 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
        <h3 className={`text-2xl font-bold mb-3 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {lecture.title}
        </h3>
        {lecture.description && (
          <p className={`text-lg max-w-2xl mx-auto transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            {lecture.description}
          </p>
        )}
      </div>

      {/* PDF Details + Actions */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Details */}
          <div className={`rounded-xl p-6 transition-all duration-300 ${isDark ? 'bg-slate-900/50 border border-slate-700/50' : 'bg-gray-50'}`}>
            <h4 className={`font-semibold mb-3 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Document Details
            </h4>
            <div className={`space-y-2 text-sm transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-gray-700'}`}>
              <div className="flex justify-between">
                <span>Subject:</span>
                <span className={`font-medium transition-colors duration-300 ${isDark ? 'text-slate-200' : ''}`}>
                  {lecture.subject || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Standard:</span>
                <span className={`font-medium transition-colors duration-300 ${isDark ? 'text-slate-200' : ''}`}>
                  {lecture.std || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Format:</span>
                <span className={`font-medium uppercase transition-colors duration-300 ${isDark ? 'text-slate-200' : ''}`}>
                  {lecture.contentType}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={`rounded-xl p-6 transition-all duration-300 ${isDark ? 'bg-slate-900/50 border border-slate-700/50' : 'bg-gray-50'}`}>
            <h4 className={`font-semibold mb-3 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h4>
            <div className="space-y-3">
              {/* Download */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleDownload}
                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition ${isDark ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-500 text-white hover:bg-red-600'}`}
              >
                <Download className="w-5 h-5" />
                Download PDF
              </motion.button>

              {/* Share */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleShare}
                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition ${isDark ? 'border border-slate-600 text-slate-300 hover:bg-slate-700/50' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'}`}
              >
                <Share className="w-5 h-5" />
                Share
              </motion.button>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className={`border rounded-xl p-4 transition-all duration-300 ${isDark ? 'border-yellow-900/50 bg-yellow-950/30 text-yellow-300' : 'border-yellow-200 bg-yellow-50 text-yellow-800'}`}>
          <p className="text-sm text-center">
            📚 You can view this PDF using your browser’s built-in viewer or
            download it for offline reading.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PDFDetailView;
