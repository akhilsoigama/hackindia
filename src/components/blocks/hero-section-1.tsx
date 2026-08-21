import * as React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { TextEffect } from "@/components/ui/text-effect";
import RuralSparkLogo from "@/components/ui/RuralSparkLogo";
import { useTheme } from "@/theme/AppThemeProvider";
import { AboutSection } from "./about-section";
import { FeaturesSection } from "./features-section";
import { PricingSection } from "./pricing-section";
import { ContactSection } from "./contact-section";
import { Footer } from "./footer";
import { ParticleButton } from "../ui/particle-button";

const sliderImages = [
  {
    src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&auto=format&fit=crop&q=85",
    alt: "Students studying with laptops",
    label: "AI-Powered Learning",
  },
  {
    src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&auto=format&fit=crop&q=85",
    alt: "Teacher with students in classroom",
    label: "Interactive Classrooms",
  },
  {
    src: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1600&auto=format&fit=crop&q=85",
    alt: "Student reading",
    label: "Offline-First Syncing",
  },
  {
    src: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1600&auto=format&fit=crop&q=85",
    alt: "Student with notebook",
    label: "Progress Tracking",
  },
];

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "About Us", href: "#about" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export function HeroSection1() {
  const navigate = useNavigate();
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const prefersReducedMotion = useReducedMotion();

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [imagesLoaded, setImagesLoaded] = React.useState<boolean[]>([]);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const drawerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    Promise.all(
      sliderImages.map(
        (img) =>
          new Promise<boolean>((res) => {
            const el = new Image();
            el.src = img.src;
            el.onload = () => res(true);
            el.onerror = () => res(false);
          }),
      ),
    ).then(setImagesLoaded);
  }, []);

  React.useEffect(() => {
    const t = setInterval(
      () => setCurrentIndex((p) => (p + 1) % sliderImages.length),
      5000,
    );
    return () => clearInterval(t);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  React.useEffect(() => {
    if (!mobileOpen) return;
    const pd = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node))
        setMobileOpen(false);
    };
    const kd = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("pointerdown", pd);
    document.addEventListener("keydown", kd);
    return () => {
      document.removeEventListener("pointerdown", pd);
      document.removeEventListener("keydown", kd);
    };
  }, [mobileOpen]);

  React.useEffect(() => {
    const fn = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const close = () => setMobileOpen(false);
  const navClick = (href: string) => {
    close();
    setTimeout(
      () =>
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }),
      150,
    );
  };

  return (
    <div className="relative w-full overflow-x-hidden">
      {/* Header */}
      <header
        className={`fixed top-0 inset-x-0 z-50 h-16 flex items-center transition-all duration-300 ${
          scrolled
            ? isDark
              ? "bg-slate-950/90 border-b border-slate-800/50 backdrop-blur-xl shadow-lg"
              : "bg-white/90 border-b border-slate-200/50 backdrop-blur-xl shadow-sm"
            : isDark
            ? "bg-transparent border-transparent"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <RuralSparkLogo
            isDark={isDark}
          />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isDark
                    ? scrolled
                      ? "text-slate-300 hover:text-white hover:bg-slate-800/50"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                    : scrolled
                    ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ParticleButton
              onClick={() => navigate("/login")}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isDark
                  ? "text-white hover:text-slate-800 hover:bg-slate-100 bg-transparent"
                  : scrolled
                  ? "text-slate-700 hover:text-slate-900 hover:bg-slate-100/50"
                  : "text-slate-900 hover:text-slate-900 hover:bg-white/10"
              }`}
            >
              Sign In
            </ParticleButton>
            <ParticleButton
              onClick={() => navigate("/dashboard")}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md ${
                isDark
                  ? "bg-white text-slate-900 hover:bg-slate-100 hover:shadow-lg"
                  : "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg"
              }`}
            >
              Get Started
            </ParticleButton>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <ParticleButton
              onClick={() => navigate("/login")}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isDark
                  ? "text-white/80 hover:text-white hover:bg-white/10"
                  : scrolled
                  ? "text-slate-700 hover:text-slate-900 hover:bg-slate-100/50"
                  : "text-slate-900 hover:text-white hover:bg-white/10"
              }`}
            >
              Sign In
            </ParticleButton>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className={`h-9 w-9 flex items-center justify-center rounded-lg transition-all duration-200 ${
                isDark
                  ? "text-white/80 hover:text-white hover:bg-white/10"
                  : scrolled
                  ? "text-slate-700 hover:text-slate-900 hover:bg-slate-100/50"
                  : "text-white/90 hover:text-white hover:bg-white/10"
              }`}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span
                    key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="m"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="bd"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden"
              onClick={close}
            />
            <motion.div
              key="dr"
              ref={drawerRef}
              initial={{ x: "100%", opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className={`fixed top-3 right-3 bottom-3 z-50 w-[85vw] max-w-sm rounded-2xl overflow-hidden shadow-2xl border md:hidden ${
                isDark
                  ? "bg-slate-900 backdrop-blur-xl border-slate-700"
                  : "bg-white backdrop-blur-xl border-slate-200"
              }`}
            >
              <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? "border-slate-800" : "border-slate-100"}`}>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-6 rounded-full bg-teal-500"></div>
                  <span className={`text-xs font-semibold tracking-wider uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    RuralSpark
                  </span>
                </div>
                  <button
                    onClick={close}
                  className={`h-8 w-8 flex items-center justify-center rounded-xl transition-all duration-200 ${
                    isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"
                    }`}
                  >
                  <X className={`h-4 w-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                  </button>
                </div>

              <div className="flex flex-col h-[calc(100%-60px)] px-3 py-4 overflow-y-auto">
                <div className="flex-1 space-y-1">
                    {NAV_LINKS.map(({ label, href }) => (
                      <button
                        key={href}
                        onClick={() => navClick(href)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 text-left group ${
                          isDark
                          ? "text-slate-200 hover:bg-slate-800"
                          : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {label}
                      <ArrowRight className="ml-auto h-3.5 w-3.5 opacity-0 group-hover:opacity-40 transition-all" />
                      </button>
                    ))}
                  </div>

                <div className="pt-4 mt-4 space-y-3 border-t border-slate-200/50 dark:border-slate-800/50">
                  <div className={`flex items-center gap-2 px-2 py-1.5 rounded-xl ${isDark ? "bg-slate-800" : "bg-slate-50"}`}>
                    <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                    <span className={`text-[11px] font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Ready to transform rural tech?
                    </span>
                  </div>

                    <button
                      onClick={() => {
                        close();
                        navigate("/dashboard");
                      }}
                    className={`w-full h-11 rounded-xl text-white text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      isDark ? "bg-teal-600 hover:bg-teal-500" : "bg-teal-600 hover:bg-teal-700"
                    }`}
                    >
                      Get Started
                    </button>

                  <button
                    onClick={() => {
                      close();
                      navigate("/dashboard");
                    }}
                    className={`w-full text-xs font-medium py-2 rounded-lg transition-colors ${
                      isDark ? "text-slate-400 hover:text-teal-400" : "text-slate-500 hover:text-teal-600"
                    }`}
                  >
                    Explore dashboard →
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <section className="relative w-full h-screen min-h-140 max-h-225 overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="sync">
            {sliderImages.map((img, idx) =>
              idx === currentIndex && imagesLoaded[idx] !== false ? (
                <motion.img
                  key={idx}
                  src={img.src}
                  alt={img.alt}
                  initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              ) : null,
            )}
          </AnimatePresence>
        </div>

        {/* Overlays */}
        <div className="absolute inset-0 z-10 bg-slate-950/50" />
        <div className="absolute inset-0 z-10 bg-linear-to-r from-slate-950/70 via-slate-950/30 to-transparent" />
        <div
          className={`absolute inset-x-0 bottom-0 z-10 h-32 ${
            isDark
              ? "bg-linear-to-t from-slate-950 to-transparent"
              : "bg-linear-to-t from-white/90 to-transparent"
          }`}
        />

        {/* Content */}
        <div className={`relative z-20 w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 flex flex-col items-start transition-all duration-300 ${
          mobileOpen ? "blur-sm brightness-75 pointer-events-none" : ""
        }`}>
          <h1 className="text-[2rem] leading-[1.1] sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4 max-w-[95%] sm:max-w-[65%] md:max-w-[55%]">
            <TextEffect
              text="Revolutionizing Education with AI & Offline Learning"
              preset="fade"
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="text-sm sm:text-base text-white/80 mb-8 max-w-[90%] sm:max-w-[55%] md:max-w-[45%] leading-relaxed"
          >
            An AI-Powered LMS bridging the digital divide in schools, colleges,
            coaching centres, and rural institutions — even offline.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="flex flex-wrap items-center gap-3"
          >
            <ParticleButton
              onClick={() => navigate("/dashboard")}
              className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg ${
                isDark
                  ? "bg-white text-slate-900 hover:bg-slate-100"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              Start Building Free
              <ArrowRight className="h-4 w-4 ml-2 inline-block" />
            </ParticleButton>
          </motion.div>

          {/* Slider Controls */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-8 left-4 sm:left-6 lg:left-8 flex flex-col gap-2"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={currentIndex}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.25 }}
                className="text-[10px] font-medium text-white/60 tracking-[0.2em] uppercase"
              >
                {sliderImages[currentIndex].label}
              </motion.p>
            </AnimatePresence>
            <div className="flex gap-1.5">
              {sliderImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    idx === currentIndex
                      ? "w-8 bg-white"
                      : "w-2 bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      <AboutSection />
      <FeaturesSection />
      <PricingSection />
      <ContactSection />
      <Footer />
    </div>
  );
}