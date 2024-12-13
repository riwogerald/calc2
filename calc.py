class PrecisionMode:
    STANDARD = 10  # 10 decimal places
    HIGH = 50      # 50 decimal places
    EXTREME = 100  # 100 decimal places
    
    def __init__(self):
        self.current_mode = self.STANDARD
        
    def set_mode(self, mode):
        if mode in [self.STANDARD, self.HIGH, self.EXTREME]:
            self.current_mode = mode
        else:
            raise ValueError("Invalid precision mode")
            
    def get_precision(self):
        return self.current_mode

PRECISION_MODE = PrecisionMode()  # Global precision mode instance

class BigInteger:
    def __init__(self, value=0):
        """
        Initialize BigInteger. Can accept:
        - Integer
        - String representation of a number
        - List of digits
        """
        self.sign = 1  # 1 for positive, -1 for negative
        self.digits = []  # Store digits in reverse order (least significant first)
        
        if isinstance(value, int):
            self._from_int(value)
        elif isinstance(value, str):
            self._from_string(value)
        elif isinstance(value, list):
            self.digits = value.copy()
        else:
            raise ValueError("Invalid input type")

    def _from_int(self, value):
        """Convert regular integer to BigInteger"""
        if value < 0:
            self.sign = -1
            value = abs(value)
        
        if value == 0:
            self.digits = [0]
            return
            
        while value:
            self.digits.append(value % 10)
            value //= 10

    def _from_string(self, value):
        """Convert string to BigInteger"""
        value = value.strip()
        if value[0] == '-':
            self.sign = -1
            value = value[1:]
        
        if not value.isdigit():
            raise ValueError("Invalid number string")
            
        self.digits = [int(d) for d in reversed(value)]

    def __str__(self):
        """Convert BigInteger to string"""
        if len(self.digits) == 0:
            return "0"
        result = '-' if self.sign == -1 else ''
        result += ''.join(str(d) for d in reversed(self.digits))
        return result

    def _abs_compare(self, other):
        """
        Compare absolute values of two BigIntegers
        Returns: 
         1 if self > other
         0 if self == other
        -1 if self < other
        """
        if len(self.digits) != len(other.digits):
            return 1 if len(self.digits) > len(other.digits) else -1
        
        # Compare digits from most significant to least significant
        for i in range(len(self.digits) - 1, -1, -1):
            if self.digits[i] != other.digits[i]:
                return 1 if self.digits[i] > other.digits[i] else -1
        return 0

    def __eq__(self, other):
        """Equal to operator"""
        if not isinstance(other, BigInteger):
            other = BigInteger(other)
        return self.sign == other.sign and self._abs_compare(other) == 0

    def __lt__(self, other):
        """Less than operator"""
        if not isinstance(other, BigInteger):
            other = BigInteger(other)
        
        # Different signs
        if self.sign != other.sign:
            return self.sign < other.sign
        
        # Same signs
        comp = self._abs_compare(other)
        return comp < 0 if self.sign == 1 else comp > 0

    def __gt__(self, other):
        """Greater than operator"""
        if not isinstance(other, BigInteger):
            other = BigInteger(other)
        return not (self < other or self == other)

    def __le__(self, other):
        """Less than or equal to operator"""
        return self < other or self == other

    def __ge__(self, other):
        """Greater than or equal to operator"""
        return self > other or self == other

    def __ne__(self, other):
        """Not equal to operator"""
        return not self == other

    def is_zero(self):
        """Check if the number is zero"""
        return len(self.digits) == 1 and self.digits[0] == 0

    def abs(self):
        """Return absolute value"""
        result = BigInteger(self.digits)
        result.sign = 1
        return result

    def _remove_leading_zeros(self):
        """Remove leading zeros from the number"""
        while len(self.digits) > 1 and self.digits[-1] == 0:
            self.digits.pop()

    def __add__(self, other):
        """Add two BigIntegers"""
        if not isinstance(other, BigInteger):
            other = BigInteger(other)

        # If signs are different, subtract instead
        if self.sign != other.sign:
            if self.sign == 1:
                return self - other.abs()
            else:
                return other - self.abs()

        # Same signs, do regular addition
        result = BigInteger()
        result.sign = self.sign
        
        carry = 0
        max_len = max(len(self.digits), len(other.digits))
        
        result.digits = []
        
        for i in range(max_len):
            d1 = self.digits[i] if i < len(self.digits) else 0
            d2 = other.digits[i] if i < len(other.digits) else 0
            
            current = d1 + d2 + carry
            carry = current // 10
            result.digits.append(current % 10)
        
        if carry:
            result.digits.append(carry)
            
        result._remove_leading_zeros()
        return result

    def __sub__(self, other):
        """Subtract two BigIntegers"""
        if not isinstance(other, BigInteger):
            other = BigInteger(other)

        # If signs are different, add instead
        if self.sign != other.sign:
            temp = BigInteger(other.digits)
            temp.sign = self.sign
            return self + temp

        # Same signs
        if self.sign == 1:
            if self < other:
                result = other - self
                result.sign = -1
                return result
        else:
            temp1, temp2 = self.abs(), other.abs()
            if temp1 < temp2:
                return temp2 - temp1
            result = temp1 - temp2
            result.sign = -1
            return result

        # At this point, we're subtracting a smaller number from a bigger positive number
        result = BigInteger()
        borrow = 0
        
        for i in range(len(self.digits)):
            d1 = self.digits[i]
            d2 = other.digits[i] if i < len(other.digits) else 0
            
            # Handle borrow
            if borrow:
                d1 -= 1
                borrow = 0
                
            if d1 < d2:
                d1 += 10
                borrow = 1
                
            result.digits.append(d1 - d2)
            
        result._remove_leading_zeros()
        return result

    def __mul__(self, other):
        """Multiply two BigIntegers"""
        if not isinstance(other, BigInteger):
            other = BigInteger(other)

        # Handle zero multiplication
        if self.is_zero() or other.is_zero():
            return BigInteger(0)

        # Calculate result sign
        result_sign = self.sign * other.sign
        
        # Initialize result with zeros
        result = BigInteger(0)
        
        # Perform multiplication digit by digit
        for i in range(len(self.digits)):
            # Skip if digit is 0
            if self.digits[i] == 0:
                continue
                
            # Initialize current step
            current = BigInteger()
            current.digits = [0] * i  # Add trailing zeros
            
            carry = 0
            # Multiply current digit with all digits of other number
            for j in range(len(other.digits)):
                product = self.digits[i] * other.digits[j] + carry
                carry = product // 10
                current.digits.append(product % 10)
                
            if carry:
                current.digits.append(carry)
                
            result += current

        result.sign = result_sign
        result._remove_leading_zeros()
        return result

    def __rmul__(self, other):
        """Reverse multiplication"""
        return self * other

    def __imul__(self, other):
        """In-place multiplication"""
        return self * other

    def shift_left(self, n):
        """Multiply by 10^n"""
        if n <= 0:
            return self
        if self.is_zero():
            return self
            
        result = BigInteger(self.digits)
        result.sign = self.sign
        result.digits = [0] * n + result.digits
        return result

    def shift_right(self, n):
        """Divide by 10^n"""
        if n <= 0:
            return self
        if n >= len(self.digits):
            return BigInteger(0)
            
        result = BigInteger(self.digits[n:])
        result.sign = self.sign
        result._remove_leading_zeros()
        return result
        
    def __divmod__(self, other):
        """Implement division and modulo together"""
        if not isinstance(other, BigInteger):
            other = BigInteger(other)

        # Check for division by zero
        if other.is_zero():
            raise ZeroDivisionError("Division by zero")

        # Handle zero dividend
        if self.is_zero():
            return BigInteger(0), BigInteger(0)

        # Determine sign of quotient and remainder
        quotient_sign = self.sign * other.sign
        remainder_sign = self.sign

        # Work with absolute values
        dividend = self.abs()
        divisor = other.abs()

        # If dividend < divisor, quotient is 0 and remainder is dividend
        if dividend < divisor:
            return BigInteger(0), self

        # Initialize quotient and remainder
        quotient = BigInteger(0)
        remainder = BigInteger(0)

        # Convert dividend to list of digits in normal order (most significant first)
        temp = list(reversed(dividend.digits))

        # Long division algorithm
        current = BigInteger(0)
        
        for digit in temp:
            # Shift current left by 1 decimal place and add next digit
            current = current.shift_left(1)
            current.digits[0] = digit
            current._remove_leading_zeros()

            # Find how many times divisor goes into current
            count = 0
            while current >= divisor:
                current -= divisor
                count += 1

            quotient = quotient.shift_left(1)
            quotient.digits[0] = count

        remainder = current
        
        # Apply signs
        quotient.sign = quotient_sign
        remainder.sign = remainder_sign

        quotient._remove_leading_zeros()
        remainder._remove_leading_zeros()

        return quotient, remainder

    def __div__(self, other):
        """Regular division"""
        quotient, _ = self.__divmod__(other)
        return quotient

    def __mod__(self, other):
        """Modulo operation"""
        _, remainder = self.__divmod__(other)
        return remainder

    def __pow__(self, exponent):
        """Exponentiation using square-and-multiply algorithm"""
        if not isinstance(exponent, BigInteger):
            exponent = BigInteger(exponent)

        if exponent.sign == -1:
            raise ValueError("Negative exponents not supported")

        if exponent.is_zero():
            return BigInteger(1)

        if self.is_zero():
            return BigInteger(0)

        if exponent == BigInteger(1):
            return BigInteger(self.digits)

        # Square and multiply algorithm
        result = BigInteger(1)
        base = BigInteger(self.digits)
        base.sign = self.sign

        while not exponent.is_zero():
            if exponent.digits[0] & 1:  # If exponent is odd
                result *= base
            base *= base
            exponent = exponent.shift_right(1)  # Divide exponent by 2

        return result

    def factorial(self):
        """Calculate factorial"""
        if self.sign == -1:
            raise ValueError("Factorial of negative number is undefined")

        if self.is_zero() or self == BigInteger(1):
            return BigInteger(1)

        result = BigInteger(1)
        current = BigInteger(self.digits)

        while not current.is_zero():
            result *= current
            current -= BigInteger(1)

        return result

    # Helper method for REPL
    @classmethod
    def evaluate(cls, expression):
        """Evaluate a simple mathematical expression"""
        try:
            # Handle decimal operations
            if '.' in expression:
                # Split the expression into operands and operator
                parts = expression.replace(' ', '').split()
                if len(parts) == 1:
                    return Decimal(expression)
            
                # Parse operator and operands
                if '+' in expression:
                    a, b = expression.split('+')
                    return Decimal(a.strip()) + Decimal(b.strip())
                elif '-' in expression:
                    a, b = expression.split('-')
                    return Decimal(a.strip()) - Decimal(b.strip())
                elif '*' in expression:
                    a, b = expression.split('*')
                    return Decimal(a.strip()) * Decimal(b.strip())
                elif '/' in expression:
                    # Check if it's a fraction or decimal division
                    a, b = expression.split('/')
                    if '.' in a or '.' in b:
                        return Decimal(a.strip()) / Decimal(b.strip())
                    else:
                        # Handle as fraction if no decimal points
                        return Fraction(BigInteger(a.strip()), BigInteger(b.strip()))
                elif '^' in expression:
                    a, b = expression.split('^')
                    return Decimal(a.strip()) ** Decimal(b.strip())
                
            # Handle logarithms
            if expression.startswith('log'):
                if '(' not in expression or ')' not in expression:
                    raise SyntaxError("Invalid logarithm format")
            
                # Extract base and argument
                base_end = expression.find('(')
                if base_end == 3:  # log(x) - natural log
                    base = None  # Natural log
                else:
                    base = BigInteger(expression[3:base_end])
            
                arg = expression[base_end+1:-1]
                num = BigInteger(arg)
            
                if base is None:
                    return num.ln()
                return num.log(base)
            
            # Existing evaluation logic for non-decimal operations
            if '!' in expression:
                num = expression.replace('!', '')
                return BigInteger(num).factorial()
            elif '^' in expression:
                base, exp = expression.split('^')
                return BigInteger(base) ** BigInteger(exp)
            elif '+' in expression:
                a, b = expression.split('+')
                return BigInteger(a) + BigInteger(b)
            elif '-' in expression:
                a, b = expression.split('-')
                return BigInteger(a) - BigInteger(b)
            elif '*' in expression:
                a, b = expression.split('*')
                return BigInteger(a) * BigInteger(b)
            elif '/' in expression:
                a, b = expression.split('/')
                return BigInteger(a) / BigInteger(b)
            elif '%' in expression:
                a, b = expression.split('%')
                return BigInteger(a) % BigInteger(b)
            else:
                return BigInteger(expression)
            
        except Exception as e:
            return f"Error: {str(e)}"

    
    def ln(self):
        """Natural logarithm using series expansion"""
        if self.sign == -1 or self.is_zero():
            raise ValueError("Logarithm is undefined for non-positive numbers")
        
        # For numbers close to 1, use series expansion
        # ln(x) = 2( z + z^3/3 + z^5/5 + ...) where z = (x-1)/(x+1)
        precision = PRECISION_MODE.get_precision()
    
        # Convert to fraction for better precision
        x = Fraction(self)
        one = Fraction(1)
    
        # Find power of 10 to scale number close to 1
        scale = 0
        while x > Fraction(10):
            x = x / 10
            scale += 1
    
        # Calculate z = (x-1)/(x+1)
        z = (x - one) / (x + one)
        z_squared = z * z
    
        # Initialize result
        result = Fraction(0)
        term = z
        n = 1
    
        # Add terms until desired precision is reached
        while n <= precision:
            result = result + (term / n)
            term = term * z_squared
            n += 2
        
        # Scale result back
        return result * 2 + scale * Fraction(BigInteger("2302585092994046"), BigInteger("1000000000000000"))  # ln(10)

    def log10(self):
        """Logarithm base 10"""
        return self.ln() / Fraction(BigInteger("2302585092994046"), BigInteger("1000000000000000"))  # ln(10)

    def log(self, base):
        """Logarithm with arbitrary base"""
        if not isinstance(base, BigInteger):
            base = BigInteger(base)
        return self.ln() / base.ln()

        
