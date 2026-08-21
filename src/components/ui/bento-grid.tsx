"use client";

import type { ReactNode } from "react";
import { CheckCircle, Globe, TrendingUp, Video } from "lucide-react";
import { cn } from "@/utils/utils";
import { useTheme } from "@/theme/AppThemeProvider";

export interface BentoItem {
  title: string;
  description: string;
  icon: ReactNode;
  status?: string;
  tags?: string[];
  meta?: string;
  cta?: string;
  colSpan?: number;
  hasPersistentHover?: boolean;
}

export type BentoItems = BentoItem;

interface BentoGridProps {
  items: BentoItem[];
  className?: string;
}

const itemsSample: BentoItem[] = [
  {
    title: "Analytics Dashboard",
    meta: "v2.4.1",
    description:
      "Real-time metrics with AI-powered insights and predictive analytics",
    icon: <TrendingUp className="h-4 w-4 text-blue-500" />,
    status: "Live",
    tags: ["Statistics", "Reports", "AI"],
    colSpan: 2,
    hasPersistentHover: true,
  },
  {
    title: "Task Manager",
    meta: "84 completed",
    description: "Automated workflow management with priority scheduling",
    icon: <CheckCircle className="h-4 w-4 text-emerald-500" />,
    status: "Updated",
    tags: ["Productivity", "Automation"],
  },
  {
    title: "Media Library",
    meta: "12GB used",
    description: "Cloud storage with intelligent content processing",
    icon: <Video className="h-4 w-4 text-purple-500" />,
    tags: ["Storage", "CDN"],
    colSpan: 2,
  },
  {
    title: "Global Network",
    meta: "6 regions",
    description: "Multi-region deployment with edge computing",
    icon: <Globe className="h-4 w-4 text-slate-500" />,
    status: "Beta",
    tags: ["Infrastructure", "Edge"],
  },
];

function BentoGrid({ items = itemsSample, className }: BentoGridProps) {
  const { mode } = useTheme();
  const isDark = mode === "dark";

  return (
    <div className={cn(
      "mx-auto grid max-w-7xl grid-cols-1 gap-4 p-4 md:grid-cols-3",
      className
    )}>
      {items.map((item, index) => (
        <div
          key={`${item.title}-${index}`}
          className={cn(
            "group relative overflow-hidden rounded-xl p-6 text-left transition-all duration-300",
            "border will-change-transform",
            isDark
              ? "border-slate-800 bg-slate-900/50 hover:border-teal-500/30 hover:bg-slate-900/80 hover:shadow-xl hover:shadow-teal-500/5"
              : "border-slate-200 bg-white  hover:shadow-lg hover:shadow-teal-100/20",
            "hover:-translate-y-0.5",
            item.colSpan ? `col-span-${item.colSpan}` : "col-span-1",
            item.colSpan === 2 ? "md:col-span-2" : "",
            {
              "-translate-y-0.5": item.hasPersistentHover,
              "shadow-lg shadow-teal-100/20": item.hasPersistentHover && !isDark,
              "border-teal-500/30 shadow-xl shadow-teal-500/5": item.hasPersistentHover && isDark,
            }
          )}
        >
          {/* Background Pattern */}
          <div
            className={`absolute inset-0 ${
              item.hasPersistentHover ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            } transition-opacity duration-300`}
          >
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
                  ? "bg-slate-800 text-slate-300  "
                  : "bg-slate-100 text-slate-600 group-hover:bg-teal-50"
              )}>
                {item.icon}
              </div>
              <span
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-medium backdrop-blur-sm transition-colors duration-300",
                  isDark
                    ? "bg-slate-800 text-slate-300  "
                    : "bg-slate-100 text-slate-600 group-hover:bg-teal-50"
                )}
              >
                {item.status || "Active"}
              </span>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h3 className={cn(
                "text-[15px] font-medium tracking-tight",
                isDark ? "text-white" : "text-slate-900"
              )}>
                {item.title}
                <span className={cn(
                  "ml-2 text-xs font-normal",
                  isDark ? "text-slate-400" : "text-slate-500"
                )}>
                  {item.meta}
                </span>
              </h3>
              <p className={cn(
                "text-sm leading-snug",
                isDark ? "text-slate-400" : "text-slate-600"
              )}>
                {item.description}
              </p>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {item.tags?.map((tag, i) => (
                  <span
                    key={`${tag}-${i}`}
                    className={cn(
                      "rounded-md px-2 py-1 backdrop-blur-sm transition-all duration-200",
                      isDark
                        ? "bg-slate-800 text-slate-300  "
                        : "bg-slate-100 text-slate-600 hover:bg-teal-50"
                    )}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <span className={cn(
                "text-xs transition-opacity duration-300 flex items-center gap-1",
                isDark ? "text-slate-400" : "text-slate-500",
                "opacity-0 group-hover:opacity-100"
              )}>
                {item.cta || "Explore"}
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>

          {/* Border linear */}
          <div
            className={cn(
              "absolute inset-0 -z-10 rounded-xl p-px transition-opacity duration-300",
              isDark
                ? "bg-linear-to-br from-transparent via-teal-500/20 to-transparent"
                : "bg-linear-to-br from-transparent via-teal-300/30 to-transparent",
              item.hasPersistentHover ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
          />
        </div>
      ))}
    </div>
  );
}

export { BentoGrid };