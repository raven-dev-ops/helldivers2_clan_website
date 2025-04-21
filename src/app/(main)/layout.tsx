// src/app/(main)/layout.tsx (Polished Main Layout - Standard CSS)
import Navbar from '@/components/common/Navbar'; // Adjust path if needed
import Footer from '@/components/common/Footer'; // Adjust path if needed
// ThemeToggle is assumed to be inside Navbar or Footer

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // This outer fragment inherits flex setup from RootLayout's body
    // No extra div needed here as body is already flex-col
    <>
      <Navbar />

      {/* Main content area */}
      {/* Using semantic <main> tag */}
      {/* Apply layout helper classes defined in globals.css */}
      <main className="container flex-grow py-6 sm:py-8 relative z-10">
        {/*
           - container: Applies max-width, horizontal centering, and horizontal padding.
           - flex-grow: Makes this section expand to fill available vertical space, pushing the footer down.
           - py-6 sm:py-8: Example vertical padding (adjust values or add classes as needed).
                           NOTE: Standard CSS doesn't have responsive prefixes like sm:py-8 by default.
                           You would need to define responsive padding classes in globals.css or use media queries.
                           Using fixed padding like 'py-8' for simplicity here.
           - relative z-10: Ensures content is above potential global background overlays.
         */}

        {/* Optional wrapper for consistent content background/styling */}
        {/* Use CSS variables for background/border/shadow */}
        {/* Example using inline styles for clarity, but classes are better if defined */ }
        {/*
        <div style={{
             backgroundColor: 'var(--color-surface-alt)', // Example semi-transparent surface
             // Add backdropFilter if supported and desired: backdropFilter: 'blur(4px)',
             padding: 'var(--spacing-6)', // Example padding
             borderRadius: 'var(--border-radius-lg)',
             border: 'var(--border-width) solid var(--color-border)',
             boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)' // Example shadow
             // Or use defined classes like: className="content-wrapper p-6 rounded-lg shadow-md border"
        }}>
             {children}
        </div>
        */}

         {/* Render children directly if no inner wrapper needed */}
         {children}

      </main>

      <Footer />
    </>
  )
}

// --- Add this class definition to src/app/globals.css if using the wrapper ---
/*
@layer utilities { // Or just add directly if not layering heavily
  .content-wrapper {
    background-color: rgba(30, 41, 59, 0.7); // Example: --color-surface at 70% opacity
    backdrop-filter: blur(5px);
    padding: var(--spacing-6);
    border-radius: var(--border-radius-lg);
    border: var(--border-width) solid var(--color-border);
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1); // shadow-md equivalent
  }
}
*/