import { motion } from "framer-motion";
import { 
  Shield, 
  Zap, 
  LayoutDashboard, 
  BrainCircuit, 
  Users, 
  WifiOff,
  Library,
  BookOpen,
  Award,
  Globe,
  BarChart,
  MessageCircle,
  Video,
  Headphones,
  Target,
  Smartphone,
  Trophy
} from "lucide-react";
import { BentoGrid, type BentoItem } from "@/components/ui/bento-grid";
import { useTheme } from "@/theme/AppThemeProvider";

const features = [
  {
    title: "Online Library",
    description: "Access 600,000+ books including complete NCERT curriculum, reference materials, and competitive exam resources.",
    icon: Library,
    category: "Learning Resources",
    status: "Popular",
  },
  {
    title: "Complete NCERT Curriculum",
    description: "Full coverage from Class 1 to 12 with interactive modules, chapter-wise explanations, and practice questions.",
    icon: BookOpen,
    category: "Learning Resources",
    status: "Essential",
  },
  {
    title: "Offline-First Syncing",
    description: "Download content once and learn anywhere. Progress syncs automatically when you're back online.",
    icon: WifiOff,
    category: "Technology",
    status: "Featured",
  },
  {
    title: "AI-Powered Assistant",
    description: "Get instant help with complex topics, automated assignment grading, and personalized study recommendations.",
    icon: BrainCircuit,
    category: "AI & Automation",
    status: "New",
  },
  {
    title: "Multi-Language Support",
    description: "Content available in multiple regional languages for accessible learning across India.",
    icon: Globe,
    category: "Accessibility",
    status: "Regional",
  },
  {
    title: "Multi-Institution Management",
    description: "Centralized platform for managing multiple schools, coaching centers, and colleges.",
    icon: Users,
    category: "Management",
    status: "Enterprise",
  },
  {
    title: "Role-Based Access Control",
    description: "Secure permissions for Admins, Teachers, Students, and Parents ensuring data privacy.",
    icon: Shield,
    category: "Security",
    status: "Secure",
  },
  {
    title: "Gamified Learning",
    description: "Boost engagement with achievements, badges, leaderboards, and interactive challenges.",
    icon: LayoutDashboard,
    category: "Engagement",
    status: "Interactive",
  },
  {
    title: "Performance Optimized",
    description: "Lightweight architecture designed to run smoothly on low-end devices and slow connections.",
    icon: Zap,
    category: "Technology",
    status: "Fast",
  },
  {
    title: "Progress Analytics",
    description: "Track student performance with detailed analytics, reports, and learning insights.",
    icon: BarChart,
    category: "Analytics",
    status: "Insightful",
  },
  {
    title: "Video Lectures",
    description: "Access recorded lectures, tutorials, and interactive video content for better understanding.",
    icon: Video,
    category: "Learning Resources",
    status: "Visual",
  },
  {
    title: "Interactive Quizzes",
    description: "Engage students with auto-graded quizzes, tests, and real-time feedback.",
    icon: Target,
    category: "Assessment",
    status: "Interactive",
  },
  {
    title: "Progress Tracking",
    description: "Monitor individual and class progress with comprehensive tracking and reporting tools.",
    icon: Trophy,
    category: "Analytics",
    status: "Trackable",
  },
  {
    title: "Mobile Responsive",
    description: "Access learning materials on any device with fully responsive design.",
    icon: Smartphone,
    category: "Technology",
    status: "Mobile",
  },
  {
    title: "24/7 Support",
    description: "Round-the-clock technical support and learning assistance for all users.",
    icon: Headphones,
    category: "Support",
    status: "Available",
  },
  {
    title: "Automated Assessments",
    description: "AI-powered grading and assessment with instant feedback for students.",
    icon: MessageCircle,
    category: "AI & Automation",
    status: "Smart",
  },
  {
    title: "Certification & Awards",
    description: "Digital certificates and achievement awards for course completion.",
    icon: Award,
    category: "Recognition",
    status: "Rewarding",
  },
];

export function FeaturesSection() {
  const { mode } = useTheme();
  const isDark = mode === "dark";

  // Transform features to BentoGrid format with better categorization
  const bentoFeatures: BentoItem[] = features.map((feature, index) => {
    const Icon = feature.icon;
    
    // Define color based on category
    const getIconColor = (category: string) => {
      const colors: Record<string, string> = {
        "Learning Resources": "text-slate-500",
        "Technology": "text-blue-500",
        "AI & Automation": "text-purple-500",
        "Accessibility": "text-emerald-500",
        "Management": "text-indigo-500",
        "Security": "text-rose-500",
        "Engagement": "text-orange-500",
        "Analytics": "text-amber-500",
        "Assessment": "text-cyan-500",
        "Support": "text-slate-500",
        "Recognition": "text-yellow-500",
        "Default": "text-slate-400",
      };
      return colors[category] || colors.Default;
    };

    // Make first feature prominent
    const isProminent = index === 0;

    return {
      title: feature.title,
      description: feature.description,
      icon: <Icon className={`h-4 w-4 ${getIconColor(feature.category)}`} />,
      status: feature.status,
      tags: [feature.category, "Feature"],
      meta: feature.status,
      colSpan: isProminent ? 2 : 1,
      hasPersistentHover: isProminent,
    };
  });

  return (
    <section 
      id="features" 
      className={`relative py-20 sm:py-28 overflow-hidden ${
        isDark ? "bg-slate-950" : "bg-slate-50"
      }`}
    >
      {/* Subtle Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl ${
          isDark ? "bg-slate-500/5" : "bg-slate-200/20"
        }`} />
        <div className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl ${
          isDark ? "bg-slate-500/5" : "bg-slate-200/20"
        }`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl ${
          isDark ? "bg-slate-500/5" : "bg-slate-200/10"
        }`} />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`text-4xl sm:text-5xl font-bold tracking-tight mb-4 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Everything You Need for{" "}
            <span className={isDark ? "text-slate-400" : "text-slate-600"}>
              Modern Education
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={`text-lg leading-relaxed ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Comprehensive platform designed for rural education with enterprise-grade features
          </motion.p>
        </div>

        {/* Features Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <BentoGrid items={bentoFeatures}  />
        </motion.div>
      </div>
    </section>
  );
}