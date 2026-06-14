import React, { useEffect, useContext } from 'react';
import { FinSyncContext } from '../context/FinSyncContext';

export default function SplashScreen() {
  const { navigateTo } = useContext(FinSyncContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigateTo('login', 'forward');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigateTo]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-white select-none animate-fade-in">
      <div className="flex flex-col items-center justify-center flex-grow">
        {/* Centered Logo */}
        <div className="flex items-center text-4xl font-extrabold tracking-tight">
          <span className="text-primary">Fin</span>
          <span className="text-slate-900">Sync</span>
        </div>
        {/* Tagline */}
        <p className="mt-2 text-sm text-textSecondary font-medium">
          Your money, unified
        </p>
      </div>
      
      {/* Dynamic spinner indicator at bottom */}
      <div className="mb-12 flex flex-col items-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="mt-2 text-caption text-textSecondary">Securing connection...</span>
      </div>
    </div>
  );
}
