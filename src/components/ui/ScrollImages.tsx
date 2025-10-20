import { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { error } from "../../lib/logger";

interface ScrollImagesProps {
    onScrollComplete?: () => void;
    onImagesLoaded?: () => void;
}

// Navigator connection type definition
interface NavigatorConnection {
    effectiveType?: string;
}

interface NavigatorWithConnection extends Navigator {
    connection?: NavigatorConnection;
}

// Configuration constants for performance optimization
const TOTAL_IMAGES = 299;

// Responsive configuration based on device capabilities
const getDeviceConfig = () => {
    const isMobile = window.innerWidth < 768;
    const isSlowConnection = 'connection' in navigator &&
        (navigator as NavigatorWithConnection).connection?.effectiveType &&
        ['slow-2g', '2g', '3g'].includes((navigator as NavigatorWithConnection).connection.effectiveType);

    if (isMobile || isSlowConnection) {
        return {
            BATCH_SIZE: 25,          // Smaller batches for mobile
            INITIAL_BATCH_SIZE: 10,  // Fewer initial images
            PRELOAD_BUFFER: 5,       // Less aggressive preloading
            QUALITY_REDUCTION: 0.8   // Reduce canvas quality on mobile
        };
    }

    return {
        BATCH_SIZE: 50,
        INITIAL_BATCH_SIZE: 20,
        PRELOAD_BUFFER: 10,
        QUALITY_REDUCTION: 1.0
    };
};

function ScrollImages({ onScrollComplete, onImagesLoaded }: ScrollImagesProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
    const currentFrameRef = useRef<number>(0);
    const [imagesLoaded, setImagesLoaded] = useState(0);
    const [isAnyImageBroken, setIsAnyImageBroken] = useState(false);
    const [hasReachedEnd, setHasReachedEnd] = useState(false);
    const [isInitialBatchLoaded, setIsInitialBatchLoaded] = useState(false);
    const [currentBatch, setCurrentBatch] = useState(0);
    const imagesRef = useRef<HTMLImageElement[]>(new Array(TOTAL_IMAGES));
    const loadingBatchRef = useRef<Set<number>>(new Set());
    const lastRequestedFrameRef = useRef<number>(0);

    // Get responsive configuration
    const deviceConfig = useMemo(() => getDeviceConfig(), []);
    const { BATCH_SIZE, INITIAL_BATCH_SIZE, PRELOAD_BUFFER, QUALITY_REDUCTION } = deviceConfig;

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

    // Load images in batches for better performance
    const loadImageBatch = useCallback(async (batchIndex: number) => {
        if (loadingBatchRef.current.has(batchIndex)) return;

        loadingBatchRef.current.add(batchIndex);
        const startIndex = batchIndex * BATCH_SIZE;
        const endIndex = Math.min(startIndex + BATCH_SIZE, TOTAL_IMAGES);

        const batchPromises = [];
        for (let i = startIndex; i < endIndex; i++) {
            if (!imagesRef.current[i]) {
                batchPromises.push(loadImage(imagePaths[i], i));
            }
        }

        try {
            await Promise.all(batchPromises);
            if (batchIndex === 0) {
                setIsInitialBatchLoaded(true);
                onImagesLoaded?.();
            }
        } catch (loadError) {
            error(`Error loading batch ${batchIndex}`, loadError, 'IMAGE_LOAD');
            setIsAnyImageBroken(true);
        }
    }, [BATCH_SIZE, imagePaths, loadImage, onImagesLoaded]);

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
            error('Error drawing image', drawError, 'CANVAS');
            setIsAnyImageBroken(true);
        }
    }, []);

    // Progressive image loading - load initial batch first
    useEffect(() => {
        let mounted = true;

        // Load initial batch for immediate playback
        const loadInitialBatch = async () => {
            const initialSize = Math.min(INITIAL_BATCH_SIZE, TOTAL_IMAGES);
            const initialPromises = [];

            for (let i = 0; i < initialSize; i++) {
                initialPromises.push(loadImage(imagePaths[i], i));
            }

            try {
                await Promise.all(initialPromises);
                if (mounted) {
                    setIsInitialBatchLoaded(true);
                    onImagesLoaded?.();
                    renderFrame(0);
                }
            } catch (loadError) {
                error('Error loading initial batch', loadError, 'IMAGE_LOAD');
                if (mounted) {
                    setIsAnyImageBroken(true);
                }
            }
        };

        void loadInitialBatch();

        return () => {
            mounted = false;
        };
    }, [INITIAL_BATCH_SIZE, imagePaths, loadImage, onImagesLoaded, renderFrame]);

    // Load additional batches based on scroll progress
    const preloadBasedOnProgress = useCallback((frameIndex: number) => {
        const requiredBatch = Math.floor(frameIndex / BATCH_SIZE);
        const preloadBatch = Math.floor((frameIndex + PRELOAD_BUFFER) / BATCH_SIZE);

        // Load current batch if not loaded
        if (requiredBatch !== currentBatch) {
            setCurrentBatch(requiredBatch);
            void loadImageBatch(requiredBatch);
        }

        // Preload next batch
        if (preloadBatch !== requiredBatch && preloadBatch < Math.ceil(TOTAL_IMAGES / BATCH_SIZE)) {
            void loadImageBatch(preloadBatch);
        }
    }, [BATCH_SIZE, PRELOAD_BUFFER, currentBatch, loadImageBatch]);

    // Canvas setup
    useEffect(() => {
        if (!canvasRef.current || !isInitialBatchLoaded) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        canvasCtxRef.current = context;

        const handleResize = () => {
            // Apply quality reduction for mobile devices to improve performance
            canvas.width = window.innerWidth * QUALITY_REDUCTION;
            canvas.height = window.innerHeight * QUALITY_REDUCTION;

            // Scale canvas display size to full screen
            if (QUALITY_REDUCTION < 1.0) {
                canvas.style.width = window.innerWidth + 'px';
                canvas.style.height = window.innerHeight + 'px';
            }

            renderFrame(currentFrameRef.current);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [QUALITY_REDUCTION, isInitialBatchLoaded, renderFrame]);

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
                        Učitavanje slika... {Math.round((imagesLoaded / INITIAL_BATCH_SIZE) * 100)}%
                    </div>
                </div>
            )}
            {isInitialBatchLoaded && imagesLoaded < TOTAL_IMAGES && (
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm">
                    {Math.round((imagesLoaded / TOTAL_IMAGES) * 100)}% učitano
                    {deviceConfig.BATCH_SIZE < 50 && (
                        <span className="block text-xs opacity-75">Mobilni režim</span>
                    )}
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
