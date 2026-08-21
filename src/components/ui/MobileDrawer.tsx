import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Check, Rocket, Layers, CreditCard, Mail } from "lucide-react";
import RuralSparkLogo from "@/components/ui/RuralSparkLogo";

type MenuItem = {
  key: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  href?: string;
};

type MobileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (href: string) => void;
  activeKey?: string | null;
  isDark?: boolean;
};

export function MobileDrawer({ isOpen, onClose, onNavigate, activeKey = null, isDark = true }: MobileDrawerProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const menu: MenuItem[] = React.useMemo(() => [
    { key: "features", label: "Features", description: "Explore AI-powered learning tools", icon: <Layers className="h-5 w-5" />, href: "#features" },
    { key: "pricing", label: "Pricing", description: "Flexible plans for every institution", icon: <CreditCard className="h-5 w-5" />, href: "#pricing" },
    { key: "contact", label: "Contact", description: "Talk to our education experts", icon: <Mail className="h-5 w-5" />, href: "#contact" },
  ], []);

  // Accessibility: focus management + keyboard handling
  React.useEffect(() => {
    if (!isOpen) return;
    const el = containerRef.current;
    // focus the first focusable element inside drawer
    const timer = setTimeout(() => {
      const focusable = el?.querySelector<HTMLElement>("button, a, [tabindex]:not([tabindex='-1'])");
      focusable?.focus();
    }, 50);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  const handleNavigate = (href?: string) => {
    if (!href) return;
    if (onNavigate) onNavigate(href);
    else window.location.href = href;
    onClose();
  };

  const drawerVariants = {
    hidden: { x: "100%", transition: { when: "afterChildren" } },
    visible: { x: 0, transition: { type: "spring", stiffness: 380, damping: 30 } },
  } as const;

  const listVariants = {
    hidden: { transition: { staggerChildren: 0.02, when: "afterChildren" } },
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.06 } },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.28 } },
  } as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          className="fixed inset-0 z-50 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-hidden={!isOpen}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

          {/* Drawer panel */}
          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
            className="absolute right-0 top-0 h-full w-[90%] max-w-105 rounded-l-4xl p-6 z-60 shadow-2xl shadow-black/40"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{
              background: isDark ? "rgba(10,10,15,0.85)" : "rgba(255,255,255,0.8)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full blur-2xl opacity-30" style={{ background: isDark ? "radial-gradient(circle,#0ea5a4,transparent)" : "radial-gradient(circle,#34d399,transparent)" }} />
                  <div className="relative">
                    <RuralSparkLogo isDark={isDark} showSubtitle={false} className="h-8" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold">RuralSpark</div>
                  <div className="text-[13px] text-zinc-400">AI-Powered Learning Platform</div>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                aria-label="Close menu"
                className="p-2 rounded-full bg-white/3 hover:bg-white/6 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <div className="p-1 rounded-full bg-white/6">
                  <X className={`h-4 w-4 ${isDark ? "text-white" : "text-slate-900"}`} />
                </div>
              </motion.button>
            </div>

            {/* Nav list */}
            <motion.nav className="mt-6 space-y-3" variants={listVariants} initial="hidden" animate="visible">
              {menu.map((m) => {
                const active = activeKey === m.key;
                return (
                  <motion.button
                    key={m.key}
                    variants={itemVariants}
                    onClick={() => handleNavigate(m.href)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left flex items-start gap-3 p-4 rounded-xl transition-transform duration-300 ${active ? 'ring-1 ring-emerald-400/30' : 'hover:bg-white/5'} focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <div className={`shrink-0 grid place-items-center h-10 w-10 rounded-lg ${active ? 'bg-linear-0-to-br from-emerald-500 to-teal-400 text-white' : 'bg-white/3 text-white/90'}`}>{m.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-base text-white">{m.label}</div>
                      {m.description && <div className="text-sm text-zinc-400 mt-1">{m.description}</div>}
                    </div>
                    {active && (
                      <div className="ml-2 grid place-items-center text-emerald-400"><Check className="h-4 w-4" /></div>
                    )}
                  </motion.button>
                );
              })}
            </motion.nav>

            {/* CTA Promo Card */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
              animate={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.32 }}
              className="mt-6 p-4 rounded-2xl"
              style={{ background: 'linear-gradient(180deg, rgba(16,185,129,0.12), rgba(6,95,70,0.06))', boxShadow: '0 8px 30px rgba(5, 150, 105, 0.08)' }}
            >
              <div className="font-semibold text-lg text-white">Start Transforming Education</div>
              <div className="text-sm text-zinc-400 mt-1">Bring AI-powered learning to your school, college, or coaching institute.</div>
              <motion.button
                onClick={() => handleNavigate('/dashboard')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-4 w-full inline-flex items-center justify-center rounded-3xl py-3 text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(90deg,#10b981,#06b6d4)', boxShadow: '0 8px 30px rgba(6,95,70,0.18)' }}
              >
                Get Started Free
              </motion.button>
            </motion.div>

            {/* Auth area */}
            <div className="mt-6 space-y-3">
              <motion.button
                onClick={() => handleNavigate('/dashboard')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full rounded-xl py-3 font-semibold text-white"
                style={{ background: 'linear-gradient(90deg,#10b981,#06b6d4)', boxShadow: '0 8px 30px rgba(6,95,70,0.12)' }}
              >
                Get Started
              </motion.button>

              <motion.button
                onClick={() => handleNavigate('/login')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-xl py-3 font-medium text-white bg-transparent border border-white/6 hover:bg-white/6"
              >
                Sign In
              </motion.button>
            </div>

            {/* Footer badges */}
            <div className="mt-6 border-t border-white/6 pt-4 text-sm text-zinc-400">
              <div className="font-medium text-white">Trusted by Schools & Institutes</div>
              <div className="mt-3 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="grid place-items-center h-7 w-7 rounded-md bg-white/6 text-emerald-400"><Check className="h-4 w-4" /></span>
                  <span>Offline Learning</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="grid place-items-center h-7 w-7 rounded-md bg-white/6 text-emerald-400"><Rocket className="h-4 w-4" /></span>
                  <span>AI Powered</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="grid place-items-center h-7 w-7 rounded-md bg-white/6 text-emerald-400"><Layers className="h-4 w-4" /></span>
                  <span>Analytics</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export default MobileDrawer;
