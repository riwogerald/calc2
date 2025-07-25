import React from 'react'
import { Link } from 'react-router-dom'
import { Calculator, TestTube, Infinity, Zap, Shield, Code } from 'lucide-react'

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Infinity,
      title: 'Arbitrary Precision',
      description: 'Handle numbers of unlimited size, limited only by memory'
    },
    {
      icon: Zap,
      title: 'Fast Operations',
      description: 'Optimized algorithms for addition, multiplication, and more'
    },
    {
      icon: Shield,
      title: 'No Dependencies',
      description: 'Pure implementation without external libraries'
    },
    {
      icon: Code,
      title: 'Advanced Functions',
      description: 'Supports logarithms, factorials, fractions, and more'
    }
  ]

  const operations = [
    'Basic Arithmetic (+, -, *, /, %)',
    'Exponentiation (^)',
    'Factorial (!)',
    'Logarithms (ln, log)',
    'Square Root (sqrt)',
    'Absolute Value (abs)',
    'Fractions (1/2 + 3/4)',
    'Parentheses for grouping'
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-teal-600/10"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Arbitrary-Precision
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-teal-600">
                Calculator
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A powerful calculator that handles numbers of unlimited size without relying on external libraries. 
              Built from scratch with pure algorithms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/calculator" className="button-primary">
                <Calculator className="inline-block w-5 h-5 mr-2" />
                Start Calculating
              </Link>
              <Link to="/test" className="button-secondary">
                <TestTube className="inline-block w-5 h-5 mr-2" />
                Run Tests
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why ArbiCalc?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built to demonstrate mastery of fundamental algorithms and provide unlimited precision arithmetic
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="glass-effect p-6 rounded-xl hover:shadow-2xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <feature.icon className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Operations Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-50 to-teal-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Supported Operations</h2>
              <p className="text-xl text-gray-600 mb-8">
                From basic arithmetic to advanced mathematical functions, ArbiCalc handles it all with precision.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {operations.map((operation, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="text-gray-700 font-mono text-sm">{operation}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="glass-effect p-8 rounded-xl">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Example Calculations</h3>
              <div className="space-y-4 font-mono text-sm">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-purple-600 mb-1">Input:</div>
                  <div className="text-gray-800">123456789012345678901234567890 * 987654321098765432109876543210</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-purple-600 mb-1">Input:</div>
                  <div className="text-gray-800">20!</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-purple-600 mb-1">Input:</div>
                  <div className="text-gray-800">2^64</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-purple-600 mb-1">Input:</div>
                  <div className="text-gray-800">1/2 + 3/4</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Calculate?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Experience the power of arbitrary-precision arithmetic in your browser
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/calculator" className="button-primary text-lg px-8 py-4">
              <Calculator className="inline-block w-6 h-6 mr-2" />
              Open Calculator
            </Link>
            <Link to="/test" className="button-secondary text-lg px-8 py-4">
              <TestTube className="inline-block w-6 h-6 mr-2" />
              View Tests
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage