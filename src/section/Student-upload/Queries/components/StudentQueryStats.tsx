interface StudentQueryStatsProps {
  total: number;
  answered: number;
  pending: number;
}

export default function StudentQueryStats({ total, answered, pending }: StudentQueryStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-3xl bg-slate-900 px-5 py-4 text-white shadow-lg shadow-slate-900/10">
        <div className="text-xs uppercase tracking-[0.2em] text-slate-300">Total</div>
        <div className="mt-2 text-3xl font-semibold">{total}</div>
      </div>
      <div className="rounded-3xl bg-emerald-50 px-5 py-4 text-emerald-900 border border-emerald-100">
        <div className="text-xs uppercase tracking-[0.2em] text-emerald-700">Answered</div>
        <div className="mt-2 text-3xl font-semibold">{answered}</div>
      </div>
      <div className="rounded-3xl bg-amber-50 px-5 py-4 text-amber-900 border border-amber-100">
        <div className="text-xs uppercase tracking-[0.2em] text-amber-700">Pending</div>
        <div className="mt-2 text-3xl font-semibold">{pending}</div>
      </div>
    </div>
  );
}
