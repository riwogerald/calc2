import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Calculator, Home, TestTube } from 'lucide-react'

const Navigation: React.FC = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/calculator', icon: Calculator, label: 'Calculator' },
    { path: '/test', icon: TestTube, label: 'Tests' },
  ]

  return (
    <nav className="glass-effect sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Calculator className="h-8 w-8 text-purple-600" />
            <span className="text-xl font-bold text-gray-900">ArbiCalc</span>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === path
                    ? 'bg-purple-100 text-purple-700 font-medium'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation