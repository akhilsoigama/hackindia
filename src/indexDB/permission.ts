import { initDB, PERMISSION} from "./DBConnect";
import { Permission } from "../types/Permissions";

export const setPermissionDB = async (perm: Permission) => {
  const db = await initDB();
  if (!db) return;

  if (!perm.id) perm.id = Date.now(); 
  await db.put(PERMISSION, perm);
};

// Get all permissions from IndexedDB
export const getPermissionsDB = async (): Promise<Permission[]> => {
  const db = await initDB();
  if (!db) return [];
  return await db.getAll(PERMISSION);
};

// Delete a permission from IndexedDB
export const deletePermissionDB = async (id: number) => {
  const db = await initDB();
  if (!db) return;
  await db.delete(PERMISSION, id);
};

// Clear all permissions
export const clearPermissionsDB = async () => {
  const db = await initDB();
  if (!db) return;
  await db.clear(PERMISSION);
};
