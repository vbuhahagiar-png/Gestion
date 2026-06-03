import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { ToastContainer } from '../UI/Toast';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 font-inter">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <Header />
          <main className="p-6 pb-8 animate-fade-in">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 pb-24 animate-fade-in">
          <Outlet />
        </main>
        <BottomNav />
      </div>

      <ToastContainer />
    </div>
  );
};
