import { useTheme } from '@/theme/AppThemeProvider';

const useThemeSkeleton = () => {
  const { mode } = useTheme() ;
  const isDark = mode === 'dark';
  return {
    bg: isDark ? 'bg-slate-950/70' : 'bg-white',
    card: isDark ? 'bg-slate-950/70' : 'bg-white',
    text: isDark ? 'text-slate-200' : 'text-slate-700',
    border: isDark ? 'border-slate-700' : 'border-slate-200',
  };
};

export const SkeletonPage = () => {
  const theme = useThemeSkeleton();
  return (
    <div className={`w-full h-screen ${theme.bg}`}>
      <div className={`h-10 w-3/5 mb-2 rounded ${theme.card} animate-pulse ml-4 mt-4`} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`rounded-xl p-4 ${theme.card} border ${theme.border} animate-pulse`}>
            <div className="h-8 w-4/5 mb-2 rounded bg-slate-300/40" />
            <div className="h-5 w-3/5 rounded bg-slate-300/30" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonForm = () => {
  const theme = useThemeSkeleton();
  return (
    <div className={`w-full min-h-screen ${theme.bg} p-4`}>
      <div className={`h-10 w-4/5 mb-3 rounded ${theme.card} animate-pulse`} />
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <div className="h-6 w-2/5 mb-1 rounded bg-slate-300/40" />
            <div className="h-12 w-full rounded bg-slate-300/30" />
          </div>
        ))}
        <div className="h-10 w-32 mt-2 rounded bg-slate-300/30" />
      </div>
    </div>
  );
};

export const SkeletonList = () => {
  const theme = useThemeSkeleton();
  return (
    <div className={`w-full min-h-screen ${theme.bg} p-4`}>
      <div className="flex justify-between items-center mb-4">
        <div className="h-9 w-36 rounded bg-slate-300/40 animate-pulse" />
        <div className="h-9 w-24 rounded bg-slate-300/30 animate-pulse" />
      </div>
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`rounded-xl p-4 ${theme.card} border ${theme.border} animate-pulse`}>
            <div className="flex justify-between items-center">
              <div className="w-full">
                <div className="h-6 w-36 mb-1 rounded bg-slate-300/40" />
                <div className="h-5 w-24 rounded bg-slate-300/30" />
              </div>
              <div className="flex gap-1 ml-4">
                <div className="h-7 w-12 rounded bg-slate-300/30" />
                <div className="h-7 w-12 rounded bg-slate-300/30" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonDashboard = () => {
  const theme = useThemeSkeleton();
  return (
    <div className={`w-full min-h-screen ${theme.bg} p-4`}>
      <div className="h-9 w-36 mb-4 rounded bg-slate-300/40 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`rounded-xl p-4 ${theme.card} border ${theme.border} animate-pulse`}>
            <div className="flex justify-between items-center">
              <div>
                <div className="h-6 w-16 mb-1 rounded bg-slate-300/40" />
                <div className="h-8 w-10 rounded bg-slate-300/30" />
              </div>
              <div className="h-10 w-10 rounded-full bg-slate-300/30" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`rounded-xl p-4 ${theme.card} border ${theme.border} animate-pulse`}>
          <div className="h-8 w-32 mb-2 rounded bg-slate-300/40" />
          <div className="h-44 rounded bg-slate-300/30" />
        </div>
        <div className={`rounded-xl p-4 ${theme.card} border ${theme.border} animate-pulse`}>
          <div className="h-8 w-32 mb-2 rounded bg-slate-300/40" />
          <div className="h-44 rounded bg-slate-300/30" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonTable = () => {
  const theme = useThemeSkeleton();
  return (
    <div className={`w-full min-h-screen ${theme.bg} p-4`}>
      <div className="h-10 w-36 mb-4 rounded bg-slate-300/40 animate-pulse" />
      <div className="flex gap-2 mb-4">
        <div className="h-9 w-32 rounded bg-slate-300/30 animate-pulse" />
        <div className="h-9 w-20 rounded bg-slate-300/30 animate-pulse" />
      </div>
      <div className={`rounded-xl p-4 ${theme.card} border ${theme.border} animate-pulse`}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-2 mb-3">
            <div className="h-11 w-full rounded bg-slate-300/30" />
          </div>
        ))}
      </div>
    </div>
  );
};

const Skeletons = {
  Page: SkeletonPage,
  Form: SkeletonForm,
  List: SkeletonList,
  Dashboard: SkeletonDashboard,
  Table: SkeletonTable,
};

export default Skeletons;
