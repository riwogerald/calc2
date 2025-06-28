class BigInteger:
    def __init__(self, value):
        # Initialize the BigInteger from a string value
        if isinstance(value, str):
            value = value.strip()
            if value.startswith('-'):
                self.sign = -1
                self.digits = value[1:]
            else:
                self.sign = 1
                if value.startswith('+'):
                    self.digits = value[1:]
                else:
                    self.digits = value
        elif isinstance(value, BigInteger):
            self.sign = value.sign
            self.digits = value.digits
        else:
            raise ValueError('Value must be a string representing an integer')
        if not self.digits.isdigit():
            raise ValueError('Invalid digits in integer')
        self.digits = self.digits.lstrip('0')  # Remove leading zeros
        if not self.digits:
            # Number is zero
            self.digits = '0'
            self.sign = 1  # Zero is unsigned

    def __str__(self):
        s = ''.join(self.digits)
        if self.sign == -1 and s != '0':
            return '-' + s
        else:
            return s
    
    def __repr__(self):
        return f"BigInteger('{str(self)}')"

    def __eq__(self, other):
        return self.sign == other.sign and self.digits == other.digits

    def __ne__(self, other):
        return not self == other

    def __lt__(self, other):
        if self.sign != other.sign:
            return self.sign < other.sign
        else:
            cmp = compare_strings(self.digits, other.digits)
            if self.sign == 1:
                return cmp < 0
            else:
                return cmp > 0

    def __le__(self, other):
        return self < other or self == other

    def __gt__(self, other):
        return not (self <= other)

    def __ge__(self, other):
        return not (self < other)

    def __add__(self, other):
        if self.sign == other.sign:
            # Same sign, add magnitudes
            sum_digits = add_strings(self.digits, other.digits)
            result = BigInteger('0')
            result.sign = self.sign
            result.digits = sum_digits
            return result
        else:
            # Different signs, subtract magnitudes
            cmp = compare_strings(self.digits, other.digits)
            if cmp == 0:
                # Magnitudes are equal, result is zero
                return BigInteger('0')
            elif cmp > 0:
                # self magnitude > other magnitude
                diff_digits = subtract_strings(self.digits, other.digits)
                result = BigInteger('0')
                result.sign = self.sign
                result.digits = diff_digits
                return result
            else:
                # self magnitude < other magnitude
                diff_digits = subtract_strings(other.digits, self.digits)
                result = BigInteger('0')
                result.sign = other.sign
                result.digits = diff_digits
                return result

    def __sub__(self, other):
        # Subtract other from self: self - other
        if self.sign != other.sign:
            # Different signs, add magnitudes
            sum_digits = add_strings(self.digits, other.digits)
            result = BigInteger('0')
            result.sign = self.sign
            result.digits = sum_digits
            return result
        else:
            # Same signs, subtract magnitudes
            cmp = compare_strings(self.digits, other.digits)
            if cmp == 0:
                # Magnitudes are equal, result is zero
                return BigInteger('0')
            elif cmp > 0:
                # self magnitude > other magnitude
                diff_digits = subtract_strings(self.digits, other.digits)
                result = BigInteger('0')
                result.sign = self.sign
                result.digits = diff_digits
                return result
            else:
                # self magnitude < other magnitude
                diff_digits = subtract_strings(other.digits, self.digits)
                result = BigInteger('0')
                result.sign = -self.sign  # Sign is opposite of self
                result.digits = diff_digits
                return result

    def __mul__(self, other):
        prod_digits = multiply_strings(self.digits, other.digits)
        result = BigInteger('0')
        result.sign = self.sign * other.sign
        result.digits = prod_digits
        return result

    def __floordiv__(self, other):
        if other.digits == '0':
            raise ZeroDivisionError('Division by zero')
        self_sign = self.sign
        other_sign = other.sign
        quotient_digits, remainder_digits = divide_strings(self.digits, other.digits)
        result = BigInteger('0')
        result.sign = self_sign * other_sign
        result.digits = quotient_digits
        return result

    def __mod__(self, other):
        if other.digits == '0':
            raise ZeroDivisionError('Modulo by zero')
        self_sign = self.sign
        other_sign = other.sign
        quotient_digits, remainder_digits = divide_strings(self.digits, other.digits)
        result = BigInteger('0')
        result.sign = self_sign  # Remainder takes the sign of dividend
        result.digits = remainder_digits
        return result

    def __truediv__(self, other):
        # Returns a BigRational
        if other.digits == '0':
            raise ZeroDivisionError('Division by zero')
        numerator = self
        denominator = other
        result = BigRational(numerator, denominator)
        return result

    def __pow__(self, exponent):
        if not isinstance(exponent, BigInteger):
            raise ValueError('Exponent must be BigInteger')
        if exponent.sign == -1:
            raise ValueError('Negative exponent is not supported for BigInteger')
        result = pow_bigint(self, exponent)
        return result

    def __abs__(self):
        result = BigInteger(str(self))
        result.sign = 1
        return result

    def __neg__(self):
        result = BigInteger(str(self))
        if self.digits != '0':
            result.sign = -self.sign
        return result

