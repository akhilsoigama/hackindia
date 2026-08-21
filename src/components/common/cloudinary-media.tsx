// components/CloudinaryMedia.tsx
import { useState } from 'react';
import { Translated } from './translator/translator';

interface CloudinaryMediaProps {
  src: string;
  type: 'image' | 'video';
  alt?: string;
  className?: string;
  fallback?: string;
}

export const CloudinaryMedia = ({ 
  src, 
  type, 
  alt = '', 
  className = '', 
  fallback 
}: CloudinaryMediaProps) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Transform Cloudinary URL to avoid COEP issues
  const getOptimizedUrl = (url: string): string => {
    if (!url) return '';
    
    try {
      // For Cloudinary URLs, add transformation parameters
      if (url.includes('cloudinary.com')) {
        const urlObj = new URL(url);
        
        // Remove any existing cache-busting parameters
        const searchParams = new URLSearchParams(urlObj.search);
        searchParams.delete('_');
        
        // Add optimization parameters
        if (type === 'image') {
          searchParams.set('f_auto', 'true');
          searchParams.set('q_auto', 'good');
        } else {
          searchParams.set('fm', 'mp4');
          searchParams.set('f_auto', 'true');
        }
        
        urlObj.search = searchParams.toString();
        return urlObj.toString();
      }
      
      return url;
    } catch {
      return url; // Return original if URL parsing fails
    }
  };

  const optimizedSrc = getOptimizedUrl(src);
  const srcSet = type === 'image'
    ? [480, 768, 1200]
        .map((width) => {
          const separator = optimizedSrc.includes('?') ? '&' : '?';
          return `${optimizedSrc}${separator}w=${width} ${width}w`;
        })
        .join(', ')
    : undefined;

  const handleError = () => {
    console.error(`Failed to load ${type} from:`, optimizedSrc);
    setError(true);
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  if (error && fallback) {
    return (
      <img 
        src={fallback} 
        alt={alt} 
        loading="lazy"
        decoding="async"
        className={className}
      />
    );
  }

  if (type === 'image') {
    return (
      <div className={`relative ${className}`}>
        {loading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <span className="text-gray-400"><Translated text="Loading..." /></span>
          </div>
        )}
        <img
          src={optimizedSrc}
          srcSet={srcSet}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
          alt={alt}
          className={`w-full h-full object-cover ${loading ? 'opacity-0' : 'opacity-100'}`}
          onError={handleError}
          onLoad={handleLoad}
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  // For video
  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <span className="text-gray-400"><Translated text="Loading video..."/></span>
        </div>
      )}
      <video
        src={optimizedSrc}
        className={`w-full h-full object-cover ${loading ? 'opacity-0' : 'opacity-100'}`}
        crossOrigin="anonymous"
        onError={handleError}
        onLoadedData={handleLoad}
        controls
        preload="metadata"
        playsInline
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
      >
        <Translated text="Your browser does not support the video tag."/>
      </video>
    </div>
  );
};