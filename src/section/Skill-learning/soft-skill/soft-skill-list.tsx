import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Users,
  Heart,
  Brain,
  Mic,
  Handshake,
  Lightbulb,
  Target,
  Shield,
  Zap,
  Eye,
  Crown,
  Rocket,
  LucideIcon,
  Activity,
} from 'lucide-react';
import { useTheme } from '@/theme/AppThemeProvider';
import { cn } from '@/utils/utils';
import { ParticleButton } from '@/components/ui/particle-button';

interface SoftSkill {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  category: 'Communication' | 'Leadership' | 'Emotional' | 'Problem Solving' | 'Teamwork' | 'Adaptability';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  color: 'teal' | 'slate' | 'rose' | 'slate' | 'sky' | 'slate' | 'teal' | 'slate';
  tips: string[];
  exercises: string[];
  importance: number; // 1-100
  relatedSkills: string[];
}

interface SkillCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  color: 'teal' | 'slate' | 'rose' | 'slate' | 'sky' | 'slate';
}

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
    ring: 'ring-teal-500/40',
    glow: 'shadow-teal-500/20',
  },
  slate: {
    bg: 'bg-slate-50 dark:bg-slate-500/10',
    border: 'border-slate-500/30',
    text: 'text-slate-600 dark:text-slate-400',
    hover: 'hover:border-slate-500/50 hover:shadow-slate-500/20',
    gradient: 'from-slate-500 via-slate-600 to-slate-700',
    badge: 'bg-slate-500 text-white',
    ring: 'ring-slate-500/40',
    glow: 'shadow-slate-500/20',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-600 dark:text-rose-400',
    hover: 'hover:border-rose-500/50 hover:shadow-rose-500/20',
    gradient: 'from-rose-500 via-rose-600 to-red-700',
    badge: 'bg-rose-500 text-white',
    ring: 'ring-rose-500/40',
    glow: 'shadow-rose-500/20',
  },
  sky: {
    bg: 'bg-sky-50 dark:bg-sky-500/10',
    border: 'border-sky-500/30',
    text: 'text-sky-600 dark:text-sky-400',
    hover: 'hover:border-sky-500/50 hover:shadow-sky-500/20',
    gradient: 'from-sky-500 via-sky-600 to-slate-700',
    badge: 'bg-sky-500 text-white',
    ring: 'ring-sky-500/40',
    glow: 'shadow-sky-500/20',
  },
};

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'communication',
    name: 'Communication',
    icon: Mic,
    description: 'Express ideas clearly, listen actively, and communicate effectively.',
    color: 'teal',
  },
  {
    id: 'leadership',
    name: 'Leadership',
    icon: Crown,
    description: 'Inspire others, make decisions, and guide teams to success.',
    color: 'slate',
  },
  {
    id: 'emotional',
    name: 'Emotional Intelligence',
    icon: Heart,
    description: 'Understand and manage emotions, build strong relationships.',
    color: 'rose',
  },
  {
    id: 'problem-solving',
    name: 'Problem Solving',
    icon: Brain,
    description: 'Analyze situations, think critically, and find creative solutions.',
    color: 'slate',
  },
  {
    id: 'teamwork',
    name: 'Teamwork',
    icon: Users,
    description: 'Collaborate effectively, build trust, and achieve shared goals.',
    color: 'sky',
  },
  {
    id: 'adaptability',
    name: 'Adaptability',
    icon: Zap,
    description: 'Embrace change, learn quickly, and thrive in dynamic environments.',
    color: 'slate',
  },
];

