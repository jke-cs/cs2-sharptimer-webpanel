"use client"

import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FaChevronDown, FaChevronRight } from 'react-icons/fa'

interface MapRecord {
  MapName: string
  PlayerName: string
  FormattedTime: string
}

export default function MapRecordsPage() {
  const [mapRecords, setMapRecords] = useState<MapRecord[]>([])
  const [expandedMaps, setExpandedMaps] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getMapRecords')
        const data: MapRecord[] = await response.json()
        setMapRecords(data)
      } catch (error) {
        console.error('Error fetching map records:', error)
      }
    }

    fetchData()
  }, [])

  const toggleMap = (mapName: string) => {
    setExpandedMaps(prev =>
      prev.includes(mapName) ? prev.filter(name => name !== mapName) : [...prev, mapName]
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Map Records</h1>
        <div className="space-y-4">
          {Object.entries(
            mapRecords.reduce((acc, record) => {
              if (!acc[record.MapName]) acc[record.MapName] = []
              acc[record.MapName].push(record)
              return acc
            }, {} as Record<string, MapRecord[]>)
          ).map(([mapName, records]) => {
            const mapImageUrl = `https://cs2browser.com/static/img/maps/${mapName}.webp`

            return (
              <div key={mapName}>
                <button
                  onClick={() => toggleMap(mapName)}
                  className="relative w-full flex items-center justify-between p-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg shadow transition-all duration-200 ease-in-out overflow-hidden"
                >
                  {/* Image Container */}
                  <div
                    className="relative h-16 w-1/4 flex-shrink-0 mr-4 bg-cover bg-center rounded-lg"
                    style={{
                      backgroundImage: `url(${mapImageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {/* Gradient Fade on the Left */}
                    <div className="absolute inset-0 left-0 bg-gradient-to-r from-gray-200 via-transparent to-transparent dark:from-gray-700 z-10"></div>
                  </div>

                  {/* Map Name */}
                  <span className="relative z-20 font-semibold text-lg text-gray-800 dark:text-white flex-1 text-left">
                    {mapName}
                  </span>
                  
                  {/* Arrow Icon */}
                  <span className="relative z-20 text-gray-800 dark:text-white">
                    {expandedMaps.includes(mapName) ? <FaChevronDown /> : <FaChevronRight />}
                  </span>
                </button>
                {/* Map Records (Expand/Collapse) */}
                {expandedMaps.includes(mapName) && (
                  <div className="mt-2 space-y-2 pl-4 pr-4 overflow-hidden transition-all duration-300 ease-in-out">
                    {records
                      .sort((a, b) => a.FormattedTime.localeCompare(b.FormattedTime)) 
                      .map((record, index) => (
                        <div key={index} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg flex justify-between shadow">
                          {/* Rank Number */}
                          <span className="mr-2 font-semibold text-gray-700 dark:text-gray-300">
                            {index + 1} 
                          </span>
                          <span>{record.PlayerName}</span>
                          <span>{record.FormattedTime}</span>
                        </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>
      <Footer />
    </div>
  )
}
