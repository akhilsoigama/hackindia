import React from "react";
import { useTheme } from '@/theme/AppThemeProvider';

export const Table = ({ children }: { children: React.ReactNode }) => {
  const { mode } = useTheme();
  const isDark = mode === "dark";

  const wrapperClass = `
            w-full scrollbar-thin scrollbar-hide scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 overflow-x-auto overflow-y-hidden overscroll-x-contain rounded-xl shadow-sm
        ${
          isDark
            ? "bg-slate-950/70 text-slate-100 border border-slate-700/50"
            : "bg-gradient-to-br from-white to-slate-50 text-slate-900 border border-slate-100 shadow-sm"
        }
    `;

  const tableClass = `
         w-max min-w-full border-collapse text-sm font-sans
        ${isDark ? "text-slate-100" : "text-slate-800"}
    `;

  return (
    <div className="w-full">
      <div className="w-full p-1">
        <div className={wrapperClass}>
          <div className="w-full p-2 sm:p-3 md:p-4">
            <table className={tableClass}>{children}</table>
          </div>
        </div>
      </div>
    </div>
  );
};

const TableColgroup = ({ children }: { children: React.ReactNode }) => {
  return <colgroup>{children}</colgroup>;
};

const TableCol = ({ className }: { className?: string }) => {
  return <col className={className} />;
};

const TableHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <thead className="border-b border-slate-200 dark:border-slate-700/50">
      {children}
    </thead>
  );
};

const TableBody = ({
  children,
  striped,
  interactive,
}: {
  children: React.ReactNode;
  striped?: boolean;
  interactive?: boolean;
  virtualize?: boolean;
}) => {
  const { mode } = useTheme();
  const isDark = mode === "dark";

  const stripedClass = striped
    ? isDark
      ? "[&_tr:where(:nth-child(odd))]:bg-slate-950/70"
      : "[&_tr:where(:nth-child(odd))]:bg-slate-50/70"
    : "";

  const hoverClass = interactive
    ? isDark
      ? " [&_tr:hover]:bg-slate-900/70 [&_tr:hover]:shadow-inner"
      : " [&_tr:hover]:bg-slate-100/80 [&_tr:hover]:shadow-sm"
    : "";

  return (
    <>
      <tbody className="table-row h-3" />
      <tbody
        className={`
                relative
                before:absolute before:inset-0 before:bg-linear-to-b 
                ${
                  isDark
                    ? "before:from-slate-950/70 before:via-transparent before:to-slate-950/80"
                    : "before:from-slate-50/50 before:via-transparent before:to-white/50"
                }
                before:pointer-events-none
                ${stripedClass}${hoverClass}
            `}
      >
        {children}
      </tbody>
    </>
  );
};

const TableRow = ({ children }: { children: React.ReactNode }) => {
  const { mode } = useTheme();
  const isDark = mode === "dark";

  return (
    <tr
      className={`
            relative transition-all duration-200 ease-out
            border-b ${isDark ? "border-slate-700/30" : "border-slate-100"}
            [&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg
            ${
              isDark
                ? "hover:bg-slate-800/30 hover:shadow-lg hover:shadow-cyan-500/5"
                : "hover:bg-slate-50/80 hover:shadow-md hover:shadow-cyan-500/10"
            }
            before:absolute before:inset-0 before:bg-linear-to-r 
            before:from-transparent before:via-transparent
            ${isDark ? "before:to-slate-700/10" : "before:to-slate-100/30"}
            before:pointer-events-none
        `}
    >
      {children}
    </tr>
  );
};

const TableHead = ({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const { mode } = useTheme();
  const isDark = mode === "dark";

  return (
    <th
      style={style}
      className={`
            h-12 px-4 align-middle font-semibold text-left whitespace-nowrap
            first:rounded-tl-lg last:rounded-tr-lg last:text-right
            ${isDark ? "text-slate-200 " : "text-slate-700 "}
            border-b ${isDark ? "border-slate-700" : "border-slate-200"}
        ${className || ""}`}
    >
      <div className="flex items-center gap-2">
        {children}
      </div>
    </th>
  );
};

const TableCell = ({
  children,
  className,
  colSpan,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
  style?: React.CSSProperties;
}) => {
  const { mode } = useTheme();
  const isDark = mode === "dark";

  return (
    <td
      style={style}
      className={`
                px-4 py-3 align-middle last:text-right transition-colors duration-200 whitespace-nowrap
                ${
                  isDark
                    ? "text-slate-300 hover:text-slate-100"
                    : "text-slate-700 hover:text-slate-900"
                }
                ${className || ""}
            `}
      colSpan={colSpan}
    >
      <div className="leading-relaxed">{children}</div>
    </td>
  );
};

const TableFooter = ({ children }: { children: React.ReactNode }) => {
  const { mode } = useTheme();
  const isDark = mode === "dark";

  return (
    <tfoot
      className={`
            border-t ${isDark ? "border-slate-700" : "border-slate-200"}
            ${
              isDark
                ? "bg-linear-to-r from-slate-900/80 to-slate-800/80"
                : "bg-linear-to-r from-slate-50/80 to-white/80"
            }
            first:rounded-bl-lg last:rounded-br-lg
        `}
    >
      {children}
    </tfoot>
  );
};

const TableTitle = ({
  children,
  description,
}: {
  children: React.ReactNode;
  description?: string;
}) => {
  const { mode } = useTheme();
  const isDark = mode === "dark";

  return (
    <div className="mb-6 px-4">
      <h3
        className={`
                text-lg font-semibold mb-1
                ${isDark ? "text-slate-100" : "text-slate-900"}
            `}
      >
        {children}
      </h3>
      {description && (
        <p
          className={`
                    text-sm
                    ${isDark ? "text-slate-400" : "text-slate-600"}
                `}
        >
          {description}
        </p>
      )}
    </div>
  );
};

const TableLoading = () => {
  const { mode } = useTheme();
  const isDark = mode === "dark";

  return (
    <TableBody>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i}>
          {[...Array(4)].map((_, j) => (
            <TableCell key={j}>
              <div
                className={`
                                h-6 rounded animate-pulse
                                ${isDark ? "bg-slate-900/50" : "bg-slate-200"}
                            `}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};

Table.Colgroup = TableColgroup;
Table.Col = TableCol;
Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;
Table.Footer = TableFooter;
Table.Title = TableTitle;
Table.Loading = TableLoading;

export default Table;