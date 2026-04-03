import { motion } from 'framer-motion'
import { Send, Download, Zap } from 'lucide-react'
import { useAppStore } from '../store'

export function TransferControls() {
  const { 
    mode, 
    setMode, 
    selectedFile, 
    selectedDevice, 
    isTransferring, 
    setIsTransferring,
    setProgress,
    addLog,
    resetTransfer,
  } = useAppStore()

  const handleSend = async () => {
    if (!selectedFile || !selectedDevice) {
      addLog('Please select a file and device first', 'error')
      return
    }

    setIsTransferring(true)
    resetTransfer()
    setProgress({ status: 'compressing', message: 'Compressing file...', totalBytes: selectedFile.size })
    addLog('Starting file transfer...', 'info')

    try {
      setProgress({ status: 'compressing', message: 'Compressing file...' })
      await new Promise(resolve => setTimeout(resolve, 1500))

      setProgress({ status: 'sending', message: 'Sending file...', speed: 0 })
      addLog(`Sending to ${selectedDevice.name}...`, 'info')
      
      const result = await window.electronAPI.sendFile(selectedFile.path, selectedDevice.id)
      
      if (result.success) {
        setProgress({ status: 'completed', message: 'Transfer complete!' })
        addLog('File sent successfully!', 'success')
      } else {
        setProgress({ status: 'error', message: 'Transfer failed' })
        addLog(`Transfer failed: ${result.output}`, 'error')
      }
    } catch (err) {
      setProgress({ status: 'error', message: 'Transfer failed' })
      addLog('Failed to send file', 'error')
    }
    
    setIsTransferring(false)
  }

  const handleReceive = async () => {
    setIsTransferring(true)
    resetTransfer()
    setProgress({ status: 'receiving', message: 'Waiting for incoming file...' })
    addLog('Waiting to receive file...', 'info')

    try {
      const savePath = useAppStore.getState().savePath || undefined
      const result = await window.electronAPI.startReceive(savePath)
      
      if (result.success) {
        setProgress({ status: 'decompressing', message: 'Decompressing file...' })
        addLog('File received, decompressing...', 'info')
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        setProgress({ status: 'completed', message: 'Transfer complete!' })
        addLog('File received successfully!', 'success')
      } else {
        setProgress({ status: 'error', message: 'Receive failed' })
        addLog(`Receive failed: ${result.output}`, 'error')
      }
    } catch (err) {
      setProgress({ status: 'error', message: 'Receive failed' })
      addLog('Failed to receive file', 'error')
    }
    
    setIsTransferring(false)
  }

  const canSend = selectedFile && selectedDevice && !isTransferring
  const canReceive = !isTransferring

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex bg-dark-200 rounded-xl p-1.5 shadow-lg">
        <button
          onClick={() => setMode('send')}
          className={`
            flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2
            ${mode === 'send' 
              ? 'bg-accent-100 text-dark-100 shadow-lg shadow-accent-100/30' 
              : 'text-zinc-400 hover:text-zinc-200'
            }
          `}
        >
          <Send className="w-5 h-5" />
          Send
        </button>
        <button
          onClick={() => setMode('receive')}
          className={`
            flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2
            ${mode === 'receive' 
              ? 'bg-accent-100 text-dark-100 shadow-lg shadow-accent-100/30' 
              : 'text-zinc-400 hover:text-zinc-200'
            }
          `}
        >
          <Download className="w-5 h-5" />
          Receive
        </button>
      </div>

      <motion.button
        layout
        onClick={mode === 'send' ? handleSend : handleReceive}
        disabled={mode === 'send' ? !canSend : !canReceive}
        className={`
          w-full py-4 px-6 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3
          ${mode === 'send' 
            ? 'bg-gradient-to-r from-accent-100 to-emerald-400 hover:from-accent-200 hover:to-emerald-500' 
            : 'bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500'
          }
          disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
          text-dark-100 shadow-lg shadow-accent-100/20
        `}
      >
        <Zap className="w-6 h-6" />
        {isTransferring 
          ? (mode === 'send' ? 'Sending...' : 'Receiving...') 
          : (mode === 'send' ? 'Send File' : 'Start Receiving')
        }
      </motion.button>
    </motion.div>
  )
}
