import unittest
import sys

sys.path.append('D:\Files\Codex\Github\PesaPal\calc2\calc.py')
from calc import BigInteger, Fraction, Decimal, PrecisionMode

class TestCalculator(unittest.TestCase):
    def setUp(self):
        """Set up test cases"""
        self.precision_mode = PrecisionMode()

    def test_big_integer_creation(self):
        """Test BigInteger initialization"""
        print("\nTesting BigInteger Creation...")
        
        # Test integer input
        num = BigInteger(123)
        self.assertEqual(str(num), "123")
        
        # Test string input
        num = BigInteger("456")
        self.assertEqual(str(num), "456")
        
        # Test negative numbers
        num = BigInteger(-789)
        self.assertEqual(str(num), "-789")
        
        print("BigInteger Creation Tests Passed!")

    def test_basic_operations(self):
        """Test basic arithmetic operations"""
        print("\nTesting Basic Operations...")
        
        # Addition
        self.assertEqual(str(BigInteger(5) + BigInteger(3)), "8")
        
        # Subtraction
        self.assertEqual(str(BigInteger(10) - BigInteger(4)), "6")
        
        # Multiplication
        self.assertEqual(str(BigInteger(6) * BigInteger(7)), "42")
        
        # Division
        self.assertEqual(str(BigInteger(20) / BigInteger(5)), "4")
        
        print("Basic Operations Tests Passed!")

    def test_advanced_operations(self):
        """Test advanced operations"""
        print("\nTesting Advanced Operations...")
        
        # Power
        self.assertEqual(str(BigInteger(2) ** BigInteger(3)), "8")
        
        # Factorial
        self.assertEqual(str(BigInteger(5).factorial()), "120")
        
        print("Advanced Operations Tests Passed!")

    def test_fraction_operations(self):
        """Test fraction operations"""
        print("\nTesting Fraction Operations...")
        
        # Creating fractions
        f1 = Fraction(BigInteger(1), BigInteger(2))
        f2 = Fraction(BigInteger(1), BigInteger(4))
        
        # Addition
        result = f1 + f2
        self.assertEqual(str(result), "3/4")
        
        print("Fraction Operations Tests Passed!")

    def test_decimal_operations(self):
        """Test decimal operations"""
        print("\nTesting Decimal Operations...")
        
        # Creating decimals
        d1 = Decimal("1.5")
        d2 = Decimal("2.5")
        
        # Addition
        result = d1 + d2
        self.assertEqual(str(result), "4.0")
        
        print("Decimal Operations Tests Passed!")

    def test_error_handling(self):
        """Test error handling"""
        print("\nTesting Error Handling...")
        
        # Division by zero
        with self.assertRaises(ZeroDivisionError):
            BigInteger(5) / BigInteger(0)
            
        # Invalid input
        with self.assertRaises(ValueError):
            BigInteger("abc")
            
        print("Error Handling Tests Passed!")

def run_tests():
    """Run all tests and display results"""
    print("=== Starting Calculator Unit Tests ===")
    
    # Create test suite
    suite = unittest.TestLoader().loadTestsFromTestCase(TestCalculator)
    
    # Run tests
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    
    # Display summary
    print("\n=== Test Results Summary ===")
    print(f"Tests Run: {result.testsRun}")
    print(f"Tests Passed: {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"Tests Failed: {len(result.failures)}")
    print(f"Test Errors: {len(result.errors)}")
    
    # Check if all tests passed
    if result.wasSuccessful():
        print("\n✅ All tests passed! Calculator is working correctly.")
    else:
        print("\n❌ Some tests failed. Please check the details above.")

if __name__ == '__main__':
    run_tests()
