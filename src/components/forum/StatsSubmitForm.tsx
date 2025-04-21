// src/components/forms/StatsSubmitForm.tsx
"use client";

import React, { useState } from "react";

interface StatsData {
  kills: number;
  deaths: number;
  assists: number;
}

interface StatsSubmitFormProps {
  onSubmit: (data: StatsData) => Promise<void>; // Make onSubmit async
  isSubmitting: boolean; // Add submitting state prop
}

export default function StatsSubmitForm({ onSubmit, isSubmitting }: StatsSubmitFormProps) {
  // Initialize with empty string for better controlled input handling with type="number"
  const [kills, setKills] = useState<string>("");
  const [deaths, setDeaths] = useState<string>("");
  const [assists, setAssists] = useState<string>("");

  // Helper to handle number input changes
  const handleNumberChange = (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Allow only non-negative integers
      const value = e.target.value;
      if (value === '' || /^[0-9]\d*$/.test(value)) {
          setter(value);
      }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Convert to numbers for submission, defaulting empty strings to 0
    const killsNum = parseInt(kills, 10) || 0;
    const deathsNum = parseInt(deaths, 10) || 0;
    const assistsNum = parseInt(assists, 10) || 0;

    await onSubmit({ kills: killsNum, deaths: deathsNum, assists: assistsNum });

    // Optionally clear form after successful submission (if parent doesn't unmount/remount)
    // setKills("");
    // setDeaths("");
    // setAssists("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      // Style assuming a dark theme page background, light card form
      className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg shadow-md w-full border border-slate-300 dark:border-slate-700"
    >
      <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Submit Game Stats</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"> {/* Grid layout */}
        <div>
          <label className="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300" htmlFor="kills">
            Kills
          </label>
          <input
            id="kills"
            type="number"
            min="0" // HTML5 validation: non-negative
            step="1" // HTML5 validation: integers only
            className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 disabled:opacity-50"
            value={kills}
            onChange={handleNumberChange(setKills)}
            required // HTML5 validation
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300" htmlFor="deaths">
            Deaths
          </label>
          <input
            id="deaths"
            type="number"
            min="0"
            step="1"
            className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 disabled:opacity-50"
            value={deaths}
            onChange={handleNumberChange(setDeaths)}
            required // HTML5 validation
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300" htmlFor="assists">
            Assists
          </label>
          <input
            id="assists"
            type="number"
            min="0"
            step="1"
            className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 disabled:opacity-50"
            value={assists}
            onChange={handleNumberChange(setAssists)}
            required // HTML5 validation
            disabled={isSubmitting}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-green-600 text-white py-2 px-4 rounded font-semibold hover:bg-green-700 dark:hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition duration-150 ease-in-out ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Stats'}
      </button>
    </form>
  );
}