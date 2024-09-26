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

const PlayerCountGraph: React.FC<{ data: { time: string; count: number }[]; maxPlayers: number }> = ({ data, maxPlayers }) => {
  const height = 100
  const width = 300
  const padding = 20
  const barWidth = (width - padding * 2) / data.length

  const yScale = (count: number) => {
    const graphHeight = height - padding * 2
    return graphHeight - (count / maxPlayers) * graphHeight
  }

  return (
    <svg width={width} height={height} className="player-count-graph">
      <defs>
        <linearGradient id="barGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(59, 130, 246, 0.8)" />
          <stop offset="100%" stopColor="rgba(59, 130, 246, 0.2)" />
        </linearGradient>
      </defs>
      {data.map((d, i) => (
        <g key={i}>
          <rect
            x={padding + i * barWidth}
            y={padding + yScale(d.count)}
            width={barWidth - 2}
            height={height - padding * 2 - yScale(d.count)}
            fill="url(#barGradient)"
            rx={2}
          />
          <text
            x={padding + i * barWidth + barWidth / 2}
            y={padding + yScale(d.count) - 5}
            textAnchor="middle"
            fontSize="10"
            fill="currentColor"
          >
            {d.count}
          </text>
        </g>
      ))}
      <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke="currentColor"
        strokeOpacity="0.2"
      />
      <text
        x={width - padding}
        y={padding}
        textAnchor="end"
        fontSize="10"
        fill="currentColor"
        opacity="0.7"
      >
        Max: {maxPlayers}
      </text>
    </svg>
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
        const updated = [...prev, newData].slice(-30) // Keep last 30 data points (30 minutes)
        return updated
      })
    }

    updatePlayerCount() // Initial update
    const intervalId = setInterval(updatePlayerCount, 60000) // Update every minute

    return () => clearInterval(intervalId)
  }, [server.numPlayers])

  const copyToClipboard = async () => {
    setCopying(true)
    try {
      await navigator.clipboard.writeText(server.connect)
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
        <PlayerCountGraph data={playerCountHistory} maxPlayers={server.maxPlayers} />
      </CardFooter>
    </Card>
  )
}