# test_calc.py

# Assuming that 'calc.py' is in the same directory or appropriately accessible
# and that it defines BigInteger, BigRational, tokenize, Parser, Evaluator

from calc import BigInteger, BigRational, tokenize, Parser, Evaluator

def test_big_integer_operations():
    print("=== Testing BigInteger Operations ===\n")

    # Initialize BigIntegers
    a = BigInteger('123456789012345678901234567890')
    b = BigInteger('987654321098765432109876543210')
    c = BigInteger('-112233445566778899')

    print(f"a = {a}")
    print(f"b = {b}")
    print(f"c = {c}\n")

    # Addition
    result_add = a + b
    print(f"{a} + {b} = {result_add}")

    # Subtraction
    result_sub = b - a
    print(f"{b} - {a} = {result_sub}")

    # Multiplication
    result_mul = a * b
    print(f"{a} * {b} = {result_mul}")

    # Floor Division
    result_div = b // a
    print(f"{b} // {a} = {result_div}")

    # Modulo
    result_mod = b % a
    print(f"{b} % {a} = {result_mod}")

    # Exponentiation
    exponent = BigInteger('5')
    result_pow = a ** exponent
    print(f"{a} ** {exponent} = {result_pow}\n")

def test_big_rational_operations():
    print("=== Testing BigRational (Fraction) Operations ===\n")

    # Initialize BigRationals
    r1 = BigRational(BigInteger('1'), BigInteger('3'))
    r2 = BigRational(BigInteger('2'), BigInteger('5'))
    r3 = BigRational(BigInteger('-7'), BigInteger('8'))

    print(f"r1 = {r1.to_fraction_string()}")  # Using to_fraction_string() to display as fraction
    print(f"r2 = {r2.to_fraction_string()}")
    print(f"r3 = {r3.to_fraction_string()}\n")

    # Addition
    result_add = r1 + r2
    print(f"{r1.to_fraction_string()} + {r2.to_fraction_string()} = {result_add.to_fraction_string()}")

    # Subtraction
    result_sub = r2 - r3
    print(f"{r2.to_fraction_string()} - {r3.to_fraction_string()} = {result_sub.to_fraction_string()}")

    # Multiplication
    result_mul = r1 * r3
    print(f"{r1.to_fraction_string()} * {r3.to_fraction_string()} = {result_mul.to_fraction_string()}")

    # Division
    result_div = r1 / r2
    print(f"{r1.to_fraction_string()} / {r2.to_fraction_string()} = {result_div.to_fraction_string()}")

    # Exponentiation
    exponent = BigInteger('3')
    result_pow = r2 ** exponent
    print(f"({r2.to_fraction_string()}) ** {exponent} = {result_pow.to_fraction_string()}\n")

def test_expression_evaluation():
    print("=== Testing Expression Evaluation ===\n")

    expressions = [
        "12345678901234567890 + 98765432109876543210",
        "10000000000000000000 - 9999999999999999999",
        "12345678901234567890 * 98765432109876543210",
        "98765432109876543210 / 12345678901234567890",
        "12345678909876543210 % 12345",
        "2 ^ 64",
        "20!",
        "log(100)",
        "ln(2)",
        "3 + 5 * (2 - 8)",
        "1/2 + 3/4",
        "5 ^ 3!",
    ]

    evaluator = Evaluator()

    for expr in expressions:
        print(f"Expression: {expr}")
        try:
            tokens = tokenize(expr)
            parser = Parser(tokens)
            ast = parser.parse()
            result = evaluator.visit(ast)
            # For BigRational, display as fraction
            if isinstance(result, BigRational):
                print(f"Result: {result.to_fraction_string()}\n")
            else:
                print(f"Result: {result}\n")
        except Exception as e:
            print(f"Error evaluating expression '{expr}': {e}\n")

def main():
    test_big_integer_operations()
    test_big_rational_operations()
    test_expression_evaluation()

if __name__ == "__main__":
    main()