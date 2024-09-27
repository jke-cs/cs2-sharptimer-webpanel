'use client'

import { useState, useEffect } from 'react'
import { SettingsIcon, MenuIcon } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '../context/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Map Records', path: '/maprecords' },
  ]

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <motion.img
                src="/img/logo.png" 
                alt="Logo"
                className="h-10 md:h-12"
                whileHover={{ rotate: 360, transition: { duration: 0.5 } }}
              />
              <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                
              </span>
            </Link>

            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.path}
                  className={`relative px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group ${
                    pathname === item.path ? 'text-purple-600 dark:text-purple-400' : ''
                  }`}
                >
                  {item.name}
                  <span 
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 dark:bg-purple-400 transform origin-left transition-transform duration-300 ${
                      pathname === item.path ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.05 }}
              >
                <motion.button 
                  className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  whileHover={{ rotate: 360, transition: { duration: 0.5 } }}
                >
                  <SettingsIcon size={20} />
                </motion.button>
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg"
                    >
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                          <label className="flex items-center justify-between space-x-2">
                            <span>Dark Mode</span>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                              <input 
                                type="checkbox" 
                                name="toggle" 
                                id="toggle" 
                                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                                checked={theme === 'dark'}
                                onChange={toggleTheme}
                              />
                              <label 
                                htmlFor="toggle" 
                                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                              ></label>
                            </div>
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <button 
                className="md:hidden p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <MenuIcon size={20} />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-gray-800 shadow-lg"
            >
              <nav className="container mx-auto px-4 py-3">
                {navItems.map((item) => (
                  <Link 
                    key={item.name} 
                    href={item.path}
                    className={`block py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors ${
                      pathname === item.path ? 'text-purple-600 dark:text-purple-400' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <div className="h-[72px] md:h-[80px]"></div>
    </>
  )
}