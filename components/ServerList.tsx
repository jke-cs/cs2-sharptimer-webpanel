'use client'

import { useState, useEffect } from 'react'
import ServerCard from './ServerCard'
import LoadingSpinner from './LoadingSpinner'

interface Server {
  name: string
  map: string
  numPlayers: number
  maxPlayers: number
  players: string[]
  bots: number
  connect: string
  ping: number
}

export default function ServerList() {
  const [servers, setServers] = useState<Server[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServers = async () => {
    try {
      const response = await fetch('/api/servers')
      if (!response.ok) {
        throw new Error('Failed to fetch server data')
      }
      const data = await response.json()
      setServers(data)
      setLoading(false)
    } catch (err) {
      setError('Failed to load server data. Please try again later.')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServers()
  }, [])

  const handleRefresh = async (serverConnect: string) => {
    try {
      const response = await fetch('/api/servers')
      if (!response.ok) {
        throw new Error('Failed to fetch server data')
      }
      const data: Server[] = await response.json()
      const updatedServer = data.find(server => server.connect === serverConnect)
      if (updatedServer) {
        return {
          numPlayers: updatedServer.numPlayers,
          maxPlayers: updatedServer.maxPlayers,
          ping: updatedServer.ping
        }
      } else {
        throw new Error('Server not found')
      }
    } catch (error) {
      console.error('Failed to refresh server info:', error)
      throw error
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {servers.map((server, index) => (
          <div key={index} className="w-full max-w-sm">
            <ServerCard 
              server={server} 
              onRefresh={() => handleRefresh(server.connect)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}