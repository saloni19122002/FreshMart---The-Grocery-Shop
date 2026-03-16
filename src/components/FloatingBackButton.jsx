import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup') return null;

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.1, backgroundColor: '#f0fdf4' }}
      whileTap={{ scale: 0.9 }}
      onClick={() => navigate(-1)}
      className="fixed top-32 left-6 z-[100] bg-white/80 backdrop-blur-md text-emerald-600 w-12 h-12 rounded-2xl shadow-xl border border-emerald-100 flex items-center justify-center hover:text-emerald-700 hover:border-emerald-200 transition-all group"
      title="Go Back"
    >
      <ArrowLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
    </motion.button>
  );
};

export default FloatingBackButton;