def compare_strings(num1, num2):
    # Compare magnitudes of num1 and num2
    if len(num1) > len(num2):
        return 1
    elif len(num1) < len(num2):
        return -1
    else:
        if num1 == num2:
            return 0
        elif num1 > num2:
            return 1
        else:
            return -1

def add_strings(num1, num2):
    # num1 and num2 are strings of digits
    # Returns string of digits
    maxlen = max(len(num1), len(num2))
    num1 = num1.zfill(maxlen)
    num2 = num2.zfill(maxlen)
    carry = 0
    result = []
    for i in range(maxlen - 1, -1, -1):
        n1 = int(num1[i])
        n2 = int(num2[i])
        total = n1 + n2 + carry
        result.append(str(total % 10))
        carry = total // 10
    if carry:
        result.append(str(carry))
    result_str = ''.join(result[::-1]).lstrip('0')
    if result_str == '':
        result_str = '0'
    return result_str

def subtract_strings(num1, num2):
    # num1 and num2 are strings of digits, num1 >= num2
    # Returns string of digits
    maxlen = max(len(num1), len(num2))
    num1 = num1.zfill(maxlen)
    num2 = num2.zfill(maxlen)
    borrow = 0
    result = []
    for i in range(maxlen - 1, -1, -1):
        n1 = int(num1[i])
        n2 = int(num2[i]) + borrow
        if n1 < n2:
            n1 += 10
            borrow = 1
        else:
            borrow = 0
        diff = n1 - n2
        result.append(str(diff))
    result_str = ''.join(result[::-1]).lstrip('0')
    if result_str == '':
        result_str = '0'
    return result_str

def multiply_strings(num1, num2):
    # num1 and num2 are strings of digits
    # Returns string of digits
    if num1 == '0' or num2 == '0':
        return '0'
    result = [0] * (len(num1) + len(num2))
    num1 = num1[::-1]
    num2 = num2[::-1]
    for i1, d1 in enumerate(num1):
        for i2, d2 in enumerate(num2):
            n1 = int(d1)
            n2 = int(d2)
            result[i1 + i2] += n1 * n2
            result[i1 + i2 + 1] += result[i1 + i2] // 10
            result[i1 + i2] = result[i1 + i2] % 10
    # Remove leading zeros
    while len(result) > 1 and result[-1] == 0:
        result.pop()
    result_str = ''.join(map(str, result[::-1]))
    return result_str

