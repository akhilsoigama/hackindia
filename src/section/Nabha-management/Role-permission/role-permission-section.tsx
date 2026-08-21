import React, { useMemo, useState, useEffect, useCallback } from "react";
import { PermissionEntity } from "../../../hooks/useOptimizedPermission";
import { useTheme } from '@/theme/AppThemeProvider';

interface PermissionsSectionProps {
  permissionMatrix: PermissionEntity[];
  selectedPermissions: number[];
  isMobile?: boolean;
  togglePermission: (id: number | number[]) => void;
  toggleAll: (keys: Record<string, number | number[]>) => void;
  toggleAllPermissions: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const ACTION_LABELS: Record<string, string> = {
  access: "Access", view: "View", create: "Create",
  update: "Update", delete: "Delete", list: "List", assign: "Assign",
};
const ACTION_PRIORITY = ["access", "view", "list", "create", "update", "delete", "assign"];

const ACTION_COLORS: Record<string, { dark: string; light: string }> = {
  access:  { dark: "text-purple-400 border-purple-500/30 bg-purple-500/10", light: "text-purple-700 border-purple-200 bg-purple-50" },
  view:    { dark: "text-sky-400 border-sky-500/30 bg-sky-500/10",          light: "text-sky-700 border-sky-200 bg-sky-50" },
  list:    { dark: "text-teal-400 border-teal-500/30 bg-teal-500/10",       light: "text-teal-700 border-teal-200 bg-teal-50" },
  create:  { dark: "text-tebg-teal-800-400 border-tebg-teal-800-500/30 bg-teal-800-500/10", light: "text-tebg-teal-800-700 border-tebg-teal-800-200 bg-teal-800-50" },
  update:  { dark: "text-amber-400 border-amber-500/30 bg-amber-500/10",    light: "text-amber-700 border-amber-200 bg-amber-50" },
  delete:  { dark: "text-red-400 border-red-500/30 bg-red-500/10",          light: "text-red-700 border-red-200 bg-red-50" },
  assign:  { dark: "text-slate-400 border-slate-500/30 bg-slate-500/10", light: "text-slate-700 border-slate-200 bg-slate-50" },
};

const getActionColor = (action: string, isDark: boolean) => {
  const c = ACTION_COLORS[action];
  if (!c) return isDark ? "text-slate-400 border-slate-700 bg-slate-800/50" : "text-slate-600 border-slate-200 bg-slate-50";
  return isDark ? c.dark : c.light;
};

const getActionLabel = (action: string) =>
  ACTION_LABELS[action] || action.charAt(0).toUpperCase() + action.slice(1);

const getSortedActions = (keys: Record<string, number | number[]>): string[] =>
  Object.keys(keys).sort((a, b) => {
    const ai = ACTION_PRIORITY.indexOf(a), bi = ACTION_PRIORITY.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1; if (bi === -1) return -1;
    return ai - bi;
  });

// ── Custom Checkbox ───────────────────────────────────────────────────────────
const Checkbox = ({
  checked, onChange, isDark, indeterminate = false,
}: { checked: boolean; onChange: () => void; isDark: boolean; indeterminate?: boolean; }) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={indeterminate ? "mixed" : checked}
    onClick={onChange}
    className={`
      h-4 w-4 shrink-0 rounded transition-all duration-150 border flex items-center justify-center
      ${checked || indeterminate
        ? isDark
          ? 'bg-slate-500 border-slate-500'
          : 'bg-slate-600 border-slate-600'
        : isDark
          ? 'bg-slate-800 border-slate-600 hover:border-slate-400'
          : 'bg-white border-slate-300 hover:border-slate-400'
      }
    `}
  >
    {indeterminate && !checked
      ? <div className="h-0.5 w-2 bg-white rounded-full" />
      : checked
        ? <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
            <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        : null}
  </button>
);

