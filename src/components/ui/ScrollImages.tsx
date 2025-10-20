import { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { error } from "../../lib/logger";

interface ScrollImagesProps {
    onScrollComplete?: () => void;
    onImagesLoaded?: () => void;
}

// Configuration constants - Load all images immediately, no restrictions
const TOTAL_IMAGES = 299;

function ScrollImages({ onScrollComplete, onImagesLoaded }: ScrollImagesProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
    const currentFrameRef = useRef<number>(0);
    const [imagesLoaded, setImagesLoaded] = useState(0);
    const [isAnyImageBroken, setIsAnyImageBroken] = useState(false);
    const [hasReachedEnd, setHasReachedEnd] = useState(false);
    const [isInitialBatchLoaded, setIsInitialBatchLoaded] = useState(false);
    const imagesRef = useRef<HTMLImageElement[]>(new Array(TOTAL_IMAGES));
    const lastRequestedFrameRef = useRef<number>(0);

    // Koristimo window za scroll tracking umjesto container elementa
    const { scrollYProgress } = useScroll({
        offset: ["start start", "end start"]
    });

    // Optimized image paths generation with memoization
    const imagePaths = useMemo(() => {
        const paths: string[] = [];
        for (let i = 1; i <= TOTAL_IMAGES; i++) {
            const paddedNumber = i.toString().padStart(4, '0');
            paths.push(`/scrollImages/output_${paddedNumber}.webp`);
        }
        return paths;
    }, []);

    // Load a single image with error handling
    const loadImage = useCallback((path: string, index: number): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                imagesRef.current[index] = img;
                setImagesLoaded(prev => prev + 1);
                resolve(img);
            };
            img.onerror = () => {
                reject(new Error(`Failed to load image: ${path}`));
            };
            img.src = path;
        });
    }, []);

    // renderFrame function declaration moved before useEffect to fix hoisting issue
    const renderFrame = useCallback((frameIndex: number) => {
        if (!canvasCtxRef.current || !canvasRef.current || !imagesRef.current[frameIndex]) return;

        const ctx = canvasCtxRef.current;
        const canvas = canvasRef.current;
        const img = imagesRef.current[frameIndex];

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Izračunaj dimenzije za održavanje aspect ratia
        const imgAspect = img.width / img.height;
        const canvasAspect = canvas.width / canvas.height;
        let drawWidth = canvas.width;
        let drawHeight = canvas.height;

        if (canvasAspect > imgAspect) {
            drawHeight = canvas.width / imgAspect;
        } else {
            drawWidth = canvas.height * imgAspect;
        }

        const x = (canvas.width - drawWidth) / 2;
        const y = (canvas.height - drawHeight) / 2;

        try {
            ctx.drawImage(img, x, y, drawWidth, drawHeight);
        } catch (drawError) {
            error('Error drawing image', { error: drawError instanceof Error ? drawError : String(drawError) }, 'CANVAS');
            setIsAnyImageBroken(true);
        }
    }, []);

    // Load ALL images at once - no restrictions
    useEffect(() => {
        let mounted = true;

        const loadAllImages = async () => {
            const allPromises = [];

            // Load all 299 images at once
            for (let i = 0; i < TOTAL_IMAGES; i++) {
                allPromises.push(loadImage(imagePaths[i], i));
            }

            try {
                await Promise.all(allPromises);
                if (mounted) {
                    setIsInitialBatchLoaded(true);
                    onImagesLoaded?.();
                    renderFrame(0);
                }
            } catch (loadError) {
                error('Error loading images', { error: loadError instanceof Error ? loadError : String(loadError) }, 'IMAGE_LOAD');
                if (mounted) {
                    setIsAnyImageBroken(true);
                }
            }
        };

        void loadAllImages();

        return () => {
            mounted = false;
        };
    }, [imagePaths, loadImage, onImagesLoaded, renderFrame]);

    // Preloading is disabled - all images load at once
    const preloadBasedOnProgress = useCallback((_frameIndex: number) => {
        // No-op: All images are loaded upfront
    }, []);

    // Canvas setup
    useEffect(() => {
        if (!canvasRef.current || !isInitialBatchLoaded) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        canvasCtxRef.current = context;

        const handleResize = () => {
            // Full quality always - no restrictions
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            renderFrame(currentFrameRef.current);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isInitialBatchLoaded, renderFrame]);

    // Optimized scroll handler with throttling and preloading
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (!isInitialBatchLoaded) return;

        // Calculate frame index with better distribution
        const progress = Math.max(0, Math.min(1, latest));
        const adjustedProgress = Math.pow(progress, 1.1); // Slightly adjusted for smoother movement

        const frameIndex = Math.min(
            Math.floor(adjustedProgress * (TOTAL_IMAGES - 1)),
            TOTAL_IMAGES - 1
        );

        // Throttle frame updates for better performance
        if (Math.abs(frameIndex - lastRequestedFrameRef.current) < 1) return;
        lastRequestedFrameRef.current = frameIndex;

        // Preload images based on current progress
        preloadBasedOnProgress(frameIndex);

        // Only update if image is loaded, otherwise keep current frame
        if (imagesRef.current[frameIndex]) {
            // Add smoothing for transitions with reduced max jump
            if (frameIndex !== currentFrameRef.current) {
                const maxFrameJump = 3; // Optimized frame jump
                const currentFrame = currentFrameRef.current;
                const frameDiff = frameIndex - currentFrame;

                let nextFrame = currentFrame;
                if (Math.abs(frameDiff) > maxFrameJump) {
                    nextFrame = currentFrame + (Math.sign(frameDiff) * maxFrameJump);
                    // Ensure we don't go beyond available images
                    if (imagesRef.current[nextFrame]) {
                        currentFrameRef.current = nextFrame;
                        renderFrame(nextFrame);
                    }
                } else {
                    currentFrameRef.current = frameIndex;
                    renderFrame(frameIndex);
                }
            }
        }

        // End detection with optimized threshold
        if (latest >= 0.95 && !hasReachedEnd) {
            setHasReachedEnd(true);
            onScrollComplete?.();
        }
    });

    return (
        <div ref={containerRef} className="absolute inset-0">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover"
            />
            {!isInitialBatchLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="text-white text-xl">
                        Učitavanje slika... {Math.round((imagesLoaded / TOTAL_IMAGES) * 100)}%
                    </div>
                </div>
            )}
            {isAnyImageBroken && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="text-red-500 text-xl">
                        Greska pri ucitavanju slika.
                    </div>
                </div>
            )}
        </div>
    );
}

export default ScrollImages;
