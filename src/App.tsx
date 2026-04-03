import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { useAppStore } from './store'
import {
  FileSelector,
  DeviceList,
  SaveFolderPicker,
  TransferControls,
  ProgressPanel,
  LogsPanel,
} from './components'

function App() {
  const { mode } = useAppStore()

  return (
    <div className="min-h-screen bg-dark-300 p-6">
      <div className="max-w-xl mx-auto space-y-6">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-100 to-emerald-400 flex items-center justify-center shadow-lg shadow-accent-100/30">
            <Zap className="w-7 h-7 text-dark-100" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">SpeedLAN</h1>
            <p className="text-sm text-zinc-500">Local file transfer</p>
          </div>
        </motion.header>

        <TransferControls />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {mode === 'send' ? (
            <>
              <FileSelector />
              <DeviceList />
            </>
          ) : (
            <SaveFolderPicker />
          )}
        </motion.div>

        <ProgressPanel />
        
        <LogsPanel />
      </div>
    </div>
  )
}

export default App
