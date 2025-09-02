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

  const formatExpression = (expr: string) => {
    if (!expr) return []
    
    // Split the expression into tokens and classify them
    const tokens: { text: string; type: 'number' | 'operator' | 'function' | 'parenthesis' | 'text' }[] = []
    let currentToken = ''
    let i = 0
    
    while (i < expr.length) {
      const char = expr[i]
      
      // Check for functions (ln, log, sqrt, abs)
      if (i <= expr.length - 2) {
        const twoChar = expr.substr(i, 2)
        const threeChar = expr.substr(i, 3)
        const fourChar = expr.substr(i, 4)
        
        if (fourChar === 'sqrt') {
          if (currentToken) {
            tokens.push({ text: currentToken, type: 'text' })
            currentToken = ''
          }
          tokens.push({ text: 'sqrt', type: 'function' })
          i += 4
          continue
        } else if (threeChar === 'abs' || threeChar === 'log') {
          if (currentToken) {
            tokens.push({ text: currentToken, type: 'text' })
            currentToken = ''
          }
          tokens.push({ text: threeChar, type: 'function' })
          i += 3
          continue
        } else if (twoChar === 'ln') {
          if (currentToken) {
            tokens.push({ text: currentToken, type: 'text' })
            currentToken = ''
          }
          tokens.push({ text: 'ln', type: 'function' })
          i += 2
          continue
        }
      }
      
      // Check for numbers
      if (/\d/.test(char) || (char === '.' && /\d/.test(currentToken))) {
        currentToken += char
      } else {
        // End of number token
        if (currentToken && /^\d*\.?\d+$/.test(currentToken)) {
          tokens.push({ text: currentToken, type: 'number' })
          currentToken = ''
        } else if (currentToken) {
          tokens.push({ text: currentToken, type: 'text' })
          currentToken = ''
        }
        
        // Check for operators and parentheses
        if (/[+\-*/^%!]/.test(char)) {
          tokens.push({ text: char, type: 'operator' })
        } else if (/[()]/.test(char)) {
          tokens.push({ text: char, type: 'parenthesis' })
        } else {
          currentToken += char
        }
      }
      i++
    }
    
    // Don't forget the last token
    if (currentToken) {
      if (/^\d*\.?\d+$/.test(currentToken)) {
        tokens.push({ text: currentToken, type: 'number' })
      } else {
        tokens.push({ text: currentToken, type: 'text' })
      }
    }
    
    return tokens
  }
  
  const renderFormattedExpression = (expr: string) => {
    const tokens = formatExpression(expr)
    return tokens.map((token, index) => {
      const className = token.type === 'text' ? '' : token.type
      return (
        <span key={index} className={className}>
          {token.text}
        </span>
      )
    })
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
              
              <div className="expression-display font-mono text-sm mb-1 text-gray-700 break-all">
                {renderFormattedExpression(entry.expression)}
              </div>
              
              <div className="font-mono text-sm font-medium text-purple-600 break-all">
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