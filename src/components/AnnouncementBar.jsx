import React, { useState, useEffect } from 'react';
import { getActiveCoupons } from '../services/couponService';
import { Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AnnouncementBar = () => {
  const [coupons, setCoupons] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const activeCoupons = await getActiveCoupons();
        if (activeCoupons.length > 0) {
          setCoupons(activeCoupons);
        }
      } catch (error) {
        console.error("Failed to fetch coupons for announcement bar", error);
      }
    };
    fetchCoupons();
  }, []);

  if (!isVisible || coupons.length === 0) return null;

  // Multiple items for seamless horizontal loop
  const tickerItems = [...coupons, ...coupons, ...coupons, ...coupons];

  return (
    <div className="sticky top-0 z-[120] bg-emerald-600 text-white py-2.5 overflow-hidden border-b border-emerald-500/30 select-none shadow-md">
      <div className="flex whitespace-nowrap">
        <motion.div
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: Math.max(coupons.length * 15, 30), // Dynamic speed
              ease: "linear",
            },
          }}
          className="flex gap-16 items-center px-4"
        >
          {tickerItems.map((coupon, idx) => (
            <div key={`${coupon.id}-${idx}`} className="flex items-center gap-4 shrink-0">
              <Sparkles size={16} className="text-yellow-400 animate-pulse" />
              <div className="flex items-center gap-3 text-sm font-black tracking-tight uppercase">
                <span className="bg-white/20 px-3 py-1 rounded-md text-[10px] font-black border border-white/10 uppercase">{coupon.code}</span>
                <span className="text-yellow-300 font-black italic">{coupon.discount}% FLAT DISCOUNT</span>
                {coupon.description && (
                  <span className="opacity-90 font-bold">— {coupon.description}</span>
                )}
                {!coupon.description && (
                  <span className="opacity-80 font-bold">— USE CODE AT CHECKOUT</span>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-700/80 hover:bg-emerald-800 backdrop-blur-md p-1.5 rounded-full text-white/80 hover:text-white transition-all z-20 shadow-lg border border-white/10"
        title="Close"
      >
        <X size={14} />
      </button>

      {/* Ticker Gradient Overlays for smooth entry/exit */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-emerald-600 via-emerald-600/50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-emerald-600 via-emerald-600/50 to-transparent z-10 pointer-events-none" />
    </div>
  );
};

export default AnnouncementBar;
