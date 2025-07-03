import React from 'react'
import { Clock, Copy } from 'lucide-react'
import { HistoryEntry } from '../pages/CalculatorPage'

interface HistoryPanelProps {
  history: HistoryEntry[]
  onSelect: (entry: HistoryEntry) => void
  visible: boolean
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, visible }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const copyToClipboard = async (text: string, event: React.MouseEvent) => {
    event.stopPropagation()
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  if (!visible) return null

  return (
    <div className="h-96 overflow-y-auto">
      {history.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No calculations yet</p>
          <p className="text-sm">Your calculation history will appear here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((entry) => (
            <div
              key={entry.id}
              onClick={() => onSelect(entry)}
              className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTime(entry.timestamp)}
                </div>
                <button
                  onClick={(e) => copyToClipboard(entry.result, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-all"
                  title="Copy result"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
              
              <div className="font-mono text-sm mb-1 text-gray-700 break-all">
                {entry.expression}
              </div>
              
              <div className="font-mono text-sm font-medium text-blue-600 break-all">
                = {entry.result}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HistoryPanel