// components/Header/Header.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiMenu } from "react-icons/fi";
import {
  LanguageSelector,
  NotificationPanel,
  SearchButton,
} from "../layouts/header-section";
import { UserProfile } from "../components/user-profile";
import ThemeToggle from "../components/ui/ThemeToggle";
import HeaderActionButton from "../components/ui/HeaderActionButton";
import { useUser } from "../atoms/userAtom";
import RuralSparkLogo from "../components/ui/RuralSparkLogo";
import { useTheme } from '@/theme/AppThemeProvider';

interface HeaderProps {
  toggleMobileSidebar: () => void;
}

const Header = ({ toggleMobileSidebar }: HeaderProps) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const { user } = useUser();
  const userProfile = user;
  const { mode } = useTheme();
  const isDark = mode === "dark";
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 4);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const headerClass = `sticky top-0 z-30  backdrop-blur-md transition-all duration-300 ${
    isDark
      ? "bg-slate-950/70 text-gray-100 "
      : "bg-white/80 text-app  before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-50/30 before:to-transparent before:pointer-events-none"
  } ${isScrolled ? "shadow-lg" : "shadow-sm"}`;

  return (
    <motion.header
      className={headerClass}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className={`flex min-h-14 w-full items-center justify-between gap-2 px-2 py-2 ${isDark ? 'bg-slate-950/70' : 'bg-white/80'}`}>
        <motion.div
          className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <HeaderActionButton
            isDark={isDark}
            className="xl:hidden"
            onClick={toggleMobileSidebar}
            aria-label="Open navigation"
          >
            <FiMenu className="h-4 w-4" />
          </HeaderActionButton>

          <RuralSparkLogo isDark={isDark} />
        </motion.div>

        <motion.div className="ml-1 flex shrink-0 flex-nowrap items-center gap-1.5 sm:gap-3">
          <SearchButton isOnline={isOnline} />
          <div className="hidden lg:flex">
            <LanguageSelector />
          </div>
          <NotificationPanel isOnline={isOnline} />
          <div className="hidden md:flex">
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-2">
            <UserProfile userProfile={userProfile} isOnline={isOnline} />
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