const SOFT_SKILLS: SoftSkill[] = [
  // Communication Skills
  {
    id: 'public-speaking',
    title: 'Public Speaking',
    icon: Mic,
    description: 'Deliver confident presentations and communicate ideas effectively to any audience.',
    category: 'Communication',
    level: 'Intermediate',
    duration: '6 weeks',
    color: 'teal',
    importance: 85,
    tips: [
      'Start with a strong opening that grabs attention',
      'Use stories and examples to make your points memorable',
      'Practice in front of a mirror or record yourself',
      'Focus on your audience\'s needs, not your fears',
    ],
    exercises: [
      'Give a 2-minute presentation on any topic daily',
      'Join a local Toastmasters club',
      'Record and review your practice sessions',
      'Volunteer to present at team meetings',
    ],
    relatedSkills: ['Active Listening', 'Storytelling', 'Persuasion'],
  },
  {
    id: 'active-listening',
    title: 'Active Listening',
    icon: Eye,
    description: 'Listen to understand, not just to reply. Build stronger connections through attentive listening.',
    category: 'Communication',
    level: 'Beginner',
    duration: '4 weeks',
    color: 'sky',
    importance: 90,
    tips: [
      'Give the speaker your full attention',
      'Don\'t interrupt or formulate your response while they speak',
      'Ask clarifying questions to ensure understanding',
      'Summarize what you heard to confirm comprehension',
    ],
    exercises: [
      'In conversations, wait 3 seconds before responding',
      'Practice paraphrasing what others say',
      'Count how many times you interrupt in a meeting',
      'Have a conversation where you only ask questions',
    ],
    relatedSkills: ['Empathy', 'Communication', 'Emotional Intelligence'],
  },
  // Leadership Skills
  {
    id: 'emotional-intelligence',
    title: 'Emotional Intelligence',
    icon: Heart,
    description: 'Recognize, understand, and manage your own emotions and those of others.',
    category: 'Emotional',
    level: 'Intermediate',
    duration: '8 weeks',
    color: 'rose',
    importance: 95,
    tips: [
      'Practice self-awareness by journaling your emotions',
      'Learn to pause before reacting emotionally',
      'Show empathy by trying to understand others\' perspectives',
      'Manage stress through mindfulness and breathing exercises',
    ],
    exercises: [
      'Keep an emotion journal for 30 days',
      'Practice deep breathing when feeling stressed',
      'Ask for feedback on your emotional responses',
      'Role-play difficult conversations with a friend',
    ],
    relatedSkills: ['Leadership', 'Communication', 'Teamwork'],
  },
  {
    id: 'decision-making',
    title: 'Decision Making',
    icon: Target,
    description: 'Make confident, informed decisions under pressure with clear reasoning.',
    category: 'Leadership',
    level: 'Advanced',
    duration: '6 weeks',
    color: 'slate',
    importance: 88,
    tips: [
      'Gather relevant information before deciding',
      'Consider multiple perspectives and options',
      'Weigh pros and cons systematically',
      'Trust your instincts but back them with data',
    ],
    exercises: [
      'Practice making decisions with time limits',
      'Document your decision-making process',
      'Review past decisions and their outcomes',
      'Seek diverse opinions before important decisions',
    ],
    relatedSkills: ['Problem Solving', 'Critical Thinking', 'Leadership'],
  },
  // Problem Solving
  {
    id: 'critical-thinking',
    title: 'Critical Thinking',
    icon: Brain,
    description: 'Analyze information objectively and make reasoned judgments without bias.',
    category: 'Problem Solving',
    level: 'Intermediate',
    duration: '6 weeks',
    color: 'slate',
    importance: 92,
    tips: [
      'Question assumptions and challenge the status quo',
      'Seek evidence before forming conclusions',
      'Consider alternative explanations and viewpoints',
      'Avoid emotional reasoning in decision-making',
    ],
    exercises: [
      'Read news from multiple perspectives daily',
      'Practice identifying logical fallacies',
      'Solve puzzles and brain teasers',
      'Analyze a problem from three different angles',
    ],
    relatedSkills: ['Problem Solving', 'Decision Making', 'Analytical Thinking'],
  },
  {
    id: 'creative-thinking',
    title: 'Creative Thinking',
    icon: Lightbulb,
    description: 'Generate innovative ideas and find unique solutions to complex challenges.',
    category: 'Problem Solving',
    level: 'Intermediate',
    duration: '5 weeks',
    color: 'teal',
    importance: 80,
    tips: [
      'Embrace curiosity and ask "what if" questions',
      'Make connections between unrelated ideas',
      'Set aside time for brainstorming without judgment',
      'Take breaks to let your mind wander',
    ],
    exercises: [
      'Practice mind mapping for different problems',
      'Brainstorm 20 solutions for a single problem',
      'Combine two unrelated concepts into an idea',
      'Keep a daily idea journal',
    ],
    relatedSkills: ['Critical Thinking', 'Problem Solving', 'Innovation'],
  },
  // Teamwork
  {
    id: 'collaboration',
    title: 'Collaboration',
    icon: Users,
    description: 'Work effectively with others, share responsibilities, and achieve collective goals.',
    category: 'Teamwork',
    level: 'Beginner',
    duration: '4 weeks',
    color: 'sky',
    importance: 85,
    tips: [
      'Communicate openly and share information freely',
      'Respect diverse opinions and perspectives',
      'Take responsibility for your part of the work',
      'Celebrate team successes and learn from failures',
    ],
    exercises: [
      'Volunteer for group projects at work or school',
      'Practice giving and receiving constructive feedback',
      'Rotate leadership roles in team activities',
      'Reflect on team dynamics after each project',
    ],
    relatedSkills: ['Communication', 'Leadership', 'Emotional Intelligence'],
  },
  {
    id: 'conflict-resolution',
    title: 'Conflict Resolution',
    icon: Handshake,
    description: 'Address disagreements constructively and find win-win solutions.',
    category: 'Teamwork',
    level: 'Advanced',
    duration: '6 weeks',
    color: 'rose',
    importance: 87,
    tips: [
      'Stay calm and composed during disagreements',
      'Focus on the issue, not the person',
      'Listen to all sides before responding',
      'Work toward solutions that benefit everyone involved',
    ],
    exercises: [
      'Role-play conflict scenarios with a partner',
      'Practice "I" statements in difficult conversations',
      'Mediate a disagreement between friends',
      'Study negotiation techniques',
    ],
    relatedSkills: ['Communication', 'Emotional Intelligence', 'Negotiation'],
  },
  // Adaptability
  {
    id: 'adaptability',
    title: 'Adaptability',
    icon: Zap,
    description: 'Embrace change, learn new skills quickly, and thrive in dynamic environments.',
    category: 'Adaptability',
    level: 'Intermediate',
    duration: '5 weeks',
    color: 'teal',
    importance: 90,
    tips: [
      'View change as an opportunity to grow',
      'Develop a growth mindset and embrace challenges',
      'Stay curious and open to learning new things',
      'Build resilience by stepping out of your comfort zone',
    ],
    exercises: [
      'Try something new every week',
      'Practice adjusting your routine spontaneously',
      'Learn a new skill outside your comfort zone',
      'Volunteer for projects outside your role',
    ],
    relatedSkills: ['Resilience', 'Growth Mindset', 'Learning Agility'],
  },
  {
    id: 'resilience',
    title: 'Resilience',
    icon: Shield,
    description: 'Bounce back from setbacks, handle pressure, and maintain optimism.',
    category: 'Adaptability',
    level: 'Intermediate',
    duration: '6 weeks',
    color: 'slate',
    importance: 88,
    tips: [
      'Build a strong support network',
      'Practice self-care and maintain work-life balance',
      'Learn from failures and setbacks',
      'Focus on what you can control',
    ],
    exercises: [
      'Journal about challenges and how you overcame them',
      'Practice mindfulness meditation daily',
      'Set small achievable goals to build confidence',
      'Reflect on past resilience stories',
    ],
    relatedSkills: ['Adaptability', 'Emotional Intelligence', 'Stress Management'],
  },
];

