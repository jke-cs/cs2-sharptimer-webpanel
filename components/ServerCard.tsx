import React, { useState } from 'react'
import { MapIcon, UsersIcon, ZapIcon, GamepadIcon, CopyIcon, PlayIcon } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = "", 
  variant = "default", 
  size = "default", 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground"
  }
  const sizeStyles = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md"
  }

  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

interface ServerProps {
  server: {
    name: string
    map: string
    numPlayers: number
    maxPlayers: number
    ping: number
    connect: string
  }
}

export default function ServerCard({ server }: ServerProps) {
  const [copying, setCopying] = useState(false)
  const playerPercentage = (server.numPlayers / server.maxPlayers) * 100

  const copyToClipboard = async () => {
    setCopying(true)
    try {
      await navigator.clipboard.writeText(server.connect)
    } catch (err) {
      console.error('Failed to copy server IP:', err)
    } finally {
      setCopying(false)
    }
  }

  const openSteamConnect = (e: React.MouseEvent) => {
    e.preventDefault()
    const [ip, port] = server.connect.split(':')
    window.location.href = `steam://connect/${ip}:${port}?appid=730`
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">{server.name || 'Unknown Server'}</h2>
        <div className="space-y-3">
          <div className="flex items-center">
            <MapIcon className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">{server.map || 'Unknown'}</span>
          </div>
          <div className="flex items-center">
            <UsersIcon className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">
              {server.numPlayers}/{server.maxPlayers} Players
            </span>
          </div>
          <div className="flex items-center">
            <ZapIcon className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">{server.ping || 'N/A'} ms</span>
          </div>
          <div className="flex items-center">
            <GamepadIcon className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">{server.connect || 'Unknown'}</span>
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <Button onClick={copyToClipboard} disabled={copying} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
            <CopyIcon className="w-4 h-4 mr-2" />
            {copying ? 'Copying...' : 'Copy IP'}
          </Button>
          <Button onClick={openSteamConnect} className="flex-1 bg-green-500 hover:bg-green-600 text-white">
            <PlayIcon className="w-4 h-4 mr-2" />
            Connect
          </Button>
        </div>
      </div>
      <div className="bg-gray-100 dark:bg-gray-700 px-6 py-4">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200 dark:text-purple-200 dark:bg-purple-800">
                Playercount
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-purple-600 dark:text-purple-400">
                {playerPercentage.toFixed(0)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200 dark:bg-purple-800">
            <div
              style={{ width: `${playerPercentage}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500 dark:bg-purple-400"
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}