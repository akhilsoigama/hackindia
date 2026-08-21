import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDateForInput(dateString: string | undefined | null): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

export function formatDateToISO(dateString: string | undefined | null): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toISOString();
  } catch (error) {
    console.error('Error converting date to ISO:', error);
    return '';
  }
}

export function formatTimeForInput(timeString: string | undefined | null): string {
  if (!timeString) return '';
  
  if (timeString.includes('T')) {
    const date = new Date(timeString);
    if (!isNaN(date.getTime())) {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    }
  }
  
  return timeString;
}

export function cleanCloudinaryUrl(url: string | undefined | null): string {
  if (!url) return '';
  
  try {
    if (url.includes('cloudinary.com') && url.includes('?_=')) {
      return url.split('?_=')[0];
    }
    
    return url;
  } catch (error) {
    console.error('Error cleaning Cloudinary URL:', error);
    return url || '';
  }
}
