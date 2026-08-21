import React, { useState } from 'react';
import {
  Sprout,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Clock,
  PlayCircle,
  Play,
  ChevronRight,
  ChevronLeft,
  Award,
  Smartphone,
  ShieldCheck,
  QrCode,
  Send,
  Wallet,
  ClipboardList,
  AlertTriangle,
  KeyRound,
  Eye,
  Users,
  RefreshCcw,
  Receipt,
  Umbrella,
  Target,
  PiggyBank,
  LucideIcon,
} from 'lucide-react';
import { useTheme } from '@/theme/AppThemeProvider';
import { ParticleButton } from '@/components/ui/particle-button';

/* -------------------------------------------------------------------------- */
/*  Shared types & accent tokens                                              */
/* -------------------------------------------------------------------------- */

type AccentKey = 'slate' | 'teal' | 'slate' | 'teal' | 'slate' | 'teal';

interface AccentStyle {
  solid: string;
  soft: string;
  softDark: string;
  text: string;
  textDark: string;
  gradient: string;
  ring: string;
  border: string;
  hoverBg: string;
  hoverBorder: string;
  glow: string;
}

const ACCENTS: Record<AccentKey, AccentStyle> = {
  slate: {
    solid: 'bg-slate-500',
    soft: 'bg-slate-50',
    softDark: 'bg-slate-500/10',
    text: 'text-slate-600',
    textDark: 'text-slate-400',
    gradient: 'from-slate-500 via-slate-600 to-slate-700',
    ring: 'ring-slate-500/40',
    border: 'border-slate-500/30',
    hoverBg: 'hover:bg-slate-50',
    hoverBorder: 'hover:border-slate-500/30',
    glow: 'shadow-slate-500/20',
  },
  teal: {
    solid: 'bg-teal-500',
    soft: 'bg-teal-50',
    softDark: 'bg-teal-500/10',
    text: 'text-teal-600',
    textDark: 'text-teal-400',
    gradient: 'from-teal-500 via-teal-600 to-teal-700',
    ring: 'ring-teal-500/40',
    border: 'border-teal-500/30',
    hoverBg: 'hover:bg-teal-50',
    hoverBorder: 'hover:border-teal-500/30',
    glow: 'shadow-teal-500/20',
  },
};

// CORS-enabled placeholder stream that always plays — swap for your real,
// hosted lesson video URL (mp4, HLS manifest, whatever your CDN serves).
const PLACEHOLDER_VIDEO = 'https://placeholdervideo.dev/1280x720';

interface QuizQuestionData {
  q: string;
  options: string[];
  correct: number;
  explain: string;
}

interface BaseLesson {
  icon: LucideIcon;
  title: string;
  duration: string;
  accent: AccentKey;
}

interface ContentLesson extends BaseLesson {
  type: 'content';
  body: string;
  takeaways: string[];
  videoUrl: string;
}

interface QuizLesson extends BaseLesson {
  type: 'quiz';
  questions: QuizQuestionData[];
}

type Lesson = ContentLesson | QuizLesson;

interface ModuleData {
  id: string;
  title: string;
  category: string;
  level: string;
  duration: string;
  language: string;
  description: string;
  color: AccentKey;
  icon: LucideIcon;
  lessons: Lesson[];
}

/* -------------------------------------------------------------------------- */
/*  Module catalogue                                                          */
/* -------------------------------------------------------------------------- */

