// src/app/(main)/layout.tsx (Polished Main Layout)
import Navbar from '@/components/common/Navbar'; // Adjust path if needed
import Footer from '@/components/common/Footer'; // Adjust path if needed
// No need to import ThemeToggle here as it's part of Navbar/Footer

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // This outer fragment inherits flex setup from RootLayout's body
    <>
      <Navbar />

      {/* Main content area */}
      {/* Using semantic <main> tag */}
      {/* 'container' class applies max-width and horizontal centering */}
      {/* Padding applied here for consistent content spacing */}
      {/* 'flex-grow' makes this section fill available vertical space */}
      {/* 'relative z-10' ensures content is above potential global pseudo-elements like overlays */}
      <main className="container flex-grow py-6 sm:py-8 relative z-10">
        {/* Optional wrapper for consistent content background/styling */}
        {/* <div className="bg-surface/80 backdrop-blur-sm p-6 rounded-lg shadow-md border border-border"> */}
            {children}
        {/* </div> */}
      </main>

      <Footer />
    </>
  )
}