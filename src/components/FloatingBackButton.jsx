import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on auth pages
  if (['/login', '/signup', '/forgot-password'].includes(location.pathname)) return null;
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1, backgroundColor: '#f0fdf4' }}
      whileTap={{ scale: 0.9 }}
      onClick={() => navigate(-1)}
      className="fixed bottom-8 left-8 z-[100] bg-white text-emerald-600 w-12 h-12 rounded-full shadow-xl border border-emerald-100 flex items-center justify-center hover:text-emerald-700 hover:border-emerald-200 transition-all group"
      title="Go Back"
    >
      <ArrowLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
    </motion.button>
  );
};

export default FloatingBackButton;
