import { useMemo, useRef, useEffect, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

interface ScrollImagesProps {
    onScrollComplete?: () => void;
    onImagesLoaded?: () => void;
}

function ScrollImages({ onScrollComplete, onImagesLoaded }: ScrollImagesProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
    const currentFrameRef = useRef<number>(0);
    const [imagesLoaded, setImagesLoaded] = useState(0);
    const [isAnyImageBroken, setIsAnyImageBroken] = useState(false);
    const [hasReachedEnd, setHasReachedEnd] = useState(false);
    const [isAllImagesLoaded, setIsAllImagesLoaded] = useState(false);
    const imagesRef = useRef<HTMLImageElement[]>([]);

    // Koristimo window za scroll tracking umjesto container elementa
    const { scrollYProgress } = useScroll({
        offset: ["start start", "end start"]
    });

    // Kreiranje array-a putanja do slika
    const imagePaths = useMemo(() => {
        const paths: string[] = [];
        for (let i = 1; i <= 299; i++) {
            const paddedNumber = i.toString().padStart(4, '0');
            paths.push(`/src/assets/scrollImages/output_${paddedNumber}.webp`);
        }
        return paths;
    }, []);

    // Preload slika
    useEffect(() => {
        let mounted = true;
        const images: HTMLImageElement[] = [];
        let loadedCount = 0;

        const loadImage = (path: string): Promise<HTMLImageElement> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    if (mounted) {
                        loadedCount++;
                        setImagesLoaded(loadedCount);
                    }
                    resolve(img);
                };
                img.onerror = () => {
                    console.error(`Failed to load image: ${path}`);
                    reject(new Error(`Failed to load image: ${path}`));
                };
                img.src = path;
                images.push(img);
            });
        };

        Promise.all(imagePaths.map(path => loadImage(path)))
            .then(loadedImages => {
                if (mounted) {
                    imagesRef.current = loadedImages;
                    setIsAllImagesLoaded(true);
                    onImagesLoaded?.();
                    // Renderiramo prvi frame čim su slike učitane
                    renderFrame(0);
                }
            })
            .catch(error => {
                console.error('Error loading images:', error);
                if (mounted) {
                    setIsAnyImageBroken(true);
                }
            });

        return () => {
            mounted = false;
        };
    }, [imagePaths, onImagesLoaded]);

    // Canvas setup
    useEffect(() => {
        if (!canvasRef.current || !isAllImagesLoaded) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        if (!context) return;

        canvasCtxRef.current = context;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            renderFrame(currentFrameRef.current);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isAllImagesLoaded]);

    const renderFrame = (frameIndex: number) => {
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
        } catch (error) {
            console.error('Error drawing image:', error);
            setIsAnyImageBroken(true);
        }
    };

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (!isAllImagesLoaded) return;
        
        // Izračunaj frameIndex s boljom distribucijom
        const progress = Math.max(0, Math.min(1, latest));
        const adjustedProgress = Math.pow(progress, 1.2); // Smanjili smo eksponent za linearnije kretanje
        
        const frameIndex = Math.min(
            Math.floor(adjustedProgress * (imagePaths.length - 1)),
            imagePaths.length - 1
        );
        
        // Dodaj smoothing za prijelaze
        if (frameIndex !== currentFrameRef.current) {
            // Osiguraj da ne preskačemo previše frejmova odjednom
            const maxFrameJump = 2; // Smanjili smo maksimalni skok
            const currentFrame = currentFrameRef.current;
            const frameDiff = frameIndex - currentFrame;
            
            let nextFrame = currentFrame;
            if (Math.abs(frameDiff) > maxFrameJump) {
                nextFrame = currentFrame + (Math.sign(frameDiff) * maxFrameJump);
            } else {
                nextFrame = frameIndex;
            }
            
            currentFrameRef.current = nextFrame;
            renderFrame(nextFrame);
        }

        if (latest >= 0.95 && !hasReachedEnd) { // Smanjili smo prag za završetak
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
            {!isAllImagesLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="text-white text-xl">
                        Učitavanje slika... {Math.round((imagesLoaded / imagePaths.length) * 100)}%
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