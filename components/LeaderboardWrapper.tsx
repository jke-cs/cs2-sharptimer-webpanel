'use client'

import React, { useState, useEffect } from 'react';
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
    return 'bg-gray-600 text-white';
  };

  return (
    <div className="space-y-4">
      {isMobile ? (
        <MobileLeaderboard
          currentPlayers={currentPlayers}
          indexOfFirstPlayer={indexOfFirstPlayer}
          getPointsStyle={getPointsStyle}
        />
      ) : (
        <PCLeaderboard
          currentPlayers={currentPlayers}
          indexOfFirstPlayer={indexOfFirstPlayer}
          getPointsStyle={getPointsStyle}
        />
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
      />
    </div>
  );
}