export type DashboardStat = {
  id: string;
  title: string;
  value: string;
  description: string;
  icon: DashboardIconName;
  progress: number;
  trend?: string;
  accentClass: string;
};

export type DashboardActivity = {
  id: number;
  title: string;
  time: string;
  icon: DashboardIconName;
};

export type DashboardDeadline = {
  id: number;
  title: string;
  due: string;
  subject: string;
  priority: 'high' | 'medium' | 'low';
};

export type DashboardProgress = {
  id: string;
  subject: string;
  progress: number;
};

export type DashboardQuickAction = {
  id: string;
  text: string;
  icon: DashboardIconName;
};

export type DashboardIconName =
  | 'book'
  | 'barChart2'
  | 'calendar'
  | 'messageSquare'
  | 'users'
  | 'award'
  | 'checkCircle'
  | 'clock'
  | 'zap'
  | 'activity'
  | 'star'
  | 'trendingUp'
  | 'target'
  | 'chevronRight';

export const STATS_DATA: DashboardStat[] = [
  {
    id: 'assignments',
    title: 'Total Assignments',
    value: '12',
    description: 'Pending submissions',
    icon: 'book',
    progress: 68,
    trend: '▲ 6%',
    accentClass: 'bg-blue-500',
  },
  {
    id: 'progress',
    title: 'Progress Rate',
    value: '75%',
    description: 'Course completion',
    icon: 'barChart2',
    progress: 75,
    trend: '▲ 4%',
    accentClass: 'bg-emerald-500',
  },
  {
    id: 'events',
    title: 'Upcoming Events',
    value: '3',
    description: 'This week',
    icon: 'calendar',
    progress: 45,
    accentClass: 'bg-indigo-500',
  },
  {
    id: 'messages',
    title: 'New Messages',
    value: '8',
    description: 'Unread messages',
    icon: 'messageSquare',
    progress: 52,
    accentClass: 'bg-amber-500',
  },
  {
    id: 'groups',
    title: 'Study Groups',
    value: '5',
    description: 'Active groups',
    icon: 'users',
    progress: 60,
    accentClass: 'bg-sky-500',
  },
  {
    id: 'achievements',
    title: 'Achievements',
    value: '24',
    description: 'Total earned',
    icon: 'award',
    progress: 78,
    trend: '▲ 8%',
    accentClass: 'bg-rose-500',
  },
];

export const ACTIVITIES_DATA: DashboardActivity[] = [
  { id: 1, title: 'Submitted Math Assignment', time: '2 hours ago', icon: 'checkCircle' },
  { id: 2, title: 'Completed Chemistry Quiz', time: '5 hours ago', icon: 'award' },
  { id: 3, title: 'Joined Study Group', time: 'Yesterday', icon: 'users' },
  { id: 4, title: 'Started New Module', time: '2 days ago', icon: 'book' },
  { id: 5, title: 'Reviewed Physics Notes', time: '2 days ago', icon: 'activity' },
  { id: 6, title: 'Asked a Question in Forum', time: '3 days ago', icon: 'messageSquare' },
  { id: 7, title: 'Earned Weekly Badge', time: '4 days ago', icon: 'star' },
  { id: 8, title: 'Completed Practice Test', time: '5 days ago', icon: 'checkCircle' },
];

export const DEADLINES_DATA: DashboardDeadline[] = [
  { id: 1, title: 'Physics Homework', due: 'Tomorrow, 10:00 AM', subject: 'Physics', priority: 'high' },
  { id: 2, title: 'Literature Essay', due: 'In 3 days', subject: 'Literature', priority: 'medium' },
  { id: 3, title: 'Math Quiz', due: 'Next Monday', subject: 'Mathematics', priority: 'low' },
  { id: 4, title: 'Biology Lab Report', due: 'Next Tuesday', subject: 'Biology', priority: 'medium' },
  { id: 5, title: 'History Assignment', due: 'Next Friday', subject: 'History', priority: 'low' },
  { id: 6, title: 'Chemistry Worksheet', due: 'Tonight, 11:59 PM', subject: 'Chemistry', priority: 'high' },
];

export const PROGRESS_DATA: DashboardProgress[] = [
  { id: 'math', subject: 'Mathematics', progress: 85 },
  { id: 'physics', subject: 'Physics', progress: 70 },
  { id: 'literature', subject: 'Literature', progress: 60 },
  { id: 'chemistry', subject: 'Chemistry', progress: 90 },
];

export const QUICK_ACTIONS_DATA: DashboardQuickAction[] = [
  { id: 'start-assignment', text: 'Start Assignment', icon: 'book' },
  { id: 'view-calendar', text: 'View Calendar', icon: 'calendar' },
  { id: 'message-instructor', text: 'Message Instructor', icon: 'messageSquare' },
  { id: 'view-resources', text: 'View Resources', icon: 'target' },
];

export const DASHBOARD_COPY = {
  welcomeDescription:
    "You're making great progress in your courses. Keep up the good work! You have 3 upcoming deadlines this week and 75% overall completion.",
  ttsText: 'hello students how are you all',
};
