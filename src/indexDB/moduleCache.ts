import { IDBPDatabase } from "idb";
import {
  ASSIGNMENT_CACHE_STORE,
  ASSIGNMENT_UPLOAD_CACHE_STORE,
  FACULTY_LEAVE_CACHE_STORE,
  DEPARTMENT_CACHE_STORE,
  FACULTY_CACHE_STORE,
  GOVT_EVENT_CACHE_STORE,
  INSTITUTE_EVENT_CACHE_STORE,
  MATERIAL_CACHE_STORE,
  LECTURE_CACHE_STORE,
  QUIZ_ATTEMPT_CACHE_STORE,
  QUIZ_CACHE_STORE,
  STUDENT_QUERY_CACHE_STORE,
  STUDENT_CACHE_STORE,
  initDB,
} from "./DBConnect";

export type ModuleCacheEntry<T = unknown> = {
  key: string;
  data: T;
  updatedAt: number;
};

export type ModuleCacheStoreName =
  | typeof LECTURE_CACHE_STORE
  | typeof FACULTY_CACHE_STORE
  | typeof DEPARTMENT_CACHE_STORE
  | typeof STUDENT_CACHE_STORE
  | typeof GOVT_EVENT_CACHE_STORE
  | typeof INSTITUTE_EVENT_CACHE_STORE
  | typeof ASSIGNMENT_CACHE_STORE
  | typeof ASSIGNMENT_UPLOAD_CACHE_STORE
  | typeof QUIZ_CACHE_STORE
  | typeof QUIZ_ATTEMPT_CACHE_STORE
  | typeof MATERIAL_CACHE_STORE
  | typeof FACULTY_LEAVE_CACHE_STORE
  | typeof STUDENT_QUERY_CACHE_STORE;

const moduleStoreByEndpoint: Array<{ pattern: RegExp; store: ModuleCacheStoreName }> = [
  { pattern: /^\/lectures(?:\/|\?|$)/, store: LECTURE_CACHE_STORE },
  { pattern: /^\/faculty(?:\/|\?|$)/, store: FACULTY_CACHE_STORE },
  { pattern: /^\/departments?(?:\/|\?|$)/, store: DEPARTMENT_CACHE_STORE },
  { pattern: /^\/student(?:\/|\?|$)/, store: STUDENT_CACHE_STORE },
  { pattern: /^\/govtEvent(?:\/|\?|$)/, store: GOVT_EVENT_CACHE_STORE },
  { pattern: /^\/instituteEvent(?:\/|\?|$)/, store: INSTITUTE_EVENT_CACHE_STORE },
  { pattern: /^\/assignments(?:\/|\?|$)/, store: ASSIGNMENT_CACHE_STORE },
  { pattern: /^\/assignment-uploads(?:\/|\?|$)/, store: ASSIGNMENT_UPLOAD_CACHE_STORE },
  { pattern: /^\/materials(?:\/|\?|$)/, store: MATERIAL_CACHE_STORE },
  { pattern: /^\/faculty-leaves(?:\/|\?|$)/, store: FACULTY_LEAVE_CACHE_STORE },
  { pattern: /^\/student-queries(?:\/|\?|$)/, store: STUDENT_QUERY_CACHE_STORE },
  { pattern: /^\/quizzes(?:\/|\?|$)/, store: QUIZ_CACHE_STORE },
  { pattern: /^\/quiz-attempts(?:\/|\?|$)/, store: QUIZ_ATTEMPT_CACHE_STORE },
];

export const getModuleCacheStoreName = (url: string): ModuleCacheStoreName | null => {
  const normalizedUrl = url.split("?")[0];
  const match = moduleStoreByEndpoint.find(({ pattern }) => pattern.test(normalizedUrl));
  return match?.store ?? null;
};

export const buildModuleCacheKey = (url: string, params?: unknown): string => {
  return `${url}::${JSON.stringify(params ?? null)}`;
};

const getStore = async (): Promise<IDBPDatabase | null> => {
  const db = await initDB();
  return db ?? null;
};

export const setModuleCacheDB = async <T>(
  storeName: ModuleCacheStoreName,
  key: string,
  data: T,
): Promise<void> => {
  const db = await getStore();
  if (!db) return;

  await db.put(storeName, {
    key,
    data,
    updatedAt: Date.now(),
  } as ModuleCacheEntry<T>);
};

export const getModuleCacheDB = async <T = unknown>(
  storeName: ModuleCacheStoreName,
  key: string,
): Promise<ModuleCacheEntry<T> | null> => {
  const db = await getStore();
  if (!db) return null;

  const cached = await db.get(storeName, key);
  return (cached as ModuleCacheEntry<T> | undefined) ?? null;
};

export const clearModuleCacheDB = async (storeName: ModuleCacheStoreName): Promise<void> => {
  const db = await getStore();
  if (!db) return;

  await db.clear(storeName);
};