def divide_strings(num1, num2, decimal_places=0):
    # num1 and num2 are strings, num2 != '0'
    # Returns quotient, remainder
    if num2 == '0':
        raise ZeroDivisionError('Division by zero')
    if num1 == '0':
        return ('0', '0')
    cmp = compare_strings(num1, num2)
    if cmp < 0:
        return ('0', num1)  # Quotient is 0, remainder is num1
    elif cmp == 0:
        return ('1', '0')  # Quotient is 1, remainder is 0
    else:
        # num1 > num2
        quotient = ''
        remainder = ''
        n = len(num1)
        i = 0
        while i < n or (decimal_places > 0 and remainder != '0'):
            if i < n:
                remainder += num1[i]
                i += 1
            else:
                remainder += '0'
                decimal_places -= 1
            remainder = remainder.lstrip('0')
            if remainder == '':
                remainder = '0'
            count = 0
            while compare_strings(remainder, num2) >= 0:
                remainder = subtract_strings(remainder, num2)
                count += 1
            quotient += str(count)
        quotient = quotient.lstrip('0')
        if quotient == '':
            quotient = '0'
        remainder = remainder.lstrip('0')
        if remainder == '':
            remainder = '0'
        return (quotient, remainder)

def pow_bigint(base, exponent):
    result = BigInteger('1')
    base_pow = BigInteger(str(base))
    exp = BigInteger(str(exponent))
    while exp > BigInteger('0'):
        if int(exp.digits[-1]) % 2 == 1:
            result = result * base_pow
        base_pow = base_pow * base_pow
        exp = exp // BigInteger('2')
    return result

def factorial_bigint(n):
    if n.sign == -1:
        return BigInteger('0')
    result = BigInteger('1')
    i = BigInteger('1')
    while i <= n:
        result = result * i
        i = i + BigInteger('1')
    return result

def gcd(a, b):
    # GCD of BigIntegers a and b
    a_abs = abs(a)
    b_abs = abs(b)
    while b_abs != BigInteger('0'):
        a_abs, b_abs = b_abs, a_abs % b_abs
    return a_abs

