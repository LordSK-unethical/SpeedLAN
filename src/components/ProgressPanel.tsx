import { motion, AnimatePresence } from 'framer-motion'
import { FileUp, FileDown, Archive, CheckCircle, XCircle, Loader, Zap } from 'lucide-react'
import { useAppStore, TransferStatus } from '../store'

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatSpeed = (bytesPerSecond: number) => {
  if (bytesPerSecond === 0) return '0 B/s'
  return formatFileSize(bytesPerSecond) + '/s'
}

const getStatusIcon = (status: TransferStatus) => {
  switch (status) {
    case 'compressing':
      return <Archive className="w-5 h-5" />
    case 'sending':
      return <FileUp className="w-5 h-5" />
    case 'receiving':
      return <FileDown className="w-5 h-5" />
    case 'decompressing':
      return <Archive className="w-5 h-5" />
    case 'completed':
      return <CheckCircle className="w-5 h-5" />
    case 'error':
      return <XCircle className="w-5 h-5" />
    default:
      return <Loader className="w-5 h-5" />
  }
}

const getStatusColor = (status: TransferStatus) => {
  switch (status) {
    case 'compressing':
    case 'decompressing':
      return 'text-purple-400'
    case 'sending':
    case 'receiving':
      return 'text-blue-400'
    case 'completed':
      return 'text-accent-100'
    case 'error':
      return 'text-red-400'
    default:
      return 'text-zinc-400'
  }
}

export function ProgressPanel() {
  const { progress, isTransferring } = useAppStore()
  const { status, message, bytesTransferred, totalBytes, speed } = progress

  const percent = totalBytes > 0 ? (bytesTransferred / totalBytes) * 100 : 0

  return (
    <AnimatePresence>
      {(isTransferring || status !== 'idle') && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="bg-dark-200 rounded-xl p-5 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-accent-100 font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Transfer Status
            </h3>
            <div className={`flex items-center gap-2 ${getStatusColor(status)}`}>
              {getStatusIcon(status)}
              <span className="text-sm font-medium capitalize">{status}</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="h-3 bg-dark-300 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.3 }}
                className={`
                  h-full rounded-full
                  ${status === 'completed' ? 'bg-accent-100' : ''}
                  ${status === 'error' ? 'bg-red-400' : ''}
                  ${status === 'compressing' || status === 'decompressing' ? 'bg-purple-400' : ''}
                  ${status === 'sending' || status === 'receiving' ? 'bg-gradient-to-r from-blue-400 to-cyan-400' : ''}
                  ${status === 'idle' ? 'bg-zinc-600' : ''}
                `}
              />
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-zinc-400">
              <span>Progress</span>
              <span className="text-zinc-200">
                {formatFileSize(bytesTransferred)} / {formatFileSize(totalBytes)}
              </span>
            </div>
            
            {(status === 'sending' || status === 'receiving') && speed > 0 && (
              <div className="flex justify-between text-zinc-400">
                <span>Speed</span>
                <span className="text-zinc-200">{formatSpeed(speed)}</span>
              </div>
            )}

            {message && (
              <div className="flex justify-between text-zinc-400">
                <span>Status</span>
                <span className={`${getStatusColor(status)}`}>{message}</span>
              </div>
            )}
          </div>

          {percent > 0 && percent < 100 && (
            <div className="mt-4 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              >
                <Loader className="w-6 h-6 text-accent-100" />
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
