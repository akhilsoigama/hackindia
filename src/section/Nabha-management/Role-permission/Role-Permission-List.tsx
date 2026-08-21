// src/pages/role-management/RolePermissionList.tsx
import { useMemo, useCallback } from 'react';
import { FaUserShield, FaKey, FaCrown, FaUserEdit, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { IUserRolePermissionItem } from '../../../types/Roles';
import { useGetUserRolePermissions } from '../../../action/RollPermission';
import { usePermissions } from '../../../action/permission';
import CommonDataList, { ModalField } from '../../../components/common/commanDataList';
import { useTheme } from '@/theme/AppThemeProvider';import { Translated } from '../../../components/common/translator/translator';

interface TransformedRole {
  id: string;
  roleName: string;
  roleDescription: string;
  roleKey?: string;
  permissions: Record<string, boolean>;
  createdAt: string;
  isDefault: boolean;
}

interface RolePermissionListProps {
  rolePermissions: IUserRolePermissionItem[];
  onEdit?: (rolePermission: IUserRolePermissionItem) => void;
  onDelete?: (id: number) => void;
  onCreate?: () => void;
  isLoading?: boolean;
}

const transformApiDataToRoles = (apiData: IUserRolePermissionItem[]): TransformedRole[] => {
  return apiData.map(item => {
    let permissionsObj: Record<string, boolean> = {};

    try {
      if (Array.isArray(item.permissions)) {
        item.permissions.forEach((perm) => {
          if (perm.permissionKey) permissionsObj[perm.permissionKey] = true;
        });
      } else if (typeof item.permissions === 'string') {
        permissionsObj = JSON.parse(item.permissions);
      } else if (typeof item.permissions === 'object' && item.permissions !== null) {
        permissionsObj = item.permissions;
      }
    } catch (e) {
      console.error('Error parsing permissions:', e);
    }

    return {
      id: item.id?.toString() ?? '',
      roleName: item.roleName ?? '',
      roleDescription: item.roleDescription ?? '',
      permissions: permissionsObj,
      roleKey: item.roleKey ?? '',
      createdAt: item.createdAt
        ? new Date(item.createdAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      isDefault: item.isDefault ?? false,
    };
  });
};

const RolePermissionList = ({
  rolePermissions,
  onEdit,
  onDelete,
  onCreate,
  isLoading = false,
}: RolePermissionListProps) => {
  const navigate = useNavigate();
  const { userRolePermissions, isLoading: rolesLoading } = useGetUserRolePermissions();
  const { permissions, isLoading: permsLoading } = usePermissions();

  const roles = useMemo(() => transformApiDataToRoles(userRolePermissions ?? []), [userRolePermissions]);

  const formatPermissionName = useCallback((key: string) => {
    const p = permissions?.find(p => p.permissionKey === key);
    if (p) return p.permissionName;
    return key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }, [permissions]);

  const handleEdit = useCallback((role: TransformedRole) => {
    const originalRole = rolePermissions.find(r => r.id.toString() === role.id);
    if (originalRole) {
      onEdit?.(originalRole);
    }
  }, [onEdit, rolePermissions]);

  const handleDelete = useCallback((id: string) => {
    onDelete?.(parseInt(id));
  }, [onDelete]);

  const handleCreate = useCallback(() => {
    if (onCreate) onCreate();
    else navigate('/dashboard/institute-management/rolePermission/create');
  }, [onCreate, navigate]);

  const columns = useMemo(() => [
    { header: 'Role Name', accessor: 'roleName' as keyof TransformedRole, sortable: true, width: '25%' },
    { header: 'Description', accessor: 'roleDescription' as keyof TransformedRole, width: '45%' },
    { header: 'Role key', accessor: 'roleKey' as keyof TransformedRole, width: '15%' },
    { header: 'Created Date', accessor: 'createdAt' as keyof TransformedRole, sortable: true, width: '15%' },
  ], []);

  // Theme-aware modal fields
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const viewModalFields: ModalField<TransformedRole>[] = useMemo(() => [
    {
      label: 'Role Name',
      key: 'roleName',
      type: 'text' as const,
      disabled: true,
    },
    {
      label: 'Description',
      key: 'roleDescription',
      type: 'textarea' as const,
      disabled: true,
    },
    {
      label: 'Role Type',
      key: 'isDefault',
      type: 'custom' as const,
      disabled: true,
      render: (val) => (
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors duration-200 ${val
            ? isDark
              ? 'bg-green-900/40 border-green-700 text-green-200'
              : 'bg-green-100 border-green-300 text-green-800'
            : isDark
              ? 'bg-indigo-900/40 border-indigo-700 text-indigo-200'
              : 'bg-indigo-100 border-indigo-300 text-indigo-800'
            }`}
        >
          {val ? <FaCrown size={14} /> : <FaUserEdit size={14} />}
          {val ? 'System Default Role' : 'Custom Role'}
        </div>
      ),
    },
    {
      label: 'Created Date',
      key: 'createdAt',
      type: 'custom' as const,
      disabled: true,
      render: (val) => (
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
        >
          <FaCalendarAlt size={14} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
          <span>
            {new Date(typeof val === 'string' ? val : '').toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      ),
    },
    {
      label: 'Permissions',
      key: 'permissions',
      type: 'custom' as const,
      disabled: true,
      render: (perms) => {
        const permissionMap =
          typeof perms === 'object' && perms !== null
            ? (perms as Record<string, boolean>)
            : {};
        const enabled = Object.entries(permissionMap)
          .filter(([, v]) => v)
          .map(([k]) => formatPermissionName(k));

        return (
          <div
            className={`rounded-xl border overflow-hidden scrollbar-hide ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
          >
            <div
              className={`px-4 py-3 flex items-center justify-between ${isDark
                ? 'bg-gray-900 text-white'
                : 'bg-linear-to-r from-indigo-500 via-indigo-400 to-indigo-500 text-white'}`}
            >
              <span className="font-semibold text-sm">Enabled Permissions</span>
              <span className={`rounded-md px-2 py-1 text-xs font-semibold ${isDark ? 'bg-white/10' : 'bg-white/20'}`}>{enabled.length} total</span>
            </div>
            <div className="max-h-72 overflow-y-auto p-4 scrollbar-hide">
              {enabled.length > 0 ? (
                <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                  {enabled.map((p, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md border text-xs font-medium transition-colors duration-200 ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'}`}
                    >
                      <span className="w-2 h-2 rounded-full mr-2" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}></span>
                      {p}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 px-5 text-slate-400">
                  <FaKey size={32} className="mx-auto mb-3 opacity-50" />
                  <div className="text-sm font-medium"><Translated text="No permissions enabled for this role" /></div>
                </div>
              )}
            </div>
          </div>
        );
      },
    },
  ], [formatPermissionName, isDark]);
  return (
    <CommonDataList<TransformedRole>
      data={roles}
      title="Role Management"
      subtitle="Manage system roles, permissions, and access controls"

      columns={columns}

      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}

      viewModalFields={viewModalFields}

      icon={<FaUserShield />}
      createButtonText="Create Role"
      searchPlaceholder="Search roles, descriptions..."
      emptyMessage="No roles configured"
      emptyDescription="Start by creating your first custom role with specific permissions"
      enableSearch={true}
      enableStatusFilter={true}
      statusFilterKey="isDefault"
      isLoading={isLoading || rolesLoading || permsLoading}
    />
  );
};

export default RolePermissionList;