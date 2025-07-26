import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { Calculator, History, Trash2 } from 'lucide-react';
import CalculatorDisplay from '../components/CalculatorDisplay';
import CalculatorKeypad from '../components/CalculatorKeypad';
import HistoryPanel from '../components/HistoryPanel';
import { mockApi } from '../services/mockApi';
const CalculatorPage = () => {
    const [expression, setExpression] = useState('');
    const [result, setResult] = useState('');
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);
    const [copied, setCopied] = useState(false);
    const evaluateExpression = useCallback(async (expr) => {
        if (!expr.trim())
            return;
        setIsCalculating(true);
        try {
            let data;
            try {
                // Try real backend first
                const response = await fetch('http://localhost:8000/calculate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ expression: expr }),
                });
                if (!response.ok) {
                    throw new Error('Backend not available');
                }
                data = await response.json();
            }
            catch (backendError) {
                // Fallback to mock API for demo
                data = await mockApi.calculate(expr);
            }
            const resultValue = data.result || data.error || 'Error';
            setResult(resultValue);
            // Add to history
            const historyEntry = {
                id: Date.now().toString(),
                expression: expr,
                result: resultValue,
                timestamp: new Date(),
            };
            setHistory(prev => [historyEntry, ...prev.slice(0, 49)]); // Keep last 50 entries
        }
        catch (error) {
            setResult('Error: Unable to calculate');
        }
        finally {
            setIsCalculating(false);
        }
    }, []);
    const handleKeyPress = useCallback((key) => {
        if (key === '=') {
            evaluateExpression(expression);
        }
        else if (key === 'C') {
            setExpression('');
            setResult('');
        }
        else if (key === '⌫') {
            setExpression(prev => prev.slice(0, -1));
        }
        else {
            setExpression(prev => prev + key);
        }
    }, [expression, evaluateExpression]);
    const handleHistorySelect = useCallback((entry) => {
        setExpression(entry.expression);
        setResult(entry.result);
        setShowHistory(false);
    }, []);
    const clearHistory = useCallback(() => {
        setHistory([]);
    }, []);
    const copyResult = useCallback(async () => {
        if (result) {
            try {
                await navigator.clipboard.writeText(result);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
            catch (error) {
                console.error('Failed to copy:', error);
            }
        }
    }, [result]);
    return (_jsx("div", { className: "min-h-screen py-8 px-4", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsxs("h1", { className: "text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3", children: [_jsx(Calculator, { className: "h-10 w-10 text-purple-600" }), "Arbitrary-Precision Calculator"] }), _jsx("p", { className: "text-gray-600", children: "Enter mathematical expressions with unlimited precision" })] }), _jsxs("div", { className: "grid lg:grid-cols-3 gap-8", children: [_jsx("div", { className: "lg:col-span-2", children: _jsxs("div", { className: "glass-effect rounded-2xl p-6 shadow-2xl", children: [_jsx(CalculatorDisplay, { expression: expression, result: result, isCalculating: isCalculating, onCopyResult: copyResult, copied: copied }), _jsx(CalculatorKeypad, { onKeyPress: handleKeyPress })] }) }), _jsx("div", { className: "lg:col-span-1", children: _jsxs("div", { className: "glass-effect rounded-2xl p-6 shadow-2xl h-full", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("h3", { className: "text-xl font-semibold text-gray-900 flex items-center gap-2", children: [_jsx(History, { className: "h-5 w-5 text-purple-600" }), "History"] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setShowHistory(!showHistory), className: "p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors", title: showHistory ? 'Hide History' : 'Show History', children: _jsx(History, { className: "h-4 w-4" }) }), history.length > 0 && (_jsx("button", { onClick: clearHistory, className: "p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors", title: "Clear History", children: _jsx(Trash2, { className: "h-4 w-4" }) }))] })] }), _jsx(HistoryPanel, { history: history, onSelect: handleHistorySelect, visible: showHistory || true })] }) })] }), _jsxs("div", { className: "mt-8 glass-effect rounded-xl p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Supported Operations" }), _jsxs("div", { className: "grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-medium text-gray-700", children: "Basic" }), _jsxs("div", { className: "space-y-1 text-gray-600 font-mono", children: [_jsx("div", { children: "+ - * / %" }), _jsx("div", { children: "^ (power)" }), _jsx("div", { children: "! (factorial)" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-medium text-gray-700", children: "Functions" }), _jsxs("div", { className: "space-y-1 text-gray-600 font-mono", children: [_jsx("div", { children: "ln(x)" }), _jsx("div", { children: "log(x)" }), _jsx("div", { children: "sqrt(x)" }), _jsx("div", { children: "abs(x)" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-medium text-gray-700", children: "Examples" }), _jsxs("div", { className: "space-y-1 text-gray-600 font-mono", children: [_jsx("div", { children: "2^64" }), _jsx("div", { children: "20!" }), _jsx("div", { children: "1/2 + 3/4" }), _jsx("div", { children: "ln(2)" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-medium text-gray-700", children: "Features" }), _jsxs("div", { className: "space-y-1 text-gray-600", children: [_jsx("div", { children: "Unlimited precision" }), _jsx("div", { children: "Fraction support" }), _jsx("div", { children: "Parentheses" }), _jsx("div", { children: "History tracking" })] })] })] })] })] }) }));
};
export default CalculatorPage;
