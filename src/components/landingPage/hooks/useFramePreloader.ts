import { useEffect, useCallback, useRef, useMemo, useReducer } from 'react';
import type { PreloaderState, PreloadProgress } from '@/types/frameSequence';

const DESKTOP_FRAME_COUNT = 192;
const MOBILE_FRAME_COUNT = 153;
const CRITICAL_FRAMES = 100;
const CHUNK_SIZE = 20;

// Generate frame URLs based on device type
const generateFrameUrls = (isMobile: boolean): string[] => {
  const frameCount = isMobile ? MOBILE_FRAME_COUNT : DESKTOP_FRAME_COUNT;
  const folder = isMobile ? 'mobile' : 'desktop';

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

// State and action types for reducer
interface State {
  images: HTMLImageElement[];
  progress: PreloadProgress;
  isLoaded: boolean;
  isReady: boolean;
  error: Error | null;
}

type Action =
  | { type: 'RESET'; frameCount: number }
  | { type: 'SET_IMAGES'; images: HTMLImageElement[] }
  | { type: 'SET_PROGRESS'; progress: PreloadProgress }
  | { type: 'SET_READY' }
  | { type: 'SET_LOADED' }
  | { type: 'SET_ERROR'; error: Error };

function createInitialState(frameCount: number): State {
  return {
    images: [],
    progress: {
      loaded: 0,
      total: frameCount,
      percentage: 0,
      phase: 'critical',
    },
    isLoaded: false,
    isReady: false,
    error: null,
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'RESET':
      return createInitialState(action.frameCount);
    case 'SET_IMAGES':
      return { ...state, images: action.images };
    case 'SET_PROGRESS':
      return { ...state, progress: action.progress };
    case 'SET_READY':
      return { ...state, isReady: true };
    case 'SET_LOADED':
      return { ...state, isLoaded: true };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    default:
      return state;
  }
}

export function useFramePreloader(isMobile: boolean): PreloaderState {
  // Memoize config to ensure stable references
  const config = useMemo(
    () => ({
      frameCount: isMobile ? MOBILE_FRAME_COUNT : DESKTOP_FRAME_COUNT,
      progressiveFrames: isMobile ? 40 : 50,
      deviceKey: isMobile ? 'mobile' : 'desktop',
    }),
    [isMobile]
  );

  const [state, dispatch] = useReducer(
    reducer,
    config.frameCount,
    createInitialState
  );

  const mountedRef = useRef(true);
  const loadedImagesRef = useRef<HTMLImageElement[]>([]);
  const currentDeviceKeyRef = useRef(config.deviceKey);

  const updateProgress = useCallback(
    (loaded: number, phase: PreloadProgress['phase']) => {
      if (!mountedRef.current) return;
      dispatch({
        type: 'SET_PROGRESS',
        progress: {
          loaded,
          total: config.frameCount,
          percentage: Math.round((loaded / config.frameCount) * 100),
          phase,
        },
      });
    },
    [config.frameCount]
  );

  useEffect(() => {
    // Check if device type changed - if so, reset state
    const deviceChanged = currentDeviceKeyRef.current !== config.deviceKey;
    if (deviceChanged) {
      currentDeviceKeyRef.current = config.deviceKey;
      dispatch({ type: 'RESET', frameCount: config.frameCount });
    }

    // Reset refs for new load
    mountedRef.current = true;
    loadedImagesRef.current = new Array(config.frameCount).fill(null);

    const frameUrls = generateFrameUrls(isMobile);
    const { frameCount, progressiveFrames } = config;

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
        dispatch({ type: 'SET_READY' });
        dispatch({ type: 'SET_IMAGES', images: [...loadedImagesRef.current] });

        // Phase 2: Progressive frames (10-39 mobile, 10-49 desktop)
        let loadedCount = CRITICAL_FRAMES;

        for (let i = CRITICAL_FRAMES; i < progressiveFrames; i++) {
          if (!mountedRef.current) return;
          const img = await loadImageWithRetry(frameUrls[i]);
          loadedImagesRef.current[i] = img;
          loadedCount++;

          if (loadedCount % 5 === 0) {
            updateProgress(loadedCount, 'progressive');
            dispatch({
              type: 'SET_IMAGES',
              images: [...loadedImagesRef.current],
            });
          }
        }

        if (!mountedRef.current) return;
        updateProgress(progressiveFrames, 'background');
        dispatch({ type: 'SET_IMAGES', images: [...loadedImagesRef.current] });

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
          dispatch({ type: 'SET_IMAGES', images: [...loadedImagesRef.current] });
        }

        if (!mountedRef.current) return;
        updateProgress(frameCount, 'complete');
        dispatch({ type: 'SET_LOADED' });
        dispatch({ type: 'SET_IMAGES', images: [...loadedImagesRef.current] });
      } catch (err) {
        if (!mountedRef.current) return;
        dispatch({
          type: 'SET_ERROR',
          error: err instanceof Error ? err : new Error('Unknown error'),
        });
      }
    };

    loadFrames();

    return () => {
      mountedRef.current = false;
    };
  }, [updateProgress, isMobile, config]);

  return {
    images: state.images,
    progress: state.progress,
    isLoaded: state.isLoaded,
    isReady: state.isReady,
    error: state.error,
  };
}
