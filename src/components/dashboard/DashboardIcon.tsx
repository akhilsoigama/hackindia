import { Suspense, lazy } from 'react';
import type { ComponentType } from 'react';
import type { DashboardIconName } from '@/constants/dashboard.constants';

type IconProps = {
  className?: string;
};

const createLazyIcon = (iconName: string) =>
  lazy(async () => {
    const icons = await import('react-icons/fi');
    const IconComponent = icons[iconName as keyof typeof icons] as ComponentType<IconProps>;
    return {
      default: IconComponent,
    };
  });

const iconMap: Record<DashboardIconName, ReturnType<typeof createLazyIcon>> = {
  book: createLazyIcon('FiBook'),
  barChart2: createLazyIcon('FiBarChart2'),
  calendar: createLazyIcon('FiCalendar'),
  messageSquare: createLazyIcon('FiMessageSquare'),
  users: createLazyIcon('FiUsers'),
  award: createLazyIcon('FiAward'),
  checkCircle: createLazyIcon('FiCheckCircle'),
  clock: createLazyIcon('FiClock'),
  zap: createLazyIcon('FiZap'),
  activity: createLazyIcon('FiActivity'),
  star: createLazyIcon('FiStar'),
  trendingUp: createLazyIcon('FiTrendingUp'),
  target: createLazyIcon('FiTarget'),
  chevronRight: createLazyIcon('FiChevronRight'),
};

const IconSkeleton = ({ className = 'h-4 w-4' }: IconProps) => (
  <span className={`inline-block rounded bg-gray-200 dark:bg-gray-700 ${className}`} aria-hidden="true" />
);

export const DashboardIcon = ({ name, className = 'h-4 w-4' }: { name: DashboardIconName; className?: string }) => {
  const LazyIcon = iconMap[name];

  return (
    <Suspense fallback={<IconSkeleton className={className} />}>
      <LazyIcon className={className} />
    </Suspense>
  );
};

export default DashboardIcon;
