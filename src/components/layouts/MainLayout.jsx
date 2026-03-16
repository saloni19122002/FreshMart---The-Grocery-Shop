import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import AnnouncementBar from '../AnnouncementBar';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow pt-[88px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
