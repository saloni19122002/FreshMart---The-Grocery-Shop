import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';

export const getActiveCategories = async (limitCount = 0) => {
  try {
    const categoriesRef = collection(db, 'categories');
    let q = query(
      categoriesRef,
      where('isActive', '==', true),
      orderBy('order', 'asc')
    );
    
    if (limitCount > 0) {
      q = query(q, limit(limitCount));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    if (error.code === 'failed-precondition') {
      console.warn("Firestore Index missing: ", error.message);
      const snapshot = await getDocs(collection(db, 'categories'));
      let cats = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(c => c.isActive)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      return limitCount > 0 ? cats.slice(0, limitCount) : cats;
    }
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const getCategoryBySlug = async (slug) => {
  try {
    const q = query(collection(db, 'categories'), where('slug', '==', slug));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    return null;
  }
};
