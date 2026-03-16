import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Fetch a public profile for a user (farmer or customer)
 * @param {string} userId - The unique ID of the user
 * @returns {Promise<Object|null>}
 */
export const getUserProfile = async (userId) => {
  try {
    if (!userId) return null;
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Only return public fields for safety
      return {
        id: docSnap.id,
        displayName: data.displayName || data.name,
        email: data.email,
        phoneNumber: data.phoneNumber || data.phone,
        photoURL: data.photoURL,
        role: data.role,
        status: data.status,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};
