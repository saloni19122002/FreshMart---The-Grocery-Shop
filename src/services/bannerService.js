import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

export const getActiveBanners = async () => {
  try {
    const bannersRef = collection(db, 'banners');
    const q = query(
      bannersRef, 
      where('isActive', '==', true),
      orderBy('order', 'asc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    if (error.code === 'failed-precondition') {
      // Missing index fallback for development
      console.warn("Firestore Index missing: ", error.message);
      const snapshot = await getDocs(collection(db, 'banners'));
      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(b => b.isActive)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    console.error("Error fetching banners:", error);
    return [];
  }
};
