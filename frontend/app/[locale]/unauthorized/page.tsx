import { ShieldOff } from 'lucide-react';
import React from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';

const page = () => {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-tr from-slate-50 to-slate-100 overflow-hidden text-center">
      {/* Animated Background Bubbles */}
      <Icon
        icon="mdi:shield-alert"
        className="absolute text-mainBlue-100 text-[20rem] opacity-10 animate-pulse left-[-5rem] top-[-5rem] z-0"
      />
      <Icon
        icon="mdi:lock-alert-outline"
        className="absolute text-mainBlue-200 text-[14rem] opacity-10 animate-bounce right-[-4rem] bottom-[-4rem] z-0"
      />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center">
        <ShieldOff className="h-20 w-20 text-mainBlue-600 mb-6 animate-wiggle" />
        <h1 className="text-6xl font-extrabold text-mainBlue-700">401</h1>
        <p className="text-xl text-gray-700 mt-3 max-w-lg">
          You are not authorized to access this page.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block px-6 py-3 text-lg font-semibold text-white bg-[#001526] hover:bg-[#001526]/80 transition-colors rounded-md shadow-xl"
        >
          Go back home
        </Link>
      </div>
    </main>
  );
};

export default page;
