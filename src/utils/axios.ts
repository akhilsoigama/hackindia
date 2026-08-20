import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
  timeout: 10000,
});

// Enhanced error handler
export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return "An unexpected error occurred";
};

// ✅ CORRECT Request Interceptor 
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {

    const cookieToken = Cookies.get('token');
    const directCookie = document.cookie.match(/token=([^;]+)/)?.[1];

    const finalToken = cookieToken || directCookie;
    
    if (finalToken) {
      config.headers.Authorization = `Bearer ${finalToken}`;
    } else {
      delete config.headers.Authorization;
    }

    return config; 
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message = getErrorMessage(error);

    if (status === 401) {
      if (!window.location.pathname.includes('/login')) {
        // toast.error('Authentication failed. Please check your token.');
      }
    } 
    // Handle 403 Forbidden
    else if (status === 403) {
      if (message !== "Insufficient permissions") {
        toast.error(message || 'Access forbidden');
      }
    }
    // Handle other errors
    else if (status && status >= 400 && status !== 401) {
      // toast.error(message || 'Something went wrong');
    }

    return Promise.reject(error);
  }
);

// Enhanced fetcher
export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];
    const res = await axiosInstance.get(url, config);
    return res.data;
  } catch (error: any) {
    const enhancedError = new Error(getErrorMessage(error));
    (enhancedError as any).status = error.response?.status;
    (enhancedError as any).originalError = error;
    throw enhancedError;
  }
};

export const listFetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];
    const res = await axiosInstance.get(url, config);
    return res.data.data || res.data;
  } catch (error) {
    console.error("❌ ListFetcher error:", error);
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
    getAll: "/students",
    details: (id: number) => `/students/${id}`,
    create: "/students",
    update: (id: number) => `/students/${id}`,
    delete: (id: number) => `/students/${id}`,
  },
  assignment: {
    getAll: "/assignments",
    details: (id: number) => `/assignments/${id}`,
    create: "/assignments",
    update: (id: number) => `/assignments/${id}`,
    delete: (id: number) => `/assignments/${id}`,
  },
  quiz: {
    getAll: "/quizzes",
    details: (id: number) => `/quizzes/${id}`,
    create: "/quizzes",
    update: (id: number) => `/quizzes/${id}`,
    delete: (id: number) => `/quizzes/${id}`,
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
  },
  role: {
    getAll: "/roles",
    details: (id: number) => `/roles/${id}`,
    create: "/roles",
    update: (id: number) => `/roles/${id}`,
    delete: (id: number) => `/roles/${id}`,
  },
  translate: {
    translate: "/translate",
  },
  chatbot : {
    send : "/chatbot"
  }
};

export default axiosInstance;