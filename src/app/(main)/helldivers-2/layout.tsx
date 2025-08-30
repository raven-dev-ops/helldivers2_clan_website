// src/app/(main)/helldivers-2/layout.tsx
'use client';

import { usePathname } from 'next/navigation';

export default function HelldiversLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showExtraOverlay =
    pathname === '/helldivers-2' || pathname === '/helldivers-2/merch';

  const gradientOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background:
      'radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(16,20,31,0.5) 100%)',
    zIndex: -2,
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(16, 20, 31, 0.35)',
    zIndex: -1,
  };

  return (
    <>
      {showExtraOverlay && <div style={gradientOverlayStyle} />}
      <div style={overlayStyle} />

      {/* Page Content */}
      {children}
    </>
  );
}

