'use client'

import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { PCLeaderboard, MobileLeaderboard, Pagination } from './LeaderboardClient';

interface PlayerData {
  PlayerName: string;
  SteamID: string;
  GlobalPoints: number;
}

interface LeaderboardWrapperProps {
  initialLeaderboard: PlayerData[];
}

export default function LeaderboardWrapper({ initialLeaderboard }: LeaderboardWrapperProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const playersPerPage = 10;
  const { theme } = useTheme();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentPlayers = initialLeaderboard.slice(indexOfFirstPlayer, indexOfLastPlayer);
  const totalPages = Math.ceil(initialLeaderboard.length / playersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getPointsStyle = (rank: number) => {
    if (rank === 1) return 'bg-yellow-400 text-gray-900';
    if (rank === 2) return 'bg-gray-300 text-gray-900';
    if (rank === 3) return 'bg-yellow-700 text-white';
    return theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800';
  };

  return (
    <div className={`space-y-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg`}>
      {isMobile ? (
        <MobileLeaderboard
          currentPlayers={currentPlayers}
          indexOfFirstPlayer={indexOfFirstPlayer}
          getPointsStyle={getPointsStyle}
          theme={theme}
        />
      ) : (
        <PCLeaderboard
          currentPlayers={currentPlayers}
          indexOfFirstPlayer={indexOfFirstPlayer}
          getPointsStyle={getPointsStyle}
          theme={theme}
        />
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
        theme={theme}
      />
    </div>
  );
}