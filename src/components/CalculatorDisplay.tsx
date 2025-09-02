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

  return (
    <div className="mb-6">
      {/* Expression Input */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4 min-h-[60px] flex items-center">
        <div className="flex-1">
          {expression ? (
            <div className="expression-display text-right">
              {renderFormattedExpression(expression)}
            </div>
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