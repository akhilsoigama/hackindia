// utils/errorHandler.ts
import axios from "axios";
import { toast } from "sonner";

// Map HTTP status codes to user-friendly messages
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || "Something went wrong";
    switch (status) {
      case 401:
        return "Authentication failed. Please log in again.";
      case 403:
        return "You do not have permission to access this resource.";
      case 404:
        return "Resource not found.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return message;
    }
  }
  return "An unexpected error occurred.";
}

// Validate JWT token format and expiration
export function validateToken(token: string | undefined): boolean {
  if (!token) {
    console.warn("No token found in cookies");
    return false;
  }

  // Basic JWT format check (three parts separated by dots)
  if (!token.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)) {
    console.warn("Invalid JWT format");
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      console.warn("Token expired:", payload.exp);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Failed to decode token:", e);
    return false;
  }
}

// Handle token refresh (assuming backend has a /refresh endpoint)
export async function refreshToken(): Promise<boolean> {
  try {
    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/refresh`,
      {},
      { withCredentials: true }
    );
    return true;
  } catch (error) {
    console.error("Token refresh failed:", error);
    toast.error("Session expired. Please log in again.");
    return false;
  }
}