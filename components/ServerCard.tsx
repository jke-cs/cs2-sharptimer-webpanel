"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { MapIcon, UsersIcon, GamepadIcon, CopyIcon, PlayIcon, LayersIcon, RefreshCwIcon, ChevronDownIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type ButtonVariant = 'default' | 'outline' | 'connect' | 'icon'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'default', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  const variantStyles: Record<ButtonVariant, string> = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    connect: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700',
    icon: 'bg-transparent text-muted-foreground hover:text-foreground'
  }
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${variantStyles[variant]} h-10 py-2 px-4 ${className} transition-all duration-200`}
      {...props}
    >
      {children}
    </motion.button>
  )
}

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className={`rounded-xl border bg-card text-card-foreground shadow-lg overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </motion.div>
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

const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
)

const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className = '', ...props }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
)

const PlayerCountBar: React.FC<{ currentPlayers: number; maxPlayers: number }> = ({ currentPlayers, maxPlayers }) => {
  const widthPercentage = Math.min((currentPlayers / maxPlayers) * 100, 100)

  return (
    <div className="w-full mt-4">
      <div className="relative h-6 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600"
          initial={{ width: 0 }}
          animate={{ width: `${widthPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full bg-white opacity-20"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: `${widthPercentage}%`, opacity: 0.2 }}
          transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white mix-blend-difference">
          {currentPlayers}/{maxPlayers} Players ({Math.round(widthPercentage)}%)
        </span>
      </div>
    </div>
  )
}

const PingIndicator: React.FC<{ ping: number }> = ({ ping }) => {
  const getBarColor = (threshold: number) => {
    if (ping < 50) return 'bg-green-500'
    if (ping < 80) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="flex items-end h-5 space-x-1 mr-2">
      <motion.div
        className={`w-1 ${getBarColor(80)}`}
        initial={{ height: 0 }}
        animate={{ height: '20%' }}
        transition={{ duration: 0.3, delay: 0.1 }}
      />
      <motion.div
        className={`w-1 ${ping < 80 ? getBarColor(50) : 'bg-gray-300'}`}
        initial={{ height: 0 }}
        animate={{ height: '60%' }}
        transition={{ duration: 0.3, delay: 0.2 }}
      />
      <motion.div
        className={`w-1 ${ping < 50 ? getBarColor(50) : 'bg-gray-300'}`}
        initial={{ height: 0 }}
        animate={{ height: '100%' }}
        transition={{ duration: 0.3, delay: 0.3 }}
      />
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
    name: string
    numPlayers: number
    maxPlayers: number
    ping: number
  }>
}

interface MapData {
  mapname: string
  tier: number
}

export default function ServerCard({ server: initialServer, onRefresh }: ServerProps) {
  const [server, setServer] = useState(initialServer)
  const [copying, setCopying] = useState(false)
  const [playerCountHistory, setPlayerCountHistory] = useState<{ time: string; count: number }[]>([])
  const [mapTier, setMapTier] = useState<number | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const mapImageUrl = `https://cs2browser.com/static/img/maps/${server.map}.webp`

  const updateServerInfo = useCallback(async () => {
    setIsRefreshing(true)
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
    } finally {
      setIsRefreshing(false)
    }
  }, [onRefresh])

  useEffect(() => {
    updateServerInfo()
    const intervalId = setInterval(updateServerInfo, 30000)
    return () => clearInterval(intervalId)
  }, [updateServerInfo])

  useEffect(() => {
    const fetchMapTier = async () => {
      try {
        const response = await fetch('/maps.json')
        const mapsData: MapData[] = await response.json()
        const currentMap = mapsData.find(map => map.mapname.toLowerCase() === server.map.toLowerCase())
        setMapTier(currentMap ? currentMap.tier : null)
      } catch (error) {
        console.error('Failed to fetch map tier:', error)
      }
    }

    fetchMapTier()
  }, [server.map])

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
    if (ping < 50) return 'text-green-500'
    if (ping < 80) return 'text-yellow-500'
    return 'text-red-500'
  }

  const truncateServerName = (name: string, maxLength: number) => {
    if (!name) return 'Unknown Server'
    return name.length > maxLength ? name.substring(0, maxLength - 3) + '...' : name
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-gray-900 to-gray-800">
      <div
        className="h-48 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${mapImageUrl})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" />
        <div className="h-full w-full p-6 flex flex-col justify-between relative z-10">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-white truncate max-w-[80%]" title={server.name}>
              {truncateServerName(server.name, 30)}
            </h2>
            <Button 
              variant="icon" 
              onClick={updateServerInfo} 
              className="text-white"
              disabled={isRefreshing}
            >
              <RefreshCwIcon className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <div className="flex items-center text-white">
            <MapIcon className="w-5 h-5 mr-2" />
            <span className="font-medium">{server.map || 'Unknown'}</span>
          </div>
        </div>
      </div>
      <CardContent className="p-6 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UsersIcon className="w-5 h-5 mr-2 text-purple-400" />
              <span className="text-white font-medium">
                {server.numPlayers}/{server.maxPlayers} Players
              </span>
            </div>
            <div className="flex items-center">
              <PingIndicator ping={server.ping} />
              <span className={`font-medium ${getPingColor(server.ping)}`}>
                {server.ping || '0'} ms
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <GamepadIcon className="w-5 h-5 mr-2 text-indigo-400" />
            <span className="text-white truncate" title={server.connect}>{server.connect || 'Unknown'}</span>
          </div>
          <div className="flex items-center">
            <LayersIcon className="w-5 h-5 mr-2 text-blue-400" />
            <span className="text-white">
              Tier: {mapTier !== null ? mapTier : 'Unknown'}
            </span>
          </div>
        </div>
        <div className="mt-6 flex space-x-2">
          <Button
            onClick={copyToClipboard}
            disabled={copying}
            variant="outline"
            className="flex-1 hover:bg-white hover:text-gray-900 border-white text-white"
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
      <CardFooter className="bg-gray-900 p-6 flex-col items-start">
        <div className="w-full mb-2 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-400">
            Player Count
          </span>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        <PlayerCountBar currentPlayers={server.numPlayers} maxPlayers={server.maxPlayers} />
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full mt-4 overflow-hidden"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-400">Player Count History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={playerCountHistory}>
                        <XAxis 
                          dataKey="time" 
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                                        Time
                                      </span>
                                      <span className="font-bold text-muted-foreground">
                                        {payload[0].payload.time}
                                      </span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                                        Players
                                      </span>
                                      <span className="font-bold">
                                        {payload[0].value}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#ffbb00"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </CardFooter>
    </Card>
  )
}