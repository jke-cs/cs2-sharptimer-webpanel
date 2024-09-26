'use client'

import { useState, useEffect } from 'react'
import ServerCard from './ServerCard'

interface Server {
  name: string
  map: string
  players: number
  maxPlayers: number
  ping: number
  gameMode: string
}

export default function ServerList() {
  const [servers, setServers] = useState<Server[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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

    fetchServers()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading server data...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {servers.map((server, index) => (
        <ServerCard key={index} server={server} />
      ))}
    </div>
  )
}