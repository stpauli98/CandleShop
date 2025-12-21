export interface PreloadProgress {
  loaded: number;
  total: number;
  percentage: number;
  phase: 'critical' | 'progressive' | 'background' | 'complete';
}

export interface PreloaderState {
  images: HTMLImageElement[];
  progress: PreloadProgress;
  isLoaded: boolean;
  isReady: boolean; // At least critical frames loaded
  error: Error | null;
}
