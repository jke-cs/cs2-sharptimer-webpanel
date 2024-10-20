'use client'

import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext'
import LeaderboardWrapper from './LeaderboardWrapper';

async function getPlayers() {
  const res = await fetch('http://localhost:3000/api/getPlayers', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch players');
  }
  return res.json();
}

export default function Leaderboard() {
  const { theme } = useTheme();
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPlayers()
      .then(data => {
        setLeaderboard(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching leaderboard:', error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className={`flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className={`w-full md:w-3/5 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg shadow-lg p-4 sm:p-6`}>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">Top Players</h2>
        <LeaderboardWrapper initialLeaderboard={leaderboard} />
      </div>

      <div className="w-full md:w-2/5 space-y-4 sm:space-y-6 md:space-y-8">
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-4 sm:p-6 shadow-lg`}>
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">How to get Global Points</h2>
          <ul className="space-y-2">
            {[
              { action: "Complete Map 1st", points: 2000 },
              { action: "Beat SR", points: 1000 },
              { action: "Complete Map", points: 31 },
              { action: "Beat PB", points: 20 },
            ].map((item, index) => (
              <li key={index} className={`flex justify-between items-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-2 sm:p-3`}>
                <span className="text-sm sm:text-base">{item.action}</span>
                <span className="font-semibold text-green-400 text-sm sm:text-base">+{item.points} Points</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-4 sm:p-6 shadow-lg`}>
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">In-game Ranks</h2>
          <ul className="space-y-2">
            {[
                        { rank: "GOD III", color: "text-red-400", top: "1%" },
                        { rank: "GOD II", color: "text-red-400", top: "2%" },
                        { rank: "GOD I", color: "text-red-400", top: "3%" },
                        { rank: "ROYALTY I - III", color: "text-purple-400", top: "20% 10%" },
                        { rank: "LEGEND I - III", color: "text-yellow-400", top: "35% - 25%" },
                        { rank: "MASTER I - III", color: "text-blue-400", top: "50% - 40%" },
                        { rank: "DIAMOND I - III", color: "text-cyan-400", top: "65% - 55%" },
                        { rank: "PLATINUM I - III", color: "text-green-400", top: "80% - 70%" },
                        { rank: "GOLD I - III", color: "text-yellow-600", top: "95% - 85%" },
                        { rank: "SILVER I", color: "text-gray-400", top: "100%" },
            ].map((item, index) => (
              <li key={index} className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-2 sm:p-3 flex justify-between items-center`}>
                <span className={`font-semibold ${item.color} text-sm sm:text-base`}>[{item.rank}]</span>
                <span className="text-xs sm:text-sm">Top {item.top}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}