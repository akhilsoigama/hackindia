export const getHeaderActionClass = (isDark: boolean, className = ''): string => {
  const base =
    'relative inline-flex h-10 items-center justify-center gap-2 rounded-full border px-3.5 text-sm font-medium shadow-sm backdrop-blur-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
  const theme = isDark
    ? 'border-white/10 bg-white/10 text-slate-100 shadow-black/10 hover:bg-white/15 focus-visible:ring-blue-400/50 focus-visible:ring-offset-slate-950'
    : 'border-white/60 bg-white/70 text-slate-700 shadow-blue-950/5 hover:bg-white/90 focus-visible:ring-blue-500/50 focus-visible:ring-offset-slate-50';

  return `${base} ${theme} ${className}`.trim();
};
