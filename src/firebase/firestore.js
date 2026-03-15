import { db } from './config';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';

export const getDocument = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

export const addDocument = async (collectionName, data) => {
  const colRef = collection(db, collectionName);
  const docRef = await addDoc(colRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const setDocument = async (collectionName, docId, data) => {
  const docRef = doc(db, collectionName, docId);
  await setDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  }, { merge: true });
};

export const updateDocument = async (collectionName, docId, data) => {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const deleteDocument = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
};
