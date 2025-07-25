import React from 'react'
import { Copy, Check, Loader2 } from 'lucide-react'

interface CalculatorDisplayProps {
  expression: string
  result: string
  isCalculating: boolean
  onCopyResult: () => void
  copied: boolean
}

const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  expression,
  result,
  isCalculating,
  onCopyResult,
  copied
}) => {
  const formatExpression = (expr: string) => {
    // Simple syntax highlighting using CSS classes defined in index.css
    return expr.replace(/(\d+)/g, '<span class="number">$1</span>')
              .replace(/([+\-*/^%!])/g, '<span class="operator">$1</span>')
              .replace(/(ln|log|sqrt|abs)/g, '<span class="function">$1</span>')
              .replace(/([()])/g, '<span class="parenthesis">$1</span>')
  }

  return (
    <div className="mb-6">
      {/* Expression Input */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4 min-h-[60px] flex items-center">
        <div className="flex-1">
          {expression ? (
            <div 
              className="expression-display text-right"
              dangerouslySetInnerHTML={{ __html: formatExpression(expression) }}
            />
          ) : (
            <div className="text-gray-400 text-right font-mono text-lg">
              Enter an expression...
            </div>
          )}
        </div>
      </div>

      {/* Result Display */}
      <div className="bg-gradient-to-r from-purple-50 to-teal-50 rounded-lg p-4 min-h-[80px] flex items-center justify-between">
        <div className="flex-1">
          {isCalculating ? (
            <div className="flex items-center justify-center text-purple-600">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span className="font-medium">Calculating...</span>
            </div>
          ) : result ? (
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 font-mono break-all result-animation">
                {result}
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-right text-xl font-mono">
              Result will appear here
            </div>
          )}
        </div>
        
        {result && !isCalculating && (
          <button
            onClick={onCopyResult}
            className="ml-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-all duration-200 flex-shrink-0"
            title="Copy result"
          >
            {copied ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default CalculatorDisplay