// components/Header/NotificationPanel.tsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell } from 'react-icons/fi';

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

  // Close notification panel when clicking outside
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
      closeNotificationPanel(); // Close panel after marking as read
    }
  };

  const unreadCount: number = notifications.filter(n => !n.read).length;

  return (
    <motion.div
      className="relative"
      ref={notificationRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <motion.button
        onClick={toggleNotificationPanel}
        className="p-1 rounded-full relative bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm border border-gray-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiBell className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-gray-600" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 flex items-center justify-center w-3 h-3 sm:w-4 sm:h-4 bg-red-500 text-white text-[9px] xs:text-xs rounded-full"
          >
            {unreadCount}
          </motion.span>
        )}
      </motion.button>
      <AnimatePresence>
        {showNotificationPanel && (
          <motion.div
            className="absolute right-0 mt-2 w-56 xs:w-64 sm:w-72 md:w-80 bg-white text-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 z-40"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2 sm:p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-xs sm:text-base">Notifications</h3>
              <p className="text-[10px] sm:text-xs text-gray-500">{unreadCount} unread</p>
            </div>
            <div className="max-h-40 sm:max-h-64 md:max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-2 sm:p-3 md:p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <p className="text-xs sm:text-sm">{notification.text}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))
              ) : (
                <div className="p-2 sm:p-3 md:p-4 text-center text-xs sm:text-sm text-gray-500">
                  No notifications available
                </div>
              )}
            </div>
            <div className="p-2 sm:p-3 bg-gray-50 text-center">
              <button
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium"
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