class Fraction:
    def __init__(self, numerator, denominator=BigInteger(1)):
        if not isinstance(numerator, BigInteger):
            numerator = BigInteger(numerator)
        if not isinstance(denominator, BigInteger):
            denominator = BigInteger(denominator)
            
        if denominator.is_zero():
            raise ValueError("Denominator cannot be zero")
            
        self.numerator = numerator
        self.denominator = denominator
        self._normalize()
        
    def _normalize(self):
        """Normalize the fraction by:
        1. Moving sign to numerator
        2. Reducing to lowest terms
        """
        # Handle signs
        if self.denominator.sign == -1:
            self.numerator.sign *= -1
            self.denominator.sign = 1
            
        # Reduce to lowest terms
        self._reduce()
        
    def _reduce(self):
        """Reduce fraction to lowest terms using GCD"""
        def gcd(a, b):
            while not b.is_zero():
                a, b = b, a % b
            return a
            
        divisor = gcd(self.numerator.abs(), self.denominator)
        if divisor > BigInteger(1):
            self.numerator = self.numerator / divisor
            self.denominator = self.denominator / divisor
            
    def __str__(self):
        if self.denominator == BigInteger(1):
            return str(self.numerator)
        return f"{self.numerator}/{self.denominator}"
    
    def __add__(self, other):
        if not isinstance(other, Fraction):
            other = Fraction(other)
    
        new_num = (self.numerator * other.denominator) + (other.numerator * self.denominator)
        new_den = self.denominator * other.denominator
        return Fraction(new_num, new_den)

    def __sub__(self, other):
        if not isinstance(other, Fraction):
            other = Fraction(other)
    
        new_num = (self.numerator * other.denominator) - (other.numerator * self.denominator)
        new_den = self.denominator * other.denominator
        return Fraction(new_num, new_den)

    def __mul__(self, other):
        if not isinstance(other, Fraction):
            other = Fraction(other)
    
        return Fraction(self.numerator * other.numerator, 
                    self.denominator * other.denominator)

    def __truediv__(self, other):
        if not isinstance(other, Fraction):
            other = Fraction(other)
    
        if other.numerator.is_zero():
            raise ZeroDivisionError("Division by zero")
    
        return Fraction(self.numerator * other.denominator,
                    self.denominator * other.numerator)

