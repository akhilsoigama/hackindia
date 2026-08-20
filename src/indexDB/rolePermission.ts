import { IUserRolePermissionItem } from "../types/Roles";
import { initDB, ROLE_STORE } from "./DBConnect";

// Store or update a role permission
export const setRolePermissionDB = async (perm: IUserRolePermissionItem) => {
  const db = await initDB();
  if (!db) return;
  if (!perm?.id) perm.id = Date.now(); // fallback id
  await db.put(ROLE_STORE, perm);
};

// Get all role permissions
export const getRolePermissionsDB = async () => {
  const db = await initDB();
  if (!db) return [];
  return await db.getAll(ROLE_STORE);
};

// Delete a role permission
export const deleteRolePermissionDB = async (id: string | number) => {
  const db = await initDB();
  if (!db) return;
  await db.delete(ROLE_STORE, id);
};

// Clear all role permissions
export const clearRolePermissionsDB = async () => {
  const db = await initDB();
  if (!db) return;
  await db.clear(ROLE_STORE);
};