class BigRational:
    def __init__(self, numerator, denominator=BigInteger('1')):
        if isinstance(numerator, BigInteger):
            self.numerator = numerator
        elif isinstance(numerator, BigRational):
            self.numerator = numerator.numerator
            self.denominator = numerator.denominator
            self.simplify()
            return
        else:
            raise ValueError('Numerator must be BigInteger or BigRational')
        if isinstance(denominator, BigInteger):
            self.denominator = denominator
        elif isinstance(denominator, BigRational):
            self.numerator = self.numerator * denominator.denominator
            self.denominator = self.denominator * denominator.numerator
            self.simplify()
            return
        else:
            raise ValueError('Denominator must be BigInteger or BigRational')
        
        if self.denominator == BigInteger('0'):
            raise ZeroDivisionError('Denominator cannot be zero')
            
        if self.denominator.sign == -1:
            self.numerator = -self.numerator
            self.denominator = abs(self.denominator)
        self.simplify()

    def simplify(self):
        gcd_value = gcd(abs(self.numerator), self.denominator)
        self.numerator = self.numerator // gcd_value
        self.denominator = self.denominator // gcd_value

    def __add__(self, other):
        if isinstance(other, BigInteger):
            other = BigRational(other)
        if not isinstance(other, BigRational):
            raise ValueError('Operand must be BigRational or BigInteger')
        numerator = self.numerator * other.denominator + other.numerator * self.denominator
        denominator = self.denominator * other.denominator
        return BigRational(numerator, denominator)

    def __sub__(self, other):
        if isinstance(other, BigInteger):
            other = BigRational(other)
        if not isinstance(other, BigRational):
            raise ValueError('Operand must be BigRational or BigInteger')
        numerator = self.numerator * other.denominator - other.numerator * self.denominator
        denominator = self.denominator * other.denominator
        return BigRational(numerator, denominator)

    def __mul__(self, other):
        if isinstance(other, BigInteger):
            other = BigRational(other)
        if not isinstance(other, BigRational):
            raise ValueError('Operand must be BigRational or BigInteger')
        numerator = self.numerator * other.numerator
        denominator = self.denominator * other.denominator
        return BigRational(numerator, denominator)

    def __truediv__(self, other):
        if isinstance(other, BigInteger):
            other = BigRational(other)
        if not isinstance(other, BigRational):
            raise ValueError('Operand must be BigRational or BigInteger')
        if other.numerator == BigInteger('0'):
            raise ZeroDivisionError('Division by zero')
        numerator = self.numerator * other.denominator
        denominator = self.denominator * other.numerator
        return BigRational(numerator, denominator)

    def __pow__(self, exponent):
        if not isinstance(exponent, BigInteger):
            raise ValueError('Exponent must be BigInteger')
        if exponent.sign == -1:
            new_numerator = pow_bigint(self.denominator, abs(exponent))
            new_denominator = pow_bigint(self.numerator, abs(exponent))
        else:
            new_numerator = pow_bigint(self.numerator, exponent)
            new_denominator = pow_bigint(self.denominator, exponent)
        return BigRational(new_numerator, new_denominator)

    def __abs__(self):
        return BigRational(abs(self.numerator), self.denominator)

    def __neg__(self):
        return BigRational(-self.numerator, self.denominator)

    def __str__(self):
        # Return decimal expansion
        return self.to_decimal(10)  # Default to 10 decimal places

    def to_fraction_string(self):
        if self.denominator == BigInteger('1'):
            return str(self.numerator)
        else:
            return f"{self.numerator}/{self.denominator}"

    def to_decimal(self, decimal_places=20):
        # Perform decimal division
        integer_part = self.numerator // self.denominator
        remainder = self.numerator % self.denominator
        
        # Handle negative numbers
        if remainder.sign == -1:
            remainder = abs(remainder)
            
        decimal_digits = ''
        remainder_digits = {}
        count = 0
        periodic = False
        
        while remainder != BigInteger('0') and count < decimal_places:
            remainder = remainder * BigInteger('10')
            digit = remainder // self.denominator
            remainder = remainder % self.denominator
            decimal_digits += str(digit)
            count += 1
            
            remainder_key = str(remainder)
            if remainder_key in remainder_digits:
                # Period detected
                repeat_start = remainder_digits[remainder_key]
                non_repeat = decimal_digits[:repeat_start]
                repeat = decimal_digits[repeat_start:]
                periodic = True
                break
            remainder_digits[remainder_key] = count
            
        if periodic:
            if non_repeat:
                result = f"{integer_part}.{non_repeat}({repeat})"
            else:
                result = f"{integer_part}.({repeat})"
        else:
            if decimal_digits:
                result = f"{integer_part}.{decimal_digits}"
            else:
                result = str(integer_part)
        return result

    def __eq__(self, other):
        if isinstance(other, BigInteger):
            other = BigRational(other)
        return self.numerator == other.numerator and self.denominator == other.denominator

    def __lt__(self, other):
        if isinstance(other, BigInteger):
            other = BigRational(other)
        left = self.numerator * other.denominator
        right = other.numerator * self.denominator
        return left < right

    def __le__(self, other):
        if isinstance(other, BigInteger):
            other = BigRational(other)
        return self < other or self == other

    def __gt__(self, other):
        if isinstance(other, BigInteger):
            other = BigRational(other)
        return not (self <= other)

    def __ge__(self, other):
        if isinstance(other, BigInteger):
            other = BigRational(other)
        return not (self < other)

# Tokenizer and Parser

class Token:
    def __init__(self, type_, value=None):
        self.type = type_
        self.value = value  # For numbers or identifiers

    def __repr__(self):
        if self.value:
            return f'Token({self.type}, {self.value})'
        else:
            return f'Token({self.type})'

NUMBER = 'NUMBER'
IDENTIFIER = 'IDENTIFIER'
PLUS = 'PLUS'
MINUS = 'MINUS'
MULTIPLY = 'MULTIPLY'
DIVIDE = 'DIVIDE'
MODULO = 'MODULO'
EXPONENT = 'EXPONENT'
FACTORIAL = 'FACTORIAL'
LPAREN = 'LPAREN'
RPAREN = 'RPAREN'
COMMA = 'COMMA'
EOF = 'EOF'

