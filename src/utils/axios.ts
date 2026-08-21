import axios, { AxiosRequestConfig } from "axios";
import { toast } from "sonner";
import {
  buildModuleCacheKey,
  getModuleCacheDB,
  getModuleCacheStoreName,
  setModuleCacheDB,
  type ModuleCacheStoreName,
} from "../indexDB/moduleCache";

const API_CACHE_TTL_MS = 1000 * 60 * 60 * 24;

const shouldPersistCacheData = (payload: unknown): boolean => {
  if (payload === null || payload === undefined) return false;

  if (typeof payload !== "object") return true;

  const candidate = payload as { status?: boolean; data?: unknown };

  if (candidate.status === false && (candidate.data === null || candidate.data === undefined)) {
    return false;
  }

  return true;
};

const getCacheMeta = (url: string, config?: AxiosRequestConfig): { storeName: ModuleCacheStoreName | null; key: string } => {
  const fullUrl = config?.params ? `${url}?${new URLSearchParams(config.params as Record<string, string>).toString()}` : url;
  return {
    storeName: getModuleCacheStoreName(fullUrl),
    key: buildModuleCacheKey(fullUrl, config?.params ?? null),
  };
};

const readFromModuleCache = async <T>(storeName: ModuleCacheStoreName, key: string): Promise<T | null> => {
  try {
    const cached = await getModuleCacheDB<T>(storeName, key);
    if (!cached) return null;

    if (Date.now() - cached.updatedAt > API_CACHE_TTL_MS) {
      return null;
    }

    return cached.data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("Failed to read API cache:", error);
    }
    return null;
  }
};

const writeToModuleCache = async <T>(storeName: ModuleCacheStoreName, key: string, data: T): Promise<void> => {
  try {
    await setModuleCacheDB(storeName, key, data);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("Failed to write API cache:", error);
    }
  }
};

export const getWithCache = async <T = unknown>(
  args: string | [string, AxiosRequestConfig],
): Promise<T> => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const { storeName, key } = getCacheMeta(url, config);

  try {
    const res = await axiosInstance.get<T>(url, config);
    if (storeName && shouldPersistCacheData(res.data)) {
      await writeToModuleCache(storeName, key, res.data);
    }
    return res.data;
  } catch (error) {
    if (storeName) {
      const cachedData = await readFromModuleCache<T>(storeName, key);
      if (cachedData !== null) {
        return cachedData;
      }
    }
    throw error;
  }
};

// Base URL
const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

