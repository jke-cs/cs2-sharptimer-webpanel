import { GithubIcon } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-4">CS2 Sharptimer Webpanel</h3>
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com/jke-cs/cs2-sharptimer-webpanel"
                className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                aria-label="GitHub repository"
              >
                <GithubIcon className="w-6 h-6" />
              </a>
            </div>
          </div>
          <div className="col-span-1 flex justify-start md:justify-end md:col-span-2">
            <div className="mr-8"> 
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="https://discord.gg/n4xCDWrQRB" 
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    Discord Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">&copy; 2024 JKE. All rights reserved.</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 md:mt-0">Coded with ❤️ by JKE</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
