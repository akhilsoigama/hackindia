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
};

export type ICreateUserRolePermission = {
  roleName: string;
  roleDescription?: string;
  roleKey: string;
  isDefault?: boolean;
  permissionIds: number[];
};

export type IUpdateUserRolePermission = {
  roleName?: string;
  roleDescription?: string;
  roleKey?: string;
  isDefault?: boolean;
  permissionIds?: number[];
};
