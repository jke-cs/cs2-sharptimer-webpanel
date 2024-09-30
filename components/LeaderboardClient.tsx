'use client'

import React from 'react';
import { FaTrophy, FaSteam, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PlayerData {
  PlayerName: string;
  SteamID: string;
  GlobalPoints: number;
}

export const PCLeaderboard = ({ currentPlayers, indexOfFirstPlayer, getPointsStyle, theme }: { currentPlayers: PlayerData[], indexOfFirstPlayer: number, getPointsStyle: (rank: number) => string, theme: string }) => (
  <div className="overflow-x-auto flex-grow">
    <table className="w-full">
      <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}>
        <tr>
          <th className={`px-4 py-3 text-left text-xs font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider w-1/6`}>Rank</th>
          <th className={`px-4 py-3 text-left text-xs font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider w-3/6`}>Player</th>
          <th className={`px-4 py-3 text-right text-xs font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider w-2/6`}>Points</th>
        </tr>
      </thead>
      <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
        {currentPlayers.map((player: PlayerData, index: number) => {
          const rank = indexOfFirstPlayer + index + 1;
          const pointsStyle = getPointsStyle(rank);
          return (
            <tr key={player.SteamID} className={`${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors duration-200`}>
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

export const MobileLeaderboard = ({ currentPlayers, indexOfFirstPlayer, getPointsStyle, theme }: { currentPlayers: PlayerData[], indexOfFirstPlayer: number, getPointsStyle: (rank: number) => string, theme: string }) => (
  <div className="space-y-2 flex-grow">
    {currentPlayers.map((player: PlayerData, index: number) => {
      const rank = indexOfFirstPlayer + index + 1;
      const pointsStyle = getPointsStyle(rank);
      return (
        <div key={player.SteamID} className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-3 shadow`}>
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

export const Pagination = ({ currentPage, totalPages, paginate, theme }: { currentPage: number, totalPages: number, paginate: (pageNumber: number) => void, theme: string }) => {
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
    <div className="w-full flex justify-center">
      <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        <button
          onClick={() => paginate(1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700' : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'} text-sm font-medium`}
        >
          <span className="sr-only">First</span>
          <FaChevronLeft className="h-4 w-4 mr-1" />
          <FaChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-2 py-2 border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700' : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'} text-sm font-medium`}
        >
          <span className="sr-only">Previous</span>
          <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        {getPageRange().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && paginate(page)}
            className={`relative inline-flex items-center px-4 py-2 border ${
              currentPage === page
                ? 'z-10 bg-blue-600 text-white'
                : theme === 'dark'
                ? 'border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700'
                : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
            } text-sm font-medium ${typeof page !== 'number' ? 'cursor-default' : ''}`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-2 py-2 border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700' : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'} text-sm font-medium`}
        >
          <span className="sr-only">Next</span>
          <FaChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          onClick={() => paginate(totalPages)}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700' : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'} text-sm font-medium`}
        >
          <span className="sr-only">Last</span>
          <FaChevronRight className="h-4 w-4 mr-1" />
          <FaChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
};

export default function Leaderboard({ currentPlayers, indexOfFirstPlayer, getPointsStyle, currentPage, totalPages, paginate, theme }: {
  currentPlayers: PlayerData[],
  indexOfFirstPlayer: number,
  getPointsStyle: (rank: number) => string,
  currentPage: number,
  totalPages: number,
  paginate: (pageNumber: number) => void,
  theme: string
}) {
  return (
    <div className="flex flex-col min-h-[600px]">
      <div className="hidden md:block">
        <PCLeaderboard currentPlayers={currentPlayers} indexOfFirstPlayer={indexOfFirstPlayer} getPointsStyle={getPointsStyle} theme={theme} />
      </div>
      <div className="md:hidden">
        <MobileLeaderboard currentPlayers={currentPlayers} indexOfFirstPlayer={indexOfFirstPlayer} getPointsStyle={getPointsStyle} theme={theme} />
      </div>
      <div className="mt-auto pt-4 w-full max-w-2xl mx-auto">
        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} theme={theme} />
      </div>
    </div>
  );
}