axiosInstance.interceptors.request.use((config) => {
  const excludeAuthPaths = ['/login', '/logout', '/translate','/api/contact'];
  const isExcludedPath = excludeAuthPaths.some(path => config.url?.includes(path));
  
  if (typeof window !== 'undefined' && !isExcludedPath) {
    const authToken =
      window.localStorage.getItem('lms:authToken') ||
      window.localStorage.getItem('authToken') ||
      window.localStorage.getItem('token');
    if (authToken) {
      config.headers = config.headers ?? {};
      if (!('Authorization' in config.headers) && !('authorization' in config.headers)) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
    }
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || "Something went wrong";

    if (status === 401) {
      if (!window.location.pathname.includes("/login")) {
        toast.error("Session expired. Logging you out...");
      }
    } else if (status === 403) {
      toast.error("Access denied");
    } else if (status >= 400) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export const fetcher = async <T = unknown>(
  args: string | [string, AxiosRequestConfig],
): Promise<T> => {
  return getWithCache<T>(args);
};

export const listFetcher = async <T = unknown>(
  args: string | [string, AxiosRequestConfig],
): Promise<T> => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const { storeName, key } = getCacheMeta(url, config);

  try {
    const res = await axiosInstance.get(url, config);
    const payload = (res.data.data || res.data) as T;
    if (storeName && shouldPersistCacheData(res.data) && shouldPersistCacheData(payload)) {
      await writeToModuleCache(storeName, key, payload);
    }
    return payload;
  } catch (error) {
    if (storeName) {
      const cachedData = await readFromModuleCache<T>(storeName, key);
      if (cachedData !== null) {
        return cachedData;
      }
    }
    throw error;
  }
};

// API endpoints
export const endpoints = {
  auth: {
    me: "/profile",
    signIn: "/login",
    logout: "/logout",
    refresh: "/refresh",
  },
  permission: {
    getAll: "/permissions",
  },
  lecture: {
    getAll: "/lectures",
    details: (id: number) => `/lectures/${id}`,
    create: "/lectures",
    update: (id: number) => `/lectures/${id}`,
    delete: (id: number) => `/lectures/${id}`,
  },
  faculty: {
    getAll: "/faculty",
    details: (id: number) => `/faculty/${id}`,
    create: "/faculty",
    update: (id: number) => `/faculty/${id}`,
    delete: (id: number) => `/faculty/${id}`,
  },
  material: {
    getAll: "/materials",
    details: (id: number) => `/materials/${id}`,
    create: "/materials",
    update: (id: number) => `/materials/${id}`,
    delete: (id: number) => `/materials/${id}`,
  },
  student: {
    getAll: "/student",
    details: (id: number) => `/student/${id}`,
    create: "/student",
    update: (id: number) => `/student/${id}`,
    delete: (id: number) => `/student/${id}`,
  },
  assignment: {
    getAll: "/assignments",
    details: (id: number) => `/assignments/${id}`,
    create: "/assignments",
    update: (id: number) => `/assignments/${id}`,
    delete: (id: number) => `/assignments/${id}`,
  },
  assignmentUpload: {
    getAll: "/assignment-uploads",
    details: (id: number) => `/assignment-uploads/${id}`,
    create: "/assignment-uploads",
    update: (id: number) => `/assignment-uploads/${id}`,
    delete: (id: number) => `/assignment-uploads/${id}`,
  },
  quiz: {
    getAll: "/quizzes",
    details: (id: number) => `/quizzes/${id}`,
    create: "/quizzes",
    update: (id: number) => `/quizzes/${id}`,
    delete: (id: number) => `/quizzes/${id}`,
  },
  quizAttempt: {
    getAll: "/quiz-attempts",
    details: (id: number) => `/quiz-attempts/${id}`,
    create: "/quiz-attempts",
    update: (id: number) => `/quiz-attempts/${id}`,
    delete: (id: number) => `/quiz-attempts/${id}`,
  },
  department: {
    getAll: "/departments",
    details: (id: number) => `/departments/${id}`,
    create: "/departments",
    update: (id: number) => `/departments/${id}`,
    delete: (id: number) => `/departments/${id}`,
  },
  institute: {
    getAll: "/institutes",
    details: (id: number) => `/institutes/${id}`,
    create: "/institutes",
    update: (id: number) => `/institutes/${id}`,
    delete: (id: number) => `/institutes/${id}`,
    overview: "/institutes/overview",
  },
  role: {
    getAll: "/roles",
    details: (id: number) => `/roles/${id}`,
    create: "/roles",
    update: (id: number) => `/roles/${id}`,
    delete: (id: number) => `/roles/${id}`,
  },
  govtEvent: {
    getAll: "/govtEvent",
    details: (id: number) => `/govtEvent/${id}`,
    create: "/govtEvent",
    update: (id: number) => `/govtEvent/${id}`,
    delete: (id: number) => `/govtEvent/${id}`
  },
  instituteEvent: {
    getAll: "/instituteEvent",
    details: (id: number) => `/instituteEvent/${id}`,
    create: "/instituteEvent",
    update: (id: number) => `/instituteEvent/${id}`,
    delete: (id: number) => `/instituteEvent/${id}`,
  },
  chatbot: {
    send: "/chatbot"
  },
  facultyLeave: {
    getAll: "/faculty-leaves",
    details: (id: number) => `/faculty-leaves/${id}`,
    create: "/faculty-leaves",
    update: (id: number) => `/faculty-leaves/${id}`,
    delete: (id: number) => `/faculty-leaves/${id}`,
    approve: (id: number) => `/faculty-leaves/${id}/approve`,
    reject: (id: number) => `/faculty-leaves/${id}/reject`,
  },
  studentQuery: {
    getAll: '/student-queries',
    details: (id: number) => `/student-queries/${id}`,
    create: '/student-queries',
    update: (id: number) => `/student-queries/${id}`,
    delete: (id: number) => `/student-queries/${id}`,
    progressReport: '/student-queries/progress-report',
  },
  onlineLibrary: {
    search: '/api/online-library/search',
    metadata: (identifier: string) => `/api/online-library/metadata/${identifier}`,
  },
  contact: {
    send: "/api/contact",
  },
};

export default axiosInstance;