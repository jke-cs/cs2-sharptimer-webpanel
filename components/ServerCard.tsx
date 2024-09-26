"use client"

import React, { useState, useEffect } from 'react'
import { MapIcon, UsersIcon, ZapIcon, GamepadIcon, CopyIcon, PlayIcon } from 'lucide-react'

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline'
}> = ({ children, className = '', variant = 'default', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  const variantStyles = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
  }
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} h-10 py-2 px-4 ${className} transition-colors duration-200`}
      {...props}
    >
      {children}
    </button>
  )
}

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden ${className}`} {...props}>
    {children}
  </div>
)

const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
)

const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
)

const PlayerCountBar: React.FC<{ currentPlayers: number; maxPlayers: number }> = ({ currentPlayers, maxPlayers }) => {
  const widthPercentage = Math.min((currentPlayers / maxPlayers) * 100, 100)

  return (
    <div className="w-full mt-4">
      <div className="relative h-4 w-full bg-gray-300 rounded-full overflow-hidden shadow-md"> 
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-purple-700 to-purple-500 animate-gradient-move"
          style={{
            width: `${widthPercentage}%`,
            transition: 'width 1s ease-in-out',
          }}
        />
        {/* Glow Effect */}
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-purple-700/40 blur-sm"
          style={{
            width: `${widthPercentage}%`,
            transition: 'width 1s ease-in-out',
          }}
        />
        {/* Percentage Text */}
        <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white"> {/* Reduced font size here */}
          {currentPlayers}/{maxPlayers} Players ({Math.round(widthPercentage)}%)
        </span>
      </div>
    </div>
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
  const [playerCountHistory, setPlayerCountHistory] = useState<{ time: string; count: number }[]>([])
  const mapImageUrl = `https://cs2browser.com/static/img/maps/${server.map}.webp`

  useEffect(() => {
    const updatePlayerCount = () => {
      const now = new Date()
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const newData = { time, count: server.numPlayers }

      setPlayerCountHistory(prev => {
        const updated = [...prev, newData].slice(-30)
        return updated
      })
    }

    updatePlayerCount() 
    const intervalId = setInterval(updatePlayerCount, 60000) 

    return () => clearInterval(intervalId)
  }, [server.numPlayers])

  const copyToClipboard = async () => {
    setCopying(true)
    try {
      const ipWithConnect = `connect ${server.connect}`
      await navigator.clipboard.writeText(ipWithConnect)
    } catch (err) {
      console.error('Failed to copy server IP:', err)
    } finally {
      setTimeout(() => setCopying(false), 2000)
    }
  }

  const openSteamConnect = (e: React.MouseEvent) => {
    e.preventDefault()
    const [ip, port] = server.connect.split(':')
    window.location.href = `steam://connect/${ip}:${port}?appid=730`
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <div
        className="h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${mapImageUrl})` }}
      >
        <div className="h-full w-full bg-black bg-opacity-50 p-6 flex flex-col justify-between">
          <h2 className="text-2xl font-bold text-white">{server.name || 'Unknown Server'}</h2>
          <div className="flex items-center text-white">
            <MapIcon className="w-5 h-5 mr-2" />
            <span>{server.map || 'Unknown'}</span>
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="flex items-center">
            <UsersIcon className="w-5 h-5 mr-2 text-muted-foreground" />
            <span className="text-foreground">
              {server.numPlayers}/{server.maxPlayers} Players
            </span>
          </div>
          <div className="flex items-center">
            <ZapIcon className="w-5 h-5 mr-2 text-muted-foreground" />
            <span className="text-foreground">{server.ping || 'N/A'} ms</span>
          </div>
          <div className="flex items-center">
            <GamepadIcon className="w-5 h-5 mr-2 text-muted-foreground" />
            <span className="text-foreground">{server.connect || 'Unknown'}</span>
          </div>
        </div>
        <div className="mt-6 flex space-x-2">
          <Button
            onClick={copyToClipboard}
            disabled={copying}
            variant="outline"
            className="flex-1 hover:bg-primary hover:text-primary-foreground"
          >
            {copying ? (
              'Copied!'
            ) : (
              <>
                <CopyIcon className="w-4 h-4 mr-2" />
                Copy IP
              </>
            )}
          </Button>
          <Button
            onClick={openSteamConnect}
            className="flex-1 bg-green-500 text-white hover:bg-green-600"
          >
            <PlayIcon className="w-4 h-4 mr-2" />
            Connect
          </Button>
        </div>
      </CardContent>
      <CardFooter className="bg-muted p-6 flex-col items-start">
        <div className="w-full mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Player Count
          </span>
        </div>
        <PlayerCountBar currentPlayers={server.numPlayers} maxPlayers={server.maxPlayers} />
      </CardFooter>
    </Card>
  )
}
