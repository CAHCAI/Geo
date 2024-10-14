import React from 'react';

export default function Navbar () {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">Geo</div>
        <div className="space-x-6">
          <a href="/" className="text-gray-300 hover:text-white transition">Home</a>
          <a href="/hpsa-search" className="text-gray-300 hover:text-white transition">HPSA Search</a>
          <a href="/licensed-healthcare" className="text-gray-300 hover:text-white transition">Licensed Healthcare Facilities</a>
          <a href="/api-reference" className="text-gray-300 hover:text-white transition">API Reference</a>
        </div>
      </div>
    </nav>
  );
};