// ── Module Row ────────────────────────────────────────────────────────────────
const ModuleSection = ({
  module, entities, stats, isDark, isExpanded, onToggleExpand,
  togglePermission, toggleAll, isChecked, isAllChecked, hasValidPermissions, getDefinedKeys,
}: {
  module: string; entities: PermissionEntity[];
  stats: { total: number; selected: number };
  isDark: boolean; isExpanded: boolean;
  onToggleExpand: () => void;
  togglePermission: (id: number | number[]) => void;
  toggleAll: (keys: Record<string, number | number[]>) => void;
  isChecked: (id?: number | number[]) => boolean;
  isAllChecked: (keys: Record<string, number | number[] | undefined>) => boolean;
  hasValidPermissions: (entity: PermissionEntity) => boolean;
  getDefinedKeys: (entity: PermissionEntity) => Record<string, number | number[]>;
}) => {
  const percent = stats.total > 0 ? Math.round((stats.selected / stats.total) * 100) : 0;
  const isPartial = stats.selected > 0 && stats.selected < stats.total;
  const isAllSel = stats.selected === stats.total && stats.total > 0;

  const handleModuleToggle = useCallback(() => {
    const allKeys: Record<string, number | number[]> = {};
    entities.filter(hasValidPermissions).forEach(entity => {
      Object.assign(allKeys, getDefinedKeys(entity));
    });
    toggleAll(allKeys);
  }, [entities, hasValidPermissions, getDefinedKeys, toggleAll]);

  return (
    <div className={`rounded-xl border overflow-hidden transition-colors duration-150 ${isDark ? 'border-slate-950 bg-slate-950/70' : 'border-slate-200 bg-white'}`}>
      {/* Module header */}
      <div
        className={`flex items-center gap-3 px-4 py-3 cursor-pointer select-none transition-colors duration-150 ${isDark ? 'hover:bg-slate-900/60' : 'hover:bg-slate-50'}`}
        onClick={onToggleExpand}
      >
        {/* Checkbox */}
        <div onClick={e => { e.stopPropagation(); handleModuleToggle(); }}>
          <Checkbox checked={isAllSel} onChange={handleModuleToggle} isDark={isDark} indeterminate={isPartial} />
        </div>

        {/* Module initial badge */}
        <div className={`h-7 w-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${isDark ? 'bg-slate-500/15 text-slate-400' : 'bg-slate-50 text-slate-600'}`}>
          {module.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{module}</p>
          <div className="flex items-center gap-2 mt-0.5">
            {/* Progress bar */}
            <div className={`flex-1 max-w-20 h-1 rounded-full overflow-hidden ${isDark ? 'bg-slate-950/70' : 'bg-slate-100'}`}>
              <div
                className={`h-full rounded-full transition-all duration-300 ${percent === 100 ? 'bg-teal-800-500' : 'bg-slate-500'}`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className={`text-xs tabular-nums ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {stats.selected}/{stats.total}
            </span>
          </div>
        </div>

        {/* Expand chevron */}
        <svg
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''} ${isDark ? 'text-slate-600' : 'text-slate-400'}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Expanded entities */}
      {isExpanded && (
        <div className={`border-t px-4 py-3 space-y-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
          {entities.filter(hasValidPermissions).map((entity) => {
            const definedKeys = getDefinedKeys(entity);
            const sortedActions = getSortedActions(definedKeys);
            const allChecked = isAllChecked(entity.keys);
            const anyChecked = sortedActions.some(action => isChecked(definedKeys[action]));

            return (
              <div
                key={entity.name}
                className={`rounded-lg p-3 border transition-colors duration-150 ${isDark ? 'bg-slate-950/70 border-slate-700/60' : 'bg-slate-50 border-slate-100'}`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <div onClick={() => toggleAll(definedKeys)}>
                      <Checkbox checked={allChecked} onChange={() => toggleAll(definedKeys)} isDark={isDark} indeterminate={anyChecked && !allChecked} />
                    </div>
                    <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {entity.name}
                    </span>
                  </div>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${allChecked ? isDark ? 'bg-teal-800-500/15 text-tebg-teal-800-400' : 'bg-teal-800-50 text-tebg-teal-800-600' : isDark ? 'bg-slate-700 text-slate-500' : 'bg-slate-200 text-slate-400'}`}>
                    {sortedActions.filter(a => isChecked(definedKeys[a])).length}/{sortedActions.length}
                  </span>
                </div>

                {/* Action pills */}
                <div className="flex flex-wrap gap-1.5">
                  {sortedActions.map((action) => {
                    const id = definedKeys[action];
                    const checked = isChecked(id);
                    const colorCls = getActionColor(action, isDark);

                    return (
                      <button
                        key={action}
                        type="button"
                        onClick={() => {
                          if (Array.isArray(id)) togglePermission(id);
                          else if (typeof id === 'number') togglePermission(id);
                        }}
                        className={`
                          inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium
                          border transition-all duration-100
                          ${checked
                            ? colorCls
                            : isDark
                              ? 'bg-transparent border-slate-700 text-slate-600 hover:border-slate-600 hover:text-slate-400'
                              : 'bg-transparent border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'
                          }
                        `}
                      >
                        {/* Dot indicator */}
                        <span className={`h-1.5 w-1.5 rounded-full shrink-0 transition-colors duration-100 ${checked ? 'bg-current' : isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
                        {getActionLabel(action)}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const PermissionsSection: React.FC<PermissionsSectionProps> = ({
  permissionMatrix, selectedPermissions, isMobile,
  togglePermission, toggleAll, toggleAllPermissions,
}) => {
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");

  const { groupedPermissions, totalPermissions, moduleStats } = useMemo(() => {
    const modules: Record<string, PermissionEntity[]> = {};
    let total = 0;
    const stats: Record<string, { total: number; selected: number }> = {};

    permissionMatrix.forEach((entity) => {
      const module = entity.name || "Other";
      if (!modules[module]) modules[module] = [];
      modules[module].push(entity);
      if (!stats[module]) stats[module] = { total: 0, selected: 0 };

      Object.values(entity.keys).forEach((value) => {
        if (Array.isArray(value)) {
          const validIds = value.filter((id) => id !== 0);
          total += validIds.length;
          stats[module].total += validIds.length;
          stats[module].selected += validIds.filter((id) => selectedPermissions.includes(id)).length;
        } else if (value !== undefined && value !== 0) {
          total += 1;
          stats[module].total += 1;
          if (selectedPermissions.includes(value)) stats[module].selected += 1;
        }
      });
    });
    return { groupedPermissions: modules, totalPermissions: total, moduleStats: stats };
  }, [permissionMatrix, selectedPermissions]);

  useEffect(() => {
    const init: Record<string, boolean> = {};
    Object.keys(groupedPermissions).forEach((m, i) => { init[m] = isMobile ? i < 1 : i < 3; });
    setExpandedModules(init);
  }, [groupedPermissions, isMobile]);

  const isChecked = useCallback((id?: number | number[]) => {
    if (Array.isArray(id)) return id.length > 0 && id.every((sid) => selectedPermissions.includes(sid));
    return id ? selectedPermissions.includes(id) : false;
  }, [selectedPermissions]);

  const isAllChecked = useCallback((keys: Record<string, number | number[] | undefined>) => {
    const allIds: number[] = [];
    Object.values(keys).forEach((value) => {
      if (Array.isArray(value)) value.forEach((id) => { if (id !== 0) allIds.push(id); });
      else if (value !== undefined && value !== 0) allIds.push(value);
    });
    return allIds.length > 0 && allIds.every((k) => selectedPermissions.includes(k));
  }, [selectedPermissions]);

  const hasValidPermissions = useCallback((entity: PermissionEntity) =>
    Object.values(entity.keys).some((value) => {
      if (Array.isArray(value)) return value.length > 0 && value.some((id) => id !== 0);
      return value !== undefined && value !== 0;
    }), []);

  const getDefinedKeys = useCallback((entity: PermissionEntity): Record<string, number | number[]> => {
    const dk: Record<string, number | number[]> = {};
    Object.entries(entity.keys).forEach(([action, value]) => {
      if (Array.isArray(value)) { if (value.length > 0 && value.some((id) => id !== 0)) dk[action] = value; }
      else if (value !== undefined && value !== 0) dk[action] = value;
    });
    return dk;
  }, []);

  const allSelected = selectedPermissions.length === totalPermissions;
  const anySelected = selectedPermissions.length > 0;

  // Filter modules by search
  const filteredModules = useMemo(() => {
    if (!search.trim()) return Object.entries(groupedPermissions);
    const q = search.toLowerCase();
    return Object.entries(groupedPermissions).filter(([module, entities]) =>
      module.toLowerCase().includes(q) ||
      entities.some(e => e.name?.toLowerCase().includes(q))
    );
  }, [groupedPermissions, search]);

  return (
    <div className="space-y-4">
      {/* Top bar: search + select all */}
      <div className="flex items-center gap-2.5">
        {/* Search */}
        <div className={`relative flex-1 ${isDark ? '' : ''}`}>
          <svg className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search modules..."
            className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border outline-none transition-colors duration-150 ${
              isDark
                ? 'bg-slate-950/70 border-slate-700 text-slate-200 placeholder-slate-600 focus:border-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-slate-300 focus:bg-white'
            }`}
          />
        </div>

        {/* Select all toggle */}
        <button
          type="button"
          onClick={toggleAllPermissions}
          className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl border transition-colors duration-150 ${
            allSelected
              ? isDark ? 'bg-slate-500/15 border-slate-500/30 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
              : anySelected
                ? isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'
                : isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'
          }`}
        >
          <Checkbox checked={allSelected} onChange={toggleAllPermissions} isDark={isDark} indeterminate={anySelected && !allSelected} />
          <span className="hidden sm:inline">{allSelected ? "Deselect All" : "Select All"}</span>
        </button>
      </div>

      {/* Stats bar */}
      <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl ${isDark ? 'bg-slate-950/70' : 'bg-slate-50'}`}>
        <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
          <div
            className="h-full rounded-full bg-slate-500 transition-all duration-300"
            style={{ width: totalPermissions > 0 ? `${Math.round((selectedPermissions.length / totalPermissions) * 100)}%` : '0%' }}
          />
        </div>
        <span className={`text-xs font-medium tabular-nums shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {selectedPermissions.length} / {totalPermissions}
        </span>
      </div>

      {/* Module list */}
      <div className="space-y-2">
        {filteredModules.length === 0 && (
          <div className={`text-center py-8 text-sm ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            No modules match "{search}"
          </div>
        )}
        {filteredModules
          .filter(([module]) => groupedPermissions[module].some(hasValidPermissions))
          .map(([module, entities]) => (
            <ModuleSection
              key={module}
              module={module}
              entities={entities}
              stats={moduleStats[module] || { total: 0, selected: 0 }}
              isDark={isDark}
              isExpanded={!!expandedModules[module]}
              onToggleExpand={() => setExpandedModules(prev => ({ ...prev, [module]: !prev[module] }))}
              togglePermission={togglePermission}
              toggleAll={toggleAll}
              isChecked={isChecked}
              isAllChecked={isAllChecked}
              hasValidPermissions={hasValidPermissions}
              getDefinedKeys={getDefinedKeys}
            />
          ))}
      </div>
    </div>
  );
};

export default PermissionsSection;