def tokenize(text):
    tokens = []
    i = 0
    n = len(text)
    while i < n:
        c = text[i]
        if c.isdigit():
            num = c
            i += 1
            while i < n and text[i].isdigit():
                num += text[i]
                i += 1
            tokens.append(Token(NUMBER, num))
        elif c.isalpha():
            ident = c
            i += 1
            while i < n and (text[i].isalnum() or text[i] == '_'):
                ident += text[i]
                i += 1
            tokens.append(Token(IDENTIFIER, ident))
        elif c == '+':
            tokens.append(Token(PLUS))
            i += 1
        elif c == '-':
            tokens.append(Token(MINUS))
            i += 1
        elif c == '*':
            tokens.append(Token(MULTIPLY))
            i += 1
        elif c == '/':
            tokens.append(Token(DIVIDE))
            i += 1
        elif c == '%':
            tokens.append(Token(MODULO))
            i += 1
        elif c == '^':
            tokens.append(Token(EXPONENT))
            i += 1
        elif c == '!':
            tokens.append(Token(FACTORIAL))
            i += 1
        elif c == '(':
            tokens.append(Token(LPAREN))
            i += 1
        elif c == ')':
            tokens.append(Token(RPAREN))
            i += 1
        elif c == ',':
            tokens.append(Token(COMMA))
            i += 1
        elif c.isspace():
            i += 1
        else:
            raise ValueError(f'Unknown character {c}')
    tokens.append(Token(EOF))
    return tokens

class NumberNode:
    def __init__(self, value):
        self.value = value  # BigInteger
    def __repr__(self):
        return f'NumberNode({self.value})'

class UnaryOpNode:
    def __init__(self, op_tok, node):
        self.op_tok = op_tok
        self.node = node
    def __repr__(self):
        return f'UnaryOpNode({self.op_tok}, {self.node})'

class BinOpNode:
    def __init__(self, left_node, op_tok, right_node):
        self.left_node = left_node
        self.op_tok = op_tok
        self.right_node = right_node
    def __repr__(self):
        return f'BinOpNode({self.left_node}, {self.op_tok}, {self.right_node})'

class FuncCallNode:
    def __init__(self, func_name_tok, arg_nodes):
        self.func_name_tok = func_name_tok
        self.arg_nodes = arg_nodes
    def __repr__(self):
        return f'FuncCallNode({self.func_name_tok}, {self.arg_nodes})'

class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.pos = 0
        self.current_tok = self.tokens[self.pos]

    def advance(self):
        self.pos += 1
        if self.pos < len(self.tokens):
            self.current_tok = self.tokens[self.pos]
        else:
            self.current_tok = Token(EOF)

    def parse(self):
        result = self.expression()
        if self.current_tok.type != EOF:
            raise ValueError('Unexpected token after expression')
        return result

    def expression(self):
        node = self.term()
        while self.current_tok.type in (PLUS, MINUS):
            op_tok = self.current_tok
            self.advance()
            right_node = self.term()
            node = BinOpNode(node, op_tok, right_node)
        return node

    def term(self):
        node = self.factor()
        while self.current_tok.type in (MULTIPLY, DIVIDE, MODULO):
            op_tok = self.current_tok
            self.advance()
            right_node = self.factor()
            node = BinOpNode(node, op_tok, right_node)
        return node

    def factor(self):
        node = self.unary()
        while self.current_tok.type == EXPONENT:
            op_tok = self.current_tok
            self.advance()
            right_node = self.factor()
            node = BinOpNode(node, op_tok, right_node)
        return node

    def unary(self):
        tok = self.current_tok
        if tok.type in (PLUS, MINUS):
            self.advance()
            node = self.unary()
            return UnaryOpNode(tok, node)
        else:
            return self.primary()

    def primary(self):
        tok = self.current_tok
        if tok.type == NUMBER:
            self.advance()
            node = NumberNode(BigInteger(tok.value))
            while self.current_tok.type == FACTORIAL:
                op_tok = self.current_tok
                self.advance()
                node = UnaryOpNode(op_tok, node)
            return node
        elif tok.type == IDENTIFIER:
            self.advance()
            if self.current_tok.type == LPAREN:
                # Function call
                self.advance()
                arg_nodes = []
                if self.current_tok.type != RPAREN:
                    arg_nodes.append(self.expression())
                    while self.current_tok.type == COMMA:
                        self.advance()
                        arg_nodes.append(self.expression())
                if self.current_tok.type != RPAREN:
                    raise ValueError('Expected ) after function arguments')
                self.advance()
                node = FuncCallNode(tok, arg_nodes)
                return node
            else:
                raise ValueError(f'Unexpected token {self.current_tok}')
        elif tok.type == LPAREN:
            self.advance()
            node = self.expression()
            if self.current_tok.type != RPAREN:
                raise ValueError('Expected )')
            self.advance()
            while self.current_tok.type == FACTORIAL:
                op_tok = self.current_tok
                self.advance()
                node = UnaryOpNode(op_tok, node)
            return node
        else:
            raise ValueError('Expected number, identifier, or (')