class Decimal:
    def __init__(self, value, precision=None):
        if precision is None:
            precision = PRECISION_MODE.get_precision()
            
        self.precision = precision
        
        if isinstance(value, str):
            # Parse string representation
            parts = value.split('.')
            if len(parts) == 1:
                self.value = BigInteger(parts[0])
                self.scale = 0
            else:
                self.value = BigInteger(parts[0] + parts[1])
                self.scale = len(parts[1])
        elif isinstance(value, BigInteger):
            self.value = value
            self.scale = 0
        elif isinstance(value, int) or isinstance(value, float):
            self.from_float(value)
        else:
            raise ValueError("Invalid decimal input")
            
    def from_float(self, value):
        """Convert float to Decimal"""
        str_val = f"{value:.{self.precision}f}"
        parts = str_val.split('.')
        self.value = BigInteger(parts[0] + parts[1])
        self.scale = len(parts[1])
        
    def __str__(self):
        str_val = str(self.value)
        if self.scale == 0:
            return str_val
        
        # Insert decimal point
        point_pos = len(str_val) - self.scale
        if point_pos <= 0:
            return "0." + "0" * (-point_pos) + str_val
        return str_val[:point_pos] + "." + str_val[point_pos:]
    
    def __add__(self, other):
        if not isinstance(other, Decimal):
            other = Decimal(other)
    
        # Align decimal points
        max_scale = max(self.scale, other.scale)
        a = self.value * BigInteger(10) ** (max_scale - self.scale)
        b = other.value * BigInteger(10) ** (max_scale - other.scale)
    
        result = Decimal("0")
        result.value = a + b
        result.scale = max_scale
        return result

    def __sub__(self, other):
        if not isinstance(other, Decimal):
            other = Decimal(other)
    
        # Align decimal points
        max_scale = max(self.scale, other.scale)
        a = self.value * BigInteger(10) ** (max_scale - self.scale)
        b = other.value * BigInteger(10) ** (max_scale - other.scale)
    
        result = Decimal("0")
        result.value = a - b
        result.scale = max_scale
        return result

    def __mul__(self, other):
        if not isinstance(other, Decimal):
            other = Decimal(other)
    
        result = Decimal("0")
        result.value = self.value * other.value
        result.scale = self.scale + other.scale
        return result

    def __truediv__(self, other):
        if not isinstance(other, Decimal):
            other = Decimal(other)
    
        if other.value.is_zero():
            raise ZeroDivisionError("Division by zero")
    
        # Scale up for precision
        scale = PRECISION_MODE.get_precision()
        a = self.value * BigInteger(10) ** scale
        result = Decimal("0")
        result.value = a / other.value
        result.scale = scale + self.scale - other.scale
        return result

    def __pow__(self, other):
        if not isinstance(other, Decimal):
            other = Decimal(other)
    
        # For now, only support integer exponents
        if other.scale != 0:
            raise ValueError("Only integer exponents are supported")
    
        result = Decimal("1")
        for _ in range(int(str(other.value))):
            result *= self
        return result

