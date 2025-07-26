import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Copy, Check, Loader2 } from 'lucide-react';
const CalculatorDisplay = ({ expression, result, isCalculating, onCopyResult, copied }) => {
    const formatExpression = (expr) => {
        // Simple syntax highlighting using CSS classes defined in index.css
        return expr.replace(/(\d+)/g, '<span class="number">$1</span>')
            .replace(/([+\-*/^%!])/g, '<span class="operator">$1</span>')
            .replace(/(ln|log|sqrt|abs)/g, '<span class="function">$1</span>')
            .replace(/([()])/g, '<span class="parenthesis">$1</span>');
    };
    return (_jsxs("div", { className: "mb-6", children: [_jsx("div", { className: "bg-gray-50 rounded-lg p-4 mb-4 min-h-[60px] flex items-center", children: _jsx("div", { className: "flex-1", children: expression ? (_jsx("div", { className: "expression-display text-right", dangerouslySetInnerHTML: { __html: formatExpression(expression) } })) : (_jsx("div", { className: "text-gray-400 text-right font-mono text-lg", children: "Enter an expression..." })) }) }), _jsxs("div", { className: "bg-gradient-to-r from-purple-50 to-teal-50 rounded-lg p-4 min-h-[80px] flex items-center justify-between", children: [_jsx("div", { className: "flex-1", children: isCalculating ? (_jsxs("div", { className: "flex items-center justify-center text-purple-600", children: [_jsx(Loader2, { className: "h-6 w-6 animate-spin mr-2" }), _jsx("span", { className: "font-medium", children: "Calculating..." })] })) : result ? (_jsx("div", { className: "text-right", children: _jsx("div", { className: "text-2xl font-bold text-gray-900 font-mono break-all result-animation", children: result }) })) : (_jsx("div", { className: "text-gray-400 text-right text-xl font-mono", children: "Result will appear here" })) }), result && !isCalculating && (_jsx("button", { onClick: onCopyResult, className: "ml-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-all duration-200 flex-shrink-0", title: "Copy result", children: copied ? (_jsx(Check, { className: "h-5 w-5 text-green-600" })) : (_jsx(Copy, { className: "h-5 w-5" })) }))] })] }));
};
export default CalculatorDisplay;
