// components/Header/Header.tsx
import { useState, useEffect} from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen, FiMenu, FiUser, FiUsers, FiAward } from 'react-icons/fi';
import { LanguageSelector, NotificationPanel, SearchButton } from '../layouts/header-section';
import { UserProfile } from '../components/user-profile';
import { useUser } from '../atoms/userAtom';

interface HeaderProps {
  toggleMobileSidebar: () => void;
}

const Header = ({ toggleMobileSidebar }: HeaderProps) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const { user } = useUser();
  const userProfile = user;

  // Get role badge based on user type
  const getRoleBadge = () => {
    if (!user?.userType) return null;

    const roleConfig = {
      super_admin: { label: 'Super Admin', color: 'bg-purple-100 text-purple-800', icon: FiAward },
      institute: { label: 'Institute', color: 'bg-blue-100 text-blue-800', icon: FiUsers },
      faculty: { label: 'Faculty', color: 'bg-green-100 text-green-800', icon: FiUser },
      student: { label: 'Student', color: 'bg-orange-100 text-orange-800', icon: FiUser },
    };

    const config = roleConfig[user.userType as keyof typeof roleConfig];
    if (!config) return null;

    const IconComponent = config.icon;

    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3" />
        <span>{config.label}</span>
      </div>
    );
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="bg-white text-gray-800 p-2 sm:p-4 sticky top-0 z-30 shadow-md border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button
            onClick={toggleMobileSidebar}
            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm border border-gray-300 lg:hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiMenu className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-gray-600" />
          </motion.button>
          <div className="p-1 rounded-lg mr-1 sm:mr-3 shadow-sm border border-gray-200">
            <FiBookOpen className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 text-blue-600" />
          </div>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-base sm:text-xl md:text-2xl font-bold text-blue-700">
                EduHub
              </h1>
              <p className="text-[10px] text-gray-500 hidden xs:block">
                Empowering Education
                {userProfile?.userType && ` • ${userProfile.userType.replace('_', ' ').toUpperCase()}`}
              </p>
            </div>
            {getRoleBadge()}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1 sm:space-x-3 md:space-x-4">
          <SearchButton isOnline={isOnline} />
          <LanguageSelector />
          <NotificationPanel isOnline={isOnline} />
          <UserProfile 
            userProfile={userProfile} 
            isOnline={isOnline} 
          />
        </div>
      </div>
    </header>
  );
};

export default Header;