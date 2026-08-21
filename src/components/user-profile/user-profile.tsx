import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  FiChevronDown,
  FiUser,
  FiSettings,
  FiLogOut,
  FiWifiOff,
} from "react-icons/fi";
import { useTheme } from '@/theme/AppThemeProvider';
import HeaderActionButton from '../ui/HeaderActionButton';
import ThemeToggle from '../ui/ThemeToggle';
import { toast } from "sonner";
import { useUser } from "../../atoms/userAtom";

interface UserProfileProps {
  userProfile: {
    data?: UserProfileData;
  } | null;
  isOnline: boolean;
  isLoading?: boolean;
}

interface UserProfileData {
  fullName?: string;
  email?: string;
  role?: {
    roleName?: string;
  };
  authType?: string;
}

const UserProfile = ({ userProfile, isOnline, isLoading = false }: UserProfileProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { logout } = useUser();

  const [cachedUserData, setCachedUserData] = useState<UserProfileData | null>(null);
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const isUserProfileData = (value: unknown): value is UserProfileData => {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const candidate = value as UserProfileData;
    const hasValidFullName =
      candidate.fullName === undefined || typeof candidate.fullName === 'string';
    const hasValidEmail =
      candidate.email === undefined || typeof candidate.email === 'string';
    const hasValidRole =
      candidate.role === undefined ||
      (typeof candidate.role === 'object' &&
        candidate.role !== null &&
        (candidate.role.roleName === undefined ||
          typeof candidate.role.roleName === 'string'));
    const hasValidAuthType =
      candidate.authType === undefined || typeof candidate.authType === 'string';
          
    return hasValidFullName && hasValidEmail && hasValidRole && hasValidAuthType;
  };


  const userData = userProfile?.data || cachedUserData;
  const toggleProfile = (): void => setIsProfileOpen(!isProfileOpen);

  useEffect(() => {
    if (userProfile?.data) {
      setCachedUserData(userProfile.data);
      localStorage.setItem('cachedUserData', JSON.stringify(userProfile.data));
    }
  }, [userProfile]);

  useEffect(() => {
    const cached = localStorage.getItem('cachedUserData');
    if (cached) {
      try {
        const parsed: unknown = JSON.parse(cached);
        if (isUserProfileData(parsed)) {
          setCachedUserData(parsed);
        }
      } catch (error) {
        console.error('Error parsing cached user data:', error);
      }
    }
  }, []);

  async function logoutHandler() {
    try {
      await logout();
      localStorage.removeItem('cachedUserData');
    } catch (err) {
      toast.error(`${err}`);
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <motion.div
      className="relative"
      ref={profileRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <HeaderActionButton
        onClick={toggleProfile}
        isDark={isDark}
        className="h-12 gap-2"
        disabled={isLoading}
        aria-haspopup="menu"
        aria-expanded={isProfileOpen}
      >
        <div className="relative ">
          <span className={`h-8 w-8 rounded-full flex items-center justify-center font-semibold text-sm shadow-sm ring-2 ${isDark ? 'bg-slate-600 text-white ring-gray-800' : 'bg-slate-500 text-white ring-white'}`}>
            {userData?.fullName?.charAt(0)?.toUpperCase() || "U"}
          </span>
          <span
            className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border ${isDark ? 'border-gray-900' : 'border-white'} ${isOnline ? 'bg-emerald-500' : (isDark ? 'bg-gray-500' : 'bg-gray-400')}`}
          ></span>
        </div>
        <div className="text-left hidden lg:block">
          <p className={`font-medium text-sm ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{userData?.fullName || "User"}</p>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{userData?.authType || "Loading..."}</p>
        </div>
        <motion.div
          animate={{ rotate: isProfileOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiChevronDown className={`${isDark ? 'text-gray-300' : 'text-gray-600'} h-4 w-4`} />
        </motion.div>
      </HeaderActionButton>

      <AnimatePresence>
        {isProfileOpen && (
          <motion.div
            className={`absolute right-0 mt-3 w-48 sm:w-56 p-2 rounded-xl overflow-hidden z-40 border shadow-xl ${isDark ? 'bg-gray-900 text-gray-100 border-gray-800' : 'bg-white text-gray-800 border-gray-200'}`}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className={`mb-2 rounded-lg px-4 py-4 border-b ${isDark ? 'border-gray-800 bg-gray-800/70' : 'border-gray-100 bg-gray-50'}`}>
              <div className="space-y-1">
                <p className={`font-semibold text-sm ${isDark ? 'text-gray-100' : 'text-gray-900'} truncate`}>
                  {userData?.fullName || "User"}
                </p>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs truncate`}>
                  {userData?.email || "Loading..."}
                </p>
                {!isOnline && (
                  <p className="text-xs text-red-500 flex items-center mt-1">
                    <FiWifiOff className="h-3 w-3 mr-1" />
                    Offline
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <div className="md:hidden rounded-lg px-3 py-2">
                <ThemeToggle />
              </div>

              <NavLink
                to={`/dashboard/profile`}
                className={({ isActive }) => `flex items-center rounded-lg px-3 py-2 text-sm transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/60 focus-visible:ring-offset-2 ${isDark ? 'focus-visible:ring-offset-gray-900' : 'focus-visible:ring-offset-white'} ${isActive ? (isDark ? 'bg-slate-900/40 text-slate-200 shadow-sm shadow-slate-900/30' : 'bg-slate-100/60 text-slate-700 shadow-sm shadow-slate-200/40') : (isDark ? 'text-gray-300 hover:bg-gray-800/50 hover:text-gray-100' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900')}`}
                onClick={toggleProfile}
              >
                <FiUser className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mr-2 h-4 w-4 transition-colors duration-300`} />
                Profile
              </NavLink>

              <NavLink
                to="/dashboard/settings"
                className={({ isActive }) => `flex items-center rounded-lg px-3 py-2 text-sm transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/60 focus-visible:ring-offset-2 ${isDark ? 'focus-visible:ring-offset-gray-900' : 'focus-visible:ring-offset-white'} ${isActive ? (isDark ? 'bg-slate-900/40 text-slate-200 shadow-sm shadow-slate-900/30' : 'bg-slate-100/60 text-slate-700 shadow-sm shadow-slate-200/40') : (isDark ? 'text-gray-300 hover:bg-gray-800/50 hover:text-gray-100' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900')}`}
                onClick={toggleProfile}
              >
                <FiSettings className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mr-2 h-4 w-4 transition-colors duration-300`} />
                Settings
              </NavLink>
            </div>

            <div className={`${isDark ? 'border-t border-gray-800' : 'border-t border-gray-100'} my-2`} />

            <button
              className={`flex items-center w-full rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:ring-offset-2 ${isDark ? 'hover:bg-red-900/20 text-red-400 focus-visible:ring-offset-gray-900' : 'hover:bg-red-50 text-red-600 focus-visible:ring-offset-white'}`}
              onClick={logoutHandler}
            >
              <FiLogOut className={`mr-2 h-4 w-4 ${isDark ? 'text-red-400' : ''}`} />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UserProfile;