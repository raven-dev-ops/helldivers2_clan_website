// src/hooks/useDivisionSelection.ts
import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export interface DivisionSelectionResult {
  selectDivision: (href: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useDivisionSelection(): DivisionSelectionResult {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectDivision = async (href: string) => {
    setError(null); // Reset error on new attempt

    // 1. Prevent action if auth loading
    if (status === 'loading') {
      console.warn('useDivisionSelection: Auth status loading, aborting.');
      return;
    }

    // 2. Client-side check: If not authenticated, redirect to sign in
    if (status !== 'authenticated' || !session) {
      console.warn(
        'useDivisionSelection: Client session invalid/missing. Redirecting to auth.'
      );
      signIn(undefined, { callbackUrl: href }); // Default signIn page
      return; // Stop execution
    }

    // 3. Prepare for API call
    const divisionIdentifier = href.replace(/^\//, ''); // Remove leading slash if present
    console.log(`Attempting to set division via API: ${divisionIdentifier}`);
    setIsLoading(true);

    try {
      // 4. API Call
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ division: divisionIdentifier }),
      });

      // 5. Handle API Response
      if (!response.ok) {
        if (response.status === 401) {
          console.error(
            `API Error (${response.status}): Unauthorized. Server session invalid/expired. Redirecting to auth.`
          );
          setError(
            `Unauthorized (Status ${response.status}). Please sign in again.`
          );
          // Redirect to sign-in page
          signIn(undefined, { callbackUrl: href, error: 'SessionRequired' });
        } else {
          const errorText = await response
            .text()
            .catch(() => 'Could not read error response.');
          console.error(
            `API Error (${response.status}): Failed to update user division.`,
            errorText
          );
          setError(
            `Error: Could not select division (Status ${response.status}). ${errorText}`
          );
          alert(
            `Error: Could not select division. Server responded with status ${response.status}.`
          ); // Keep alert for immediate feedback
        }
        setIsLoading(false);
        return; // Stop execution after handling error
      }

      // --- Success Case ---
      const responseData = await response.json();
      console.log('User division updated successfully via API.', responseData);
      // Navigate the user to the selected game's page
      router.push(href);
      // No need to setIsLoading(false) here as navigation will unmount/remount
    } catch (err) {
      // 6. Handle Network/Fetch Errors
      console.error('Network or other error during division update:', err);
      setError('Network Error: Could not connect to the server.');
      alert('Error: Could not connect to the server to select division.');
      setIsLoading(false);
    }
  };

  return { selectDivision, isLoading, error };
}
