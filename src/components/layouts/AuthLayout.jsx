import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <main className="w-full max-w-md p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
