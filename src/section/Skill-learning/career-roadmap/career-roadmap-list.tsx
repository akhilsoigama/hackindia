import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  Briefcase,
  GraduationCap,
  Target,
  Rocket,
  Sparkles,
  Users,
  Calendar,
  ChevronRight,
  Lightbulb,
  Crown,
  Heart,
  Code,
  Palette,
  Pen,
  LucideIcon,
} from 'lucide-react';
import { useTheme } from '@/theme/AppThemeProvider';
import { cn } from '@/utils/utils';

/* -------------------------------------------------------------------------- */
/*  Types & Interfaces                                                        */
/* -------------------------------------------------------------------------- */

interface CareerStage {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  duration: string;
  skills: string[];
  roles: string[];
  salary?: string;
  color: 'teal' | 'violet' | 'rose' | 'amber' | 'sky' | 'slate';
}

interface CareerPath {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  category: string;
  color: 'teal' | 'violet' | 'rose' | 'amber' | 'sky' | 'slate';
  stages: CareerStage[];
  totalDuration: string;
  demandScore: number;
  growth: string;
}

/* -------------------------------------------------------------------------- */
/*  Career Paths Data                                                         */
/* -------------------------------------------------------------------------- */

const CAREER_PATHS: CareerPath[] = [
  {
    id: 'tech-engineering',
    title: 'Technology & Engineering',
    icon: Code,
    description: 'Build the future with software development, AI, and cutting-edge technology.',
    category: 'Technology',
    color: 'violet',
    totalDuration: '4-6 years',
    demandScore: 95,
    growth: '🚀 22% growth',
    stages: [
      {
        id: 'entry',
        title: 'Entry Level',
        icon: Rocket,
        description: 'Start your journey with foundational skills and junior roles.',
        duration: '1-2 years',
        skills: ['Programming Basics', 'Version Control', 'Problem Solving'],
        roles: ['Junior Developer', 'Intern', 'IT Support'],
        salary: '₹3-6 LPA',
        color: 'sky',
      },
      {
        id: 'mid',
        title: 'Mid-Level',
        icon: TrendingUp,
        description: 'Build expertise and take on more complex projects independently.',
        duration: '2-4 years',
        skills: ['System Design', 'Database Management', 'API Development'],
        roles: ['Software Engineer', 'DevOps Engineer', 'Full Stack Developer'],
        salary: '₹8-15 LPA',
        color: 'teal',
      },
      {
        id: 'senior',
        title: 'Senior & Lead',
        icon: Award,
        description: 'Lead teams, architect solutions, and drive technical decisions.',
        duration: '4-8 years',
        skills: ['Architecture', 'Team Leadership', 'Technical Strategy'],
        roles: ['Senior Engineer', 'Tech Lead', 'Engineering Manager'],
        salary: '₹20-40 LPA',
        color: 'violet',
      },
      {
        id: 'expert',
        title: 'Expert & Executive',
        icon: Crown,
        description: 'Shape the future of technology as a leader and innovator.',
        duration: '8+ years',
        skills: ['Innovation', 'Executive Leadership', 'Industry Influence'],
        roles: ['CTO', 'VP of Engineering', 'Principal Architect'],
        salary: '₹50+ LPA',
        color: 'amber',
      },
    ],
  },
  {
    id: 'design-creative',
    title: 'Design & Creative',
    icon: Palette,
    description: 'Create beautiful experiences through design, art, and creative thinking.',
    category: 'Creative',
    color: 'rose',
    totalDuration: '3-5 years',
    demandScore: 88,
    growth: '🎨 15% growth',
    stages: [
      {
        id: 'entry',
        title: 'Entry Level',
        icon: Rocket,
        description: 'Learn design principles and start building your portfolio.',
        duration: '1-2 years',
        skills: ['Design Principles', 'Color Theory', 'Typography'],
        roles: ['Junior Designer', 'Design Intern', 'Graphic Assistant'],
        salary: '₹2-5 LPA',
        color: 'rose',
      },
      {
        id: 'mid',
        title: 'Mid-Level',
        icon: TrendingUp,
        description: 'Develop expertise in specific design domains and tools.',
        duration: '2-4 years',
        skills: ['UI/UX Design', 'Design Systems', 'User Research'],
        roles: ['UI Designer', 'UX Designer', 'Product Designer'],
        salary: '₹6-15 LPA',
        color: 'amber',
      },
      {
        id: 'senior',
        title: 'Senior & Lead',
        icon: Award,
        description: 'Lead design initiatives and mentor junior designers.',
        duration: '4-7 years',
        skills: ['Design Strategy', 'Team Management', 'Creative Direction'],
        roles: ['Senior Designer', 'Design Lead', 'Creative Director'],
        salary: '₹18-35 LPA',
        color: 'teal',
      },
    ],
  },
  {
    id: 'business-management',
    title: 'Business & Management',
    icon: Briefcase,
    description: 'Lead organizations, drive growth, and make strategic decisions.',
    category: 'Business',
    color: 'amber',
    totalDuration: '3-7 years',
    demandScore: 92,
    growth: '📈 18% growth',
    stages: [
      {
        id: 'entry',
        title: 'Entry Level',
        icon: Rocket,
        description: 'Learn business fundamentals and start your corporate journey.',
        duration: '1-2 years',
        skills: ['Business Basics', 'Communication', 'Analytical Thinking'],
        roles: ['Management Trainee', 'Business Analyst', 'Sales Associate'],
        salary: '₹3-7 LPA',
        color: 'amber',
      },
      {
        id: 'mid',
        title: 'Mid-Level',
        icon: TrendingUp,
        description: 'Develop management skills and take on operational responsibilities.',
        duration: '2-4 years',
        skills: ['Project Management', 'Strategic Planning', 'Budgeting'],
        roles: ['Project Manager', 'Operations Manager', 'Team Lead'],
        salary: '₹10-25 LPA',
        color: 'teal',
      },
      {
        id: 'senior',
        title: 'Senior Management',
        icon: Award,
        description: 'Lead departments and drive organizational strategy.',
        duration: '4-8 years',
        skills: ['Executive Leadership', 'Strategic Vision', 'Change Management'],
        roles: ['Director', 'VP', 'General Manager'],
        salary: '₹30-60 LPA',
        color: 'violet',
      },
    ],
  },
  {
    id: 'healthcare-wellness',
    title: 'Healthcare & Wellness',
    icon: Heart,
    description: 'Make a difference in people\'s lives through healthcare and wellness.',
    category: 'Healthcare',
    color: 'rose',
    totalDuration: '4-8 years',
    demandScore: 90,
    growth: '🏥 20% growth',
    stages: [
      {
        id: 'entry',
        title: 'Entry Level',
        icon: Rocket,
        description: 'Start your healthcare career with foundational training.',
        duration: '1-3 years',
        skills: ['Medical Basics', 'Patient Care', 'Health Communication'],
        roles: ['Medical Intern', 'Nursing Assistant', 'Medical Technician'],
        salary: '₹2-5 LPA',
        color: 'rose',
      },
      {
        id: 'mid',
        title: 'Mid-Level',
        icon: TrendingUp,
        description: 'Specialize in your chosen healthcare field.',
        duration: '3-5 years',
        skills: ['Medical Specialization', 'Advanced Diagnostics', 'Patient Management'],
        roles: ['Specialist Doctor', 'Senior Nurse', 'Healthcare Administrator'],
        salary: '₹8-20 LPA',
        color: 'sky',
      },
      {
        id: 'senior',
        title: 'Senior & Leadership',
        icon: Award,
        description: 'Lead healthcare teams and shape medical practice.',
        duration: '5+ years',
        skills: ['Medical Leadership', 'Healthcare Policy', 'Research Innovation'],
        roles: ['Head of Department', 'Medical Director', 'Healthcare Executive'],
        salary: '₹25-60 LPA',
        color: 'teal',
      },
    ],
  },
  {
    id: 'education-training',
    title: 'Education & Training',
    icon: GraduationCap,
    description: 'Inspire the next generation through teaching and educational innovation.',
    category: 'Education',
    color: 'sky',
    totalDuration: '2-5 years',
    demandScore: 85,
    growth: '📚 12% growth',
    stages: [
      {
        id: 'entry',
        title: 'Entry Level',
        icon: Rocket,
        description: 'Begin your teaching career with foundational education.',
        duration: '1-2 years',
        skills: ['Teaching Methods', 'Curriculum Planning', 'Student Engagement'],
        roles: ['Assistant Teacher', 'Tutor', 'Education Intern'],
        salary: '₹2-4 LPA',
        color: 'sky',
      },
      {
        id: 'mid',
        title: 'Mid-Level',
        icon: TrendingUp,
        description: 'Develop your teaching expertise and take on more responsibility.',
        duration: '2-4 years',
        skills: ['Subject Expertise', 'Classroom Management', 'Assessment Design'],
        roles: ['Teacher', 'Education Coordinator', 'Curriculum Developer'],
        salary: '₹5-12 LPA',
        color: 'teal',
      },
      {
        id: 'senior',
        title: 'Senior & Leadership',
        icon: Award,
        description: 'Lead educational programs and shape learning outcomes.',
        duration: '4+ years',
        skills: ['Educational Leadership', 'Policy Development', 'Innovation'],
        roles: ['Principal', 'Education Director', 'Academic Dean'],
        salary: '₹15-30 LPA',
        color: 'violet',
      },
    ],
  },
  {
    id: 'content-communication',
    title: 'Content & Communication',
    icon: Pen,
    description: 'Tell stories, create content, and shape narratives across media.',
    category: 'Media',
    color: 'teal',
    totalDuration: '2-4 years',
    demandScore: 82,
    growth: '📝 14% growth',
    stages: [
      {
        id: 'entry',
        title: 'Entry Level',
        icon: Rocket,
        description: 'Start your content creation journey with fundamental skills.',
        duration: '1-2 years',
        skills: ['Writing Skills', 'Content Creation', 'Social Media'],
        roles: ['Content Writer', 'Junior Editor', 'Social Media Coordinator'],
        salary: '₹2-5 LPA',
        color: 'teal',
      },
      {
        id: 'mid',
        title: 'Mid-Level',
        icon: TrendingUp,
        description: 'Develop expertise in content strategy and digital communication.',
        duration: '2-3 years',
        skills: ['Content Strategy', 'SEO', 'Analytics'],
        roles: ['Content Manager', 'Digital Marketing Specialist', 'Editor'],
        salary: '₹6-15 LPA',
        color: 'amber',
      },
      {
        id: 'senior',
        title: 'Senior & Leadership',
        icon: Award,
        description: 'Lead content teams and drive communication strategy.',
        duration: '3+ years',
        skills: ['Brand Strategy', 'Team Leadership', 'Creative Direction'],
        roles: ['Head of Content', 'Brand Director', 'Communications Lead'],
        salary: '₹18-40 LPA',
        color: 'violet',
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Color Helpers                                                             */
/* -------------------------------------------------------------------------- */

const COLOR_STYLES: Record<string, any> = {
  teal: {
    bg: 'bg-teal-50 dark:bg-teal-500/10',
    border: 'border-teal-500/30',
    text: 'text-teal-600 dark:text-teal-400',
    hover: 'hover:border-teal-500/50 hover:shadow-teal-500/20',
    gradient: 'from-teal-500 via-teal-600 to-teal-700',
    badge: 'bg-teal-500 text-white',
  },
  violet: {
    bg: 'bg-violet-50 dark:bg-violet-500/10',
    border: 'border-violet-500/30',
    text: 'text-violet-600 dark:text-violet-400',
    hover: 'hover:border-violet-500/50 hover:shadow-violet-500/20',
    gradient: 'from-violet-500 via-violet-600 to-purple-700',
    badge: 'bg-violet-500 text-white',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-600 dark:text-rose-400',
    hover: 'hover:border-rose-500/50 hover:shadow-rose-500/20',
    gradient: 'from-rose-500 via-rose-600 to-red-700',
    badge: 'bg-rose-500 text-white',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-600 dark:text-amber-400',
    hover: 'hover:border-amber-500/50 hover:shadow-amber-500/20',
    gradient: 'from-amber-500 via-amber-600 to-orange-700',
    badge: 'bg-amber-500 text-white',
  },
  sky: {
    bg: 'bg-sky-50 dark:bg-sky-500/10',
    border: 'border-sky-500/30',
    text: 'text-sky-600 dark:text-sky-400',
    hover: 'hover:border-sky-500/50 hover:shadow-sky-500/20',
    gradient: 'from-sky-500 via-sky-600 to-blue-700',
    badge: 'bg-sky-500 text-white',
  },
  slate: {
    bg: 'bg-slate-50 dark:bg-slate-500/10',
    border: 'border-slate-500/30',
    text: 'text-slate-600 dark:text-slate-400',
    hover: 'hover:border-slate-500/50 hover:shadow-slate-500/20',
    gradient: 'from-slate-500 via-slate-600 to-slate-700',
    badge: 'bg-slate-500 text-white',
  },
};

/* -------------------------------------------------------------------------- */
/*  Career Path Card Component                                                */
/* -------------------------------------------------------------------------- */

interface CareerPathCardProps {
  path: CareerPath;
  isSelected: boolean;
  onSelect: () => void;
}

const CareerPathCard: React.FC<CareerPathCardProps> = ({ path, isSelected, onSelect }) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const colors = COLOR_STYLES[path.color];

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all duration-300",
        "border will-change-transform",
        isDark
          ? `border-slate-800 bg-slate-900/50 ${colors.hover}`
          : `border-slate-200 bg-white ${colors.hover}`,
        isSelected
          ? `ring-2 ${isDark ? `ring-${path.color}-500/50` : `ring-${path.color}-400`} shadow-lg`
          : "hover:-translate-y-1",
      )}
      onClick={onSelect}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className={cn(
          "absolute inset-0 bg-size[4px_4px]",
          isDark
            ? "bg-[radial-linear(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)]"
            : "bg-[radial-linear(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)]"
        )} />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300",
            isDark
              ? `bg-slate-800 text-slate-300 group-hover:${colors.text}`
              : `bg-slate-100 text-slate-600 group-hover:${colors.text}`
          )}>
            <path.icon className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-xs font-medium px-2.5 py-1 rounded-full",
              isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"
            )}>
              {path.category}
            </span>
            {isSelected && (
              <span className="flex items-center gap-1 text-teal-500 dark:text-teal-400 text-xs font-medium">
                <CheckCircle2 size={14} />
                Selected
              </span>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h3 className={cn(
          "text-lg font-bold mb-1",
          isDark ? "text-white" : "text-slate-900"
        )}>
          {path.title}
        </h3>
        <p className={cn(
          "text-sm mb-4",
          isDark ? "text-slate-400" : "text-slate-600"
        )}>
          {path.description}
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className={cn(
            "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full",
            isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
          )}>
            <Clock size={12} />
            {path.totalDuration}
          </div>
          <div className={cn(
            "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full",
            isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
          )}>
            <Users size={12} />
            {path.demandScore}% Demand
          </div>
          <div className={cn(
            "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full",
            isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
          )}>
            <TrendingUp size={12} />
            {path.growth}
          </div>
        </div>

        {/* Stages Preview */}
        <div className="flex items-center gap-1">
          {path.stages.map((stage, idx) => (
            <div
              key={stage.id}
              className={cn(
                "h-1.5 rounded-full flex-1 transition-all",
                isDark ? "bg-slate-700" : "bg-slate-200",
                idx < 3 && "bg-teal-500 dark:bg-teal-400"
              )}
            />
          ))}
        </div>

        {/* Hover CTA */}
        <div className={cn(
          "mt-3 text-xs font-medium transition-all duration-300 flex items-center gap-1",
          isDark ? `text-slate-400 group-hover:${colors.text}` : `text-slate-500 group-hover:${colors.text}`,
          "opacity-0 group-hover:opacity-100"
        )}>
          View Career Path
          <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Career Stage Card Component                                               */
/* -------------------------------------------------------------------------- */

interface CareerStageCardProps {
  stage: CareerStage;
  index: number;
  total: number;
  color: string;
}

const CareerStageCard: React.FC<CareerStageCardProps> = ({ stage, index, total, color }) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const colors = COLOR_STYLES[color];

  return (
    <div className={cn(
      "relative p-5 rounded-xl border transition-all",
      isDark
        ? "border-slate-700 bg-slate-800/50 hover:border-slate-600"
        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
    )}>
      {/* Step Number */}
      <div className="flex items-center gap-3 mb-3">
        <span className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
          colors.badge
        )}>
          {index + 1}
        </span>
        <span className={cn(
          "text-xs font-medium",
          isDark ? "text-slate-400" : "text-slate-500"
        )}>
          Stage {index + 1} of {total}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className={cn(
            "flex items-center gap-2",
            colors.text
          )}>
            <stage.icon size={16} />
            <h4 className="font-semibold">{stage.title}</h4>
          </div>
          <p className={cn(
            "text-sm mt-1",
            isDark ? "text-slate-400" : "text-slate-600"
          )}>
            {stage.description}
          </p>
        </div>
        {stage.salary && (
          <span className={cn(
            "text-sm font-semibold whitespace-nowrap ml-4",
            colors.text
          )}>
            {stage.salary}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="space-y-3">
        <div>
          <span className={cn(
            "text-xs font-medium flex items-center gap-1 mb-1.5",
            isDark ? "text-slate-400" : "text-slate-500"
          )}>
            <Clock size={12} />
            Duration: {stage.duration}
          </span>
        </div>

        <div>
          <span className={cn(
            "text-xs font-medium block mb-1.5",
            isDark ? "text-slate-400" : "text-slate-500"
          )}>
            Skills to Build:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {stage.skills.map((skill) => (
              <span
                key={skill}
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  isDark
                    ? "bg-slate-700 text-slate-300"
                    : "bg-slate-100 text-slate-600"
                )}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className={cn(
            "text-xs font-medium block mb-1.5",
            isDark ? "text-slate-400" : "text-slate-500"
          )}>
            Common Roles:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {stage.roles.map((role) => (
              <span
                key={role}
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full border",
                  isDark
                    ? "border-slate-700 text-slate-300"
                    : "border-slate-200 text-slate-600"
                )}
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Main Component                                                            */
/* -------------------------------------------------------------------------- */

const CareerRoadmapList: React.FC = () => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const [selectedPathId, setSelectedPathId] = useState<string | null>(CAREER_PATHS[0].id);

  const selectedPath = CAREER_PATHS.find((p) => p.id === selectedPathId);

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className={cn(
                "text-xs font-semibold uppercase tracking-wider flex items-center gap-2",
                isDark ? "text-slate-400" : "text-slate-600"
              )}>
                <Briefcase size={14} />
                Career Development
              </div>
              <h1 className={cn(
                "text-3xl sm:text-4xl font-bold mt-1",
                isDark ? "text-white" : "text-slate-900"
              )}>
                Your Career Roadmap
              </h1>
              <p className={cn(
                "text-sm mt-2 max-w-2xl",
                isDark ? "text-slate-400" : "text-slate-600"
              )}>
                Explore different career paths, understand the journey, and plan your professional growth
                with our comprehensive career roadmap.
              </p>
            </div>
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl border",
              isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white"
            )}>
              <Sparkles size={16} className="text-yellow-500" />
              <span className="text-sm font-medium">AI-Powered Recommendations</span>
            </div>
          </div>
        </header>

        {/* Career Paths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {CAREER_PATHS.map((path) => (
            <CareerPathCard
              key={path.id}
              path={path}
              isSelected={selectedPathId === path.id}
              onSelect={() => setSelectedPathId(path.id)}
            />
          ))}
        </div>

        {/* Selected Path Details */}
        {selectedPath && (
          <div className={cn(
            "rounded-3xl p-6 border transition-all",
            isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-lg"
          )}>
            <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl",
                    COLOR_STYLES[selectedPath.color].bg,
                    COLOR_STYLES[selectedPath.color].text
                  )}>
                    <selectedPath.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className={cn(
                      "text-2xl font-bold",
                      isDark ? "text-white" : "text-slate-900"
                    )}>
                      {selectedPath.title}
                    </h2>
                    <p className={cn(
                      "text-sm",
                      isDark ? "text-slate-400" : "text-slate-600"
                    )}>
                      {selectedPath.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm",
                  isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
                )}>
                  <Calendar size={14} />
                  {selectedPath.totalDuration}
                </div>
                <div className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm",
                  isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
                )}>
                  <Target size={14} />
                  {selectedPath.demandScore}% Demand
                </div>
              </div>
            </div>

            {/* Stages Timeline */}
            <div className="relative">
              {/* Connection Line */}
              <div className={cn(
                "absolute left-6 top-16 bottom-4 w-0.5",
                isDark ? "bg-slate-700" : "bg-slate-200"
              )} />

              {/* Stages */}
              <div className="space-y-4">
                {selectedPath.stages.map((stage, index) => (
                  <div key={stage.id} className="relative pl-12">
                    {/* Connection Dot */}
                    <div className={cn(
                      "absolute left-4 top-5 w-4 h-4 rounded-full border-2",
                      COLOR_STYLES[stage.color].bg,
                      COLOR_STYLES[stage.color].border
                    )}>
                      <div className={cn(
                        "w-2 h-2 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                        COLOR_STYLES[stage.color].badge
                      )} />
                    </div>

                    <CareerStageCard
                      stage={stage}
                      index={index}
                      total={selectedPath.stages.length}
                      color={stage.color}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Career Tips */}
            <div className={cn(
              "mt-6 p-4 rounded-xl border",
              isDark ? "border-slate-700 bg-slate-800/30" : "border-slate-200 bg-slate-50"
            )}>
              <div className="flex items-start gap-3">
                <Lightbulb size={18} className="text-yellow-500 mt-0.5" />
                <div>
                  <h4 className={cn(
                    "text-sm font-semibold mb-1",
                    isDark ? "text-white" : "text-slate-900"
                  )}>
                    Pro Tip for Your Career Journey
                  </h4>
                  <p className={cn(
                    "text-sm",
                    isDark ? "text-slate-400" : "text-slate-600"
                  )}>
                    Focus on building a strong foundation in your early career, network actively in your industry,
                    and never stop learning. The most successful professionals are those who adapt and grow continuously.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerRoadmapList;