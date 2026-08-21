import axiosInstance from '../utils/axios';
import axios from 'axios';
import { toast } from 'sonner';

interface ChatPayload {
  messages: Array<{
    role: string;
    content: string;
  }>;
}



export async function sendChatMessage(payload: ChatPayload) {
  try {
    const res = await axiosInstance.post('/chatbot', payload);
    
    if (res?.status === 200) {
      return res.data;
    }
    return null;
  } catch (err: unknown) {
    console.error('Chatbot API error:', err);

    if (axios.isAxiosError(err) && err.response?.status === 401) {
      toast.error('Please login to use chatbot');
    } else {
      const errorMessage = axios.isAxiosError(err)
        ? (typeof err.response?.data?.message === 'string' ? err.response.data.message : err.message)
        : err instanceof Error
          ? err.message
          : 'Unknown error';
      toast.error('Failed to send message: ' + errorMessage);
    }
    return null;
  }
}