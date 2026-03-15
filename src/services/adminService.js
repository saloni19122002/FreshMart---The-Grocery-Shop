import { collection, getDocs, query, where, orderBy, limit, doc, updateDoc, serverTimestamp, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const getAdminStats = async () => {
  try {
    const [usersSnap, farmersSnap, productsSnap, ordersSnap] = await Promise.all([
      getDocs(collection(db, 'users')),
      getDocs(query(collection(db, 'users'), where('role', '==', 'farmer'))),
      getDocs(collection(db, 'products')),
      getDocs(collection(db, 'orders'))
    ]);

    const orders = ordersSnap.docs.map(doc => doc.data());
    const totalRevenue = orders.reduce((acc, curr) => acc + (curr.total || 0), 0);
    
    return {
      totalUsers: usersSnap.size,
      totalFarmers: farmersSnap.size,
      totalProducts: productsSnap.size,
      totalOrders: ordersSnap.size,
      totalRevenue: totalRevenue.toFixed(2),
      recentOrders: ordersSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        .slice(0, 5)
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw error;
  }
};

export const getAllUsers = async (role = null) => {
  try {
    let q = collection(db, 'users');
    if (role) {
      q = query(q, where('role', '==', role));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { 
      status: status,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};

// Banner Management
export const getBanners = async () => {
  try {
    const q = query(collection(db, 'banners'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching banners:", error);
    throw error;
  }
};

export const updateBanner = async (bannerId, bannerData) => {
  try {
    const bannerRef = doc(db, 'banners', bannerId);
    await updateDoc(bannerRef, {
      ...bannerData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating banner:", error);
    throw error;
  }
};

export const addBanner = async (bannerData) => {
  try {
    const docRef = await addDoc(collection(db, 'banners'), {
      ...bannerData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...bannerData };
  } catch (error) {
    console.error("Error adding banner:", error);
    throw error;
  }
};

export const deleteBanner = async (bannerId) => {
  try {
    await deleteDoc(doc(db, 'banners', bannerId));
    return true;
  } catch (error) {
    console.error("Error deleting banner:", error);
    throw error;
  }
};

// Order Management
export const getAllOrders = async () => {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// Category Management
export const getCategories = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'categories'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Global Settings Management
export const getGlobalSettings = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'settings'));
    const settings = {};
    snapshot.forEach(doc => {
      settings[doc.id] = doc.data();
    });
    return settings;
  } catch (error) {
    console.error("Error fetching global settings:", error);
    throw error;
  }
};

export const updateGlobalSetting = async (settingId, data) => {
  try {
    const settingRef = doc(db, 'settings', settingId);
    await updateDoc(settingRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating global setting:", error);
    throw error;
  }
};

// Coupon Management
export const getCoupons = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'coupons'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw error;
  }
};

export const addCoupon = async (couponData) => {
  try {
    const docRef = await addDoc(collection(db, 'coupons'), {
      ...couponData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...couponData };
  } catch (error) {
    console.error("Error adding coupon:", error);
    throw error;
  }
};

