import { openDB, deleteDB, IDBPDatabase } from "idb";

const DB_NAME = "lms_db";
const DB_VERSION = 27;

export const USER_STORE = "users";
export const ROLE_STORE = "userRolePermissions";
export const PERMISSION = "permissions";

let dbPromise: Promise<IDBPDatabase> | null = null;

// ✅ Recreate DB (for debugging)
export const recreateDB = async (): Promise<IDBPDatabase | null> => {
  try {
    await deleteDB(DB_NAME);
    console.log("🗑️ Database deleted successfully");
  } catch (err) {
    console.warn("⚠️ DB deletion failed:", err);
  }
  dbPromise = null;
  return initDB();
};

// ✅ Initialize DB
export const initDB = async (): Promise<IDBPDatabase | null> => {
  if (typeof window === "undefined") return null;

  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion) {
        console.log(`🔄 Upgrading DB from v${oldVersion} → v${newVersion}`);

        // Remove old object stores if they exist
        [USER_STORE, ROLE_STORE, PERMISSION].forEach((storeName) => {
          if (db.objectStoreNames.contains(storeName)) {
            db.deleteObjectStore(storeName);
          }
        });

        // Create object stores with keyPath 'id'
        db.createObjectStore(USER_STORE, { keyPath: "id" });
        db.createObjectStore(ROLE_STORE, { keyPath: "id" });
        db.createObjectStore(PERMISSION, { keyPath: "id" });

        console.log("✅ New object stores created successfully");
      },
    }).catch((error) => {
      console.error("❌ DB initialization failed:", error);
      dbPromise = null;
      throw error;
    });
  }

  return dbPromise;
};
