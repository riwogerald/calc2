# Arbitrary-Precision Integer Calculator (`calc.py`)

## Overview

This Python script implements an **arbitrary-precision integer calculator** without relying on any external libraries or the language's native arbitrary-precision support. It includes its own classes for handling big integers and rational numbers, as well as a recursive descent parser and evaluator to process mathematical expressions entered by the user. The calculator supports a range of operations and functions and is wrapped in a **REPL (Read-Eval-Print Loop)** interface.

## Original Problem Statement

**Problem 2: Arbitrary precision integer calculator**

Write an arbitrary-precision-integer calculator in a language that doesn't have native support and without relying on any libraries for the core functionality. Wrap it in a REPL. It should support at least addition, subtraction, multiplication, division (and modulo), exponentiation and factorial. Bonus points for supporting non-decimal bases, fractions, logarithms, etc.

## Features

- **Arbitrary-Precision Integers**: Supports integers of any size limited only by available memory.
- **Basic Arithmetic Operations**: Addition (`+`), subtraction (`-`), multiplication (`*`), division (`/`), modulo (`%`), and exponentiation (`^`).
- **Factorial Operator**: Computes factorials using the `!` operator.
- **Fractions Support**: Handles rational numbers through a custom `BigRational` class.
- **Logarithmic Functions**: Supports natural logarithm (`ln()`) and common logarithm (`log()`).
- **Operator Precedence and Associativity**: Correctly parses expressions respecting mathematical operator precedence.
- **Parentheses**: Supports grouping of expressions using parentheses `(` and `)`.
- **REPL Interface**: Interactive command-line interface for entering and evaluating expressions.
- **Web Interface**: Modern React-based web interface with calculator and test runner.

## Web Interface

The calculator now includes a modern web interface built with React and TypeScript:

### Features:
- **Homepage**: Overview of features and capabilities
- **Calculator Interface**: Interactive calculator with visual keypad and history
- **Test Runner**: Comprehensive test suite with real-time results
- **Responsive Design**: Works on desktop and mobile devices
- **Syntax Highlighting**: Color-coded mathematical expressions with purple/teal theme
- **History Tracking**: Saves and displays calculation history
- **Copy Results**: Easy copying of calculation results
- **Smart Fallback**: Automatically uses mock API when backend is unavailable (demo deployment)
- **Progressive Enhancement**: Works offline with client-side calculations for basic operations

### Running the Web Interface:

1. **Start the Python API server**:
   ```bash
   python server.py
   ```

2. **Start the web development server**:
   ```bash
   npm run dev
   ```

