import React from "react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

export default function LeaderboardTable({ entries }: LeaderboardTableProps) {
  return (
    <table className="min-w-full border-collapse border border-gray-200">
      <thead>
        <tr className="bg-gray-50">
          <th className="p-2 border border-gray-200">Rank</th>
          <th className="p-2 border border-gray-200">Name</th>
          <th className="p-2 border border-gray-200">Score</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => (
          <tr key={entry.rank}>
            <td className="p-2 border border-gray-200 text-center">{entry.rank}</td>
            <td className="p-2 border border-gray-200">{entry.name}</td>
            <td className="p-2 border border-gray-200 text-right">{entry.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
