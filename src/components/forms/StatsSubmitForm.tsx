"use client";

import React, { useState } from "react";

interface StatsData {
  kills: number;
  deaths: number;
  assists: number;
}

interface StatsSubmitFormProps {
  onSubmit: (data: StatsData) => void;
}

export default function StatsSubmitForm({ onSubmit }: StatsSubmitFormProps) {
  const [kills, setKills] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [assists, setAssists] = useState(0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ kills, deaths, assists });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow w-full max-w-sm">
      <div className="mb-2">
        <label className="block text-sm font-bold mb-1" htmlFor="kills">
          Kills
        </label>
        <input
          id="kills"
          type="number"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={kills}
          onChange={(e) => setKills(parseInt(e.target.value))}
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-bold mb-1" htmlFor="deaths">
          Deaths
        </label>
        <input
          id="deaths"
          type="number"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={deaths}
          onChange={(e) => setDeaths(parseInt(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-1" htmlFor="assists">
          Assists
        </label>
        <input
          id="assists"
          type="number"
          className="border border-gray-300 rounded px-2 py-1 w-full"
          value={assists}
          onChange={(e) => setAssists(parseInt(e.target.value))}
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 transition"
      >
        Submit
      </button>
    </form>
  );
}
