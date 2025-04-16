import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#162447] text-[#e0e0e0] p-4 mt-auto">
      <div className="container mx-auto text-center">
        <p>© {new Date().getFullYear()} Galactic Phantom Division. All rights reserved.</p>
      </div>
    </footer>
  );
}
