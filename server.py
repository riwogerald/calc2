#!/usr/bin/env python3

import json
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading
import time
import subprocess
import os
import io
from contextlib import redirect_stdout, redirect_stderr

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
            # Run individual test functions and capture their results
            test_functions = [
                ('BigInteger Operations', test_calc.test_big_integer_operations),
                ('BigRational Operations', test_calc.test_big_rational_operations),
                ('Expression Evaluation', test_calc.test_expression_evaluation),
                ('Edge Cases', test_calc.test_edge_cases)
            ]
            
            test_results = []
            
            for test_name, test_func in test_functions:
                try:
                    # Capture stdout and stderr for each test
                    output_buffer = io.StringIO()
                    error_buffer = io.StringIO()
                    
                    start_time = time.time()
                    
                    with redirect_stdout(output_buffer), redirect_stderr(error_buffer):
                        test_func()
                    
                    end_time = time.time()
                    duration = int((end_time - start_time) * 1000)  # Convert to milliseconds
                    
                    output = output_buffer.getvalue()
                    error_output = error_buffer.getvalue()
                    
                    if error_output:
                        test_results.append({
                            'name': test_name,
                            'status': 'failed',
                            'duration': duration,
                            'error': error_output,
                            'output': output
                        })
                    else:
                        test_results.append({
                            'name': test_name,
                            'status': 'passed',
                            'duration': duration,
                            'output': output
                        })
                        
                except Exception as e:
                    test_results.append({
                        'name': test_name,
                        'status': 'failed',
                        'duration': 0,
                        'error': str(e)
                    })
            
            # Calculate overall statistics
            passed_count = sum(1 for result in test_results if result['status'] == 'passed')
            failed_count = len(test_results) - passed_count
            total_duration = sum(result['duration'] for result in test_results)
            
            self.send_json_response({
                'status': 'completed',
                'results': test_results,
                'summary': {
                    'total': len(test_results),
                    'passed': passed_count,
                    'failed': failed_count,
                    'duration': total_duration
                },
                'message': f'Tests completed: {passed_count} passed, {failed_count} failed'
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
    print(f"Access the calculator at http://localhost:5173")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.shutdown()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    run_server(port)