def show_help():
    """Display help menu with instructions and examples"""
    print("\n=== Big Integer Calculator Help ===")
    print("\nPrecision Modes:")
    print("set_precision standard - Set standard precision (10 digits)")
    print("set_precision high    - Set high precision (50 digits)")
    print("set_precision extreme - Set extreme precision (100 digits)")
    
    print("\nSupported Operations:")
    print("1. Addition (+)")
    print("   Example: 123456789 + 987654321")
    print("   Example: 999999999999999999 + 1")
    
    print("\n2. Subtraction (-)")
    print("   Example: 1000000 - 999999")
    print("   Example: -5432 - 1234")
    
    print("\n3. Multiplication (*)")
    print("   Example: 123456789 * 987654321")
    print("   Example: 2468 * 13579")
    
    print("\n4. Division (/)")
    print("   Example: 1000 / 3")
    print("   Example: 987654321 / 123456789")
    
    print("\n5. Modulo (%)")
    print("   Example: 1234567 % 890")
    print("   Example: 999999 % 7")
    
    print("\n6. Exponentiation (^)")
    print("   Example: 2 ^ 64")
    print("   Example: 123 ^ 4")
    
    print("\n7. Factorial (!)")
    print("   Example: 20!")
    print("   Example: 5!")

    print("\n8. Logarithms")
    print("   Natural log:  log(x)")
    print("   Base 10 log: log10(x)")
    print("   Custom base: logb(x) where b is the base")
    
    print("\n9. Fractions")
    print("   Example: 1/2")
    print("   Example: 22/7")
    
    print("\n10. Decimal Numbers")
    print("   Example: 3.14159")
    print("   Example: 2.718281828")
    
    print("\nCommands:")
    print("help  - Show this help menu")
    print("clear - Clear the screen")
    print("quit  - Exit the calculator")
    
    print("\nNotes:")
    print("- Enter one operation per line")
    print("- Spaces are optional")
    print("- Numbers can be arbitrarily large")
    print()

