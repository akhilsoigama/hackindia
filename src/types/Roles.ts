export type IUserRolePermissionItem = {
  id: number;
  roleName: string;
  roleDescription: string;
  roleKey: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  permissions: string;
  isAdmin?: boolean;
  _syncedAt?: number;
  _isFresh?: boolean;
};

export type ICreateUserRolePermission = {
  roleName: string;
  roleDescription?: string | null;
  roleKey: string;
  isDefault?: boolean;
  permissionIds: number[];
};

export type IUpdateUserRolePermission = {
  id?:number;
  roleName?: string;
  roleDescription?: string;
  roleKey?: string;
  isDefault?: boolean;
  permissionIds?: number[];
};
