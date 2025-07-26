import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Clock, Copy } from 'lucide-react';
const HistoryPanel = ({ history, onSelect, visible }) => {
    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    const formatExpression = (expr) => {
        // Simple syntax highlighting using CSS classes defined in index.css
        return expr.replace(/(\d+)/g, '<span class="number">$1</span>')
            .replace(/([+\-*/^%!])/g, '<span class="operator">$1</span>')
            .replace(/(ln|log|sqrt|abs)/g, '<span class="function">$1</span>')
            .replace(/([()])/g, '<span class="parenthesis">$1</span>');
    };
    const copyToClipboard = async (text, event) => {
        event.stopPropagation();
        try {
            await navigator.clipboard.writeText(text);
        }
        catch (error) {
            console.error('Failed to copy:', error);
        }
    };
    if (!visible)
        return null;
    return (_jsx("div", { className: "h-96 overflow-y-auto", children: history.length === 0 ? (_jsxs("div", { className: "text-center text-gray-500 py-8", children: [_jsx(Clock, { className: "h-12 w-12 mx-auto mb-3 opacity-50" }), _jsx("p", { children: "No calculations yet" }), _jsx("p", { className: "text-sm", children: "Your calculation history will appear here" })] })) : (_jsx("div", { className: "space-y-2", children: history.map((entry) => (_jsxs("div", { onClick: () => onSelect(entry), className: "p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors group", children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsxs("div", { className: "text-xs text-gray-500 flex items-center gap-1", children: [_jsx(Clock, { className: "h-3 w-3" }), formatTime(entry.timestamp)] }), _jsx("button", { onClick: (e) => copyToClipboard(entry.result, e), className: "opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-all", title: "Copy result", children: _jsx(Copy, { className: "h-3 w-3" }) })] }), _jsx("div", { className: "expression-display font-mono text-sm mb-1 text-gray-700 break-all", dangerouslySetInnerHTML: { __html: formatExpression(entry.expression) } }), _jsxs("div", { className: "font-mono text-sm font-medium text-purple-600 break-all", children: ["= ", entry.result] })] }, entry.id))) })) }));
};
export default HistoryPanel;
