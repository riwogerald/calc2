import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from 'react-router-dom';
import { Calculator, Home, TestTube } from 'lucide-react';
const Navigation = () => {
    const location = useLocation();
    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/calculator', icon: Calculator, label: 'Calculator' },
        { path: '/test', icon: TestTube, label: 'Tests' },
    ];
    return (_jsx("nav", { className: "glass-effect sticky top-0 z-50 border-b", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Calculator, { className: "h-8 w-8 text-purple-600" }), _jsx("span", { className: "text-xl font-bold text-gray-900", children: "ArbiCalc" })] }), _jsx("div", { className: "flex space-x-1", children: navItems.map(({ path, icon: Icon, label }) => (_jsxs(Link, { to: path, className: `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${location.pathname === path
                                ? 'bg-purple-100 text-purple-700 font-medium'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`, children: [_jsx(Icon, { className: "h-4 w-4" }), _jsx("span", { className: "hidden sm:inline", children: label })] }, path))) })] }) }) }));
};
export default Navigation;