const MODULES: ModuleData[] = [
  {
    id: 'mobile-banking',
    title: 'Mobile Banking & Digital Payments',
    category: 'Digital Skills',
    level: 'Beginner',
    duration: '42 min',
    language: 'English · हिंदी',
    description: 'Learn to send money, pay with QR codes, and spot common scams — all from a basic smartphone.',
    color: 'teal',
    icon: Smartphone,
    lessons: [
      {
        type: 'content',
        icon: Smartphone,
        title: 'What is mobile banking?',
        duration: '6 min',
        accent: 'teal',
        videoUrl: PLACEHOLDER_VIDEO,
        body: "Mobile banking lets you check your balance, send money, and pay bills using just your phone — no branch visit needed. It works over any basic internet connection, even 2G. Once your account is linked, most tasks take under a minute.",
        takeaways: [
          'Works with any bank account linked to your phone number',
          'No paperwork needed after the first setup',
          'Available in your local language',
        ],
      },
      {
        type: 'content',
        icon: Wallet,
        title: 'Setting up your mobile wallet',
        duration: '7 min',
        accent: 'teal',
        videoUrl: PLACEHOLDER_VIDEO,
        body: "A mobile wallet stores money you've added from your bank account, so you can pay without typing card details every time. Setup takes three steps: verify your phone number, link your bank account, and set a secure PIN.",
        takeaways: [
          "Never share your PIN, even with someone claiming to be bank staff",
          "Choose a PIN you don't reuse anywhere else",
          'Keep your registered phone number active',
        ],
      },
      {
        type: 'content',
        icon: Send,
        title: 'Sending and receiving money safely',
        duration: '8 min',
        accent: 'teal',
        videoUrl: PLACEHOLDER_VIDEO,
        body: "You can send money using a phone number, a UPI ID, or by scanning a QR code. Always check the receiver's name shown on screen before confirming — it's displayed there for your protection.",
        takeaways: [
          'Confirm the name on screen matches who you intend to pay',
          'Save frequent contacts to avoid typing errors',
          'Small transfers usually confirm in seconds',
        ],
      },
      {
        type: 'content',
        icon: QrCode,
        title: 'Understanding UPI & QR payments',
        duration: '6 min',
        accent: 'teal',
        videoUrl: PLACEHOLDER_VIDEO,
        body: "A QR code stores a shop or person's payment details. Scanning one auto-fills the payment screen, so you only need to enter the amount and your PIN — faster and safer than sharing account numbers out loud.",
        takeaways: [
          'Only scan codes shown at the counter, not ones sent by strangers',
          'You never need to scan a code to receive money',
          'Double-check the amount before confirming',
        ],
      },
      {
        type: 'content',
        icon: ShieldCheck,
        title: 'Spotting digital payment scams',
        duration: '7 min',
        accent: 'teal',
        videoUrl: PLACEHOLDER_VIDEO,
        body: "Scammers often pretend to be bank staff and ask you to \"accept\" a request to receive money. Receiving money never requires your PIN — if an app asks for it to receive a payment, stop immediately.",
        takeaways: [
          'A PIN is only needed to send money, never to receive it',
          'Banks never call asking for your PIN or OTP',
          "Report suspicious requests to your bank's helpline",
        ],
      },
      {
        type: 'quiz',
        icon: ClipboardList,
        title: 'Practice quiz',
        duration: '8 min',
        accent: 'teal',
        questions: [
          {
            q: 'You get a message asking you to enter your PIN to receive ₹500. What should you do?',
            options: [
              'Enter the PIN to get the money',
              'Ignore it — receiving money never needs a PIN',
              'Call the sender and share your PIN',
              'Enter the PIN but note the number down',
            ],
            correct: 1,
            explain: 'Receiving money never requires a PIN. This is a common scam pattern.',
          },
          {
            q: 'Which of these is the safest way to pay a shopkeeper?',
            options: [
              'Share your UPI PIN with them',
              'Scan the QR code displayed at their counter',
              'Tell them your PIN over the phone',
              'Send your PIN by SMS',
            ],
            correct: 1,
            explain: 'Scanning the displayed QR code fills in payment details without exposing your PIN.',
          },
          {
            q: 'Before confirming a money transfer, you should always:',
            options: [
              'Skip checking and confirm quickly',
              'Check that the name on screen matches who you intend to pay',
              'Turn off your phone',
              'Share your PIN with the receiver to confirm',
            ],
            correct: 1,
            explain: 'The name shown on screen is your main check against sending money to the wrong person.',
          },
        ],
      },
    ],
  },
  {
    id: 'online-safety',
    title: 'Staying Safe Online',
    category: 'Digital Skills',
    level: 'Beginner',
    duration: '24 min',
    language: 'English · हिंदी',
    description: 'Spot phishing messages, lock down your accounts, and keep your social media private.',
    color: 'slate',
    icon: ShieldCheck,
    lessons: [
      {
        type: 'content',
        icon: AlertTriangle,
        title: 'Recognizing phishing messages',
        duration: '7 min',
        accent: 'slate',
        videoUrl: PLACEHOLDER_VIDEO,
        body: "Phishing messages copy the look of a real bank or delivery service to trick you into clicking a link or sharing an OTP. They almost always create urgency — a locked account, a missed delivery, a prize you must claim right now.",
        takeaways: [
          'Urgency and pressure are the biggest red flags',
          'Check the sender ID carefully, not just the display name',
          'Never click links in unexpected messages — open the app directly instead',
        ],
      },
      {
        type: 'content',
        icon: KeyRound,
        title: 'Creating strong passwords',
        duration: '6 min',
        accent: 'slate',
        videoUrl: PLACEHOLDER_VIDEO,
        body: "A strong password is long and unique to each account. A short phrase with a few numbers and symbols is easier to remember and harder to guess than a short, complex-looking word.",
        takeaways: [
          'Use a different password for banking, email, and social apps',
          'Longer is stronger — aim for at least 12 characters',
          'A password manager can remember these for you',
        ],
      },
      {
        type: 'content',
        icon: Eye,
        title: 'Protecting your social media',
        duration: '6 min',
        accent: 'slate',
        videoUrl: PLACEHOLDER_VIDEO,
        body: "Public profiles let anyone see your posts, photos, and personal details. Reviewing your privacy settings regularly keeps that information visible only to people you actually know.",
        takeaways: [
          'Set your profile to private if it isn\'t already',
          'Think before posting your location in real time',
          'Review who can see your phone number and photos',
        ],
      },
      {
        type: 'quiz',
        icon: ClipboardList,
        title: 'Practice quiz',
        duration: '5 min',
        accent: 'slate',
        questions: [
          {
            q: 'A message says your account will be locked in 1 hour unless you click a link. This is:',
            options: ['Normal bank behavior', 'A likely phishing attempt', 'Something to ignore only if you feel like it', 'Always safe if the logo looks right'],
            correct: 1,
            explain: 'Urgency plus an unexpected link is a classic phishing pattern.',
          },
          {
            q: 'What makes a password stronger?',
            options: ['Using your birth year', 'Reusing the same password everywhere', 'Making it longer and unique per account', 'Keeping it short and simple'],
            correct: 2,
            explain: 'Length and uniqueness matter far more than complexity alone.',
          },
        ],
      },
    ],
  },
  {
    id: 'upi-super-apps',
    title: 'Using UPI Super Apps',
    category: 'Digital Skills',
    level: 'Beginner',
    duration: '20 min',
    language: 'English · हिंदी',
    description: 'Get comfortable adding money, splitting bills, and setting up autopay in everyday UPI apps.',
    color: 'teal',
    icon: QrCode,
    lessons: [
      {
        type: 'content',
        icon: Wallet,
        title: 'Adding money to your wallet',
        duration: '6 min',
        accent: 'teal',
        videoUrl: PLACEHOLDER_VIDEO,
        body: "Adding money links your bank account to the app once, so future top-ups take just a tap and your PIN. You can add any amount, and it lands in your wallet within seconds.",
        takeaways: [
          'You only need to link your bank once',
          'Top-ups typically confirm within seconds',
          'Keep your linked account active so top-ups don\'t fail',
        ],
      },
      {
        type: 'content',
        icon: Users,
        title: 'Splitting bills with friends',
        duration: '7 min',
        accent: 'teal',
        videoUrl: PLACEHOLDER_VIDEO,
        body: "Most UPI apps can split a bill evenly or by custom amounts and send each friend a request. Everyone pays their own share directly, so no one has to front the whole cost.",
        takeaways: [
          'Custom splits let you charge people different amounts',
          'Requests expire, so remind friends who haven\'t paid',
          'You can split a bill among a group in one go',
        ],
      },
      {
        type: 'content',
        icon: RefreshCcw,
        title: 'Setting up autopay',
        duration: '7 min',
        accent: 'teal',
        videoUrl: PLACEHOLDER_VIDEO,
        body: "Autopay charges a fixed amount automatically on a schedule — handy for subscriptions or recurring bills. You approve it once, and you can cancel it any time from the app.",
        takeaways: [
          'You approve the amount and schedule up front',
          'Autopay can be cancelled anytime from your app',
          'You\'ll usually get a reminder before each charge',
        ],
      },
      {
        type: 'quiz',
        icon: ClipboardList,
        title: 'Practice quiz',
        duration: '5 min',
        accent: 'teal',
        questions: [
          {
            q: 'To split a restaurant bill unevenly among friends, you should use:',
            options: ['An even split only', 'A custom split with different amounts', 'Cash only', 'A new bank account'],
            correct: 1,
            explain: 'Custom splits let you assign different amounts to each person.',
          },
          {
            q: 'Autopay for a subscription can be:',
            options: ['Never cancelled', 'Cancelled anytime from the app', 'Only changed by calling the bank', 'Set without your approval'],
            correct: 1,
            explain: 'You approve autopay up front and can cancel it from the app whenever you like.',
          },
        ],
      },
    ],
  },
  {
    id: 'savings-budgeting',
    title: 'Savings & Budgeting Basics',
    category: 'Financial Literacy',
    level: 'Beginner',
    duration: '30 min',
    language: 'English · हिंदी',
    description: 'Track your spending, build an emergency fund, and set savings goals you can actually hit.',
    color: 'teal',
    icon: PiggyBank,
    lessons: [
      {
        type: 'content',
        icon: Receipt,
        title: 'Tracking your monthly spending',
        duration: '8 min',
        accent: 'teal',
        videoUrl: PLACEHOLDER_VIDEO,
        body: "Writing down what you spend for even one month reveals patterns you'd otherwise miss — a subscription you forgot about, or how much small daily purchases add up to.",
        takeaways: [
          'Small, frequent purchases often add up more than big ones',
          'A simple notebook or app both work fine',
          'Review your spending weekly, not just once a month',
        ],
      },
      {
        type: 'content',
        icon: Umbrella,
        title: 'Building an emergency fund',
        duration: '8 min',
        accent: 'teal',
        videoUrl: PLACEHOLDER_VIDEO,
        body: "An emergency fund covers unexpected costs — a medical bill or lost income — without borrowing. Starting small and adding a fixed amount each month builds it faster than waiting for a big lump sum.",
        takeaways: [
          'Aim to eventually cover 3 months of essential expenses',
          'Keep it in an account you can access quickly',
          'Automate a fixed monthly transfer so you don\'t forget',
        ],
      },
      {
        type: 'content',
        icon: Target,
        title: 'Setting a savings goal',
        duration: '7 min',
        accent: 'teal',
        videoUrl: PLACEHOLDER_VIDEO,
        body: "A goal with a number and a date is far easier to hit than 'save more.' Breaking it into a monthly amount turns a big target into a routine habit.",
        takeaways: [
          'Give every goal an amount and a target date',
          'Break it down into a monthly saving amount',
          'Track progress somewhere visible to stay motivated',
        ],
      },
      {
        type: 'quiz',
        icon: ClipboardList,
        title: 'Practice quiz',
        duration: '7 min',
        accent: 'teal',
        questions: [
          {
            q: 'What is the main purpose of an emergency fund?',
            options: ['Buying things on sale', 'Covering unexpected costs without borrowing', 'Long-term retirement savings', 'Paying regular monthly bills'],
            correct: 1,
            explain: 'An emergency fund exists to absorb unexpected costs without needing to borrow.',
          },
          {
            q: 'A savings goal is most effective when it has:',
            options: ['No deadline', 'A vague target like "save more"', 'A specific amount and target date', 'Only a name'],
            correct: 2,
            explain: 'A concrete amount and date turn a goal into a plan you can actually follow.',
          },
        ],
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Quiz question                                                            */
/* -------------------------------------------------------------------------- */

interface QuizQuestionProps {
  data: QuizQuestionData;
  index: number;
  answer: number | undefined;
  checked: boolean;
  accent: AccentStyle;
  onSelect: (opt: number) => void;
  onCheck: () => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ data, index, answer, checked, accent, onSelect, onCheck }) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const isCorrect = checked && answer === data.correct;

  return (
    <div className={`mb-5 p-5 rounded-2xl border transition-all ${
      isDark ? 'bg-slate-800/40 border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      <div className="flex items-start gap-3 mb-4">
        <span className={`flex items-center justify-center w-7 h-7 rounded-lg  font-mono text-xs font-bold ${
          isDark ? `${accent.softDark} ${accent.textDark}` : `${accent.soft} ${accent.text}`
        }`}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className={`text-sm font-medium leading-relaxed pt-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          {data.q}
        </span>
      </div>
      <div className="space-y-2 mb-4">
        {data.options.map((opt, i) => {
          const selected = answer === i;
          let stateClass = '';
          if (checked && i === data.correct) stateClass = isDark ? 'border-teal-500 bg-teal-500/10' : 'border-teal-500 bg-teal-50';
          else if (checked && selected && i !== data.correct) stateClass = isDark ? 'border-slate-500 bg-slate-500/10' : 'border-slate-500 bg-slate-50';
          else if (selected) stateClass = isDark ? `${accent.ring.replace('ring-', 'border-').split('/')[0]} ${accent.softDark}` : `${accent.ring.replace('ring-', 'border-').split('/')[0]} ${accent.soft}`;
          else stateClass = isDark ? 'border-slate-700 hover:border-slate-500' : 'border-slate-200 hover:border-slate-300';

          return (
            <button
              key={opt}
              type="button"
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left text-sm ${
                isDark ? 'text-slate-200' : 'text-slate-700'
              } ${stateClass} ${checked ? 'cursor-default' : 'cursor-pointer'}`}
              onClick={() => !checked && onSelect(i)}
              disabled={checked}
            >
              <span className={`w-2 h-2 rounded-full  ${
                checked && i === data.correct ? 'bg-teal-500' :
                checked && selected ? 'bg-slate-500' :
                selected ? accent.solid :
                isDark ? 'bg-slate-600' : 'bg-slate-300'
              }`} />
              {opt}
            </button>
          );
        })}
      </div>
      {!checked ? (
        <button
          type="button"
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
            answer === undefined
              ? isDark ? 'bg-slate-700/60 text-slate-500 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : `${accent.solid} text-white hover:opacity-90 shadow-sm`
          }`}
          disabled={answer === undefined}
          onClick={onCheck}
        >
          Check answer
        </button>
      ) : (
        <div className={`mt-1 p-3 rounded-xl text-sm flex items-start gap-2 ${
          isCorrect
            ? isDark ? 'bg-teal-500/10 text-teal-400' : 'bg-teal-50 text-teal-700'
            : isDark ? 'bg-slate-500/10 text-slate-400' : 'bg-slate-50 text-slate-700'
        }`}>
          <span className="">{isCorrect ? '✅' : '❌'}</span>
          <span>{data.explain}</span>
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Video player                                                              */
/* -------------------------------------------------------------------------- */

interface VideoPlayerProps {
  lesson: ContentLesson;
  playing: boolean;
  onPlay: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ lesson, playing, onPlay }) => {
  const accent = ACCENTS[lesson.accent];

  if (playing) {
    return (
      <div className="relative mb-5 rounded-2xl overflow-hidden bg-black shadow-lg aspect-video">
        <video key={lesson.videoUrl} src={lesson.videoUrl} controls autoPlay className="w-full h-full" />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={`Play video for ${lesson.title}`}
      className={`group relative w-full mb-5 rounded-2xl overflow-hidden aspect-video text-left bg-linear-to-br ${accent.gradient}`}
    >
      <div
        className="absolute inset-0 opacity-25"
        style={{ backgroundImage: 'radial-gradient(circle at 22% 25%, white 0, transparent 42%)' }}
      />
      <lesson.icon size={120} strokeWidth={1} className="absolute -right-4 -bottom-6 text-white/10 pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="relative flex items-center justify-center w-16 h-16 rounded-full bg-white/95 shadow-xl transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
          <Play size={24} className="text-slate-900 ml-1" fill="currentColor" />
        </span>
      </div>
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-white/90 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full">
          Lesson video
        </span>
        <span className="text-[11px] font-medium text-white/90 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full">
          {lesson.duration}
        </span>
      </div>
      <div className="absolute bottom-3 left-3 right-3">
        <span className="text-sm font-semibold text-white drop-shadow-sm">{lesson.title}</span>
      </div>
    </button>
  );
};

/* -------------------------------------------------------------------------- */
/*  Nested lesson player (opened after picking a module)                     */
/* -------------------------------------------------------------------------- */

interface LearnModuleProps {
  moduleData: ModuleData;
  completed: Set<number>;
  onCompletedChange: (next: Set<number>) => void;
  onBack: () => void;
}

const LearnModule: React.FC<LearnModuleProps> = ({ moduleData, completed, onCompletedChange, onBack }) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const lessons = moduleData.lessons;
  const total = lessons.length;

  const [active, setActive] = useState<number>(() => {
    const firstIncomplete = lessons.findIndex((_, i) => !completed.has(i));
    return firstIncomplete === -1 ? total - 1 : firstIncomplete;
  });
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizChecked, setQuizChecked] = useState<Record<number, boolean>>({});
  const [videoPlaying, setVideoPlaying] = useState<Record<number, boolean>>({});

  const progressPct = Math.round((completed.size / total) * 100);
  const lesson = lessons[active];
  const accent = ACCENTS[lesson.accent];
  const isUnlocked = (i: number): boolean => i === 0 || completed.has(i - 1) || completed.has(i);

  const markComplete = (): void => {
    const next = new Set(completed);
    next.add(active);
    onCompletedChange(next);
    if (active < total - 1) setActive(active + 1);
  };

  const quizScore =
    lesson.type === 'quiz'
      ? lesson.questions.reduce((acc, q, i) => acc + (quizAnswers[i] === q.correct ? 1 : 0), 0)
      : 0;
  const allQuizChecked = lesson.type === 'quiz' && lesson.questions.every((_, i) => quizChecked[i]);

  return (
    <div className={`min-h-screen transition-colors duration-300 `}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <header className="mb-6">
          <button
            type="button"
            onClick={onBack}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              isDark
                ? 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <ArrowLeft size={15} /> Back to modules
          </button>
        </header>

        {/* Module hero */}
        <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-7 mb-7 border ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${accent.gradient}`} />
          <div className="flex items-start gap-4">
            <div className={`hidden sm:flex  items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br ${ACCENTS[moduleData.color].gradient} shadow-md`}>
              <moduleData.icon size={26} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-xs font-semibold uppercase tracking-wider ${isDark ? ACCENTS[moduleData.color].textDark : ACCENTS[moduleData.color].text}`}>
                {moduleData.category}
              </div>
              <h1 className={`text-2xl sm:text-3xl font-bold mt-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {moduleData.title}
              </h1>
              <p className={`text-sm mt-2 max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {moduleData.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${isDark ? 'border-slate-700 bg-slate-800/60 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                  <Sprout size={12} /> {moduleData.level}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${isDark ? 'border-slate-700 bg-slate-800/60 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                  <Clock size={12} /> {moduleData.duration}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${isDark ? 'border-slate-700 bg-slate-800/60 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                  {moduleData.language}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-5">
            <div className={`flex-1 h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <div
                className={`h-full rounded-full bg-linear-to-r ${accent.gradient} transition-all duration-500 ease-out`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className={`text-sm font-semibold whitespace-nowrap ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {completed.size}/{total} done
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6">
          {/* Lesson path */}
          <nav className={`rounded-3xl p-4 h-fit border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className={`text-xs font-semibold uppercase tracking-wider mb-4 px-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Lesson path
            </div>
            <div className="relative space-y-1">
              {lessons.map((l, i) => {
                const unlocked = isUnlocked(i);
                const done = completed.has(i);
                const isCurrent = i === active;
                const lAccent = ACCENTS[l.accent];

                let rowBg = '';
                let titleClass = '';
                if (isCurrent) {
                  rowBg = isDark ? 'bg-slate-800/70' : lAccent.soft;
                  titleClass = isDark ? lAccent.textDark : lAccent.text;
                } else if (!unlocked) {
                  rowBg = 'opacity-45 cursor-not-allowed';
                  titleClass = isDark ? 'text-slate-500' : 'text-slate-400';
                } else {
                  rowBg = isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50';
                  titleClass = isDark ? 'text-slate-300' : 'text-slate-700';
                }

                let badgeClass = '';
                if (done) badgeClass = 'bg-teal-500 text-white';
                else if (!unlocked) badgeClass = isDark ? 'bg-slate-800 text-slate-600' : 'bg-slate-100 text-slate-400';
                else if (isCurrent) badgeClass = `${lAccent.solid} text-white shadow-sm`;
                else badgeClass = isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500';

                return (
                  <div
                    key={l.title}
                    className={`relative flex items-start gap-3 p-2.5 rounded-2xl transition-all cursor-pointer ${rowBg}`}
                    onClick={() => unlocked && setActive(i)}
                  >
                    {i !== 0 && <span className={`absolute left-6.5 -top-1 w-px h-2 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />}
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full  transition-colors ${badgeClass}`}>
                      {done ? <CheckCircle2 size={15} /> : !unlocked ? <Lock size={13} /> : <l.icon size={14} />}
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <div className={`text-sm font-medium leading-snug ${titleClass}`}>{l.title}</div>
                      <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{l.duration}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Active lesson content */}
          <div className={`rounded-3xl p-6 border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            {lesson.type === 'content' ? (
              <>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-3">
                  <PlayCircle size={14} className={isDark ? accent.textDark : accent.text} />
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>LESSON {active + 1} OF {total} · {lesson.duration}</span>
                </div>
                <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{lesson.title}</h2>

                <VideoPlayer
                  lesson={lesson}
                  playing={!!videoPlaying[active]}
                  onPlay={() => setVideoPlaying((v) => ({ ...v, [active]: true }))}
                />

                <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{lesson.body}</p>
                <div className={`text-sm font-semibold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Key takeaways</div>
                {lesson.takeaways.map((t) => (
                  <div key={t} className="flex items-start gap-2.5 py-1.5 text-sm">
                    <CheckCircle2 size={15} className=" mt-0.5 text-teal-500 dark:text-teal-400" />
                    <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{t}</span>
                  </div>
                ))}
                <div className={`flex items-center justify-between gap-4 mt-6 pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <button
                    type="button"
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      active === 0
                        ? isDark ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 cursor-not-allowed'
                        : isDark ? 'text-slate-300 hover:bg-slate-800/60' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                    disabled={active === 0}
                    onClick={() => setActive(active - 1)}
                  >
                    <ChevronLeft size={15} /> Previous
                  </button>
                  <ParticleButton
                    type="button"
                    className={`px-5 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap bg-linear-to-r ${accent.gradient} text-white shadow-sm hover:opacity-90`}
                    successDuration={800}
                    onClick={markComplete}
                  >
                    {completed.has(active) ? 'Next lesson' : 'Mark complete & continue'} <ChevronRight size={15} />
                  </ParticleButton>
                </div>
              </>
            ) : !completed.has(active) ? (
              <>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-3">
                  <ClipboardList size={14} className={isDark ? accent.textDark : accent.text} />
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>LESSON {active + 1} OF {total} · {lesson.duration}</span>
                </div>
                <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{lesson.title}</h2>
                {lesson.questions.map((q, i) => (
                  <QuizQuestion
                    key={q.q}
                    data={q}
                    index={i}
                    answer={quizAnswers[i]}
                    checked={!!quizChecked[i]}
                    accent={accent}
                    onSelect={(opt) => setQuizAnswers((a) => ({ ...a, [i]: opt }))}
                    onCheck={() => setQuizChecked((c) => ({ ...c, [i]: true }))}
                  />
                ))}
                <div className={`flex items-center justify-between gap-4 mt-4 pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <button
                    type="button"
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isDark ? 'text-slate-300 hover:bg-slate-800/60' : 'text-slate-600 hover:bg-slate-50'}`}
                    onClick={() => setActive(active - 1)}
                  >
                    <ChevronLeft size={15} /> Previous
                  </button>
                  <ParticleButton
                    type="button"
                    className={`px-5 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap bg-linear-to-r ${accent.gradient} text-white shadow-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed`}
                    successDuration={800}
                    disabled={!allQuizChecked}
                    onClick={markComplete}
                  >
                    Complete module <Award size={15} />
                  </ParticleButton>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-linear-to-br ${accent.gradient} shadow-md`}>
                  <Award size={28} className="text-white" />
                </div>
                <h2 className={`text-xl font-bold mb-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Module complete</h2>
                <p className={`text-sm max-w-md ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  You scored {quizScore}/{lesson.questions.length} on the practice quiz. Great work finishing {moduleData.title}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Hub — pick a module using BentoGrid                                     */
/* -------------------------------------------------------------------------- */

const DigitalSkillsHub: React.FC = () => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [progressByModule, setProgressByModule] = useState<Record<string, Set<number>>>({
    'mobile-banking': new Set([0, 1]),
  });

  const selectedModule = MODULES.find((m) => m.id === selectedId) ?? null;

  if (selectedModule) {
    return (
      <LearnModule
        key={selectedModule.id}
        moduleData={selectedModule}
        completed={progressByModule[selectedModule.id] ?? new Set()}
        onCompletedChange={(next) => setProgressByModule((p) => ({ ...p, [selectedModule.id]: next }))}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <header className="mb-7">
          <div className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Learning path
          </div>
          <h1 className={`text-2xl sm:text-3xl font-bold mt-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            Digital & Financial Skills
          </h1>
          <p className={`text-sm mt-2 max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Short, practical modules to help you use your phone for banking, payments, and everyday money decisions with confidence.
          </p>
        </header>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 p-4 md:grid-cols-3">
          {MODULES.map((module) => {
            const completedCount = (progressByModule[module.id] ?? new Set()).size;
            const total = module.lessons.length;
            const progress = Math.round((completedCount / total) * 100);
            const accent = ACCENTS[module.color];
            
            let status = '';
            if (completedCount === 0) status = 'Not started';
            else if (completedCount === total) status = '✅ Completed';
            else status = `🔄 ${progress}%`;
            
            return (
              <div
                key={module.id}
                className={cn(
                  "group relative overflow-hidden rounded-xl p-6 text-left transition-all duration-300 cursor-pointer",
                  "border will-change-transform",
                  isDark
                    ? `border-slate-800 bg-slate-900/50 hover:border-${module.color}-500/50 hover:bg-slate-900/80 hover:shadow-xl ${accent.glow}`
                    : `border-slate-200 bg-white hover:border-${module.color}-300 hover:shadow-lg ${accent.glow}`,
                  "hover:-translate-y-1",
                  "md:col-span-1", // All cards same size
                )}
                onClick={() => setSelectedId(module.id)}
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

                {/* Content */}
                <div className="relative flex flex-col space-y-3">
                  {/* Header: Icon + Status */}
                  <div className="flex items-center justify-between">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300",
                      isDark
                        ? `bg-slate-800 text-slate-300 group-hover:${accent.textDark}`
                        : `bg-slate-100 text-slate-600 group-hover:${accent.text}`
                    )}>
                      <module.icon className="h-4 w-4" />
                    </div>
                    <span
                      className={cn(
                        "rounded-lg px-2.5 py-1 text-xs font-medium backdrop-blur-sm transition-colors duration-300",
                        isDark
                          ? `bg-slate-800 text-slate-300 group-hover:${accent.textDark}`
                          : `bg-slate-100 text-slate-600 group-hover:${accent.text}`
                      )}
                    >
                      {status}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className={cn(
                      "text-[15px] font-medium tracking-tight",
                      isDark ? "text-white" : "text-slate-900"
                    )}>
                      {module.title}
                      <span className={cn(
                        "ml-2 text-xs font-normal",
                        isDark ? "text-slate-400" : "text-slate-500"
                      )}>
                        {completedCount}/{total} lessons
                      </span>
                    </h3>
                    <p className={cn(
                      "text-sm leading-snug",
                      isDark ? "text-slate-400" : "text-slate-600"
                    )}>
                      {module.description}
                    </p>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {[module.level, module.duration, module.language].map((tag, i) => (
                        <span
                          key={`${tag}-${i}`}
                          className={cn(
                            "rounded-md px-2 py-1 backdrop-blur-sm transition-all duration-200",
                            isDark
                              ? `bg-slate-800 text-slate-300 group-hover:${accent.textDark}`
                              : `bg-slate-100 text-slate-600 group-hover:${accent.text}`
                          )}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span className={cn(
                      "text-xs transition-all duration-300 flex items-center gap-1",
                      isDark ? `text-slate-400 group-hover:${accent.textDark}` : `text-slate-500 group-hover:${accent.text}`,
                      "opacity-0 group-hover:opacity-100"
                    )}>
                      Start Learning
                      <svg className="h-3 w-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Border glow effect */}
                <div
                  className={cn(
                    "absolute inset-0 -z-10 rounded-xl p-px transition-opacity duration-300",
                    isDark
                      ? `bg-linear-to-br from-transparent via-${module.color}-500/20 to-transparent`
                      : `bg-linear-to-br from-transparent via-${module.color}-300/30 to-transparent`,
                    "opacity-0 group-hover:opacity-100"
                  )}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Helper function for className merging
function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export default DigitalSkillsHub;