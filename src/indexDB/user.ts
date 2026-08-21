import { User } from "../types/user";
import { initDB, USER_STORE } from "./DBConnect";

// ✅ Save single user (replace old)
export const setUserDB = async (user: User): Promise<void> => {
  try {
    const db = await initDB();
    if (!db) throw new Error("Database not initialized");

    const tx = db.transaction(USER_STORE, "readwrite");
    const store = tx.objectStore(USER_STORE);
    const sourceUser = user.data ?? user;

    await store.clear();

    const userToSave = {
      id: sourceUser.id || 1,
      email: sourceUser.email ?? "",
      fullName: sourceUser.fullName ?? "",
      userType: sourceUser.userType ?? "student",
      authType: sourceUser.authType ?? "jwt",
      mobile: sourceUser.mobile ?? "",
      instituteId: sourceUser.instituteId ?? null,
      facultyId: sourceUser.facultyId ?? null,
      isEmailVerified: sourceUser.isEmailVerified ?? false,
      isMobileVerified: sourceUser.isMobileVerified ?? false,
      isActive: sourceUser.isActive ?? true,
      institute: sourceUser.institute ?? null,
      faculty: sourceUser.faculty ?? null,
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
