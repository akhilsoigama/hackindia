import { openDB, deleteDB, IDBPDatabase } from "idb";

const DB_NAME = "ruralSpark";
const DB_VERSION = 1.2;

export const USER_STORE = "users";
export const ROLE_STORE = "userRole";
export const PERMISSION = "permissions";
export const OVERVIEW_STORE = "overview";
export const INSTITUTE_CACHE_STORE = "instituteCache";
export const LECTURE_CACHE_STORE = "lecturesCache";
export const FACULTY_CACHE_STORE = "facultiesCache";
export const DEPARTMENT_CACHE_STORE = "departmentsCache";
export const STUDENT_CACHE_STORE = "studentsCache";
export const GOVT_EVENT_CACHE_STORE = "govtEventsCache";
export const INSTITUTE_EVENT_CACHE_STORE = "instituteEventsCache";
export const ASSIGNMENT_CACHE_STORE = "assignmentsCache";
export const ASSIGNMENT_UPLOAD_CACHE_STORE = "assignmentUploadsCache";
export const QUIZ_CACHE_STORE = "quizzesCache";
export const QUIZ_ATTEMPT_CACHE_STORE = "quizAttemptsCache";
export const MATERIAL_CACHE_STORE = "materialsCache";
export const FACULTY_LEAVE_CACHE_STORE = "facultyLeavesCache";
export const STUDENT_QUERY_CACHE_STORE = "studentQueriesCache";
export const TRANSLATION_CACHE_STORE = "translationCache";
export const PROGRESS_CACHE_STORE = "progressCache";
export const CLOUDINARY_CACHE_STORE = "cloudinaryCache";

let dbPromise: Promise<IDBPDatabase> | null = null;

// ✅ Recreate DB (for debugging)
export const recreateDB = async (): Promise<IDBPDatabase | null> => {
  try {
    await deleteDB(DB_NAME);
  } catch (err) {
    // console.warn("⚠️ DB deletion failed:", err);
  }
  dbPromise = null;
  return initDB();
};

export const initDB = async (): Promise<IDBPDatabase | null> => {
  if (typeof window === "undefined") return null;

  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, { 
      upgrade(db) {
        [
          USER_STORE,
          ROLE_STORE,
          PERMISSION,
          OVERVIEW_STORE,
          INSTITUTE_CACHE_STORE,
          LECTURE_CACHE_STORE,
          FACULTY_CACHE_STORE,
          DEPARTMENT_CACHE_STORE,
          STUDENT_CACHE_STORE,
          GOVT_EVENT_CACHE_STORE,
          INSTITUTE_EVENT_CACHE_STORE,
          ASSIGNMENT_CACHE_STORE,
          ASSIGNMENT_UPLOAD_CACHE_STORE,
          QUIZ_CACHE_STORE,
          QUIZ_ATTEMPT_CACHE_STORE,
          MATERIAL_CACHE_STORE,
          FACULTY_LEAVE_CACHE_STORE,
          STUDENT_QUERY_CACHE_STORE,
          TRANSLATION_CACHE_STORE,
          PROGRESS_CACHE_STORE,
          CLOUDINARY_CACHE_STORE,
        ].forEach((storeName) => {
          if (db.objectStoreNames.contains(storeName)) {
            db.deleteObjectStore(storeName);
          }
        });

        db.createObjectStore(USER_STORE, { keyPath: "id" });
        db.createObjectStore(ROLE_STORE, { keyPath: "id" });
        db.createObjectStore(PERMISSION, { keyPath: "id" });
        db.createObjectStore(LECTURE_CACHE_STORE, { keyPath: "key" });
        db.createObjectStore(FACULTY_CACHE_STORE, { keyPath: "key" });
        db.createObjectStore(DEPARTMENT_CACHE_STORE, { keyPath: "key" });
        db.createObjectStore(STUDENT_CACHE_STORE, { keyPath: "key" });
        db.createObjectStore(GOVT_EVENT_CACHE_STORE, { keyPath: "key" });
        db.createObjectStore(INSTITUTE_EVENT_CACHE_STORE, { keyPath: "key" });
        db.createObjectStore(INSTITUTE_CACHE_STORE, { keyPath: "key" });
        db.createObjectStore(ASSIGNMENT_CACHE_STORE, { keyPath: "key" });
        db.createObjectStore(ASSIGNMENT_UPLOAD_CACHE_STORE, { keyPath: "key" });
        db.createObjectStore(QUIZ_CACHE_STORE, { keyPath: "key" });
        db.createObjectStore(QUIZ_ATTEMPT_CACHE_STORE, { keyPath: "key" });
        db.createObjectStore(MATERIAL_CACHE_STORE, { keyPath: "key" });
        db.createObjectStore(FACULTY_LEAVE_CACHE_STORE, { keyPath: "key" });
        db.createObjectStore(STUDENT_QUERY_CACHE_STORE, { keyPath: "key" });
        db.createObjectStore(OVERVIEW_STORE, { keyPath: "key" });
        db.createObjectStore(TRANSLATION_CACHE_STORE, { keyPath: "key" });
        db.createObjectStore(PROGRESS_CACHE_STORE, { keyPath: "key" });
        db.createObjectStore(CLOUDINARY_CACHE_STORE, { keyPath: "key" });
      },
    }).catch((error) => {
      console.error("❌ DB initialization failed:", error);
      dbPromise = null;
      throw error;
    });
  }

  return dbPromise;
};
