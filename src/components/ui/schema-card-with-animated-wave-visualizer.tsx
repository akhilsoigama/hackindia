import { ArrowRight, Calendar, Edit, Eye, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTheme } from '@/theme/AppThemeProvider';
import ActionMenu, { ActionMenuItem } from "../common/actionMenu";
type SchemaCardProps = {
  badge?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  statusLabel?: string;
  href?: string;
  dateLabel?: string;
  metaLabel?: string;
  imageUrl?: string;
  imageAlt?: string;
  logoUrl?: string;
  logoAlt?: string;
  extraFields?: Array<{
    label: string;
    value?: string | number | null;
  }>;
  embedded?: boolean;
  className?: string;
  showViewAction?: boolean;
  showEditAction?: boolean;
  showDeleteAction?: boolean;
  onPrimaryAction?: () => void;
  onViewAction?: () => void;
  onEditAction?: () => void;
  onDeleteAction?: () => void;
};

export default function SchemaCard({
  badge = "Database",
  title = "Schema Management",
  ctaLabel = "Manage",
  statusLabel = "Live",
  href = "#",
  dateLabel,
  metaLabel,
  imageUrl = "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80",
  imageAlt = "Database schema visualization",
  logoUrl,
  logoAlt = "Organization logo",
  extraFields = [],
  embedded = false,
  className,
  showViewAction = false,
  showEditAction = false,
  showDeleteAction = false,
  onPrimaryAction,
  onViewAction,
  onEditAction,
  onDeleteAction,
}: SchemaCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { mode } = useTheme();
  const isDark = mode === "dark";

  useEffect(() => {
    if (embedded) {
      return;
    }

    const canvasEl = canvasRef.current;
    if (!canvasEl) {
      return;
    }

    const context = canvasEl.getContext("2d");
    if (!context) {
      return;
    }

    const canvas = canvasEl;
    const ctx = context;
    let time = 0;
    let animationFrameId = 0;

    const waveData = Array.from({ length: 8 }).map(() => ({
      value: Math.random() * 0.5 + 0.1,
      targetValue: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.02 + 0.01,
    }));

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function updateWaveData() {
      waveData.forEach((data) => {
        if (Math.random() < 0.01) {
          data.targetValue = Math.random() * 0.7 + 0.1;
        }
        const diff = data.targetValue - data.value;
        data.value += diff * data.speed;
      });
    }

    function draw() {
      ctx.fillStyle = isDark ? "#020617" : "#eef2ff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      waveData.forEach((data, i) => {
        const freq = data.value * 7;
        ctx.beginPath();

        for (let x = 0; x < canvas.width; x++) {
          const nx = (x / canvas.width) * 2 - 1;
          const px = nx + i * 0.04 + freq * 0.03;
          const py = Math.sin(px * 10 + time) * Math.cos(px * 2) * freq * 0.1 * ((i + 1) / 8);
          const y = ((py + 1) * canvas.height) / 2;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        const intensity = Math.min(1, freq * 0.3);
        const baseR = isDark ? 79 : 59;
        const baseG = isDark ? 70 : 130;
        const baseB = isDark ? 229 : 246;
        const r = baseR + intensity * (isDark ? 100 : 55);
        const g = baseG + intensity * (isDark ? 130 : 65);
        const b = baseB;

        ctx.lineWidth = 1 + i * 0.3;
        ctx.strokeStyle = `rgba(${r},${g},${b},0.6)`;
        ctx.shadowColor = `rgba(${r},${g},${b},0.5)`;
        ctx.shadowBlur = 5;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });
    }

    function animate() {
      time += 0.02;
      updateWaveData();
      draw();
      animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [embedded, isDark]);

  const wrapperClassName = embedded
    ? `relative ${className ?? ""}`.trim()
    : "fixed inset-0 z-10 flex items-center justify-center";
  const mediaHeightClass = embedded ? "h-36 md:h-40" : "h-48";
  const contentPaddingClass = embedded ? "p-2.5" : "p-4";
  const cardThemeClass = isDark
    ? "border border-slate-700/70 bg-linear-to-br from-slate-900/95 via-slate-950/45 to-slate-900/95"
    : "border border-slate-200/80 bg-linear-to-br from-white via-slate-50/70 to-sky-100/70";
  const titleClass = isDark ? "text-white" : "text-slate-900";
  const dividerClass = isDark
    ? "bg-linear-to-r from-transparent via-white/70 to-transparent"
    : "bg-linear-to-r from-transparent via-slate-300/80 to-transparent";
  const badgeClass = isDark
    ? "glass border-slate-400/30 text-slate-300"
    : "border border-slate-300/70 bg-white/80 text-slate-700";
  const metaClass = isDark
    ? "border-white/10 bg-black/20 text-white/70"
    : "border-slate-200/80 bg-white/75 text-slate-600";
  const ctaClass = isDark
    ? "glass border-slate-400/30 text-slate-300 hover:text-slate-200"
    : "border border-slate-300/80 bg-white/80 text-slate-700 hover:text-slate-900";
  const getStatusClass = (status: string) => {
    const normalized = (status || "").toLowerCase().trim();
    if (normalized === "upcoming") {
      return isDark
        ? "border border-blue-500/30 bg-blue-500/10 text-blue-400"
        : "border border-blue-200 bg-blue-50 text-blue-700";
    }
    if (normalized === "ongoing" || normalized === "live") {
      return isDark
        ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
        : "border border-emerald-200 bg-emerald-50 text-emerald-700";
    }
    if (normalized === "completed") {
      return isDark
        ? "border border-sky-500/30 bg-sky-500/10 text-sky-400"
        : "border border-sky-200 bg-sky-50 text-sky-700";
    }
    if (normalized === "cancelled") {
      return isDark
        ? "border border-rose-500/30 bg-rose-500/10 text-rose-400"
        : "border border-rose-200 bg-rose-50 text-rose-700";
    }
    return isDark
      ? "glass border-white/10 text-white/60"
      : "border border-slate-200 bg-white/80 text-slate-600";
  };
  const statusClass = getStatusClass(statusLabel);
  const mediaShellClass = isDark
    ? "border border-slate-400/35 bg-radial-[at_20%_20%] from-slate-500/30 via-slate-900 to-slate-950"
    : "border border-slate-200 bg-radial-[at_20%_20%] from-slate-100 via-sky-50 to-white";
  const menuButtonClass = isDark
    ? "text-white/70 hover:bg-slate-800/70 hover:text-white"
    : "text-slate-600 hover:bg-slate-50 hover:text-slate-700";

  const actionItems: ActionMenuItem[] = [];

  if (showViewAction) {
    actionItems.push({
      label: "View",
      onClick: (_data) => {
        onViewAction?.();
      },
      icon: <Eye className="h-3.5 w-3.5" />,
      variant: "default",
    });
  }

  if (showEditAction) {
    actionItems.push({
      label: "Edit",
      onClick: (_data) => {
        onEditAction?.();
      },
      icon: <Edit className="h-3.5 w-3.5" />,
      variant: "warning",
    });
  }

  if (showDeleteAction) {
    actionItems.push({
      label: "Delete",
      onClick: (_data) => {
        onDeleteAction?.();
      },
      icon: <Trash2 className="h-3.5 w-3.5" />,
      variant: "danger",
    });
  }

  const handlePrimaryClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!onPrimaryAction) {
      return;
    }

    event.preventDefault();
    onPrimaryAction();
  };

  return (
    <>
      {!embedded && <canvas ref={canvasRef} className="inset-0 h-full w-full" />}

      <div className={wrapperClassName}>
        <div className="w-full animate-float" style={{ animationDuration: embedded ? "5s" : "4s" }}>
          <div className={`relative flex flex-col overflow-hidden rounded-2xl ${cardThemeClass}`}>
            <div className="relative flex justify-center">
              <div className={`relative ${mediaHeightClass} w-full overflow-hidden rounded-xl ${mediaShellClass}`}>
                <div className="absolute inset-0 opacity-10">
                  <div
                    className={`h-full w-full animate-pulse ${
                      isDark
                        ? "bg-linear-to-bl from-slate-500/35 to-slate-700/30"
                        : "bg-linear-to-bl from-slate-200/70 to-cyan-100/70"
                    }`}
                  />
                </div>
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  className={`h-full w-full object-cover ${isDark ? "opacity-60" : "opacity-100"}`}
                  loading="lazy"
                />
              </div>
            </div>

            <div className={`h-px w-full ${dividerClass}`} />

            <div className={contentPaddingClass}>
              {actionItems.length > 0 && (
                <div className="mb-2 flex items-center justify-end">
                  <ActionMenu items={actionItems} data={null} className={menuButtonClass} />
                </div>
              )}

              <span className={`mb-2 inline-block rounded-full px-2.5 py-1 text-[11px] font-medium ${badgeClass}`}>
                {badge}
              </span>

              <div className="mb-1.5 flex items-center gap-2">
                {logoUrl && (
                  <img
                    src={logoUrl}
                    alt={logoAlt}
                    className="h-7 w-7 rounded-full border border-white/20 object-cover"
                    loading="lazy"
                  />
                )}
                <h3 className={`text-base font-semibold ${titleClass}`}>{title}</h3>
              </div>

              

              {extraFields.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {extraFields.slice(0, 4).map((field) => (
                    <span
                      key={field.label}
                      className={`rounded-full border px-2 py-0.5 text-[10px] ${metaClass}`}
                    >
                      <strong className={isDark ? "text-white/85" : "text-slate-700"}>{field.label}:</strong>{" "}
                      <span>{field.value ?? "-"}</span>
                    </span>
                  ))}

                  {extraFields.length > 4 && (
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] ${metaClass}`}>
                      +{extraFields.length - 4} more
                    </span>
                  )}
                </div>
              )}

              {(dateLabel || metaLabel) && (
                <div className={`mb-2 flex items-center justify-between gap-2 rounded-md border px-2.5 py-1.5 text-[11px] ${metaClass}`}>
                  <span className="inline-flex min-w-0 items-center gap-1.5 truncate">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{dateLabel || "No date"}</span>
                  </span>
                  <span className={isDark ? "shrink-0 text-white/60" : "shrink-0 text-slate-500"}>{metaLabel}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <a
                  href={href}
                  onClick={handlePrimaryClick}
                  className={`flex items-center rounded-lg px-3 py-1.5 text-xs font-medium transition ${ctaClass}`}
                >
                  {ctaLabel}
                  <ArrowRight className="ml-1 h-3 w-3" />
                </a>

                <span className={`rounded-full px-2 py-1 text-xs ${statusClass}`}>{statusLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
