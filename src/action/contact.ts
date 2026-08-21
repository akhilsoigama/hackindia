import { toast } from "sonner";
import axiosInstance, { endpoints } from "../utils/axios";

export interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

const getApiErrorMessage = (err: unknown, fallback: string) => {
  if (typeof err === "object" && err !== null && "response" in err) {
    const response = (
      err as {
        response?: {
          data?: {
            message?: string;
            messages?: string;
          };
        };
      }
    ).response;

    return response?.data?.message || response?.data?.messages || fallback;
  }

  return fallback;
};

export async function sendContactMessage(payload: ContactPayload) {
  try {
    const res = await axiosInstance.post(endpoints.contact.send, payload);

    toast.success(res.data.message || "Message sent successfully");

    return true;
  } catch (err) {
    toast.error(
      getApiErrorMessage(err, "Failed to send message")
    );

    return false;
  }
}