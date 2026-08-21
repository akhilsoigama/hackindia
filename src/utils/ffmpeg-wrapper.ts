// utils/ffmpeg-wrapper.ts
import type { FFmpeg } from '@ffmpeg/ffmpeg';

export class SimpleFFmpegWrapper {
  private static instance: SimpleFFmpegWrapper;
  private ffmpeg: FFmpeg | null = null;
  private isLoaded = false;
  private loadPromise: Promise<void> | null = null;

  static getInstance(): SimpleFFmpegWrapper {
    if (!SimpleFFmpegWrapper.instance) {
      SimpleFFmpegWrapper.instance = new SimpleFFmpegWrapper();
    }
    return SimpleFFmpegWrapper.instance;
  }

  private async doLoad(): Promise<void> {
    const { createFFmpeg } = await import('@ffmpeg/ffmpeg');
    const baseUrl = window.location.origin;
    const ffmpeg = createFFmpeg({
      log: false,
      corePath: `${baseUrl}/ffmpeg/ffmpeg-core.js`,
      progress: () => { }, // No progress for now
    });
    await ffmpeg.load();
    this.ffmpeg = ffmpeg;
    this.isLoaded = true;
  }

  async load(): Promise<void> {
    if (this.isLoaded) return;

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = this.doLoad();

    return this.loadPromise;
  }

  async compressVideo(file: File): Promise<File> {
    if (!this.isLoaded) {
      await this.load();
    }

    const ffmpeg = this.ffmpeg;
    if (!ffmpeg) {
      throw new Error('FFmpeg is not initialized');
    }

    // Write file to FFmpeg's virtual file system
    const inputData = await file.arrayBuffer();
    ffmpeg.FS('writeFile', 'input.mp4', new Uint8Array(inputData));

    // Simple compression settings
    await ffmpeg.run(
      '-i', 'input.mp4',
      '-c:v', 'libx264',
      '-crf', '28',
      '-preset', 'medium',
      '-vf', 'scale=720:-2',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-y',
      'output.mp4'
    );

    // Read the compressed file
    const outputData = ffmpeg.FS('readFile', 'output.mp4');
    if (!(outputData instanceof Uint8Array)) {
      throw new Error('FFmpeg returned invalid output data');
    }

    // Cleanup
    ffmpeg.FS('unlink', 'input.mp4');
    ffmpeg.FS('unlink', 'output.mp4');

    const blob = new Blob([outputData.buffer], { type: 'video/mp4' });
    return new File([blob], `compressed_${file.name}`, { type: 'video/mp4' });
  }

  isSupported(): boolean {
    // Check if we're in a secure context
    return window.isSecureContext ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';
  }
}