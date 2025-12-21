import { useRef, useCallback } from 'react';
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import type { MotionValue } from 'framer-motion';

interface UseScrollFrameReturn {
  containerRef: React.RefObject<HTMLDivElement>;
  scrollYProgress: MotionValue<number>;
  renderFrame: (
    ctx: CanvasRenderingContext2D,
    images: HTMLImageElement[],
    frameIndex: number,
    canvasWidth: number,
    canvasHeight: number
  ) => void;
}

export function useScrollFrame(
  onFrameChange?: (frameIndex: number) => void,
  frameCount: number = 192
): UseScrollFrameReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastFrameRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Map scroll progress (0-1) to frame index
  const frameIndexMotion = useTransform(
    scrollYProgress,
    [0, 1],
    [0, frameCount - 1]
  );

  // Track current frame for external use
  useMotionValueEvent(frameIndexMotion, 'change', (latest) => {
    const rounded = Math.round(latest);
    if (rounded !== lastFrameRef.current) {
      lastFrameRef.current = rounded;
      onFrameChange?.(rounded);
    }
  });

  // Canvas rendering function with double-buffering
  const renderFrame = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      images: HTMLImageElement[],
      frameIndex: number,
      canvasWidth: number,
      canvasHeight: number
    ) => {
      const validIndex = Math.max(
        0,
        Math.min(frameIndex, images.length - 1)
      );
      const img = images[validIndex];

      if (!img) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Calculate aspect-ratio preserving dimensions (cover behavior)
      const imgRatio = img.width / img.height;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth: number;
      let drawHeight: number;
      let offsetX: number;
      let offsetY: number;

      if (imgRatio > canvasRatio) {
        // Image is wider - fit height, crop width
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * imgRatio;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = 0;
      } else {
        // Image is taller - fit width, crop height
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgRatio;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    },
    []
  );

  return {
    containerRef: containerRef as React.RefObject<HTMLDivElement>,
    scrollYProgress,
    renderFrame,
  };
}
