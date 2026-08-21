export const StatsSkeleton = ({ isDark }: { isDark: boolean }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6" aria-hidden="true">
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={`stats-skeleton-${index}`}
        className={`h-53.5 relative animate-pulse overflow-hidden rounded-3xl border p-5 backdrop-blur-xl ${
          isDark ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/75'
        }`}
      >
        <div className={`h-4 w-2/3 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
        <div className={`mt-4 h-9 w-1/2 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
        <div className={`mt-4 h-4 w-4/5 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
        <div className={`mt-6 h-2 w-full rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
      </div>
    ))}
  </div>
);

export const TtsSkeleton = ({ isDark }: { isDark: boolean }) => (
  <div
    className={`h-60 rounded-3xl border p-6 backdrop-blur-xl ${
      isDark ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/75'
    }`}
  >
    <div className={`mb-4 h-5 w-1/2 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
    <div className={`mb-2 h-4 w-full rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
    <div className={`mb-4 h-4 w-4/5 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
    <div className={`h-10 w-36 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
  </div>
);

export const VirtualListSkeleton = ({ isDark, rows }: { isDark: boolean; rows: number }) => (
  <div className="space-y-3" aria-hidden="true">
    {Array.from({ length: rows }).map((_, index) => (
      <div
        key={`row-skeleton-${index}`}
        className={`h-17 animate-pulse rounded-2xl border backdrop-blur-xl ${
          isDark ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/75'
        }`}
      />
    ))}
  </div>
);
