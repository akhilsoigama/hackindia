import React, { useState, useEffect, useCallback, Suspense, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaUserShield, FaSync } from 'react-icons/fa';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import RHFCheckbox from '../../../components/hook-form/RHFCheckbox';
import RHFFormField from '../../../components/hook-form/RHFFormFiled';
import { ICreateUserRolePermission, IUserRolePermissionItem } from '../../../types/Roles';
import { mutate } from 'swr';
import { endpoints } from '../../../utils/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserRolePermission } from '../../../action/RollPermission';
import { toast } from 'sonner';
import PermissionsSection from './role-permission-section';
import { useOptimizedPermissions } from '../../../hooks/useOptimizedPermission';

const schema = z.object({
  roleName: z.string().min(1),
  roleKey: z.string().min(1),
  roleDescription: z.string().optional(),
  isDefault: z.boolean().optional(),
  permissionIds: z.array(z.number()).optional(),
});

type FormData = z.infer<typeof schema>;

interface RolePermissionCreateProps {
  role?: IUserRolePermissionItem;
  onSuccess?: () => void;
}

const parsePermissions = (permStr: string): number[] => {
  try {
    return JSON.parse(permStr).map((id: any) => parseInt(id, 10)).filter((id: number) => !isNaN(id));
  } catch {
    return [];
  }
};

const RolePermissionCreate: React.FC<RolePermissionCreateProps> = ({ role, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [retryCount, setRetryCount] = useState(0);

  const { permissionMatrix, isLoading, isError, error } = useOptimizedPermissions();

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: useMemo(() => ({
      roleName: role?.roleName || '',
      roleKey: role?.roleKey || '',
      roleDescription: role?.roleDescription || '',
      isDefault: role?.isDefault || false,
      permissionIds: role ? parsePermissions(role.permissions) : [],
    }), [role]),
  });

  const { handleSubmit, setValue, reset, formState: { isDirty }, control } = methods;

  const selectedPermissions = useWatch({
    control,
    name: 'permissionIds',
    defaultValue: [],
  }) ?? [];

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setViewMode(mobile ? 'cards' : 'table');
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [permissionMatrix]);

  useEffect(() => {
    if (role) {
      reset({
        roleName: role.roleName,
        roleKey: role.roleKey,
        roleDescription: role.roleDescription,
        isDefault: role.isDefault,
        permissionIds: parsePermissions(role.permissions),
      });
    }
  }, [role, reset]);

  useEffect(() => {
    if (permissionMatrix.length > 0 && !role && !isDirty && selectedPermissions.length === 0) {
      const defaultSelected: number[] = permissionMatrix.map(e => e.keys.view).filter(Boolean) as number[];
      if (defaultSelected.length > 0) setValue('permissionIds', defaultSelected, { shouldValidate: false });
    }
  }, [permissionMatrix, role, isDirty, selectedPermissions.length, setValue]);

  const togglePermission = useCallback((id: number) => {
    const current = methods.getValues('permissionIds') || [];
    setValue('permissionIds', current.includes(id) ? current.filter(k => k !== id) : [...current, id], { shouldValidate: true });
  }, [methods, setValue]);

  const toggleAll = useCallback((entityKeys: Record<string, number>) => {
    const entityPerms = Object.values(entityKeys).filter(Boolean) as number[];
    const allExist = entityPerms.every(p => selectedPermissions.includes(p));
    setValue(
      'permissionIds',
      allExist ? selectedPermissions.filter(p => !entityPerms.includes(p)) : [...new Set([...selectedPermissions, ...entityPerms])],
      { shouldValidate: true }
    );
  }, [selectedPermissions, setValue]);

  const toggleAllPermissions = useCallback(() => {
    const allPerms = permissionMatrix.flatMap(e => Object.values(e.keys).filter(Boolean) as number[]);
    setValue('permissionIds', selectedPermissions.length === allPerms.length ? [] : allPerms, { shouldValidate: true });
  }, [permissionMatrix, selectedPermissions, setValue]);

  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    toast.info('Retrying to load permissions...');
  }, []);

  const onSubmit = handleSubmit(async (data: FormData) => {
    if (selectedPermissions.length === 0) return toast.error('Please select at least one permission');
    setIsSubmitting(true);
    try {
      const payload: ICreateUserRolePermission = { ...data, permissionIds: data.permissionIds ?? [] };
      const result = await createUserRolePermission(payload);
      if (result) {
        toast.success(role ? 'Role updated successfully!' : 'Role created successfully!');
        mutate(endpoints.role.getAll);
        reset();
        onSuccess?.();
      } else toast.error(role ? 'Failed to update role' : 'Failed to create role');
    } catch (err: any) {
      console.error('Submit error:', err);
      toast.error(err?.message || 'Error creating role');
    } finally {
      setIsSubmitting(false);
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading permissions...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Failed to load permissions</h2>
          <p className="text-gray-600 mb-4">{error?.message || 'Please check your connection'}</p>
          {retryCount < 3 ? (
            <button onClick={handleRetry} className="bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center justify-center mx-auto">
              <FaSync className="mr-2" /> Retry ({3 - retryCount} attempts left)
            </button>
          ) : (
            <p className="text-red-500">Please refresh the page or check your connection</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-4 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
            <FaUserShield className="mr-2 sm:mr-3" /> {role ? 'Edit Role' : 'Role & Permission Management'}
          </h1>
          <p className="text-gray-600 mt-2">{permissionMatrix.length} permission entities loaded</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6">
          <FormProvider {...methods}>
            <form onSubmit={onSubmit}>
              <div className="flex flex-col gap-3">
                <RHFFormField name="roleName" label="Role Name" type="text" placeholder="Enter Role Name" required />
                <RHFFormField name="roleKey" label="Role Key" type="text" placeholder="Enter Role Key" required />
                <RHFFormField name="roleDescription" label="Role Description" placeholder="Enter Role Description" type="text" />
                <RHFCheckbox name="isDefault" label="Set as Default Role" />
              </div>

              <Suspense fallback={<div className="text-center py-4">Loading permissions table...</div>}>
                <PermissionsSection
                  permissionMatrix={permissionMatrix}
                  selectedPermissions={selectedPermissions}
                  isMobile={isMobile}
                  viewMode={viewMode}
                  togglePermission={togglePermission}
                  toggleAll={toggleAll}
                  toggleAllPermissions={toggleAllPermissions}
                />
              </Suspense>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <motion.button
                  type="submit"
                  disabled={isSubmitting || !isDirty || selectedPermissions.length === 0}
                  className={`flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-lg flex items-center justify-center ${isSubmitting || !isDirty || selectedPermissions.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                  whileHover={(!isSubmitting && isDirty && selectedPermissions.length > 0) ? { scale: 1.02 } : {}}
                  whileTap={(!isSubmitting && isDirty && selectedPermissions.length > 0) ? { scale: 0.98 } : {}}
                >
                  {isSubmitting ? 'Submitting...' : <><FaSave className="mr-2" />{role ? 'Update Role' : 'Create Role'}</>}
                </motion.button>

                <button
                  type="button"
                  onClick={() => reset()}
                  disabled={!isDirty || isSubmitting}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
              </div>
            </form>
          </FormProvider>
        </motion.div>
      </div>
    </div>
  );
};

export default RolePermissionCreate;