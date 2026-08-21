import * as React from "react";
import { cn } from "@/utils/utils";

interface AntiCopyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AntiCopy({ children, className, ...props }: AntiCopyProps) {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      className={cn("select-none", className)}
      style={{
        WebkitUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none",
        WebkitTouchCallout: "none",
      }}
      {...props}
    >
      {children}
    </div>
  );
}
