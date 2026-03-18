import { useState, useEffect } from 'react';
import { getGlobalSettings } from '../services/adminService';

let cachedSettings = null;

export const useSettings = () => {
  const [settings, setSettings] = useState(cachedSettings);
  const [loading, setLoading] = useState(!cachedSettings);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cachedSettings) {
      setLoading(false);
      return;
    }

    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await getGlobalSettings();
        cachedSettings = {
          general: data.general || { storeName: 'FreshMart', contactEmail: 'support@freshmart.com', supportPhone: '+1 (234) 567-890', address: '123 Fresh Valley Road, Green District, 45678' },
          shipping: data.shipping || { flatRate: 50, freeThreshold: 500, estimatedDelivery: '1-3 Days' },
          tax: data.tax || { gstPercentage: 5, enabled: true },
          seo: data.seo || { metaTitle: 'FreshMart - Organic Grocery', metaDesc: '', keywords: '' }
        };
        setSettings(cachedSettings);
      } catch (err) {
        console.error("Error loading settings:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
};
