import { IUserRolePermissionItem } from "../types/Roles";
import { initDB, ROLE_STORE } from "./DBConnect";

// Store or update a role permission
export const setRolePermissionDB = async (perm: IUserRolePermissionItem) => {
  const db = await initDB();
  if (!db) return;
  if (!perm?.id) perm.id = Date.now();
  await db.put(ROLE_STORE, perm);
};

export const getRolePermissionsDB = async () => {
  const db = await initDB();
  if (!db) return [];
  return await db.getAll(ROLE_STORE);
};

export const deleteRolePermissionDB = async (id: string | number) => {
  const db = await initDB();
  if (!db) return;
  await db.delete(ROLE_STORE, id);
};

export const clearRolePermissionsDB = async (): Promise<void> => {
  try {
    const db = await initDB();
    const tx = db?.transaction([ROLE_STORE], "readwrite");
    const store = tx?.objectStore(ROLE_STORE);

    await store?.clear();
    await tx?.done;
  } catch (error) {
    console.error("❌ Failed to clear role permissions from IndexedDB:", error);
    throw error;
  }
};
