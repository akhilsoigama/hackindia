import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface SidebarLinkItemProps {
  isActive?: boolean;
  isSidebarExpanded: boolean;
  isDark: boolean;
  isSubLink?: boolean;
  className?: string;
  children: React.ReactNode;
  tooltip?: React.ReactNode;
}

const SidebarLinkItem = ({
  isActive = false,
  isSidebarExpanded,
  isDark,
  isSubLink = false,
  className = "",
  children,
  tooltip,
}: SidebarLinkItemProps) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const itemRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      setTooltipPos({
        top: rect.top,
        left: rect.right + 8,
      });
    }
    setIsTooltipVisible(true);
  };

  const hideTooltip = () => {
    timerRef.current = setTimeout(() => setIsTooltipVisible(false), 120);
  };

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const base = `group relative flex items-center gap-3 rounded-xl border transition-all duration-150 ease-out ${
    isSubLink ? "h-10 px-3 text-sm" : "h-11 px-3.5 text-sm"
  } ${isSidebarExpanded ? "" : "justify-center px-0"}`;

  const inactive = isDark
    ? "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white"
    : "border-transparent text-slate-600 hover:border-white/60 hover:bg-white/80 hover:text-slate-900";

  const active = isDark
    ? "border-slate-400/20 bg-slate-950/70 text-slate-200 "
    : "border-slate-500/15 bg-slate-50 text-slate-700 ";

  const tooltipPortal =
    !isSidebarExpanded && tooltip && isTooltipVisible
      ? createPortal(
          <div
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            style={{
              position: "fixed",
              top: tooltipPos.top,
              left: tooltipPos.left,
              zIndex: 99999, 
              pointerEvents: "auto",
              animation:
                "sidebarTooltipIn 0.14s cubic-bezier(0.16,1,0.3,1) forwards",
            }}
            className={`
              min-w-43.75 max-w-60
              rounded-2xl border shadow-xl backdrop-blur-xl
              ${
                isDark
                  ? "bg-slate-950/95 border-white/10 text-slate-100"
                  : "bg-white/95 border-white/70 text-slate-900"
              }
            `}
          >
            <style>{`
              @keyframes sidebarTooltipIn {
                from { opacity: 0; transform: translateX(-6px); }
                to   { opacity: 1; transform: translateX(0);    }
              }
            `}</style>
            {tooltip}
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div
        ref={itemRef}
        className={`${base} ${isActive ? active : inactive} ${className}`}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {children}
      </div>

      {tooltipPortal}
    </>
  );
};

export default SidebarLinkItem;
