'use client'

import React from 'react';
import { FaTrophy, FaSteam, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PlayerData {
  PlayerName: string;
  SteamID: string;
  GlobalPoints: number;
}

export const PCLeaderboard = ({ currentPlayers, indexOfFirstPlayer, getPointsStyle }: { currentPlayers: PlayerData[], indexOfFirstPlayer: number, getPointsStyle: (rank: number) => string }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-700">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider w-1/6">Rank</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider w-3/6">Player</th>
          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider w-2/6">Points</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-700">
        {currentPlayers.map((player: PlayerData, index: number) => {
          const rank = indexOfFirstPlayer + index + 1;
          const pointsStyle = getPointsStyle(rank);
          return (
            <tr key={player.SteamID} className="hover:bg-gray-700 transition-colors duration-200">
              <td className="px-4 py-3 whitespace-nowrap w-1/6">
                <div className="flex items-center">
                  {rank <= 3 ? (
                    <FaTrophy className={`text-xl mr-2 ${
                      rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-gray-300' : 'text-yellow-700'
                    }`} />
                  ) : (
                    <span className="text-sm font-semibold w-8 text-center">{rank}</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap w-3/6">
                <div className="flex items-center">
                  <a href={`https://steamcommunity.com/profiles/${player.SteamID}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 mr-2">
                    <FaSteam />
                  </a>
                  <span className="text-sm font-medium">{player.PlayerName}</span>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right w-2/6">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${pointsStyle}`}>
                  {player.GlobalPoints.toLocaleString()}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export const MobileLeaderboard = ({ currentPlayers, indexOfFirstPlayer, getPointsStyle }: { currentPlayers: PlayerData[], indexOfFirstPlayer: number, getPointsStyle: (rank: number) => string }) => (
  <div className="space-y-2">
    {currentPlayers.map((player: PlayerData, index: number) => {
      const rank = indexOfFirstPlayer + index + 1;
      const pointsStyle = getPointsStyle(rank);
      return (
        <div key={player.SteamID} className="bg-gray-700 rounded-lg p-3 shadow">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              {rank <= 3 && <FaTrophy className={`mr-2 ${rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-gray-300' : 'text-yellow-700'}`} />}
              <span className="font-bold text-sm">{rank}</span>
            </div>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${pointsStyle}`}>
              {player.GlobalPoints.toLocaleString()} pts
            </span>
          </div>
          <div className="flex items-center">
            <a href={`https://steamcommunity.com/profiles/${player.SteamID}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 mr-2">
              <FaSteam />
            </a>
            <span className="text-sm font-medium">{player.PlayerName}</span>
          </div>
        </div>
      );
    })}
  </div>
);

export const Pagination = ({ currentPage, totalPages, paginate }: { currentPage: number, totalPages: number, paginate: (pageNumber: number) => void }) => {
  const getPageRange = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    let l;
    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="mt-4 flex justify-center">
      <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        <button
          onClick={() => paginate(1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700"
        >
          <span className="sr-only">First</span>
          <FaChevronLeft className="h-4 w-4 mr-1" />
          <FaChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-2 py-2 border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700"
        >
          <span className="sr-only">Previous</span>
          <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        {getPageRange().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && paginate(page)}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-700 bg-gray-800 text-sm font-medium ${
              currentPage === page
                ? 'z-10 bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-700'
            } ${typeof page !== 'number' ? 'cursor-default' : ''}`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-2 py-2 border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700"
        >
          <span className="sr-only">Next</span>
          <FaChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          onClick={() => paginate(totalPages)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700"
        >
          <span className="sr-only">Last</span>
          <FaChevronRight className="h-4 w-4 mr-1" />
          <FaChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
};