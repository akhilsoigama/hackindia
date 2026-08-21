import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import { ParticleButton } from '../components/ui/particle-button';
import { Translated } from '../components/common/translator/translator';
import { useTheme } from '@/theme/AppThemeProvider';
const Navbaar = ({ toggleMobileSidebar }: { toggleMobileSidebar: () => void }) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const navigate = useNavigate();
  const location = useLocation();
  const showBackButton = location.pathname !== '/dashboard' && location.pathname !== '/dashboard/overview';

  return (
    <div className={`flex flex-1 flex-col min-h-screen ${isDark ? 'bg-slate-950/70' : 'bg-gray-50'}  dark:text-gray-100`}>
      <Header toggleMobileSidebar={toggleMobileSidebar} />
      <div className="flex flex-1">
        <main className="flex-1 p-1 md:p-4 md:py-5 w-full min-w-0 bg-app-soft">
          {showBackButton && (
            <div className="mb-4">
              <ParticleButton
                onClick={() => navigate(-1)}
                successDuration={600}
                variant="default"
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                  isDark
                    ? 'border-slate-600 bg-slate-800 text-slate-100 hover:bg-slate-700'
                    : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100'
                }`}
              >
                <FaArrowLeft className="h-3.5 w-3.5" />
                <Translated text="Back" />
              </ParticleButton>
            </div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};
export default Navbaar;