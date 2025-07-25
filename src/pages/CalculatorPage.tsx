import React, { useState, useCallback } from 'react'
import { Calculator, History, Trash2, Copy, Check } from 'lucide-react'
import CalculatorDisplay from '../components/CalculatorDisplay'
import CalculatorKeypad from '../components/CalculatorKeypad'
import HistoryPanel from '../components/HistoryPanel'
import { mockApi } from '../services/mockApi'

export interface HistoryEntry {
  id: string
  expression: string
  result: string
  timestamp: Date
}

const CalculatorPage: React.FC = () => {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState('')
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [copied, setCopied] = useState(false)

  const evaluateExpression = useCallback(async (expr: string) => {
    if (!expr.trim()) return

    setIsCalculating(true)
    try {
      let data
      try {
        // Try real backend first
        const response = await fetch('http://localhost:8000/calculate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ expression: expr }),
        })

        if (!response.ok) {
          throw new Error('Backend not available')
        }

        data = await response.json()
      } catch (backendError) {
        // Fallback to mock API for demo
        data = await mockApi.calculate(expr)
      }
      
      const resultValue = data.result || data.error || 'Error'
      
      setResult(resultValue)
      
      // Add to history
      const historyEntry: HistoryEntry = {
        id: Date.now().toString(),
        expression: expr,
        result: resultValue,
        timestamp: new Date(),
      }
      
      setHistory(prev => [historyEntry, ...prev.slice(0, 49)]) // Keep last 50 entries
    } catch (error) {
      setResult('Error: Unable to calculate')
    } finally {
      setIsCalculating(false)
    }
  }, [])

  const handleKeyPress = useCallback((key: string) => {
    if (key === '=') {
      evaluateExpression(expression)
    } else if (key === 'C') {
      setExpression('')
      setResult('')
    } else if (key === '⌫') {
      setExpression(prev => prev.slice(0, -1))
    } else {
      setExpression(prev => prev + key)
    }
  }, [expression, evaluateExpression])

  const handleHistorySelect = useCallback((entry: HistoryEntry) => {
    setExpression(entry.expression)
    setResult(entry.result)
    setShowHistory(false)
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  const copyResult = useCallback(async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(result)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error('Failed to copy:', error)
      }
    }
  }, [result])

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <Calculator className="h-10 w-10 text-purple-600" />
            Arbitrary-Precision Calculator
          </h1>
          <p className="text-gray-600">
            Enter mathematical expressions with unlimited precision
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calculator */}
          <div className="lg:col-span-2">
            <div className="glass-effect rounded-2xl p-6 shadow-2xl">
              <CalculatorDisplay
                expression={expression}
                result={result}
                isCalculating={isCalculating}
                onCopyResult={copyResult}
                copied={copied}
              />
              <CalculatorKeypad onKeyPress={handleKeyPress} />
            </div>
          </div>

          {/* History Panel */}
          <div className="lg:col-span-1">
            <div className="glass-effect rounded-2xl p-6 shadow-2xl h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <History className="h-5 w-5 text-purple-600" />
                  History
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title={showHistory ? 'Hide History' : 'Show History'}
                  >
                    <History className="h-4 w-4" />
                  </button>
                  {history.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Clear History"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              
              <HistoryPanel
                history={history}
                onSelect={handleHistorySelect}
                visible={showHistory || true}
              />
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported Operations</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Basic</h4>
              <div className="space-y-1 text-gray-600 font-mono">
                <div>+ - * / %</div>
                <div>^ (power)</div>
                <div>! (factorial)</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Functions</h4>
              <div className="space-y-1 text-gray-600 font-mono">
                <div>ln(x)</div>
                <div>log(x)</div>
                <div>sqrt(x)</div>
                <div>abs(x)</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Examples</h4>
              <div className="space-y-1 text-gray-600 font-mono">
                <div>2^64</div>
                <div>20!</div>
                <div>1/2 + 3/4</div>
                <div>ln(2)</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Features</h4>
              <div className="space-y-1 text-gray-600">
                <div>Unlimited precision</div>
                <div>Fraction support</div>
                <div>Parentheses</div>
                <div>History tracking</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalculatorPage