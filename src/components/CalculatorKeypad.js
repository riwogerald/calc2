import { jsx as _jsx } from "react/jsx-runtime";
import { Delete } from 'lucide-react';
const CalculatorKeypad = ({ onKeyPress }) => {
    const buttons = [
        // Row 1
        [
            { label: 'C', value: 'C', className: 'calc-button text-red-600 hover:text-red-700' },
            { label: '(', value: '(', className: 'calc-button' },
            { label: ')', value: ')', className: 'calc-button' },
            { label: '⌫', value: '⌫', className: 'calc-button text-red-600 hover:text-red-700', icon: Delete },
        ],
        // Row 2
        [
            { label: '7', value: '7', className: 'calc-button' },
            { label: '8', value: '8', className: 'calc-button' },
            { label: '9', value: '9', className: 'calc-button' },
            { label: '÷', value: '/', className: 'calc-button-operator' },
        ],
        // Row 3
        [
            { label: '4', value: '4', className: 'calc-button' },
            { label: '5', value: '5', className: 'calc-button' },
            { label: '6', value: '6', className: 'calc-button' },
            { label: '×', value: '*', className: 'calc-button-operator' },
        ],
        // Row 4
        [
            { label: '1', value: '1', className: 'calc-button' },
            { label: '2', value: '2', className: 'calc-button' },
            { label: '3', value: '3', className: 'calc-button' },
            { label: '−', value: '-', className: 'calc-button-operator' },
        ],
        // Row 5
        [
            { label: '0', value: '0', className: 'calc-button' },
            { label: '.', value: '.', className: 'calc-button' },
            { label: '!', value: '!', className: 'calc-button-operator' },
            { label: '+', value: '+', className: 'calc-button-operator' },
        ],
        // Row 6
        [
            { label: '^', value: '^', className: 'calc-button-operator' },
            { label: '%', value: '%', className: 'calc-button-operator' },
            { label: 'ln', value: 'ln(', className: 'calc-button text-green-600 hover:text-green-700' },
            { label: '=', value: '=', className: 'calc-button-equals' },
        ],
        // Row 7 - Functions
        [
            { label: 'log', value: 'log(', className: 'calc-button text-green-600 hover:text-green-700' },
            { label: 'sqrt', value: 'sqrt(', className: 'calc-button text-green-600 hover:text-green-700' },
            { label: 'abs', value: 'abs(', className: 'calc-button text-green-600 hover:text-green-700' },
            { label: '±', value: '-', className: 'calc-button-operator' },
        ],
    ];
    return (_jsx("div", { className: "space-y-3", children: buttons.map((row, rowIndex) => (_jsx("div", { className: "grid grid-cols-4 gap-3", children: row.map((button, buttonIndex) => (_jsx("button", { onClick: () => onKeyPress(button.value), className: button.className, title: button.label, children: button.icon ? (_jsx(button.icon, { className: "h-5 w-5 mx-auto" })) : (button.label) }, buttonIndex))) }, rowIndex))) }));
};
export default CalculatorKeypad;
