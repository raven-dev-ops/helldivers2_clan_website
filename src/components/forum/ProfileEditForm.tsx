// src/components/forms/ProfileEditForm.tsx
"use client";

import React, { useState, useEffect } from "react";

interface ProfileFormProps {
  initialName?: string;
  initialEmail?: string;
  onSubmit: (data: { name: string; email: string }) => Promise<void>; // Make onSubmit async
  isSubmitting: boolean; // Add submitting state prop
}

export default function ProfileEditForm({
  initialName = "",
  initialEmail = "",
  onSubmit,
  isSubmitting, // Receive submitting state
}: ProfileFormProps) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);

  // Update state if initial props change after initial render (e.g., data loads late)
  useEffect(() => {
    setName(initialName);
    setEmail(initialEmail);
  }, [initialName, initialEmail]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Basic validation example
    if (!name.trim() || !email.trim()) {
      alert("Name and Email cannot be empty.");
      return;
    }
    await onSubmit({ name, email }); // Await the async onSubmit
  }

  return (
    <form
      onSubmit={handleSubmit}
      // Style assuming a dark theme page background, light card form
      className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg shadow-md w-full border border-slate-300 dark:border-slate-700"
    >
      <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Edit Profile</h3>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300" htmlFor="name">
          Display Name
        </label>
        <input
          className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50"
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required // HTML5 validation
          disabled={isSubmitting} // Disable when submitting
        />
      </div>

      <div className="mb-6"> {/* Increased bottom margin */}
        <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300" htmlFor="email">
          Email Address
        </label>
        <input
          className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required // HTML5 validation
          disabled={isSubmitting} // Disable when submitting
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting} // Disable button when submitting
        className={`w-full bg-blue-600 text-white py-2 px-4 rounded font-semibold hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition duration-150 ease-in-out ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
}