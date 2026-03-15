import { collection, addDoc, query, where, getDocs, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION_NAME = 'addresses';

// Add new address
export const addAddress = async (userId, addressData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      userId,
      ...addressData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...addressData };
  } catch (error) {
    console.error("Error adding address:", error);
    throw error;
  }
};

// Get user addresses
export const getUserAddresses = async (userId) => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    throw error;
  }
};

// Update address
export const updateAddress = async (addressId, addressData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, addressId);
    await updateDoc(docRef, {
      ...addressData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
};

// Delete address
export const deleteAddress = async (addressId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, addressId));
    return true;
  } catch (error) {
    console.error("Error deleting address:", error);
    throw error;
  }
};
