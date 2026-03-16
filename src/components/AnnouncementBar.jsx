import React, { useState, useEffect } from 'react';
import { getActiveCoupons } from '../services/couponService';
import { Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AnnouncementBar = () => {
  const [coupons, setCoupons] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      const activeCoupons = await getActiveCoupons();
      if (activeCoupons.length > 0) {
        setCoupons(activeCoupons);
      }
    };
    fetchCoupons();
  }, []);

  useEffect(() => {
    if (coupons.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % coupons.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [coupons.length]);

  if (!isVisible || coupons.length === 0) return null;

  return (
    <div className="bg-emerald-600 text-white py-2 overflow-hidden relative border-b border-emerald-500/30">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-yellow-400 animate-pulse" />
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xs sm:text-sm font-black tracking-tight flex items-center gap-2"
            >
              <span>{coupons[currentIndex].code}:</span>
              <span className="text-yellow-300 font-black italic">{coupons[currentIndex].discount}% FLAT OFF</span>
              <span className="hidden sm:inline opacity-80">— Use this code at checkout!</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
      >
        <X size={14} />
      </button>

      {/* Subtle shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
    </div>
  );
};

export default AnnouncementBar;
