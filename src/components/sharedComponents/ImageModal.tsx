import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ImageModalProps {
    imageUrl: string;
    isOpen: boolean;
    onClose: () => void;
}

export function ImageModal({ imageUrl, isOpen, onClose }: ImageModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
                onClick={onClose}
            >
                <div className="relative max-w-[90vw] max-h-[90vh]">
                    <button
                        onClick={onClose}
                        className="absolute -top-10 right-0 text-white hover:text-gray-300"
                    >
                        <X size={24} />
                    </button>
                    <img
                        src={imageUrl}
                        alt="Full size"
                        className="max-w-full max-h-[85vh] object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
