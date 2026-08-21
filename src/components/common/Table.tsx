import { memo, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaInfoCircle,
  FaEye,
  FaRegCheckCircle,
  FaRegTimesCircle,
} from "react-icons/fa";
import useTranslateWithAtom from "../../action/translate";
import Table from "../ui/table";
import { useTheme } from '@/theme/AppThemeProvider';

const StringTranslated = memo(({ text }: { text: string }) => {
  const { translateText, currentLanguage } = useTranslateWithAtom();
  const [translated, setTranslated] = useState<string>(() => {
    const cacheKey = `${currentLanguage}_${text}`;
    const cached = typeof window !== 'undefined' ? sessionStorage.getItem(cacheKey) : null;
    return cached || text;
  });
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!text || !text.trim()) return;

    const cacheKey = `${currentLanguage}_${text}`;
    const cached = typeof window !== 'undefined' ? sessionStorage.getItem(cacheKey) : null;
    if (cached) {
      setTranslated(cached);
      return;
    }

    const doTranslate = async () => {
      try {
        const result = await translateText(text);
        if (mounted && result) {
          setTranslated(result);
          if (typeof window !== 'undefined') sessionStorage.setItem(cacheKey, result);
        }
      } catch (error) {
        console.error("Translation failed:", error);
      }
    };

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(doTranslate, 100);

    return () => {
      mounted = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, currentLanguage]);

  return <span translate="no">{translated}</span>;
});

const Translated = memo(({ text }: { text: string | ReactNode }) => {
  if (typeof text !== "string") {
    return <span translate="no">{text as ReactNode}</span>;
  }

  return <StringTranslated text={text} />;
});

Translated.displayName = "Translated";
StringTranslated.displayName = "StringTranslated";

interface Column<T extends Record<string, unknown>> {
  header: string;
  accessor: keyof T | ((item: T) => string | number);
  sortable?: boolean;
  render?: (item: T) => ReactNode;
  isTranslatable?: boolean;
  width?: string | number;
}

interface TableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: Column<T>[];
  rowKey?: (item: T, index: number) => string | number;
}

