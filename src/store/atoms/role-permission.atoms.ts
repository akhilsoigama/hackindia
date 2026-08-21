import type { IUserRolePermissionItem } from '@/types/Roles';
import { atom } from 'jotai';
import { atomWithStorage, selectAtom, splitAtom } from 'jotai/utils';

export const rolePermissionsAtom = atomWithStorage<IUserRolePermissionItem[]>('lms:role-permissions', []);

export const rolePermissionItemsAtom = splitAtom(rolePermissionsAtom);

export const rolePermissionCountAtom = selectAtom(
  rolePermissionsAtom,
  (rolePermissions) => rolePermissions.length,
);

export const rolePermissionMapAtom = atom((get) => {
  const rolePermissions = get(rolePermissionsAtom);
  return new Map(rolePermissions.map((item) => [item.id, item]));
});
