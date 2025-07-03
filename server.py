#!/usr/bin/env python3

import json
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading
import time
import subprocess
import os

# Import our calculator modules
from calc import tokenize, Parser, Evaluator, BigRational, BigInteger
import test_calc

class CalculatorHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/calculate':
            self.handle_calculate()
        elif self.path == '/test':
            self.handle_test()
        else:
            self.send_error(404)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def handle_calculate(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            expression = data.get('expression', '')
            
            if not expression.strip():
                self.send_json_response({'error': 'Empty expression'})
                return
            
            # Use our calculator to evaluate the expression
            evaluator = Evaluator()
            tokens = tokenize(expression)
            parser = Parser(tokens)
            ast = parser.parse()
            result = evaluator.visit(ast)
            
            # Format the result
            if isinstance(result, BigRational):
                if result.denominator == BigInteger('1'):
                    result_str = str(result.numerator)
                else:
                    # Show both fraction and decimal representation
                    fraction_str = result.to_fraction_string()
                    decimal_str = result.to_decimal(10)
                    if '/' in fraction_str:
                        result_str = f"{fraction_str} = {decimal_str}"
                    else:
                        result_str = decimal_str
            else:
                result_str = str(result)
            
            self.send_json_response({'result': result_str})
            
        except Exception as e:
            self.send_json_response({'error': str(e)})

    def handle_test(self):
        try:
            # Capture the output of our test functions
            import io
            from contextlib import redirect_stdout
            
            output_buffer = io.StringIO()
            
            with redirect_stdout(output_buffer):
                # Run our test functions
                test_calc.test_big_integer_operations()
                test_calc.test_big_rational_operations()
                test_calc.test_expression_evaluation()
                test_calc.test_edge_cases()
            
            output = output_buffer.getvalue()
            
            self.send_json_response({
                'status': 'success',
                'output': output,
                'message': 'All tests completed successfully'
            })
            
        except Exception as e:
            self.send_json_response({
                'status': 'error',
                'error': str(e),
                'message': 'Test execution failed'
            })

    def send_json_response(self, data):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response = json.dumps(data, indent=2)
        self.wfile.write(response.encode('utf-8'))

    def log_message(self, format, *args):
        # Suppress default logging
        pass

def run_server(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, CalculatorHandler)
    print(f"Calculator API server running on port {port}")
    print(f"Access the calculator at http://localhost:3000")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.shutdown()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    run_server(port)