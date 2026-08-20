import { User } from "../types/user";
import { initDB, USER_STORE } from "./DBConnect";

// ✅ Save single user (replace old)
export const setUserDB = async (user: User): Promise<void> => {
  try {
    const db = await initDB();
    if (!db) throw new Error("Database not initialized");

    const tx = db.transaction(USER_STORE, "readwrite");
    const store = tx.objectStore(USER_STORE);

    await store.clear();

    const userToSave = {
      id: user.data.id || 1,
      email: user.data.email ?? "",
      fullName: user.data.fullName ?? "",
      userType: user.data.userType ?? "student",
      authType: user.data.authType ?? "jwt",
      mobile: user.data.mobile ?? "",
      instituteId: user.data.instituteId ?? null,
      facultyId: user.data.facultyId ?? null,
      isEmailVerified: user.data.isEmailVerified ?? false,
      isMobileVerified: user.data.isMobileVerified ?? false,
      isActive: user.data.isActive ?? true,
      institute: user.data.institute ?? null,
      faculty: user.data.faculty ?? null,
      createdAt: user.createdAt ?? null,
      updatedAt: user.updatedAt ?? null,
    };

    await store.put(userToSave);
    await tx.done;

  } catch (error) {
    console.error("❌ setUserDB error:", error);
    throw error;
  }
};

// ✅ Get current user
export const getUserDB = async (): Promise<User | null> => {
  try {
    const db = await initDB();
    if (!db) return null;

    const tx = db.transaction(USER_STORE, "readonly");
    const store = tx.objectStore(USER_STORE);

    const users = await store.getAll();
    await tx.done;

    return users[0] || null;
  } catch (error) {
    console.error("❌ getUserDB error:", error);
    return null;
  }
};

// ✅ Clear all users
export const clearUserDB = async (): Promise<void> => {
  try {
    const db = await initDB();
    if (!db) return;

    const tx = db.transaction(USER_STORE, "readwrite");
    await tx.objectStore(USER_STORE).clear();
    await tx.done;

    console.log("✅ All users cleared from IndexedDB");
  } catch (error) {
    console.error("❌ clearUserDB error:", error);
    throw error;
  }
};
