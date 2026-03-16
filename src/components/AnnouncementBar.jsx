import React, { useState, useEffect } from 'react';
import { getActiveCoupons } from '../services/couponService';
import { useLocation } from 'react-router-dom';
import { Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AnnouncementBar = () => {
  const [coupons, setCoupons] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const activeCoupons = await getActiveCoupons();
        if (activeCoupons.length > 0) {
          setCoupons(activeCoupons);
        } else {
          // Fallback so the bar is always visible
          setCoupons([{ id: 'default', code: 'FRESH10', discount: 10, description: 'ON ALL ORGANIC PRODUCTS' }]);
        }
      } catch (error) {
        console.error("Failed to fetch coupons for announcement bar", error);
        setCoupons([{ id: 'default', code: 'FRESH10', discount: 10, description: 'ON ALL ORGANIC PRODUCTS' }]);
      }
    };
    fetchCoupons();
  }, []);

  // Hide on auth pages and if not visible/no coupons
  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(location.pathname);
  if (!isVisible || coupons.length === 0 || isAuthPage) return null;

  // Multiple items for seamless horizontal loop
  const tickerItems = [...coupons, ...coupons, ...coupons, ...coupons];

  return (
    <div className="relative bg-emerald-600 text-white py-1.5 overflow-hidden border-b border-emerald-500/30 select-none">
      <div className="flex whitespace-nowrap">
        <motion.div
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: Math.max(coupons.length * 15, 30), // Medium speed
              ease: "linear",
            },
          }}
          className="flex gap-20 items-center px-4"
        >
          {tickerItems.map((coupon, idx) => (
            <div key={`${coupon.id}-${idx}`} className="flex items-center gap-4 shrink-0">
              <div className="flex items-center gap-3 text-[11px] font-black tracking-widest uppercase">
                <span className="bg-white/20 px-2 py-0.5 rounded text-[9px] font-black border border-white/5">{coupon.code}</span>
                <span className="text-yellow-300 font-extrabold italic">{coupon.discount}% OFF</span>
                {coupon.description && (
                  <span className="opacity-90 font-bold">— {coupon.description}</span>
                )}
                {!coupon.description && (
                  <span className="opacity-80 font-bold">— SAVE NOW</span>
                )}
              </div>
              <Sparkles size={12} className="text-yellow-400/50" />
            </div>
          ))}
        </motion.div>
      </div>
      
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-all z-20"
        title="Close"
      >
        <X size={12} />
      </button>

      {/* Subtle overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-emerald-600 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-emerald-600 to-transparent z-10 pointer-events-none" />
    </div>
  );
};

export default AnnouncementBar;