def clear_screen():
    """Clear the terminal screen"""
    import os
    os.system('cls' if os.name == 'nt' else 'clear')

def calculator_repl():
    """Interactive calculator REPL"""
    clear_screen()
    print("=== Big Integer Calculator ===")
    print("This calculator supports arbitrary-precision integers and fractions!")
    print("Type 'help' for instructions and examples")
    print("Type 'quit' to exit")
    print("Type 'clear' to clear the screen")
    print("-" * 40)

    while True:
        try:
            expression = input("\n> ").strip().lower()
            
            if not expression:
                continue
                
            if expression == 'quit':
                print("\nGoodbye!")
                break
                
            if expression == 'help':
                show_help()
                continue
                
            if expression == 'clear':
                clear_screen()
                continue

            # Process the expression
            try:
                result = BigInteger.evaluate(expression)
                print(f"Result: {result}")
            except ValueError as e:
                print(f"Value Error: {str(e)}")
            except ZeroDivisionError:
                print("Error: Division by zero")
            except SyntaxError:
                print("Error: Invalid expression format")
            except Exception as e:
                print(f"Error: {str(e)}")
                
        except KeyboardInterrupt:
            print("\nOperation cancelled.")
            continue
        except EOFError:
            print("\nGoodbye!")
            break

def main():
    print("Starting calculator...")
    try:
        calculator_repl()
    except KeyboardInterrupt:
        print("\nCalculator terminated.")
    except Exception as e:
        print(f"Fatal error: {str(e)}")
        print("Calculator terminated.")

if __name__ == "__main__":
    main()
