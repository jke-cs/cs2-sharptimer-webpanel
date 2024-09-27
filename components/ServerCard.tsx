"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { MapIcon, UsersIcon, GamepadIcon, CopyIcon, PlayIcon } from 'lucide-react'

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'connect'
}> = ({ children, className = '', variant = 'default', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  const variantStyles = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    connect: 'bg-purple-600 text-white hover:bg-purple-700'
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
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-purple-700/40 blur-sm"
          style={{
            width: `${widthPercentage}%`,
            transition: 'width 1s ease-in-out',
          }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
          {currentPlayers}/{maxPlayers} Players ({Math.round(widthPercentage)}%)
        </span>
      </div>
    </div>
  )
}

const PingIndicator: React.FC<{ ping: number }> = ({ ping }) => {
  const getBarColor = (threshold: number) => {
    if (ping <= threshold) {
      return 'bg-green-500'
    } else if (ping <= 60) {
      return 'bg-orange-500'
    } else {
      return 'bg-red-500'
    }
  }

  return (
    <div className="flex items-end h-5 space-x-1 mr-2">
      <div className={`w-1 h-1 ${getBarColor(60)}`} />
      <div className={`w-1 h-3 ${ping <= 60 ? getBarColor(30) : 'bg-gray-300'}`} />
      <div className={`w-1 h-5 ${ping <= 30 ? getBarColor(30) : 'bg-gray-300'}`} />
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
  onRefresh: () => Promise<{
    numPlayers: number
    maxPlayers: number
    ping: number
  }>
}

export default function ServerCard({ server: initialServer, onRefresh }: ServerProps) {
  const [server, setServer] = useState(initialServer)
  const [copying, setCopying] = useState(false)
  const [playerCountHistory, setPlayerCountHistory] = useState<{ time: string; count: number }[]>([])
  const mapImageUrl = `https://cs2browser.com/static/img/maps/${server.map}.webp`

  const updateServerInfo = useCallback(async () => {
    try {
      const updatedInfo = await onRefresh()
      setServer(prevServer => ({
        ...prevServer,
        ...updatedInfo
      }))

      const now = new Date()
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      setPlayerCountHistory(prev => {
        const newData = { time, count: updatedInfo.numPlayers }
        return [...prev, newData].slice(-30)
      })
    } catch (error) {
      console.error('Failed to refresh server info:', error)
    }
  }, [onRefresh])

  useEffect(() => {
    updateServerInfo() // Initial update
    const intervalId = setInterval(updateServerInfo, 30000) // Update every 30 seconds

    return () => clearInterval(intervalId)
  }, [updateServerInfo])

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

  const getPingColor = (ping: number) => {
    if (ping < 30) return 'text-green-500'
    if (ping < 60) return 'text-orange-500'
    return 'text-red-500'
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
            <div className="flex items-center">
              <PingIndicator ping={server.ping} />
              <span className={`font-medium ${getPingColor(server.ping)}`}>
                {server.ping || 'N/A'} ms
              </span>
            </div>
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
            variant="connect"
            className="flex-1"
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