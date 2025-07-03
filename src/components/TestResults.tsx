import React from 'react'
import { CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react'
import { TestResult } from '../pages/TestPage'

interface TestResultsProps {
  tests: TestResult[]
}

const TestResults: React.FC<TestResultsProps> = ({ tests }) => {
  const passedTests = tests.filter(t => t.status === 'passed').length
  const failedTests = tests.filter(t => t.status === 'failed').length
  const totalTests = tests.length
  const completedTests = passedTests + failedTests
  
  const successRate = completedTests > 0 ? (passedTests / completedTests) * 100 : 0
  const totalDuration = tests.reduce((sum, test) => sum + (test.duration || 0), 0)

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-700">Passed</span>
          </div>
          <div className="text-2xl font-bold text-green-800">{passedTests}</div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <span className="font-medium text-red-700">Failed</span>
          </div>
          <div className="text-2xl font-bold text-red-800">{failedTests}</div>
        </div>
      </div>

      {/* Success Rate */}
      {completedTests > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-700">Success Rate</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-blue-800">
              {successRate.toFixed(1)}%
            </div>
            <div className="flex-1 bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${successRate}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Execution Time */}
      {totalDuration > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-700">Total Duration</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {totalDuration.toLocaleString()}ms
          </div>
        </div>
      )}

      {/* Individual Test Results */}
      {completedTests > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Test Details</h4>
          <div className="space-y-2">
            {tests.filter(t => t.status !== 'pending').map((test, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  {test.status === 'passed' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm font-medium">{test.name}</span>
                </div>
                {test.duration && (
                  <span className="text-xs text-gray-500">{test.duration}ms</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {completedTests === 0 && (
        <div className="text-center py-8 text-gray-500">
          <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Test results will appear here</p>
        </div>
      )}
    </div>
  )
}

export default TestResults