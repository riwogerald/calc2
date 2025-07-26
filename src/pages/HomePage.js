import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { Calculator, TestTube, Infinity, Zap, Shield, Code } from 'lucide-react';
const HomePage = () => {
    const features = [
        {
            icon: Infinity,
            title: 'Arbitrary Precision',
            description: 'Handle numbers of unlimited size, limited only by memory'
        },
        {
            icon: Zap,
            title: 'Fast Operations',
            description: 'Optimized algorithms for addition, multiplication, and more'
        },
        {
            icon: Shield,
            title: 'No Dependencies',
            description: 'Pure implementation without external libraries'
        },
        {
            icon: Code,
            title: 'Advanced Functions',
            description: 'Supports logarithms, factorials, fractions, and more'
        }
    ];
    const operations = [
        'Basic Arithmetic (+, -, *, /, %)',
        'Exponentiation (^)',
        'Factorial (!)',
        'Logarithms (ln, log)',
        'Square Root (sqrt)',
        'Absolute Value (abs)',
        'Fractions (1/2 + 3/4)',
        'Parentheses for grouping'
    ];
    return (_jsxs("div", { className: "min-h-screen", children: [_jsxs("section", { className: "relative overflow-hidden py-20 px-4", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-purple-600/10 to-teal-600/10" }), _jsx("div", { className: "relative max-w-7xl mx-auto text-center", children: _jsxs("div", { className: "animate-fade-in", children: [_jsxs("h1", { className: "text-5xl md:text-7xl font-bold text-gray-900 mb-6", children: ["Arbitrary-Precision", _jsx("span", { className: "block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-teal-600", children: "Calculator" })] }), _jsx("p", { className: "text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto", children: "A powerful calculator that handles numbers of unlimited size without relying on external libraries. Built from scratch with pure algorithms." }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [_jsxs(Link, { to: "/calculator", className: "button-primary", children: [_jsx(Calculator, { className: "inline-block w-5 h-5 mr-2" }), "Start Calculating"] }), _jsxs(Link, { to: "/test", className: "button-secondary", children: [_jsx(TestTube, { className: "inline-block w-5 h-5 mr-2" }), "Run Tests"] })] })] }) })] }), _jsx("section", { className: "py-20 px-4", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("h2", { className: "text-4xl font-bold text-gray-900 mb-4", children: "Why ArbiCalc?" }), _jsx("p", { className: "text-xl text-gray-600 max-w-2xl mx-auto", children: "Built to demonstrate mastery of fundamental algorithms and provide unlimited precision arithmetic" })] }), _jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-8", children: features.map((feature, index) => (_jsxs("div", { className: "glass-effect p-6 rounded-xl hover:shadow-2xl transition-all duration-300 animate-slide-up", style: { animationDelay: `${index * 0.1}s` }, children: [_jsx(feature.icon, { className: "h-12 w-12 text-purple-600 mb-4" }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: feature.title }), _jsx("p", { className: "text-gray-600", children: feature.description })] }, index))) })] }) }), _jsx("section", { className: "py-20 px-4 bg-gradient-to-r from-purple-50 to-teal-50", children: _jsx("div", { className: "max-w-7xl mx-auto", children: _jsxs("div", { className: "grid lg:grid-cols-2 gap-12 items-center", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-4xl font-bold text-gray-900 mb-6", children: "Supported Operations" }), _jsx("p", { className: "text-xl text-gray-600 mb-8", children: "From basic arithmetic to advanced mathematical functions, ArbiCalc handles it all with precision." }), _jsx("div", { className: "grid sm:grid-cols-2 gap-4", children: operations.map((operation, index) => (_jsxs("div", { className: "flex items-center space-x-3 p-3 bg-white/60 rounded-lg", children: [_jsx("div", { className: "w-2 h-2 bg-purple-600 rounded-full" }), _jsx("span", { className: "text-gray-700 font-mono text-sm", children: operation })] }, index))) })] }), _jsxs("div", { className: "glass-effect p-8 rounded-xl", children: [_jsx("h3", { className: "text-2xl font-semibold text-gray-900 mb-6", children: "Example Calculations" }), _jsxs("div", { className: "space-y-4 font-mono text-sm", children: [_jsxs("div", { className: "p-4 bg-gray-50 rounded-lg", children: [_jsx("div", { className: "text-purple-600 mb-1", children: "Input:" }), _jsx("div", { className: "text-gray-800", children: "123456789012345678901234567890 * 987654321098765432109876543210" })] }), _jsxs("div", { className: "p-4 bg-gray-50 rounded-lg", children: [_jsx("div", { className: "text-purple-600 mb-1", children: "Input:" }), _jsx("div", { className: "text-gray-800", children: "20!" })] }), _jsxs("div", { className: "p-4 bg-gray-50 rounded-lg", children: [_jsx("div", { className: "text-purple-600 mb-1", children: "Input:" }), _jsx("div", { className: "text-gray-800", children: "2^64" })] }), _jsxs("div", { className: "p-4 bg-gray-50 rounded-lg", children: [_jsx("div", { className: "text-purple-600 mb-1", children: "Input:" }), _jsx("div", { className: "text-gray-800", children: "1/2 + 3/4" })] })] })] })] }) }) }), _jsx("section", { className: "py-20 px-4", children: _jsxs("div", { className: "max-w-4xl mx-auto text-center", children: [_jsx("h2", { className: "text-4xl font-bold text-gray-900 mb-6", children: "Ready to Calculate?" }), _jsx("p", { className: "text-xl text-gray-600 mb-8", children: "Experience the power of arbitrary-precision arithmetic in your browser" }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [_jsxs(Link, { to: "/calculator", className: "button-primary text-lg px-8 py-4", children: [_jsx(Calculator, { className: "inline-block w-6 h-6 mr-2" }), "Open Calculator"] }), _jsxs(Link, { to: "/test", className: "button-secondary text-lg px-8 py-4", children: [_jsx(TestTube, { className: "inline-block w-6 h-6 mr-2" }), "View Tests"] })] })] }) })] }));
};
export default HomePage;