/* -------------------------------------------------------------------------- */
/*  Skill Card Component                                                      */
/* -------------------------------------------------------------------------- */

interface SkillCardProps {
  skill: SoftSkill;
  isSelected: boolean;
  onSelect: () => void;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, isSelected, onSelect }) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const colors = COLOR_STYLES[skill.color];
  const levelColors = {
    Beginner: 'bg-slate-500/20 text-slate-600 dark:text-slate-400',
    Intermediate: 'bg-slate-500/20 text-slate-600 dark:text-slate-400',
    Advanced: 'bg-slate-500/20 text-slate-600 dark:text-slate-400',
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl p-5 cursor-pointer transition-all duration-300",
        "border will-change-transform",
        isDark
          ? `border-slate-800 bg-slate-900/50 ${colors.hover}`
          : `border-slate-200 bg-white ${colors.hover}`,
        isSelected
          ? `ring-2 ${isDark ? `ring-${skill.color}-500/50` : `ring-${skill.color}-400`} shadow-lg`
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
        <div className="flex items-start justify-between mb-3">
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300",
            isDark
              ? `bg-slate-800 text-slate-300 group-hover:${colors.text}`
              : `bg-slate-100 text-slate-600 group-hover:${colors.text}`
          )}>
            <skill.icon className="h-4 w-4" />
          </div>
          <span className={cn(
            "text-xs font-medium px-2.5 py-1 rounded-full",
            levelColors[skill.level]
          )}>
            {skill.level}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className={cn(
          "text-base font-bold mb-1",
          isDark ? "text-white" : "text-slate-900"
        )}>
          {skill.title}
        </h3>
        <p className={cn(
          "text-sm mb-3 line-clamp-2",
          isDark ? "text-slate-400" : "text-slate-600"
        )}>
          {skill.description}
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={cn(
            "text-xs px-2.5 py-1 rounded-full flex items-center gap-1",
            isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
          )}>
            <Clock size={12} />
            {skill.duration}
          </span>
          <span className={cn(
            "text-xs px-2.5 py-1 rounded-full flex items-center gap-1",
            isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
          )}>
            {skill.importance}% Important
          </span>
          <span className={cn(
            "text-xs px-2.5 py-1 rounded-full",
            isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
          )}>
            {skill.category}
          </span>
        </div>

        {/* Importance Bar */}
        <div className="h-1 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              colors.badge
            )}
            style={{ width: `${skill.importance}%` }}
          />
        </div>

        {/* Related Skills */}
        <div className="mt-2 flex flex-wrap gap-1">
          {skill.relatedSkills.slice(0, 2).map((related) => (
            <span
              key={related}
              className={cn(
                "text-[10px] px-1.5 py-0.5 rounded",
                isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"
              )}
            >
              #{related}
            </span>
          ))}
          {skill.relatedSkills.length > 2 && (
            <span className="text-[10px] text-slate-400">+{skill.relatedSkills.length - 2}</span>
          )}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Skill Detail Component                                                    */
