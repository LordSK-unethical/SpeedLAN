import { motion } from 'framer-motion'
import { Folder, FolderOpen, Home } from 'lucide-react'
import { useAppStore } from '../store'

const DEFAULT_SAVE_PATH = 'C:\\Users\\Public\\Downloads'

export function SaveFolderPicker() {
  const { savePath, setSavePath, addLog } = useAppStore()

  const handleSelectFolder = async () => {
    try {
      const path = await window.electronAPI.selectFolder()
      if (path) {
        setSavePath(path)
        addLog(`Save folder set to: ${path}`, 'info')
      }
    } catch (err) {
      addLog('Failed to select folder', 'error')
    }
  }

  const handleSetDefault = () => {
    setSavePath(DEFAULT_SAVE_PATH)
    addLog(`Using default save folder: ${DEFAULT_SAVE_PATH}`, 'info')
  }

  const handleClearFolder = () => {
    setSavePath('')
    addLog('Save folder cleared', 'info')
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-200 rounded-xl p-5 shadow-lg"
    >
      <h3 className="text-accent-100 font-semibold mb-4 flex items-center gap-2">
        <Folder className="w-5 h-5" />
        Save Location
      </h3>

      {savePath ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-dark-300 rounded-lg p-4 flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-lg bg-accent-100/20 flex items-center justify-center text-accent-100">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-zinc-100 text-sm truncate" title={savePath}>
              {savePath}
            </p>
            <p className="text-xs text-zinc-400">Custom save location</p>
          </div>
          <button
            onClick={handleClearFolder}
            className="p-2 rounded-lg hover:bg-dark-100 text-zinc-400 hover:text-red-400 transition-colors"
          >
            <span className="text-xl">×</span>
          </button>
        </motion.div>
      ) : (
        <div className="bg-dark-300 rounded-lg p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-zinc-700 flex items-center justify-center text-zinc-400">
            <Home className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-zinc-300 text-sm truncate">
              Default: {DEFAULT_SAVE_PATH}
            </p>
            <p className="text-xs text-zinc-500">Downloads folder</p>
          </div>
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <button
          onClick={handleSelectFolder}
          className="flex-1 py-2 px-4 rounded-lg bg-dark-300 hover:bg-dark-100 text-zinc-300 hover:text-zinc-100 transition-colors text-sm font-medium"
        >
          Choose Folder
        </button>
        {!savePath && (
          <button
            onClick={handleSetDefault}
            className="py-2 px-4 rounded-lg bg-dark-300 hover:bg-dark-100 text-zinc-400 hover:text-zinc-300 transition-colors text-sm"
          >
            Use Default
          </button>
        )}
      </div>
    </motion.div>
  )
}
