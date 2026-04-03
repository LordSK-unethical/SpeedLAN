import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useAppStore, LogEntry } from '../store'

const formatTimestamp = (date: Date) => {
  return date.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  })
}

const getLogColor = (type: LogEntry['type']) => {
  switch (type) {
    case 'success':
      return 'text-accent-100'
    case 'error':
      return 'text-red-400'
    case 'warning':
      return 'text-yellow-400'
    default:
      return 'text-zinc-400'
  }
}

const getLogPrefix = (type: LogEntry['type']) => {
  switch (type) {
    case 'success':
      return '✓'
    case 'error':
      return '✗'
    case 'warning':
      return '⚠'
    default:
      return '›'
  }
}

export function LogsPanel() {
  const { logs, clearLogs } = useAppStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = React.useState(true)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-200 rounded-xl shadow-lg overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-dark-300/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-zinc-400" />
          <h3 className="text-accent-100 font-semibold">Console</h3>
          {logs.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-accent-100/20 text-accent-100 text-xs">
              {logs.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {logs.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                clearLogs()
              }}
              className="p-1.5 rounded-lg hover:bg-dark-100 text-zinc-500 hover:text-zinc-300 transition-colors"
              title="Clear logs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-zinc-400" />
          ) : (
            <ChevronUp className="w-5 h-5 text-zinc-400" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 200 }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div
              ref={scrollRef}
              className="h-[200px] overflow-y-auto bg-dark-300 p-3 font-mono text-sm"
            >
              {logs.length === 0 ? (
                <div className="text-zinc-500 text-center py-8">
                  <Terminal className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">No logs yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {logs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-2"
                    >
                      <span className="text-zinc-600 text-xs shrink-0">
                        {formatTimestamp(log.timestamp)}
                      </span>
                      <span className={`shrink-0 ${getLogColor(log.type)}`}>
                        {getLogPrefix(log.type)}
                      </span>
                      <span className="text-zinc-300 break-all">
                        {log.message}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