3. **Access the application**:
   - Open your browser to `http://localhost:5173`
   - The calculator API runs on `http://localhost:8000`
   - **Live Demo**: [https://apicalculator-v2.netlify.app/calculator](https://apicalculator-v2.netlify.app/calculator)

## Why This Approach Was Chosen

The main objective was to create a calculator that handles arbitrary-precision arithmetic **without relying on external libraries** or the language's built-in arbitrary-precision features. This requires implementing fundamental arithmetic operations manually, which provides greater control over the computations and deepens understanding of how these operations work at a low level.

### Key Reasons:

1. **Educational Value**: Building the calculator from scratch demonstrates proficiency in fundamental programming principles and algorithms for big number arithmetic.
2. **No External Dependencies**: By avoiding external libraries, the calculator remains self-contained and portable.
3. **Customization and Extendibility**: Implementing core functionality allows for easier addition of new features, such as fractions and logarithmic functions, tailored to specific requirements.

## Implementation Details

### BigInteger Class

- **Representation**: Stores the number as a string of digits and a sign indicator (`1` for positive, `-1` for negative).
- **Initialization**: Parses string inputs to handle arbitrarily large numbers and signs.
- **Arithmetic Operations**:
  - **Addition and Subtraction**: Implements digit-wise addition and subtraction with proper handling of signs and carries/borrows.
  - **Multiplication**: Uses a digit-wise multiplication algorithm similar to the traditional manual method.
  - **Division and Modulo**: Performs long division, returning both quotient and remainder.
  - **Exponentiation**: Implements power function using exponentiation by squaring.
  - **Factorial**: Calculates factorial using iterative multiplication.
- **Comparison Operators**: Overloads comparison operators (`==`, `!=`, `<`, `<=`, `>`, `>=`) for comparing `BigInteger` instances.
- **Utilities**: Provides methods for absolute value and negation.

### BigRational Class

- **Representation**: Consists of a numerator and a denominator, both of which are `BigInteger` instances.
- **Arithmetic Operations**:
  - **Addition and Subtraction**: Uses common denominators to add or subtract fractions.
  - **Multiplication and Division**: Multiplies or divides numerators and denominators respectively.
  - **Exponentiation**: Raises numerator and denominator to the given power.
- **Simplification**: Reduces fractions to their simplest form by dividing numerator and denominator by their greatest common divisor (GCD).
- **Decimal Conversion**: Converts fractions to decimal representation, handling repeating decimals.

### Arithmetic Functions

- **String-Based Computations**: All arithmetic is performed using strings to represent numbers, allowing for arbitrary precision.
- **Supporting Functions**: Includes helper functions like `compare_strings`, `add_strings`, `subtract_strings`, etc., to manipulate numerical strings.

### Parsing and Evaluation

- **Lexer (Tokenizer)**: Converts input strings into a sequence of tokens representing numbers, operators, parentheses, and functions.
- **Parser**: Implements a recursive descent parser that constructs an Abstract Syntax Tree (AST) from the tokens.
- **Evaluator**: Traverses the AST to compute the result of the expression, performing operations as defined in the AST nodes.
- **Function Handling**: Supports functions like `ln` and `log` by mapping function calls in the AST to corresponding evaluator methods.

### REPL Interface

- **Interactive Loop**: Reads expressions from the user, evaluates them, and prints the results.
- **Command Handling**: Recognizes `exit` or `quit` commands to terminate the program.
- **Error Handling**: Catches and displays errors without crashing, allowing the user to continue using the calculator.

## How to Use

### Command Line Interface

1. **Run the Script**: 
   ```bash
   python calc.py
   ```

2. **Enter Expressions**: Type mathematical expressions at the prompt. 
   Examples:
   - Basic arithmetic: `12345678901234567890 + 98765432109876543210`
   - Factorial: `20!`
   - Exponentiation: `2 ^ 64`
   - Fractions: `1/2 + 3/4`
   - Logarithms: `ln(2)`, `log(100)`
   - Exit: Type `exit` or `quit` to leave the calculator.

### Web Interface

1. **Start the servers** (as described above)
2. **Navigate** to the calculator page
3. **Use the visual keypad** or type expressions directly
4. **View history** of calculations
5. **Run tests** to verify functionality

## Testing

The calculator includes comprehensive tests in `test_calc.py`:

- **BigInteger Operations**: Tests for all arithmetic operations
- **BigRational Operations**: Tests for fraction handling
- **Expression Evaluation**: Tests for complex expressions
- **Edge Cases**: Tests for boundary conditions and error handling

Run tests via:
- Command line: `python test_calc.py`
- Web interface: Navigate to the Test page and click "Run All Tests"

## Limitations

- **Negative Exponents in BigInteger**: Exponents must be non-negative integers when using BigInteger.
- **Floating-Point Numbers**: Does not support floating-point numbers directly; uses BigRational for fractions.
- **Performance**: Operations on extremely large numbers may be slow due to the use of basic algorithms.
- **Logarithm Precision**: The ln and log functions use numerical approximation methods and may have limited precision.

## Deployment

### Live Demo
The calculator is deployed and accessible at:
**[https://apicalculator-v2.netlify.app/calculator](https://apicalculator-v2.netlify.app/calculator)**

### Deployment Architecture
- **Frontend**: Deployed on Netlify with static hosting
- **Backend**: Uses intelligent fallback system
  - Attempts to connect to full Python backend when available (local development)
  - Automatically falls back to client-side mock API for demo deployment
  - Supports all basic operations: +, -, *, /, ^, !, sqrt(), ln(), log()
  - Maintains full functionality in both modes

### Mock API Features
- Simulates backend responses for demonstration
- Supports all calculator operations with JavaScript implementations
- Includes realistic test suite execution
- Provides network delay simulation for authentic feel
- Seamless user experience regardless of backend availability

## Technology Stack

### Backend
- **Python 3**: Core calculator implementation
- **HTTP Server**: Simple API server for web interface
- **Mock API**: TypeScript/JavaScript fallback for demo deployment

### Frontend
- **React 18**: Modern UI framework
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework with purple/teal theme
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **Lucide React**: Modern icon library

## Conclusion

By implementing the core functionality manually, this calculator provides an educational tool for understanding arbitrary-precision arithmetic, parsing, and expression evaluation in programming. It demonstrates how fundamental mathematical operations can be performed without the aid of built-in high-level functions or external libraries. The addition of a modern web interface makes the calculator more accessible and user-friendly while maintaining the educational value of the underlying implementation.