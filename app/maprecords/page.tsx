"use client"

import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LoadingSpinner from '@/components/LoadingSpinner'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface MapRecord {
  MapName: string
  PlayerName: string
  FormattedTime: string
}

export default function MapRecordsPage() {
  const [mapRecords, setMapRecords] = useState<MapRecord[]>([])
  const [expandedMaps, setExpandedMaps] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getMapRecords')
        const data: MapRecord[] = await response.json()
        setMapRecords(data)
      } catch (error) {
        console.error('Error fetching map records:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const toggleMap = (mapName: string) => {
    setExpandedMaps(prev =>
      prev.includes(mapName) ? prev.filter(name => name !== mapName) : [...prev, mapName]
    )
  }

  const mapVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 transition-colors duration-300">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-5xl font-extrabold mb-12 text-center text-white">Map Records</h1>
        {isLoading ? (
          <div className="h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-6">
              {Object.entries(
                mapRecords.reduce((acc, record) => {
                  if (!acc[record.MapName]) acc[record.MapName] = []
                  acc[record.MapName].push(record)
                  return acc
                }, {} as Record<string, MapRecord[]>)
              ).map(([mapName, records], index) => {
                const mapImageUrl = `https://cs2browser.com/static/img/maps/${mapName}.webp`
                const isExpanded = expandedMaps.includes(mapName)

                return (
                  <motion.div
                    key={mapName}
                    variants={mapVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    custom={index}
                    className="group"
                  >
                    <motion.button
                      onClick={() => toggleMap(mapName)}
                      className={`
                        relative w-full flex items-center justify-between p-6
                        bg-gradient-to-r from-gray-800 to-gray-700
                        hover:from-gray-700 hover:to-gray-600
                        rounded-2xl shadow-lg transition-all duration-300 ease-in-out overflow-hidden group
                        ${isExpanded ? 'from-gray-700 to-gray-600' : ''}
                      `}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div
                        className={`
                          absolute inset-0 bg-cover bg-center
                          transition-opacity duration-300
                          ${isExpanded ? 'opacity-50' : 'opacity-30 group-hover:opacity-50'}
                        `}
                        style={{ backgroundImage: `url(${mapImageUrl})` }}
                      />
                      <div
                        className={`
                          absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-900/80
                          transition-opacity duration-300
                          ${isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                        `}
                      />
                      <span className="relative z-20 font-bold text-2xl text-white flex-1 text-left ml-4">
                        {mapName}
                      </span>
                      <motion.div
                        className="relative z-20 bg-purple-500 rounded-full p-2 mr-4"
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-6 h-6 text-white" />
                      </motion.div>
                    </motion.button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-2 space-y-2 pl-4 pr-4 overflow-hidden"
                        >
                          {records
                            .sort((a, b) => a.FormattedTime.localeCompare(b.FormattedTime))
                            .map((record, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl flex justify-between items-center shadow-md hover:shadow-lg transition-shadow duration-200"
                              >
                                <span className="mr-4 font-semibold text-purple-400 text-lg">
                                  #{index + 1}
                                </span>
                                <span className="flex-1 text-gray-200">{record.PlayerName}</span>
                                <span className="text-pink-400 font-mono">{record.FormattedTime}</span>
                              </motion.div>
                            ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </AnimatePresence>
        )}
      </main>
      <Footer />
    </div>
  )
}