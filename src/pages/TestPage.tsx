import React, { useState, useEffect } from 'react'
import { TestTube, Play, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react'
import TestRunner from '../components/TestRunner'
import TestResults from '../components/TestResults'
import { mockApi } from '../services/mockApi'

export interface TestResult {
  name: string
  status: 'pending' | 'running' | 'passed' | 'failed'
  duration?: number
  output?: string
  error?: string
}

const TestPage: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [overallStatus, setOverallStatus] = useState<'idle' | 'running' | 'completed'>('idle')

  const testSuites = [
    'BigInteger Operations',
    'BigRational Operations', 
    'Expression Evaluation',
    'Edge Cases'
  ]

  useEffect(() => {
    // Initialize test results
    setTests(testSuites.map(name => ({
      name,
      status: 'pending'
    })))
  }, [])

  const runTests = async () => {
    setIsRunning(true)
    setOverallStatus('running')
    
    // Reset all tests to pending
    setTests(prev => prev.map(test => ({ ...test, status: 'pending' as const })))

    try {
      let testResults
      try {
        // Try real backend first
        const response = await fetch('http://localhost:8000/test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Backend not available')
        }

        const data = await response.json()
        
        // Show actual test results from the backend
        if (data.status === 'completed' && data.results) {
          testResults = data.results.map((result: any) => ({
            name: result.name,
            status: result.status as 'passed' | 'failed',
            duration: result.duration,
            output: result.output,
            error: result.error
          }))
        } else {
          throw new Error('Invalid response format')
        }
      } catch (backendError) {
        // Fallback to mock API for demo
        const mockResults = await mockApi.runTests()
        testResults = mockResults
      }
      
      // Update tests with results
      setTests(testResults)
    } catch (error) {
      // Mark all tests as failed
      setTests(prev => prev.map(test => ({
        ...test,
        status: 'failed' as const,
        error: 'Failed to execute tests'
      })))
    } finally {
      setIsRunning(false)
      setOverallStatus('completed')
    }
  }

  const resetTests = () => {
    setTests(prev => prev.map(test => ({
      name: test.name,
      status: 'pending' as const
    })))
    setOverallStatus('idle')
  }

  const passedTests = tests.filter(t => t.status === 'passed').length
  const failedTests = tests.filter(t => t.status === 'failed').length
  const totalTests = tests.length

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <TestTube className="h-10 w-10 text-green-600" />
            Test Suite
          </h1>
          <p className="text-gray-600">
            Comprehensive tests for the arbitrary-precision calculator
          </p>
        </div>

        {/* Test Controls */}
        <div className="glass-effect rounded-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={runTests}
                disabled={isRunning}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isRunning
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    Run All Tests
                  </>
                )}
              </button>
              
              {overallStatus === 'completed' && (
                <button
                  onClick={resetTests}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </button>
              )}
            </div>

            {overallStatus !== 'idle' && (
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-700 font-medium">{passedTests} Passed</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-700 font-medium">{failedTests} Failed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700 font-medium">{totalTests} Total</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Test Runner */}
          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Test Execution</h2>
            <TestRunner tests={tests} isRunning={isRunning} />
          </div>

          {/* Test Results */}
          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Results</h2>
            <TestResults tests={tests} />
          </div>
        </div>

        {/* Test Information */}
        <div className="mt-8 glass-effect rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Test Coverage</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">BigInteger Tests</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Addition & Subtraction</li>
                <li>• Multiplication</li>
                <li>• Division & Modulo</li>
                <li>• Exponentiation</li>
                <li>• Comparison Operations</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">BigRational Tests</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Fraction Operations</li>
                <li>• Simplification</li>
                <li>• Decimal Conversion</li>
                <li>• Mixed Operations</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Expression Tests</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Complex Expressions</li>
                <li>• Function Calls</li>
                <li>• Operator Precedence</li>
                <li>• Parentheses Handling</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Edge Cases</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Zero Operations</li>
                <li>• Negative Numbers</li>
                <li>• Large Numbers</li>
                <li>• Error Conditions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestPage