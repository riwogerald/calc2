import React from 'react'
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react'
import { TestResult } from '../pages/TestPage'

interface TestRunnerProps {
  tests: TestResult[]
  isRunning: boolean
}

const TestRunner: React.FC<TestRunnerProps> = ({ tests, isRunning }) => {
  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-gray-400" />
      case 'running':
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />
    }
  }

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return 'text-gray-600 bg-gray-50'
      case 'running':
        return 'text-blue-700 bg-blue-50 animate-pulse-soft'
      case 'passed':
        return 'text-green-700 bg-green-50'
      case 'failed':
        return 'text-red-700 bg-red-50'
    }
  }

  return (
    <div className="space-y-3">
      {tests.map((test, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg border transition-all duration-300 ${getStatusColor(test.status)}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(test.status)}
              <span className="font-medium">{test.name}</span>
            </div>
            
            {test.duration && (
              <span className="text-sm opacity-75">
                {test.duration}ms
              </span>
            )}
          </div>
          
          {test.error && (
            <div className="mt-2 p-2 bg-red-100 rounded text-sm text-red-700 font-mono">
              {test.error}
            </div>
          )}
          
          {test.output && test.status === 'passed' && (
            <div className="mt-2 text-sm opacity-75">
              ✓ All assertions passed
            </div>
          )}
        </div>
      ))}
      
      {!isRunning && tests.every(t => t.status === 'pending') && (
        <div className="text-center py-8 text-gray-500">
          <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Click "Run All Tests" to start testing</p>
        </div>
      )}
    </div>
  )
}

export default TestRunner