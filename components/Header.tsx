'use client'

import { MoonIcon, SunIcon } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '../context/ThemeContext'

export default function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 transition-colors">
          CS2 Sharptimer Webpanel
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li><Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Home</Link></li>
            <li><Link href="/leaderboard" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Leaderboard</Link></li>
          </ul>
        </nav>
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <SunIcon className="w-5 h-5 text-yellow-400" />
          ) : (
            <MoonIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>
    </header>
  )
}