class Evaluator:
    def __init__(self):
        # You can add built-in functions here
        self.functions = {
            'log': self.func_log,
            'ln': self.func_ln,
            'sqrt': self.func_sqrt,
            'abs': self.func_abs
        }
    
    def visit(self, node):
        method_name = 'visit_' + type(node).__name__
        method = getattr(self, method_name, self.no_visit_method)
        return method(node)
        
    def no_visit_method(self, node):
        raise Exception(f'No visit_{type(node).__name__} method')

    def visit_NumberNode(self, node):
        return BigRational(node.value)

    def visit_UnaryOpNode(self, node):
        op_type = node.op_tok.type
        number = self.visit(node.node)
        if op_type == PLUS:
            return number
        elif op_type == MINUS:
            return -number
        elif op_type == FACTORIAL:
            if not isinstance(number, BigRational) or number.denominator != BigInteger('1'):
                raise ValueError('Factorial is only defined for integers')
            if number.numerator.sign == -1:
                return BigRational(BigInteger('0'))
            result = factorial_bigint(number.numerator)
            return BigRational(result)
            
    def visit_BinOpNode(self, node):
        left = self.visit(node.left_node)
        right = self.visit(node.right_node)
        op_type = node.op_tok.type
        if op_type == PLUS:
            return left + right
        elif op_type == MINUS:
            return left - right
        elif op_type == MULTIPLY:
            return left * right
        elif op_type == DIVIDE:
            return left / right
        elif op_type == MODULO:
            if not isinstance(left, BigRational) or left.denominator != BigInteger('1') or not isinstance(right, BigRational) or right.denominator != BigInteger('1'):
                raise ValueError('Modulo is only defined for integers')
            return BigRational(left.numerator % right.numerator)
        elif op_type == EXPONENT:
            if not isinstance(right, BigRational) or right.denominator != BigInteger('1'):
                raise ValueError('Exponent must be an integer')
            return left ** right.numerator
            
    def visit_FuncCallNode(self, node):
        func_name = node.func_name_tok.value
        arg_values = [self.visit(arg_node) for arg_node in node.arg_nodes]
        if func_name in self.functions:
            return self.functions[func_name](arg_values)
        else:
            raise ValueError(f'Unknown function {func_name}')

    def func_abs(self, args):
        if len(args) != 1:
            raise ValueError('abs() takes exactly one argument')
        return abs(args[0])

    def func_sqrt(self, args):
        if len(args) != 1:
            raise ValueError('sqrt() takes exactly one argument')
        x = args[0]
        if x < BigRational(BigInteger('0')):
            raise ValueError('sqrt(x) is undefined for x < 0')
        # Simple approximation for square root
        # Using Newton's method: x_{n+1} = (x_n + a/x_n) / 2
        if x == BigRational(BigInteger('0')):
            return BigRational(BigInteger('0'))
        
        # Convert to decimal for approximation
        decimal_str = x.to_decimal(50)
        try:
            import decimal
            decimal.getcontext().prec = 50
            x_decimal = decimal.Decimal(decimal_str.split('(')[0])  # Remove repeating part
            sqrt_decimal = x_decimal.sqrt()
            # Convert back to rational approximation
            sqrt_str = str(sqrt_decimal)
            if '.' in sqrt_str:
                parts = sqrt_str.split('.')
                integer_part = parts[0]
                decimal_part = parts[1]
                numerator = BigInteger(integer_part + decimal_part)
                denominator = pow_bigint(BigInteger('10'), BigInteger(str(len(decimal_part))))
                return BigRational(numerator, denominator)
            else:
                return BigRational(BigInteger(sqrt_str))
        except ImportError:
            # Fallback to simple approximation
            return BigRational(BigInteger('1'))  # Placeholder

    def func_ln(self, args):
        if len(args) != 1:
            raise ValueError('ln() takes exactly one argument')
        x = args[0]
        if x <= BigRational(BigInteger('0')):
            raise ValueError('ln(x) is undefined for x <= 0')
        
        # Simple approximation using series expansion
        # ln(1+x) = x - x^2/2 + x^3/3 - x^4/4 + ...
        # This is a placeholder implementation
        decimal_str = x.to_decimal(20)
        try:
            import math
            x_float = float(decimal_str.split('(')[0])  # Remove repeating part
            ln_result = math.log(x_float)
            # Convert back to rational approximation
            ln_str = f"{ln_result:.10f}"
            if '.' in ln_str:
                parts = ln_str.split('.')
                integer_part = parts[0]
                decimal_part = parts[1]
                if integer_part.startswith('-'):
                    sign = -1
                    integer_part = integer_part[1:]
                else:
                    sign = 1
                numerator = BigInteger(integer_part + decimal_part) * BigInteger(str(sign))
                denominator = pow_bigint(BigInteger('10'), BigInteger(str(len(decimal_part))))
                return BigRational(numerator, denominator)
            else:
                return BigRational(BigInteger(ln_str))
        except (ImportError, ValueError):
            # Fallback
            return BigRational(BigInteger('0'))

    def func_log(self, args):
        if len(args) != 1:
            raise ValueError('log() takes exactly one argument')
        x = args[0]
        if x <= BigRational(BigInteger('0')):
            raise ValueError('log(x) is undefined for x <= 0')
        
        # log10(x) = ln(x) / ln(10)
        ln_x = self.func_ln([x])
        ln_10 = self.func_ln([BigRational(BigInteger('10'))])
        return ln_x / ln_10

