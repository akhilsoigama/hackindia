import React, { useState, useEffect, useCallback, Suspense, useMemo, lazy, useRef } from 'react';
import { FaSave, FaUserShield, FaTimes, FaEdit } from 'react-icons/fa';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { mutate } from 'swr';
import { toast } from 'sonner';
import RHFCheckbox from '../../../components/hook-form/RHFCheckbox';
import RHFFormField from '../../../components/hook-form/RHFFormFiled';
import { ICreateUserRolePermission, IUpdateUserRolePermission, IUserRolePermissionItem } from '../../../types/Roles';
import { endpoints } from '../../../utils/axios';
import { createUserRolePermission, updateUserRolePermission } from '../../../action/RollPermission';
import { PermissionEntity, useOptimizedPermissions } from '../../../hooks/useOptimizedPermission';
import { useRouter } from '../../../hooks/useRouter';
import { useTheme } from '@/theme/AppThemeProvider';
import { ParticleButton } from '../../../components/ui/particle-button';
import { Translated } from '../../../components/common/translator/translator';

const PermissionsSection = lazy(() => import("./role-permission-section"));

// ── Skeleton ──────────────────────────────────────────────────────────────────
const PermissionsSkeleton = () => {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={`h-14 rounded-xl animate-pulse ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}
          style={{ animationDelay: `${i * 60}ms` }}
        />
      ))}
    </div>
  );
};

// ── Schema ────────────────────────────────────────────────────────────────────
const schema = z.object({
  roleName: z.string().min(1, "Role name is required"),
  roleKey: z.string().min(1, "Role key is required"),
  roleDescription: z.string().optional().nullable(),
  isDefault: z.boolean().optional().default(false),
  permissionIds: z.array(z.number()).optional().default([]),
});

type FormData = {
  roleName: string;
  roleKey: string;
  roleDescription?: string | null;
  isDefault?: boolean;
  permissionIds?: number[];
};

type Props = {
  currentData?: IUserRolePermissionItem;
  onSuccess?: () => void;
};

type PermissionRef = number | { id?: number | string; permissionId?: number | string };

// ── Helpers ───────────────────────────────────────────────────────────────────
const parsePermissions = (permissions: unknown): number[] => {
  if (!permissions) return [];
  if (Array.isArray(permissions)) {
    if (permissions.length === 0) return [];
    const firstItem = permissions[0] as PermissionRef;
    if (typeof firstItem === 'number') return (permissions as number[]).filter((id) => id > 0);
    if (typeof firstItem === 'object' && firstItem !== null && firstItem.id !== undefined) {
      return permissions.map((perm) => {
        const id = Number((perm as { id?: number | string }).id);
        return Number.isInteger(id) && id > 0 ? id : null;
      }).filter(Boolean) as number[];
    }
    if (typeof firstItem === 'object' && firstItem !== null && firstItem.permissionId !== undefined) {
      return permissions.map((perm) => {
        const id = Number((perm as { permissionId?: number | string }).permissionId);
        return Number.isInteger(id) && id > 0 ? id : null;
      }).filter(Boolean) as number[];
    }
    return [];
  }
  if (typeof permissions === 'string') {
    const commaResult = permissions.split(',').map(id => Number(id.trim())).filter(id => Number.isInteger(id) && id > 0);
    if (commaResult.length > 0) return commaResult;
    try { return parsePermissions(JSON.parse(permissions)); } catch { return []; }
  }
  return [];
};

const getAllValidPermissionIds = (permissionMatrix: PermissionEntity[]): number[] => {
  const validIds = new Set<number>();
  permissionMatrix.forEach(entity => {
    Object.values(entity.keys).forEach(value => {
      if (Array.isArray(value)) value.forEach((id) => { if (typeof id === 'number' && id > 0) validIds.add(id); });
      else if (typeof value === 'number' && value > 0) validIds.add(value);
    });
  });
  return Array.from(validIds);
};

const deriveEntityName = (name: string): string => {
  if (!name) return 'UNKNOWN_ENTITY';
  const parts = name.split('_');
  const actions = ['VIEW', 'CREATE', 'UPDATE', 'DELETE', 'LIST', 'ACCESS', 'ASSIGN'];
  const entityParts = [...parts];
  while (entityParts.length > 1 && actions.includes(entityParts[entityParts.length - 1])) entityParts.pop();
  return entityParts.join('_').toUpperCase();
};

// ── Main Component ────────────────────────────────────────────────────────────
const RolePermissionNewEditForm: React.FC<Props> = ({ currentData, onSuccess }) => {
  const isEdit = !!currentData;
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const router = useRouter();
  const formInitializedRef = useRef(false);
  // Track permission changes separately from RHF isDirty
  const [permissionsChanged, setPermissionsChanged] = useState(false);

  const { permissionMatrix: rawPermissionMatrix } = useOptimizedPermissions();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    const handleResize = () => requestAnimationFrame(checkMobile);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const permissionMatrix = useMemo(() => {
    if (!rawPermissionMatrix?.length) return [];
    return rawPermissionMatrix
      .map((module) => ({ name: deriveEntityName(module.name || 'UNKNOWN_ENTITY'), keys: { ...(module.keys ?? {}) } }))
      .filter((entity) => Object.values(entity.keys).some((key) => {
        if (Array.isArray(key)) return key.length > 0 && key.some((id) => id !== 0);
        return key !== undefined && key !== 0;
      }));
  }, [rawPermissionMatrix]);

  const validPermissionIds = useMemo(() => getAllValidPermissionIds(permissionMatrix), [permissionMatrix]);

  const defaultValues: FormData = useMemo(() => ({
    roleName: '', roleKey: '', roleDescription: '', isDefault: false, permissionIds: [],
  }), []);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, setValue, reset, control, getValues, formState: { dirtyFields } } = methods;

  const watchedPermissions = useWatch({ control, name: 'permissionIds' });
  const selectedPermissions: number[] = useMemo(
    () => (Array.isArray(watchedPermissions) ? watchedPermissions : []),
    [watchedPermissions]
  );


  const meaningfulFieldsDirty =
    !!dirtyFields.roleName ||
    !!dirtyFields.roleKey ||
    !!dirtyFields.roleDescription;
  const canSubmit = meaningfulFieldsDirty || permissionsChanged;

  useEffect(() => {
    if (currentData && isEdit && !formInitializedRef.current && permissionMatrix.length > 0) {
      const parsed = parsePermissions(currentData.permissions);
      const valid = parsed.filter(id => validPermissionIds.includes(id));
      reset({ roleName: currentData.roleName || '', roleKey: currentData.roleKey || '', roleDescription: currentData.roleDescription || '', isDefault: currentData.isDefault || false, permissionIds: valid });
      formInitializedRef.current = true;
      setIsFormInitialized(true);
    }
  }, [currentData, isEdit, reset, permissionMatrix, validPermissionIds]);

  useEffect(() => {
    if (!isEdit && !formInitializedRef.current) {
      reset(defaultValues);
      formInitializedRef.current = true;
      setIsFormInitialized(true);
    }
  }, [isEdit, reset, defaultValues]);

  useEffect(() => {
    if (!isEdit  && selectedPermissions.length === 0 && formInitializedRef.current && permissionMatrix.length) {
      const timer = setTimeout(() => {
        const defaults: number[] = [];
        permissionMatrix.forEach(entity => {
          const view = entity.keys.view;
          if (Array.isArray(view)) view.forEach((id) => id > 0 && defaults.push(id));
          else if (typeof view === 'number' && view > 0) defaults.push(view);
        });
        if (defaults.length) setValue('permissionIds', defaults, { shouldValidate: false });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [permissionMatrix, isEdit, selectedPermissions, setValue]);

  const togglePermission = useCallback((id: number | number[]) => {
    const current = getValues('permissionIds') || [];
    if (Array.isArray(id)) {
      const allExist = id.every(i => current.includes(i));
      setValue('permissionIds', allExist ? current.filter(k => !id.includes(k)) : [...current, ...id.filter(i => !current.includes(i))], { shouldValidate: true });
    } else {
      setValue('permissionIds', current.includes(id) ? current.filter(k => k !== id) : [...current, id], { shouldValidate: true });
    }
    setPermissionsChanged(true);
  }, [getValues, setValue]);

  const toggleAll = useCallback((entityKeys: Record<string, number | number[]>) => {
    const entityPerms: number[] = [];
    Object.values(entityKeys).forEach(value => {
      if (Array.isArray(value)) value.forEach(id => typeof id === 'number' && id > 0 && entityPerms.push(id));
      else if (typeof value === 'number' && value > 0) entityPerms.push(value);
    });
    const allExist = entityPerms.every(p => selectedPermissions.includes(p));
    setValue('permissionIds', allExist ? selectedPermissions.filter(p => !entityPerms.includes(p)) : [...new Set([...selectedPermissions, ...entityPerms])], { shouldValidate: true });
    setPermissionsChanged(true);
  }, [selectedPermissions, setValue]);

  const toggleAllPermissions = useCallback(() => {
    setValue('permissionIds', selectedPermissions.length === validPermissionIds.length ? [] : validPermissionIds, { shouldValidate: true });
    setPermissionsChanged(true);
  }, [validPermissionIds, selectedPermissions, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    const permissions = data.permissionIds || [];
    if (permissions.length === 0) { toast.error('Please select at least one permission'); return; }
    const validIds = permissions.filter(id => isEdit ? id > 0 : validPermissionIds.includes(id));
    if (!validIds.length) { toast.error('No valid permissions selected'); return; }
    setIsSubmitting(true);
    try {
      let result;
      if (isEdit && currentData) {
        const payload: IUpdateUserRolePermission = { id: currentData.id, roleName: data.roleName, roleKey: data.roleKey, roleDescription: data.roleDescription || undefined, isDefault: data.isDefault, permissionIds: validIds };
        result = await updateUserRolePermission(currentData.id, payload);
        router.push('/dashboard/core-management/rolePermission/list');
      } else {
        const payload: ICreateUserRolePermission = { roleName: data.roleName, roleKey: data.roleKey, roleDescription: data.roleDescription || null, isDefault: data.isDefault, permissionIds: validIds };
        result = await createUserRolePermission(payload);
      }
      if (result) {
        toast.success(isEdit ? 'Role updated!' : 'Role created!');
        mutate(endpoints.role.getAll);
        if (!isEdit) { reset(defaultValues); setPermissionsChanged(false); }
        onSuccess?.();
      }
    } catch (err: unknown) {
      toast.error((err instanceof Error ? err.message : '') || `Error ${isEdit ? 'updating' : 'creating'} role`);
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleReset = useCallback(() => {
    if (currentData && isEdit) {
      const parsed = parsePermissions(currentData.permissions);
      reset({ roleName: currentData.roleName, roleKey: currentData.roleKey, roleDescription: currentData.roleDescription, isDefault: currentData.isDefault, permissionIds: parsed });
    } else {
      reset(defaultValues);
    }
    setPermissionsChanged(false);
  }, [currentData, reset, isEdit, defaultValues]);

 

  const isDefaultRole = isEdit && currentData?.isDefault;

  return (
    <div className={`min-h-screen transition-colors duration-200 `}>
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">

        <div className="flex items-start gap-3">
          <div className={`shrink-0 h-10 w-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-slate-950/70 text-slate-400' : 'bg-slate-50 text-slate-600'}`}>
            <FaUserShield className="h-5 w-5" />
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-950/70'} flex items-center`}>
              {isEdit ? <Translated text="Edit Role" /> : <Translated text="Create Role" />}
            </h1>
            <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              {isEdit
                ? <><Translated text="Editing permissions for" /> <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>"{currentData?.roleName}"</span></>
                : <Translated text="Define a new role and assign system-wide permissions" />}
            </p>
          </div>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">

            {/* ── Role Info Card ── */}
            <div className={`rounded-2xl border transition-colors duration-200 ${isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200'}`}>
              {/* Card header */}
              <div className={`px-4 sm:px-6 py-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <h2 className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <Translated text="Role Information" />
                </h2>
              </div>
              <div className="px-4 sm:px-6 py-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <RHFFormField
                    name="roleName"
                    label={<Translated text="Role Name" />}
                    placeholder="e.g. Administrator"
                    required
                    disabled={isDefaultRole}
                  />
                  <RHFFormField
                    name="roleKey"
                    label={<Translated text="Role Key" />}
                    placeholder="e.g. ADMIN"
                    required
                    disabled={isDefaultRole}
                  />
                  <div className="sm:col-span-2">
                    <RHFFormField
                      name="roleDescription"
                      label={<Translated text="Description (optional)" />}
                      placeholder="Brief purpose of this role"
                    />
                  </div>
                  <div className="sm:col-span-2 flex items-start gap-3">
                    <RHFCheckbox
                      name="isDefault"
                      label={<Translated text="Set as default role" />}
                      disabled={isDefaultRole}
                    />
                    {isDefaultRole && (
                      <span className={`text-xs mt-0.5 px-2 py-0.5 rounded-full font-medium ${isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
                        <Translated text="Default roles are protected" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Permissions Card ── */}
            <div className={`rounded-2xl border transition-colors duration-200 ${isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200'}`}>
              {/* Card header */}
              <div className={`px-4 sm:px-6 py-4 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <h2 className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <Translated text="Permissions" />
                </h2>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${isDark ? 'bg-slate-500/10 text-slate-400' : 'bg-slate-50 text-slate-600'}`}>
                  {selectedPermissions.length} <Translated text="selected" />
                </span>
              </div>
              <div className="px-4 sm:px-6 py-5">
                <Suspense fallback={<PermissionsSkeleton />}>
                  {isFormInitialized && permissionMatrix.length > 0 && (
                    <PermissionsSection
                      permissionMatrix={permissionMatrix}
                      selectedPermissions={selectedPermissions}
                      isMobile={isMobile}
                      togglePermission={togglePermission}
                      toggleAll={toggleAll}
                      toggleAllPermissions={toggleAllPermissions}
                    />
                  )}
                </Suspense>
              </div>
            </div>

            {/* ── Action Bar ── */}
            <div className={`sticky bottom-0 z-10 flex items-center justify-between gap-3 rounded-2xl border px-4 sm:px-6 py-3.5 transition-colors duration-200 ${isDark ? 'bg-slate-950/70 border-slate-800 backdrop-blur-sm' : 'bg-white/95 border-slate-200 backdrop-blur-sm'}`}>
              <span className={`text-xs hidden sm:block ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                {canSubmit ? <Translated text="You have unsaved changes" /> : <Translated text="No changes yet" />}
              </span>
              <div className="flex items-center gap-2.5 ml-auto">
                <ParticleButton
                  type="button"
                  onClick={handleReset}
                  disabled={!canSubmit || isSubmitting}
                    className={`flex items-center px-4 py-2 border rounded-lg text-sm font-medium ${isDark ? "text-slate-200 bg-slate-900 border-slate-800 hover:bg-slate-800" : "text-slate-700 bg-white border-slate-200 hover:bg-slate-50"}`}
                  successDuration={600}
                >
                  <FaTimes className="h-3 w-3" />
                  <Translated text="Reset" />
                </ParticleButton>

                <ParticleButton
                  type="submit"
                  disabled={isSubmitting || !canSubmit || selectedPermissions.length === 0}
                  className={`px-4 flex  items-center gap-2 justify-center py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                    isDark
                      ? "bg-white text-slate-900 hover:bg-slate-100 shadow-sm"
                      : "bg-slate-800/80 text-white hover:bg-slate-800 shadow-sm"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <Translated text="Saving..." />
                    </>
                  ) : isEdit ? (
                    <><FaEdit className="h-3 w-3" /><Translated text="Update Role" /></>
                  ) : (
                    <><FaSave className="h-3 w-3" /><Translated text="Create Role" /></>
                  )}
                </ParticleButton>
              </div>
            </div>

          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default RolePermissionNewEditForm;