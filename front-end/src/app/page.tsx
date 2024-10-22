// Use Next.js built-in client-side routing
'use client';

import Link from 'next/link';
import React from 'react';

const Page: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
      <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
      <div className="space-x-4">
      <Link href="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Go to Login
        </Link>
        <Link href="/navbar" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition">
          Go to Navbar
        </Link>
      </div>
    </div>
  );
};

export default Page;