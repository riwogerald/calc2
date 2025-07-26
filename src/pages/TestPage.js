import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { TestTube, Play, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import TestRunner from '../components/TestRunner';
import TestResults from '../components/TestResults';
import { mockApi } from '../services/mockApi';
const TestPage = () => {
    const [tests, setTests] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [overallStatus, setOverallStatus] = useState('idle');
    const testSuites = [
        'BigInteger Operations',
        'BigRational Operations',
        'Expression Evaluation',
        'Edge Cases'
    ];
    useEffect(() => {
        // Initialize test results
        setTests(testSuites.map(name => ({
            name,
            status: 'pending'
        })));
    }, []);
    const runTests = async () => {
        setIsRunning(true);
        setOverallStatus('running');
        // Reset all tests to pending
        setTests(prev => prev.map(test => ({ ...test, status: 'pending' })));
        try {
            let testResults;
            try {
                // Try real backend first
                const response = await fetch('http://localhost:8000/test', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Backend not available');
                }
                const data = await response.json();
                // Show actual test results from the backend
                if (data.status === 'completed' && data.results) {
                    testResults = data.results.map((result) => ({
                        name: result.name,
                        status: result.status,
                        duration: result.duration,
                        output: result.output,
                        error: result.error
                    }));
                }
                else {
                    throw new Error('Invalid response format');
                }
            }
            catch (backendError) {
                // Fallback to mock API for demo
                const mockResults = await mockApi.runTests();
                testResults = mockResults;
            }
            // Update tests with results
            setTests(testResults);
        }
        catch (error) {
            // Mark all tests as failed
            setTests(prev => prev.map(test => ({
                ...test,
                status: 'failed',
                error: 'Failed to execute tests'
            })));
        }
        finally {
            setIsRunning(false);
            setOverallStatus('completed');
        }
    };
    const resetTests = () => {
        setTests(prev => prev.map(test => ({
            name: test.name,
            status: 'pending'
        })));
        setOverallStatus('idle');
    };
    const passedTests = tests.filter(t => t.status === 'passed').length;
    const failedTests = tests.filter(t => t.status === 'failed').length;
    const totalTests = tests.length;
    return (_jsx("div", { className: "min-h-screen py-8 px-4", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsxs("h1", { className: "text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3", children: [_jsx(TestTube, { className: "h-10 w-10 text-green-600" }), "Test Suite"] }), _jsx("p", { className: "text-gray-600", children: "Comprehensive tests for the arbitrary-precision calculator" })] }), _jsx("div", { className: "glass-effect rounded-xl p-6 mb-8", children: _jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: runTests, disabled: isRunning, className: `flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${isRunning
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'}`, children: isRunning ? (_jsxs(_Fragment, { children: [_jsx(RefreshCw, { className: "h-5 w-5 animate-spin" }), "Running Tests..."] })) : (_jsxs(_Fragment, { children: [_jsx(Play, { className: "h-5 w-5" }), "Run All Tests"] })) }), overallStatus === 'completed' && (_jsxs("button", { onClick: resetTests, className: "flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors", children: [_jsx(RefreshCw, { className: "h-4 w-4" }), "Reset"] }))] }), overallStatus !== 'idle' && (_jsxs("div", { className: "flex items-center gap-6 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CheckCircle, { className: "h-5 w-5 text-green-600" }), _jsxs("span", { className: "text-green-700 font-medium", children: [passedTests, " Passed"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(XCircle, { className: "h-5 w-5 text-red-600" }), _jsxs("span", { className: "text-red-700 font-medium", children: [failedTests, " Failed"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { className: "h-5 w-5 text-gray-600" }), _jsxs("span", { className: "text-gray-700 font-medium", children: [totalTests, " Total"] })] })] }))] }) }), _jsxs("div", { className: "grid lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "glass-effect rounded-xl p-6", children: [_jsx("h2", { className: "text-2xl font-semibold text-gray-900 mb-6", children: "Test Execution" }), _jsx(TestRunner, { tests: tests, isRunning: isRunning })] }), _jsxs("div", { className: "glass-effect rounded-xl p-6", children: [_jsx("h2", { className: "text-2xl font-semibold text-gray-900 mb-6", children: "Results" }), _jsx(TestResults, { tests: tests })] })] }), _jsxs("div", { className: "mt-8 glass-effect rounded-xl p-6", children: [_jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Test Coverage" }), _jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-medium text-gray-700", children: "BigInteger Tests" }), _jsxs("ul", { className: "text-sm text-gray-600 space-y-1", children: [_jsx("li", { children: "\u2022 Addition & Subtraction" }), _jsx("li", { children: "\u2022 Multiplication" }), _jsx("li", { children: "\u2022 Division & Modulo" }), _jsx("li", { children: "\u2022 Exponentiation" }), _jsx("li", { children: "\u2022 Comparison Operations" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-medium text-gray-700", children: "BigRational Tests" }), _jsxs("ul", { className: "text-sm text-gray-600 space-y-1", children: [_jsx("li", { children: "\u2022 Fraction Operations" }), _jsx("li", { children: "\u2022 Simplification" }), _jsx("li", { children: "\u2022 Decimal Conversion" }), _jsx("li", { children: "\u2022 Mixed Operations" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-medium text-gray-700", children: "Expression Tests" }), _jsxs("ul", { className: "text-sm text-gray-600 space-y-1", children: [_jsx("li", { children: "\u2022 Complex Expressions" }), _jsx("li", { children: "\u2022 Function Calls" }), _jsx("li", { children: "\u2022 Operator Precedence" }), _jsx("li", { children: "\u2022 Parentheses Handling" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-medium text-gray-700", children: "Edge Cases" }), _jsxs("ul", { className: "text-sm text-gray-600 space-y-1", children: [_jsx("li", { children: "\u2022 Zero Operations" }), _jsx("li", { children: "\u2022 Negative Numbers" }), _jsx("li", { children: "\u2022 Large Numbers" }), _jsx("li", { children: "\u2022 Error Conditions" })] })] })] })] })] }) }));
};
export default TestPage;
