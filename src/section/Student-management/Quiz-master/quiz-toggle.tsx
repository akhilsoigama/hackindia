type QuizToggleProps = {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  label?: string;
  disabledReason?: string;
};

export default function QuizToggle({
  checked,
  onChange,
  disabled = false,
  label,
  disabledReason,
}: QuizToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <span title={disabled ? disabledReason : undefined}>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={label || "Toggle status"}
          onClick={onChange}
          disabled={disabled}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
            checked
              ? "bg-emerald-500/90"
              : "bg-slate-300 dark:bg-slate-700"
          } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
        >
          <span
            className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
              checked ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </span>
      {label && <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>}
    </div>
  );
}
