import { motion, AnimatePresence } from 'framer-motion'
import { X, File, FileText, Film, Music, Image, Archive } from 'lucide-react'
import { useAppStore } from '../store'

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return <Image className="w-8 h-8" />
  if (type.startsWith('video/')) return <Film className="w-8 h-8" />
  if (type.startsWith('audio/')) return <Music className="w-8 h-8" />
  if (type.includes('zip') || type.includes('archive')) return <Archive className="w-8 h-8" />
  if (type.startsWith('text/') || type.includes('pdf')) return <FileText className="w-8 h-8" />
  return <File className="w-8 h-8" />
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function FileSelector() {
  const { selectedFile, setSelectedFile, addLog } = useAppStore()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      setSelectedFile({
        name: file.name,
        path: file.path || file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
      })
      addLog(`File selected: ${file.name} (${formatFileSize(file.size)})`, 'info')
    }
  }

  const handleSelectFile = async () => {
    try {
      const path = await window.electronAPI.selectFile()
      if (path) {
        const name = path.split(/[\\/]/).pop() || path
        setSelectedFile({
          name,
          path,
          size: 0,
          type: 'application/octet-stream',
        })
        addLog(`File selected: ${name}`, 'info')
      }
    } catch (err) {
      addLog('Failed to select file', 'error')
    }
  }

  const handleRemoveFile = () => {
    if (selectedFile) {
      addLog(`File removed: ${selectedFile.name}`, 'info')
      setSelectedFile(null)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-200 rounded-xl p-5 shadow-lg"
    >
      <h3 className="text-accent-100 font-semibold mb-4 flex items-center gap-2">
        <File className="w-5 h-5" />
        Select File
      </h3>

      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-dark-300 rounded-lg p-8 text-center hover:border-accent-100 transition-colors cursor-pointer"
            onClick={handleSelectFile}
          >
            <div className="flex flex-col items-center gap-3 text-zinc-400">
              <File className="w-12 h-12 opacity-50" />
              <div>
                <p className="text-zinc-300 font-medium">Drag & drop file here</p>
                <p className="text-sm mt-1">or click to browse</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-dark-300 rounded-lg p-4 flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-lg bg-dark-100 flex items-center justify-center text-accent-100">
              {getFileIcon(selectedFile.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-zinc-100 truncate" title={selectedFile.name}>
                {selectedFile.name}
              </p>
              <p className="text-sm text-zinc-400">
                {selectedFile.size > 0 ? formatFileSize(selectedFile.size) : 'Unknown size'}
              </p>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-2 rounded-lg hover:bg-dark-100 text-zinc-400 hover:text-red-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedFile && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleSelectFile}
          className="mt-3 w-full py-2 px-4 rounded-lg bg-dark-300 hover:bg-dark-100 text-zinc-300 hover:text-zinc-100 transition-colors text-sm"
        >
          Replace File
        </motion.button>
      )}
    </motion.div>
  )
}