const CommanTable = <T extends Record<string, unknown>,>({
  data,
  columns,
  rowKey,
}: TableProps<T>) => {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;
    const copy = [...data];
    copy.sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      const av = typeof aVal === "string" ? aVal.toLowerCase() : aVal;
      const bv = typeof bVal === "string" ? bVal.toLowerCase() : bVal;
      if (av < bv) return sortDirection === "asc" ? -1 : 1;
      if (av > bv) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [data, sortColumn, sortDirection]);

  const getDisplayValue = (item: T, column: Column<T>) => {
    if (column.render) return column.render(item);

    let raw: unknown;
    const key = typeof column.accessor === 'string' ? (column.accessor as string) : null;

    if (typeof column.accessor === 'string') {
      raw = item[column.accessor as keyof T];
    } else if (typeof column.accessor === 'function') {
      raw = column.accessor(item as T);
    } else {
      raw = item[column.accessor as keyof T];
    }

    if (key === 'isActive' || key === 'active' || key === 'status') {
      const val = Boolean(raw);
      return (
        <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${isDark
          ? val ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'
          : val ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
          {val ? (
            <>
              <FaRegCheckCircle className="w-3 h-3" />
              <span>Active</span>
            </>
          ) : (
            <>
              <FaRegTimesCircle className="w-3 h-3" />
              <span>Inactive</span>
            </>
          )}
        </div>
      );
    }

    if (key === 'createdAt' || key === 'updatedAt' || key === 'date') {
      const dateStr = raw as string;
      const dateObj = dateStr ? new Date(dateStr) : null;
      if (dateObj && !isNaN(dateObj.getTime())) {
        const formatted = dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        return (
          <div className="flex flex-col">
            <span className="font-medium">{formatted}</span>
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {dateObj.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        );
      }
      return <span className="text-gray-400">N/A</span>;
    }

    const valueToTranslate = String(raw === undefined || raw === null ? '' : raw);

    if (column.isTranslatable === false ||
      valueToTranslate.includes('@') ||
      /^\d+$/.test(valueToTranslate) ||
      valueToTranslate.startsWith('http')) {
      return <span className="font-medium">{valueToTranslate}</span>;
    }

    return <span><Translated text={valueToTranslate} /></span>;
  };

  return (
    <div className="w-full">
      {/* ✅ Desktop Table View */}
      <div className="hidden xl:block w-full">
        <div className={`rounded-lg border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="w-full overflow-x-auto overflow-y-auto scrollbar-hide max-h-96">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head style={{ width: '70px', minWidth: '70px' }}>
                    <span className={`text-xs uppercase font-semibold tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Sr No
                    </span>
                  </Table.Head>
                  {columns.map((column, index) => (
                    <Table.Head
                      key={index}
                      style={{
                        width: column.width,
                        minWidth: column.width ?? '120px',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-xs uppercase font-semibold tracking-wide whitespace-nowrap ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          <Translated text={column.header} />
                        </span>
                        {column.sortable && typeof column.accessor === "string" && (
                          <button
                            onClick={() => handleSort(column.accessor as keyof T)}
                            className={`p-1 rounded transition-colors shrink-0 ${isDark
                              ? 'hover:bg-gray-800'
                              : 'hover:bg-gray-100'
                              }`}
                          >
                            {sortColumn === column.accessor ? (
                              sortDirection === "asc" ? (
                                <FaSortUp className={`w-3 h-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                              ) : (
                                <FaSortDown className={`w-3 h-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                              )
                            ) : (
                              <FaSort className={`w-3 h-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                            )}
                          </button>
                        )}
                      </div>
                    </Table.Head>
                  ))}
                </Table.Row>
              </Table.Header>

              <Table.Body interactive striped>
                {useMemo(() => {
                  return sortedData.map((item, index) => {
                    const key = rowKey ? rowKey(item, index) : index;
                    const displayValues = columns.map((column) => getDisplayValue(item, column));
                    return (
                      <Table.Row key={key}>
                        <Table.Cell style={{ width: '70px', minWidth: '70px' }}>
                          <div className="flex items-center justify-center w-full">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 ${isDark
                              ? 'bg-slate-950/70 text-gray-300'
                              : 'bg-gray-100 text-gray-600'
                              }`}>
                              {index + 1}
                            </div>
                          </div>
                        </Table.Cell>
                        {displayValues.map((value, colIndex) => (
                          <Table.Cell
                            key={colIndex}
                            style={{
                              width: columns[colIndex].width,
                              minWidth: columns[colIndex].width ?? '120px',
                            }}
                          >
                            {value}
                          </Table.Cell>
                        ))}
                      </Table.Row>
                    );
                  });
                }, [sortedData, columns, rowKey, isDark])}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>

      {/* Mobile Card View - unchanged */}
      <div className="block xl:hidden w-full max-w-full overflow-x-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full overflow-x-hidden">
          {sortedData.map((item, index) => {
            const key = rowKey ? rowKey(item, index) : index;
            const displayValues = columns.map((column) => ({
              header: column.header,
              value: getDisplayValue(item, column),
            }));

            const mainInfo = displayValues.slice(0, 2);
            const additionalInfo = displayValues.slice(2);

            return (
              <div
                key={key}
                className={`w-full max-w-full rounded-lg overflow-hidden transition-all border ${isDark
                  ? 'bg-gray-900 border-gray-800 hover:border-gray-700'
                  : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className={`p-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-start gap-4 min-w-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3 min-w-0">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold shrink-0 ${isDark
                          ? 'bg-gray-800 text-gray-300'
                          : 'bg-gray-100 text-gray-600'
                          }`}>
                          {index + 1}
                        </div>
                        <div className="min-w-0">
                          {mainInfo[0] && (
                            <div className={`text-sm font-semibold truncate ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                              {mainInfo[0].value}
                            </div>
                          )}
                          {mainInfo[1] && (
                            <div className={`text-xs mt-1 truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {mainInfo[1].value}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <button className={`p-2 rounded-lg transition-colors ${isDark
                      ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-200'
                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                      }`}>
                      <FaEye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {additionalInfo.length > 0 && (
                  <div className={`${isDark ? 'p-4 bg-gray-800/30' : 'p-4 bg-gray-50'}`}>
                    <div className="space-y-2">
                      {additionalInfo.map((info, infoIndex) => (
                        <div
                          key={infoIndex}
                          className={`flex justify-between items-center gap-3 p-2.5 rounded-lg transition-colors min-w-0 ${isDark
                            ? 'bg-gray-800/50 hover:bg-gray-800'
                            : 'bg-white hover:bg-gray-50 border border-gray-100'
                            }`}
                        >
                          <span className={`text-xs font-medium flex items-center gap-2 min-w-0 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                            <FaInfoCircle className="w-3 h-3 opacity-50 shrink-0" />
                            <span className="truncate"><Translated text={info.header} /></span>
                          </span>
                          <span className={`text-xs font-semibold truncate shrink-0 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                            {info.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommanTable;