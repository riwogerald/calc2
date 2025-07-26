import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CalculatorPage from './pages/CalculatorPage';
import TestPage from './pages/TestPage';
import Navigation from './components/Navigation';
function App() {
    return (_jsxs("div", { className: "min-h-screen", children: [_jsx(Navigation, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/calculator", element: _jsx(CalculatorPage, {}) }), _jsx(Route, { path: "/test", element: _jsx(TestPage, {}) })] })] }));
}
export default App;
