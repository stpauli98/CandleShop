import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"
import { uploadImage } from "../../lib/storage"
import { error as logError } from "../../lib/logger"

interface ImageDropzoneProps {
  value: string
  onChange: (url: string) => void
  maxSize?: number // in MB
}

type DropzoneState = 'idle' | 'dragover' | 'uploading' | 'preview'

export function ImageDropzone({
  value,
  onChange,
  maxSize = 5,
}: ImageDropzoneProps) {
  const [state, setState] = useState<DropzoneState>(value ? 'preview' : 'idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [_dragCounter, setDragCounter] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => prev + 1)
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setState('dragover')
    }
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => {
      const newCount = prev - 1
      if (newCount === 0) {
        setState(value ? 'preview' : 'idle')
      }
      return newCount
    })
  }, [value])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const validateFile = useCallback((file: File): boolean => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Molimo odaberite sliku (JPG, PNG, GIF, WebP)')
      return false
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`Slika ne može biti veća od ${maxSize}MB`)
      return false
    }

    return true
  }, [maxSize])

  const uploadFile = useCallback(async (file: File) => {
    if (!validateFile(file)) return

    setState('uploading')
    setUploadProgress(0)

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 100)

    try {
      const imageUrl = await uploadImage(file)
      clearInterval(progressInterval)
      setUploadProgress(100)

      setTimeout(() => {
        onChange(imageUrl)
        setState('preview')
        toast.success('Slika je uspješno uploadana')
      }, 200)
    } catch (err) {
      clearInterval(progressInterval)
      logError('Error uploading image', err as Record<string, unknown>, 'STORAGE')
      toast.error('Greška pri uploadu slike')
      setState('idle')
      setUploadProgress(0)
    }
  }, [onChange, validateFile])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(0)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      uploadFile(files[0])
    }
  }, [uploadFile])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      uploadFile(files[0])
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [uploadFile])

  const handleRemove = useCallback(() => {
    onChange('')
    setState('idle')
  }, [onChange])

  const handleClick = useCallback(() => {
    if (state !== 'uploading') {
      fileInputRef.current?.click()
    }
  }, [state])

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {state === 'preview' && value ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200"
          >
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <motion.button
              type="button"
              onClick={handleRemove}
              className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4" />
            </motion.button>
            <button
              type="button"
              onClick={handleClick}
              className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-700 text-sm font-medium rounded-lg shadow-lg hover:bg-white transition-colors"
            >
              Promijeni sliku
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`
              relative w-full aspect-video rounded-xl border-2 border-dashed
              transition-all duration-200 cursor-pointer
              ${state === 'dragover'
                ? 'border-purple-500 bg-purple-50'
                : state === 'uploading'
                ? 'border-purple-300 bg-purple-50/50'
                : 'border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-50/30'
              }
            `}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
              <AnimatePresence mode="wait">
                {state === 'uploading' ? (
                  <motion.div
                    key="uploading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center"
                  >
                    <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-3" />
                    <p className="text-sm font-medium text-purple-600 mb-2">
                      Uploadanje...
                    </p>
                    <div className="w-48 h-2 bg-purple-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                    <span className="text-xs text-purple-500 mt-1">
                      {uploadProgress}%
                    </span>
                  </motion.div>
                ) : state === 'dragover' ? (
                  <motion.div
                    key="dragover"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center"
                  >
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <Upload className="w-12 h-12 text-purple-500 mb-3" />
                    </motion.div>
                    <p className="text-lg font-semibold text-purple-600">
                      Pusti sliku ovdje
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="p-4 bg-purple-100 rounded-full mb-4">
                      <ImageIcon className="w-8 h-8 text-purple-500" />
                    </div>
                    <p className="text-gray-700 font-medium mb-1">
                      Prevuci sliku ovdje
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      ili klikni za odabir
                    </p>
                    <p className="text-xs text-gray-400">
                      JPG, PNG, GIF, WebP (max {maxSize}MB)
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
