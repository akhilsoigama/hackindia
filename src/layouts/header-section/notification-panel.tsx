// components/Header/NotificationPanel.tsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell } from 'react-icons/fi';
import { useTheme } from '@/theme/AppThemeProvider';
import HeaderActionButton from '../../components/ui/HeaderActionButton';

interface Notification {
  id: number;
  text: string;
  time: string;
  read: boolean;
}

interface NotificationPanelProps {
  isOnline: boolean;
}

const NotificationPanel = ({ isOnline }: NotificationPanelProps) => {
  const [showNotificationPanel, setShowNotificationPanel] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationRef = useRef<HTMLDivElement>(null);

  const toggleNotificationPanel = (): void => setShowNotificationPanel(!showNotificationPanel);
  const closeNotificationPanel = (): void => setShowNotificationPanel(false);

  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const bellClass = `${isDark ? 'text-gray-200' : 'text-gray-600'} h-4 w-4`;
  const badgeClass = `absolute -top-1 -right-1 flex items-center justify-center h-4 min-w-[1rem] px-1 rounded-full bg-red-500 text-white text-[9px] shadow ring-2 ${
    isDark ? 'ring-gray-900' : 'ring-white'
  }`;
  const panelClass = `absolute right-0 mt-3 w-60 sm:w-72 md:w-80 rounded-xl overflow-hidden z-40 border shadow-xl ${
    isDark ? 'bg-gray-900 text-gray-100 border-gray-800' : 'bg-white text-gray-800 border-gray-200'
  }`;
  const headerClass = `px-4 py-3  ${isDark ? 'border-gray-800 bg-gray-800/70' : 'border-gray-100 bg-gray-50'}`;
  const itemBase = `px-4 py-3  transition-colors`;
  const itemHover = isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
  const unreadClass = isDark ? 'bg-slate-800/70' : 'bg-slate-50';
  const timeClass = `${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs mt-1`;
  const footerClass = `px-4 py-3 text-center ${isDark ? 'bg-gray-800/70' : 'bg-gray-50'}`;
  const markAllClass = `${isDark ? 'text-slate-300 hover:text-slate-400' : 'text-slate-600 hover:text-slate-800'} text-sm font-medium`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        closeNotificationPanel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (isOnline) {
        try {
          const fetchedNotifications: Notification[] = [
            { id: 1, text: 'New mathematics lesson available', time: '10 mins ago', read: false },
            { id: 2, text: 'Your assignment was graded', time: '2 hours ago', read: false },
            { id: 3, text: 'Live session starting soon', time: '5 hours ago', read: true },
          ];
          setNotifications(fetchedNotifications);
        } catch (error) {
          console.error('Failed to fetch data:', error);
          const cachedNotifications = localStorage.getItem('notifications');
          if (cachedNotifications) {
            setNotifications(JSON.parse(cachedNotifications));
          }
        }
      } else {
        const cachedNotifications = localStorage.getItem('notifications');
        if (cachedNotifications) {
          setNotifications(JSON.parse(cachedNotifications));
        }
      }
    };
    loadData();
  }, [isOnline]);

  const markAllAsRead = (): void => {
    if (isOnline) {
      const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
      setNotifications(updatedNotifications);
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      closeNotificationPanel(); 
    }
  };

  const unreadCount: number = notifications.filter(n => !n.read).length;

  return (
    <motion.div
      className="relative"
      ref={notificationRef}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <HeaderActionButton
        isDark={isDark}
        onClick={toggleNotificationPanel}
        aria-label="Notifications"
        aria-haspopup="menu"
        aria-expanded={showNotificationPanel}
      >
        <FiBell className={bellClass} />
        <span className="hidden lg:inline text-sm font-medium">Alerts</span>
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0.9 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className={badgeClass}
          >
            {unreadCount}
          </motion.span>
        )}
      </HeaderActionButton>
      <AnimatePresence>
        {showNotificationPanel && (
          <motion.div
            className={panelClass}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            role="menu"
          >
            <div className={headerClass}>
              <h3 className="font-semibold text-sm sm:text-base">Notifications</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs`}>
                {unreadCount} unread
              </p>
            </div>
            <div className="max-h-40 sm:max-h-64 md:max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`${itemBase} ${itemHover} ${!notification.read ? unreadClass : ''}`}
                  >
                    <p className={`${isDark ? 'text-gray-100' : 'text-gray-800'} text-sm`}>
                      {notification.text}
                    </p>
                    <p className={timeClass}>{notification.time}</p>
                  </div>
                ))
              ) : (
                <div className={`px-4 py-6 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  No notifications available
                </div>
              )}
            </div>
            <div className={footerClass}>
              <button
                className={markAllClass}
                disabled={!isOnline}
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NotificationPanel;