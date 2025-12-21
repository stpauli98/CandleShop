import { useState, useEffect, useCallback, useRef } from 'react';
import type { PreloaderState, PreloadProgress } from '@/types/frameSequence';

const DESKTOP_FRAME_COUNT = 192;
const MOBILE_FRAME_COUNT = 153;
const CRITICAL_FRAMES = 10;
const CHUNK_SIZE = 20;

// Generate frame URLs based on device type
const generateFrameUrls = (isMobile: boolean): string[] => {
  const frameCount = isMobile ? MOBILE_FRAME_COUNT : DESKTOP_FRAME_COUNT;
  const folder = isMobile ? 'ezgif-split (1)' : 'ezgif-split';

  return Array.from({ length: frameCount }, (_, i) => {
    const paddedIndex = String(i).padStart(3, '0');
    return new URL(
      `../../../assets/${folder}/frame_${paddedIndex}_delay-0.04s.webp`,
      import.meta.url
    ).href;
  });
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load: ${src}`));
    img.src = src;
  });
};

const loadImageWithRetry = async (
  src: string,
  retries = 3
): Promise<HTMLImageElement> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await loadImage(src);
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw new Error(`Failed to load after ${retries} retries: ${src}`);
};

export function useFramePreloader(isMobile: boolean): PreloaderState {
  const frameCount = isMobile ? MOBILE_FRAME_COUNT : DESKTOP_FRAME_COUNT;
  const progressiveFrames = isMobile ? 40 : 50;

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [progress, setProgress] = useState<PreloadProgress>({
    loaded: 0,
    total: frameCount,
    percentage: 0,
    phase: 'critical',
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mountedRef = useRef(true);
  const loadedImagesRef = useRef<HTMLImageElement[]>(
    new Array(frameCount).fill(null)
  );

  const updateProgress = useCallback(
    (loaded: number, phase: PreloadProgress['phase']) => {
      if (!mountedRef.current) return;
      setProgress({
        loaded,
        total: frameCount,
        percentage: Math.round((loaded / frameCount) * 100),
        phase,
      });
    },
    [frameCount]
  );

  useEffect(() => {
    mountedRef.current = true;
    loadedImagesRef.current = new Array(frameCount).fill(null);
    const frameUrls = generateFrameUrls(isMobile);

    const loadFrames = async () => {
      try {
        // Phase 1: Critical frames (0-9) - block until loaded
        const criticalPromises = frameUrls
          .slice(0, CRITICAL_FRAMES)
          .map((url, i) =>
            loadImageWithRetry(url).then((img) => {
              loadedImagesRef.current[i] = img;
              return img;
            })
          );

        await Promise.all(criticalPromises);

        if (!mountedRef.current) return;
        updateProgress(CRITICAL_FRAMES, 'progressive');
        setIsReady(true);
        setImages([...loadedImagesRef.current]);

        // Phase 2: Progressive frames (10-39 mobile, 10-49 desktop)
        let loadedCount = CRITICAL_FRAMES;

        for (let i = CRITICAL_FRAMES; i < progressiveFrames; i++) {
          if (!mountedRef.current) return;
          const img = await loadImageWithRetry(frameUrls[i]);
          loadedImagesRef.current[i] = img;
          loadedCount++;

          if (loadedCount % 5 === 0) {
            updateProgress(loadedCount, 'progressive');
            setImages([...loadedImagesRef.current]);
          }
        }

        if (!mountedRef.current) return;
        updateProgress(progressiveFrames, 'background');
        setImages([...loadedImagesRef.current]);

        // Phase 3: Background frames - chunked loading
        const remainingUrls = frameUrls.slice(progressiveFrames);

        for (let chunk = 0; chunk < remainingUrls.length; chunk += CHUNK_SIZE) {
          if (!mountedRef.current) return;

          const chunkUrls = remainingUrls.slice(chunk, chunk + CHUNK_SIZE);
          const chunkPromises = chunkUrls.map((url, idx) => {
            const frameIndex = progressiveFrames + chunk + idx;
            return loadImageWithRetry(url).then((img) => {
              loadedImagesRef.current[frameIndex] = img;
              return img;
            });
          });

          // Use requestIdleCallback for non-blocking load
          if ('requestIdleCallback' in window) {
            await new Promise<void>((resolve) => {
              requestIdleCallback(async () => {
                await Promise.all(chunkPromises);
                resolve();
              });
            });
          } else {
            await Promise.all(chunkPromises);
          }

          loadedCount = progressiveFrames + chunk + chunkUrls.length;

          if (!mountedRef.current) return;
          updateProgress(loadedCount, 'background');
          setImages([...loadedImagesRef.current]);
        }

        if (!mountedRef.current) return;
        updateProgress(frameCount, 'complete');
        setIsLoaded(true);
        setImages([...loadedImagesRef.current]);
      } catch (err) {
        if (!mountedRef.current) return;
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    };

    loadFrames();

    return () => {
      mountedRef.current = false;
    };
  }, [updateProgress, isMobile, frameCount, progressiveFrames]);

  return { images, progress, isLoaded, isReady, error };
}
