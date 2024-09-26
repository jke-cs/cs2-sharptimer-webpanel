import React from 'react';
import { useTheme } from '../context/ThemeContext'
import LeaderboardWrapper from './LeaderboardWrapper';

async function getPlayers() {
  const res = await fetch('http://localhost:3000/api/getPlayers', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch players');
  }
  return res.json();
}

export default async function Leaderboard() {
  const leaderboard = await getPlayers();

  return (
    <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      {/* Leaderboard */}
      <div className="w-full md:w-3/5 bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">Top Players</h2>
        <LeaderboardWrapper initialLeaderboard={leaderboard} />
      </div>

      {/* Right column for Global Points and Ranks */}
      <div className="w-full md:w-2/5 space-y-4 sm:space-y-6 md:space-y-8">
        {/* How to get Global Points */}
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">How to get Global Points</h2>
          <ul className="space-y-2">
            {[
              { action: "Complete Map 1st", points: 2000 },
              { action: "Beat SR", points: 1000 },
              { action: "Complete Map", points: 31 },
              { action: "Beat PB", points: 20 },
            ].map((item, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-700 rounded-lg p-2 sm:p-3">
                <span className="text-sm sm:text-base">{item.action}</span>
                <span className="font-semibold text-green-400 text-sm sm:text-base">+{item.points} Points</span>
              </li>
            ))}
          </ul>
        </div>

        {/* In-game Ranks */}
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">In-game Ranks</h2>
          <ul className="space-y-2">
            {[
              { rank: "Legend", color: "text-yellow-400", top: "0.05%" },
              { rank: "PRO", color: "text-purple-400", top: "0.1%" },
              { rank: "OG", color: "text-red-400", top: "2.5%" },
              { rank: "Master", color: "text-blue-400", top: "10%" },
              { rank: "Diamond", color: "text-cyan-400", top: "20%" },
              { rank: "Platinum", color: "text-green-400", top: "30%" },
              { rank: "Gold", color: "text-yellow-600", top: "40%" },
              { rank: "Silver", color: "text-gray-400", top: "50%" },
              { rank: "Bronze", color: "text-yellow-800", top: "99%" },
            ].map((item, index) => (
              <li key={index} className="bg-gray-700 rounded-lg p-2 sm:p-3 flex justify-between items-center">
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