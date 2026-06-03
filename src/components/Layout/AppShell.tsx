import React from 'react';
import { Outlet } from 'react-router-dom';
import { ParentNav } from './ParentNav';
import { Header } from './Header';

export const ParentShell: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <ParentNav />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
          <div className="max-w-4xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export const ChildShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-amber-50 pb-24">
      <Outlet />
    </div>
  );
};
