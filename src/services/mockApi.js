// Simple expression evaluator for basic operations
function evaluateExpression(expression) {
    try {
        // Remove whitespace
        const cleaned = expression.replace(/\s/g, '');
        // Handle basic arithmetic (this is a simplified version)
        // For a full deployment, you'd want a more robust parser
        const result = Function(`"use strict"; return (${cleaned})`)();
        return result.toString();
    }
    catch (error) {
        throw new Error(`Invalid expression: ${expression}`);
    }
}
export const mockApi = {
    async calculate(expression) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 300));
        try {
            // Handle special cases
            if (expression.includes('!')) {
                // Simple factorial for small numbers
                const match = expression.match(/(\d+)!/);
                if (match) {
                    const num = parseInt(match[1]);
                    if (num > 20)
                        return { result: "Factorial too large for demo" };
                    let result = 1;
                    for (let i = 2; i <= num; i++)
                        result *= i;
                    return { result: result.toString() };
                }
            }
            if (expression.includes('^')) {
                // Simple power operation
                const parts = expression.split('^');
                if (parts.length === 2) {
                    const base = parseFloat(parts[0]);
                    const exp = parseFloat(parts[1]);
                    return { result: Math.pow(base, exp).toString() };
                }
            }
            // Handle sqrt
            if (expression.includes('sqrt')) {
                const match = expression.match(/sqrt\(([^)]+)\)/);
                if (match) {
                    const num = parseFloat(match[1]);
                    return { result: Math.sqrt(num).toString() };
                }
            }
            // Handle ln and log
            if (expression.includes('ln')) {
                const match = expression.match(/ln\(([^)]+)\)/);
                if (match) {
                    const num = parseFloat(match[1]);
                    return { result: Math.log(num).toString() };
                }
            }
            // Basic arithmetic evaluation
            const result = evaluateExpression(expression.replace(/\^/g, '**'));
            return { result };
        }
        catch (error) {
            return {
                result: '',
                error: error instanceof Error ? error.message : 'Calculation error'
            };
        }
    },
    async runTests() {
        const tests = [
            { name: "Basic Addition", expression: "2 + 3", expected: "5" },
            { name: "Basic Subtraction", expression: "10 - 4", expected: "6" },
            { name: "Basic Multiplication", expression: "7 * 8", expected: "56" },
            { name: "Basic Division", expression: "15 / 3", expected: "5" },
            { name: "Power Operation", expression: "2^8", expected: "256" },
            { name: "Small Factorial", expression: "5!", expected: "120" },
            { name: "Square Root", expression: "sqrt(16)", expected: "4" },
            { name: "Natural Logarithm", expression: "ln(2.718281828459045)", expected: "1" },
        ];
        const results = [];
        for (const test of tests) {
            const startTime = Date.now();
            try {
                const result = await this.calculate(test.expression);
                const duration = Date.now() - startTime;
                if (result.error) {
                    results.push({
                        name: test.name,
                        status: 'failed',
                        duration,
                        error: result.error
                    });
                }
                else {
                    const passed = Math.abs(parseFloat(result.result) - parseFloat(test.expected)) < 0.0001;
                    results.push({
                        name: test.name,
                        status: passed ? 'passed' : 'failed',
                        duration,
                        output: result.result,
                        error: passed ? undefined : `Expected ${test.expected}, got ${result.result}`
                    });
                }
            }
            catch (error) {
                results.push({
                    name: test.name,
                    status: 'failed',
                    duration: Date.now() - startTime,
                    error: error instanceof Error ? error.message : 'Test failed'
                });
            }
        }
        return results;
    }
};