/* -------------------------------------------------------------------------- */

interface SkillDetailProps {
  skill: SoftSkill;
  onClose: () => void;
  onLearnMore: () => void;
}

const SkillDetail: React.FC<SkillDetailProps> = ({ skill, onClose, onLearnMore }) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const colors = COLOR_STYLES[skill.color];
  const levelColors = {
    Beginner: 'bg-slate-500/20 text-slate-600 dark:text-slate-400',
    Intermediate: 'bg-slate-500/20 text-slate-600 dark:text-slate-400',
    Advanced: 'bg-slate-500/20 text-slate-600 dark:text-slate-400',
  };

  return (
    <div className={cn(
      "rounded-3xl p-6 border transition-all",
      isDark ? "bg-slate-900/80 border-slate-700" : "bg-white border-slate-200 shadow-lg"
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex h-14 w-14 items-center justify-center rounded-2xl",
            colors.bg,
            colors.text
          )}>
            <skill.icon className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className={cn(
                "text-2xl font-bold",
                isDark ? "text-white" : "text-slate-900"
              )}>
                {skill.title}
              </h2>
              <span className={cn(
                "text-xs font-medium px-3 py-1 rounded-full",
                levelColors[skill.level]
              )}>
                {skill.level}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className={cn(
                "text-sm",
                isDark ? "text-slate-400" : "text-slate-600"
              )}>
                {skill.category}
              </span>
              <span className="text-sm text-slate-400">•</span>
              <span className={cn(
                "text-sm flex items-center gap-1",
                isDark ? "text-slate-400" : "text-slate-600"
              )}>
                <Clock size={14} />
                {skill.duration}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className={cn(
            "p-2 rounded-lg transition-all",
            isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"
          )}
        >
          ✕
        </button>
      </div>

      {/* Description */}
      <p className={cn(
        "text-sm leading-relaxed mb-6 p-4 rounded-xl",
        isDark ? "bg-slate-800/50 text-slate-300" : "bg-slate-50 text-slate-600"
      )}>
        {skill.description}
      </p>

      {/* Tips & Exercises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h4 className={cn(
            "text-sm font-semibold mb-3 flex items-center gap-2",
            isDark ? "text-white" : "text-slate-900"
          )}>
            <Lightbulb size={16} className="text-yellow-500" />
            Pro Tips
          </h4>
          <ul className="space-y-2">
            {skill.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle2 size={14} className="mt-0.5 text-teal-500" />
                <span className={isDark ? "text-slate-300" : "text-slate-600"}>
                  {tip}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className={cn(
            "text-sm font-semibold mb-3 flex items-center gap-2",
            isDark ? "text-white" : "text-slate-900"
          )}>
            <Activity size={16} className="text-slate-500" />
            Practice Exercises
          </h4>
          <ul className="space-y-2">
            {skill.exercises.map((exercise, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5" />
                <span className={isDark ? "text-slate-300" : "text-slate-600"}>
                  {exercise}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Related Skills */}
      <div className={cn(
        "p-4 rounded-xl mb-6",
        isDark ? "bg-slate-800/50" : "bg-slate-50"
      )}>
        <span className={cn(
          "text-sm font-medium block mb-2",
          isDark ? "text-slate-300" : "text-slate-700"
        )}>
          Related Skills
        </span>
        <div className="flex flex-wrap gap-2">
          {skill.relatedSkills.map((related) => (
            <span
              key={related}
              className={cn(
                "text-sm px-3 py-1.5 rounded-lg",
                isDark ? "bg-slate-700 text-slate-300" : "bg-white text-slate-600 border border-slate-200"
              )}
            >
              {related}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className={cn(
          "text-sm",
          isDark ? "text-slate-400" : "text-slate-600"
        )}>
          <span className="font-semibold">Importance:</span> {skill.importance}% of employers value this skill
        </div>
        <ParticleButton
          type="button"
          className={`px-6 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 whitespace-nowrap bg-linear-to-r ${colors.gradient} text-white shadow-sm hover:opacity-90 hover:scale-105`}
          successDuration={800}
          onClick={onLearnMore}
        >
          Start Learning <Rocket size={16} />
        </ParticleButton>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Main Component                                                            */
/* -------------------------------------------------------------------------- */

const SoftSkillList: React.FC = () => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSkills = SOFT_SKILLS.filter((skill) => {
    const matchesCategory = !selectedCategory || skill.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery || 
      skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedSkill = SOFT_SKILLS.find((s) => s.id === selectedSkillId);

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
                Professional Development
              </div>
              <h1 className={cn(
                "text-3xl sm:text-4xl font-bold mt-1",
                isDark ? "text-white" : "text-slate-900"
              )}>
                Soft Skills Library
              </h1>
              <p className={cn(
                "text-sm mt-2 max-w-2xl",
                isDark ? "text-slate-400" : "text-slate-600"
              )}>
                Master essential soft skills that employers value most. From communication to leadership,
                build the skills that set you apart.
              </p>
            </div>
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl border",
              isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white"
            )}>
              <span className="text-sm font-medium">{SOFT_SKILLS.length} Skills Available</span>
            </div>
          </div>
        </header>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search skills by name, category, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full px-4 py-2.5 rounded-xl border transition-all",
                isDark
                  ? "border-slate-700 bg-slate-900/50 text-white placeholder-slate-400 focus:border-teal-500"
                  : "border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-teal-400"
              )}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                !selectedCategory
                  ? isDark ? "bg-teal-500/20 text-teal-400 border border-teal-500/30" : "bg-teal-50 text-teal-600 border border-teal-200"
                  : isDark ? "bg-slate-800 text-slate-400 hover:bg-slate-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              All
            </button>
            {SKILL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5",
                  selectedCategory === cat.name
                    ? isDark ? `bg-${cat.color}-500/20 text-${cat.color}-400 border border-${cat.color}-500/30` : `bg-${cat.color}-50 text-${cat.color}-600 border border-${cat.color}-200`
                    : isDark ? "bg-slate-800 text-slate-400 hover:bg-slate-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                <cat.icon size={14} />
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        {selectedSkill ? (
          <SkillDetail
            skill={selectedSkill}
            onClose={() => setSelectedSkillId(null)}
            onLearnMore={() => {
              // Handle learning action
              console.log('Start learning:', selectedSkill.title);
            }}
          />
        ) : (
          <>
            {filteredSkills.length === 0 ? (
              <div className={cn(
                "text-center py-16 rounded-3xl border",
                isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white"
              )}>
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2">No Skills Found</h3>
                <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSkills.map((skill) => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    isSelected={selectedSkillId === skill.id}
                    onSelect={() => setSelectedSkillId(skill.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SoftSkillList;