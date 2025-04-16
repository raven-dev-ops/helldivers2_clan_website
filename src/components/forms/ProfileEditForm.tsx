"use client";

import React, { useState } from "react";

interface ProfileFormProps {
  initialName?: string;
  initialEmail?: string;
  onSubmit: (data: { name: string; email: string }) => void;
}

export default function ProfileEditForm({
  initialName = "",
  initialEmail = "",
  onSubmit,
}: ProfileFormProps) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ name, email });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow w-full max-w-sm">
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="name">
          Name
        </label>
        <input
          className="border border-gray-300 rounded px-2 py-1 w-full"
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          className="border border-gray-300 rounded px-2 py-1 w-full"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition"
      >
        Save
      </button>
    </form>
  );
}