def repl():
    print("Arbitrary-Precision Calculator with Fractions and Logarithms")
    print("Supports +, -, *, /, %, ^, !, ln(), log(), sqrt(), abs(), and parentheses")
    print("Type 'exit' or 'quit' to leave")
    print("Type 'help' for more information")
    
    evaluator = Evaluator()
    
    while True:
        try:
            text = input('> ')
            if text.strip() == '':
                continue
            if text.strip().lower() in ('exit', 'quit'):
                break
            if text.strip().lower() == 'help':
                print("\nSupported operations:")
                print("  Basic: +, -, *, /, %, ^")
                print("  Factorial: !")
                print("  Functions: ln(x), log(x), sqrt(x), abs(x)")
                print("  Parentheses: ( )")
                print("  Examples:")
                print("    123456789 * 987654321")
                print("    20!")
                print("    2^64")
                print("    ln(2)")
                print("    sqrt(16)")
                print("    1/2 + 3/4")
                continue
                
            tokens = tokenize(text)
            parser = Parser(tokens)
            ast = parser.parse()
            result = evaluator.visit(ast)
            
            # Display result appropriately
            if isinstance(result, BigRational):
                if result.denominator == BigInteger('1'):
                    print(result.numerator)
                else:
                    print(f"{result.to_fraction_string()} = {result.to_decimal(10)}")
            else:
                print(result)
                
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except Exception as e:
            print(f'Error: {e}')

if __name__ == '__main__':
    repl()