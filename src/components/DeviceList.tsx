import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, RefreshCw, Monitor, Smartphone, Laptop, Server } from 'lucide-react'
import { useAppStore, Device } from '../store'

const getDeviceIcon = (name: string) => {
  const lowerName = name.toLowerCase()
  if (lowerName.includes('phone') || lowerName.includes('mobile')) return <Smartphone className="w-6 h-6" />
  if (lowerName.includes('server')) return <Server className="w-6 h-6" />
  if (lowerName.includes('laptop') || lowerName.includes('mac') || lowerName.includes('windows')) return <Laptop className="w-6 h-6" />
  return <Monitor className="w-6 h-6" />
}

export function DeviceList() {
  const { devices, selectedDevice, setSelectedDevice, isScanning, setIsScanning, addLog } = useAppStore()

  const handleScan = async () => {
    setIsScanning(true)
    addLog('Scanning for devices on network...', 'info')
    setSelectedDevice(null)
    
    try {
      const foundDevices = await window.electronAPI.scanDevices()
      const mappedDevices: Device[] = foundDevices.map((d: { name: string; id: string }) => ({
        id: d.id,
        name: d.name,
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        status: 'online' as const,
      }))
      useAppStore.getState().setDevices(mappedDevices)
      
      if (foundDevices.length === 0) {
        addLog('No devices found on network', 'warning')
      } else {
        addLog(`Found ${foundDevices.length} device(s)`, 'success')
      }
    } catch (err) {
      addLog('Failed to scan devices', 'error')
      useAppStore.getState().setDevices([])
    }
    setIsScanning(false)
  }

  const handleSelectDevice = (device: Device) => {
    if (selectedDevice?.id === device.id) {
      setSelectedDevice(null)
      addLog(`Deselected device: ${device.name}`, 'info')
    } else {
      setSelectedDevice(device)
      addLog(`Selected device: ${device.name}`, 'info')
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-dark-200 rounded-xl p-5 shadow-lg"
    >
      <h3 className="text-accent-100 font-semibold mb-4 flex items-center gap-2">
        <Wifi className="w-5 h-5" />
        Nearby Devices
      </h3>

      <button
        onClick={handleScan}
        disabled={isScanning}
        className="w-full py-3 px-4 rounded-lg bg-accent-100 hover:bg-accent-200 disabled:opacity-50 disabled:cursor-not-allowed text-dark-100 font-semibold transition-colors flex items-center justify-center gap-2"
      >
        <RefreshCw className={`w-5 h-5 ${isScanning ? 'animate-spin' : ''}`} />
        {isScanning ? 'Scanning...' : 'Scan for Devices'}
      </button>

      <AnimatePresence mode="wait">
        {devices.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            {devices.map((device) => (
              <motion.div
                key={device.id}
                layout
                onClick={() => handleSelectDevice(device)}
                className={`
                  p-4 rounded-lg cursor-pointer transition-all flex items-center gap-3
                  ${selectedDevice?.id === device.id 
                    ? 'bg-accent-100/20 border-2 border-accent-100' 
                    : 'bg-dark-300 hover:bg-dark-100 border-2 border-transparent'
                  }
                `}
              >
                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center
                  ${device.status === 'online' ? 'bg-accent-100/20 text-accent-100' : 'bg-zinc-700 text-zinc-500'}
                `}>
                  {getDeviceIcon(device.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-zinc-100 truncate">{device.name}</p>
                  <p className="text-sm text-zinc-400">{device.ip}</p>
                </div>
                <div className={`
                  w-3 h-3 rounded-full
                  ${device.status === 'online' ? 'bg-accent-100 shadow-lg shadow-accent-100/50' : 'bg-zinc-600'}
                `} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-center py-8 text-zinc-500"
          >
            <Wifi className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No devices found</p>
            <p className="text-xs mt-1">Click scan to search</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
