// src/app/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Import the form components
import ProfileEditForm from "@/components/forms/ProfileEditForm"; // Adjust path if needed
import StatsSubmitForm from "@/components/forms/StatsSubmitForm"; // Adjust path if needed

// Define types for data
interface UserProfileData {
  name: string;
  email: string;
  // Add other profile fields if needed
}

interface StatsData {
  kills: number;
  deaths: number;
  assists: number;
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // --- State Management ---
  // Profile State
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  // Stats State
  const [isStatsSubmitting, setIsStatsSubmitting] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [statsSuccess, setStatsSuccess] = useState<string | null>(null);

  // --- Authentication & Data Fetching ---
  useEffect(() => {
    // Redirect if not authenticated
    if (status === "unauthenticated") {
      router.replace("/auth"); // Redirect to your auth page
      return; // Stop further execution in this render
    }

    // Fetch initial profile data when authenticated
    if (status === "authenticated") {
      setIsProfileLoading(true);
      setProfileError(null); // Clear previous errors
      fetch("/api/users/me") // Replace with your actual profile API endpoint
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch profile data.");
          }
          return res.json();
        })
        .then((data: UserProfileData) => { // Make sure API returns data in this shape
          setProfileData(data);
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
          setProfileError("Could not load your profile. Please try again later.");
        })
        .finally(() => {
          setIsProfileLoading(false);
        });
    }
  }, [status, router]); // Re-run when auth status changes

  // --- Submit Handlers ---
  const handleProfileSubmit = async (data: { name: string; email: string }) => {
    setIsProfileSubmitting(true);
    setProfileError(null); // Clear previous errors
    setProfileSuccess(null); // Clear previous success message

    try {
      const response = await fetch("/api/users/me", { // Your profile update endpoint
        method: "PUT", // Or PATCH
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || "Failed to update profile.");
      }

      // Update local state optimistically or re-fetch
      setProfileData(data); // Simple optimistic update
      setProfileSuccess("Profile updated successfully!");
      setTimeout(() => setProfileSuccess(null), 3000); // Clear success message after 3s

    } catch (error: any) {
      console.error("Error updating profile:", error);
      setProfileError(error.message || "An unexpected error occurred.");
    } finally {
      setIsProfileSubmitting(false);
    }
  };

  const handleStatsSubmit = async (data: StatsData) => {
    setIsStatsSubmitting(true);
    setStatsError(null);
    setStatsSuccess(null);

    try {
      const response = await fetch("/api/user/stats", { // Your stats submission endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

       if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || "Failed to submit stats.");
      }

      setStatsSuccess("Stats submitted successfully!");
      setTimeout(() => setStatsSuccess(null), 3000); // Clear success message

    } catch (error: any) {
      console.error("Error submitting stats:", error);
      setStatsError(error.message || "An unexpected error occurred.");
    } finally {
      setIsStatsSubmitting(false);
    }
  };

  // --- Render Logic ---

  // Loading state for authentication check
  if (status === "loading" || (status === "authenticated" && isProfileLoading)) {
    return <div className="flex justify-center items-center min-h-screen"><p className="text-slate-400">Loading settings...</p></div>; // Or a spinner component
  }

  // Should be redirected if unauthenticated, but render null as fallback
  if (status === "unauthenticated" || !profileData) {
    return null;
  }

  // Render the settings page content
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl"> {/* Constrain width */}
      <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-slate-100">Account Settings</h1>

      {/* Profile Section */}
      <section className="mb-12">
        {profileError && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{profileError}</div>}
        {profileSuccess && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{profileSuccess}</div>}

        <ProfileEditForm
          initialName={profileData.name}
          initialEmail={profileData.email}
          onSubmit={handleProfileSubmit}
          isSubmitting={isProfileSubmitting}
        />
      </section>

      {/* Stats Submission Section */}
      <section>
         <h2 className="text-2xl font-semibold mb-6 text-slate-800 dark:text-slate-200">Submit Recent Game Stats</h2>
         {statsError && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{statsError}</div>}
         {statsSuccess && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{statsSuccess}</div>}

         <StatsSubmitForm
           onSubmit={handleStatsSubmit}
           isSubmitting={isStatsSubmitting}
         />
      </section>

      {/* Add other settings sections as needed */}

    </div>
  );
}