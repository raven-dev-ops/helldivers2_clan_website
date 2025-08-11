// src/app/(main)/helldivers-2/layout.tsx

export default function HelldiversLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const videoStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: -2,
    filter: 'brightness(0.6)'
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(16, 20, 31, 0.35)',
    zIndex: -1,
  };

  return (
    <>
      {/* Background Video */}
      <video autoPlay loop muted playsInline style={videoStyle} key="bg-video">
        <source src="/videos/gpd_background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div style={overlayStyle} />

      {/* Page Content */}
      {children}
    </>
  );
}