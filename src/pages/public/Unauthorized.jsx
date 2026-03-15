import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  const { role, currentUser } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6">
      <div className="card max-w-md w-full p-8 text-center shadow-xl border border-red-100">
        <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-8">
          You don't have permission to access this page. 
          {currentUser && role && ` Your current role is "${role}".`}
        </p>
        
        <Link 
          to="/" 
          className="btn-primary inline-flex items-center justify-center w-full"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
