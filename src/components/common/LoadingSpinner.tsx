"use client";

import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
