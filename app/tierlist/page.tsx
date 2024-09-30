'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LoadingSpinner from '@/components/LoadingSpinner'

interface MapData {
  mapname: string
  tier: number
  maxvelocity: number
  announcerecord: number
  gravityfix: number
  ranked: number
  mapper: string
}

const Input = ({ className = '', ...props }) => (
  <input
    className={`flex h-12 w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-100 ring-offset-gray-900 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

const Select = ({ children, className = '', ...props }) => (
  <select
    className={`flex h-12 w-full items-center justify-between rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-100 ring-offset-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </select>
)

const Card = ({ children, className = '', ...props }) => (
  <div className={`rounded-2xl border border-gray-700 bg-gray-800 text-gray-100 shadow-lg ${className}`} {...props}>
    {children}
  </div>
)

const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
)

const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
)

const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
)

const Badge = ({ children, className = '', ...props }) => (
  <span
    className={`inline-flex items-center rounded-full border border-purple-500 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 bg-purple-500 text-white ${className}`}
    {...props}
  >
    {children}
  </span>
)

const Pagination = ({ children, className = '', ...props }) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={`mx-auto flex w-full justify-center ${className}`}
    {...props}
  >
    {children}
  </nav>
)

const PaginationContent = ({ children, className = '', ...props }) => (
  <ul className={`flex flex-row items-center gap-1 ${className}`} {...props}>
    {children}
  </ul>
)

const PaginationItem = ({ children, className = '', ...props }) => (
  <li className={className} {...props}>
    {children}
  </li>
)

const PaginationLink = ({ children, isActive = false, className = '', ...props }) => (
  <button
    aria-current={isActive ? "page" : undefined}
    className={`flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
      isActive
        ? "bg-purple-600 text-white hover:bg-purple-700"
        : "bg-gray-800 text-gray-100 hover:bg-gray-700"
    } ${className}`}
    {...props}
  >
    {children}
  </button>
)

const PaginationPrevious = ({ className = '', ...props }) => (
  <PaginationLink className={`gap-1 pl-2.5 ${className}`} {...props}>
    <ChevronLeft className="h-4 w-4" />
    <span className="sr-only">Previous</span>
  </PaginationLink>
)

const PaginationNext = ({ className = '', ...props }) => (
  <PaginationLink className={`gap-1 pr-2.5 ${className}`} {...props}>
    <span className="sr-only">Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)

const PaginationEllipsis = ({ className = '', ...props }) => (
  <span
    className={`flex h-10 w-10 items-center justify-center ${className}`}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)

export default function MapExplorer() {
  const [maps, setMaps] = useState<MapData[]>([])
  const [filteredMaps, setFilteredMaps] = useState<MapData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTier, setSelectedTier] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(true)

  const mapsPerPage = 12
  const maxPages = 5

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        const response = await fetch('/maps.json')
        const data = await response.json()
        setMaps(data)
        setFilteredMaps(data)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching map data:', error)
        setIsLoading(false)
      }
    }

    fetchMaps()
  }, [])

  const filterMaps = useCallback(() => {
    const filtered = maps.filter((map) => {
      const tierMatch = selectedTier ? map.tier === parseInt(selectedTier) : true
      const nameMatch = map.mapname.toLowerCase().includes(searchTerm.toLowerCase())
      return tierMatch && nameMatch
    })
    setFilteredMaps(filtered)
    setCurrentPage(1)
  }, [searchTerm, selectedTier, maps])

  useEffect(() => {
    filterMaps()
  }, [filterMaps])

  const indexOfLastMap = currentPage * mapsPerPage
  const indexOfFirstMap = indexOfLastMap - mapsPerPage
  const currentMaps = filteredMaps.slice(indexOfFirstMap, indexOfLastMap)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(filteredMaps.length / mapsPerPage); i++) {
    pageNumbers.push(i)
  }

  const renderPageNumbers = () => {
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2))
    let endPage = Math.min(pageNumbers.length, startPage + maxPages - 1)

    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1)
    }

    return pageNumbers.slice(startPage - 1, endPage).map((number) => (
      <PaginationItem key={number}>
        <PaginationLink onClick={() => paginate(number)} isActive={currentPage === number}>
          {number}
        </PaginationLink>
      </PaginationItem>
    ))
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      <Header setIsDarkMode={setIsDarkMode} />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search maps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 rounded-full shadow-md focus:shadow-lg transition-shadow duration-300"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <div className="relative">
            <Select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="appearance-none w-full pl-4 pr-12 py-3 rounded-full shadow-md focus:shadow-lg transition-shadow duration-300"
            >
              <option value="">All Tiers</option>
              {[1, 2, 3, 4, 5, 6].map((tier) => (
                <option key={tier} value={tier.toString()}>
                  Tier {tier}
                </option>
              ))}
            </Select>
            <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
          </div>
        </div>

        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentMaps.map((map, index) => (
              <motion.div
                key={map.mapname}
                variants={mapVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                custom={index}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="bg-purple-600">
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate text-white">{map.mapname}</span>
                      <Badge>Tier {map.tier}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <p><span className="font-semibold text-purple-400">Mapper:</span> {map.mapper}</p>
                      <p><span className="font-semibold text-purple-400">Max Velocity:</span> {map.maxvelocity}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        <Pagination className="mt-12">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => paginate(Math.max(1, currentPage - 1))} />
            </PaginationItem>
            {renderPageNumbers()}
            {currentPage < pageNumbers.length - Math.floor(maxPages / 2) && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext onClick={() => paginate(Math.min(pageNumbers.length, currentPage + 1))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </main>
      <Footer />
    </div>
  )
}