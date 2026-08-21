// utils/ffmpeg-safe.ts
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import type { FFmpeg } from '@ffmpeg/ffmpeg';

// Use a version of FFmpeg that doesn't require SharedArrayBuffer
class SafeFFmpeg {
  private ffmpeg: FFmpeg | null = null;
  private isLoaded = false;
  private loadingPromise: Promise<void> | null = null;

  private async doLoad(): Promise<void> {
    // SharedArrayBuffer is required by many wasm builds for high-performance
    // multithreading. If it's not available in the current browsing context
    // the FFmpeg core may fail to initialize. Provide a clear error with
    // suggested fixes instead of letting the core crash with a cryptic
    // ReferenceError.
    if (!('SharedArrayBuffer' in globalThis)) {
      const msg = `SharedArrayBuffer is not available in this browsing context.\n` +
        `FFmpeg WASM requires cross-origin isolation (COOP + COEP) to enable SharedArrayBuffer.\n` +
        `To fix locally, serve the app with the following response headers:\n` +
        `  Cross-Origin-Opener-Policy: same-origin\n` +
        `  Cross-Origin-Embedder-Policy: require-corp\n` +
        `Or use a FFmpeg core build that does not require SharedArrayBuffer, or run compression server-side.`;
      console.error('FFmpeg load failed:', msg);
      throw new Error(msg);
    }

    try {
      const baseUrl = window.location.origin;
      const ffmpeg = createFFmpeg({
        log: false,
        corePath: `${baseUrl}/ffmpeg/ffmpeg-core.js`,
      });
      await ffmpeg.load();
      this.ffmpeg = ffmpeg;
      this.isLoaded = true;
    } catch (error) {
      console.error('FFmpeg load failed:', error);
      throw error;
    }
  }

  async load() {
    if (this.isLoaded) return;

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = this.doLoad();

    return this.loadingPromise;
  }

  async compressVideo(file: File, onProgress?: (progress: number) => void): Promise<File> {
    if (!this.isLoaded) {
      await this.load();
    }

    const ffmpeg = this.ffmpeg;
    if (!ffmpeg) {
      throw new Error('FFmpeg is not initialized');
    }

    try {
      // Write file to memory
      ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(file));

      if (onProgress) onProgress(30);

      await ffmpeg.run(
        '-i', 'input.mp4',
        '-c:v', 'libx264',
        '-crf', '28',
        '-preset', 'medium',
        '-vf', 'scale=720:-2', // Scale to 720p max
        '-movflags', '+faststart', // Optimize for web
        '-c:a', 'aac',
        '-b:a', '128k',
        '-y', // Overwrite output
        'output.mp4'
      );

      if (onProgress) onProgress(80);

      // Read the result
      const data = ffmpeg.FS('readFile', 'output.mp4');
      if (!(data instanceof Uint8Array)) {
        throw new Error('FFmpeg returned invalid output data');
      }

      // Clean up
      ffmpeg.FS('unlink', 'input.mp4');
      ffmpeg.FS('unlink', 'output.mp4');

      if (onProgress) onProgress(100);

      const blob = new Blob([data.buffer], { type: 'video/mp4' });
      return new File([blob], `compressed_${file.name}`, {
        type: 'video/mp4',
        lastModified: Date.now()
      });
    } catch (error) {
      console.error('Compression error:', error);
      throw error;
    }
  }

  async isSupported(): Promise<boolean> {
    try {
      await this.load();
      return true;
    } catch (error) {
      console.log('FFmpeg not supported:', error);
      return false;
    }
  }
}

export const safeFFmpeg = new SafeFFmpeg();