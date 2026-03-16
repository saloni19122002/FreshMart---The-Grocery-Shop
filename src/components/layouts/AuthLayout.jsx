import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-[90vh] bg-gray-50 flex flex-col justify-center items-center py-12">
      <main className="w-full max-w-md p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
