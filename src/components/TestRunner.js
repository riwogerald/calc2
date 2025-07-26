import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
const TestRunner = ({ tests, isRunning }) => {
    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return _jsx(Clock, { className: "h-5 w-5 text-gray-400" });
            case 'running':
                return _jsx(Loader2, { className: "h-5 w-5 text-purple-600 animate-spin" });
            case 'passed':
                return _jsx(CheckCircle, { className: "h-5 w-5 text-green-600" });
            case 'failed':
                return _jsx(XCircle, { className: "h-5 w-5 text-red-600" });
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'text-gray-600 bg-gray-50';
            case 'running':
                return 'text-purple-700 bg-purple-50 animate-pulse-soft';
            case 'passed':
                return 'text-green-700 bg-green-50';
            case 'failed':
                return 'text-red-700 bg-red-50';
        }
    };
    return (_jsxs("div", { className: "space-y-3", children: [tests.map((test, index) => (_jsxs("div", { className: `p-4 rounded-lg border transition-all duration-300 ${getStatusColor(test.status)}`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [getStatusIcon(test.status), _jsx("span", { className: "font-medium", children: test.name })] }), test.duration && (_jsxs("span", { className: "text-sm opacity-75", children: [test.duration, "ms"] }))] }), test.error && (_jsx("div", { className: "mt-2 p-2 bg-red-100 rounded text-sm text-red-700 font-mono", children: test.error })), test.output && test.status === 'passed' && (_jsx("div", { className: "mt-2 text-sm opacity-75", children: "\u2713 All assertions passed" }))] }, index))), !isRunning && tests.every(t => t.status === 'pending') && (_jsxs("div", { className: "text-center py-8 text-gray-500", children: [_jsx(Clock, { className: "h-12 w-12 mx-auto mb-3 opacity-50" }), _jsx("p", { children: "Click \"Run All Tests\" to start testing" })] }))] }));
};
export default TestRunner;
