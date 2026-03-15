import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { getDocument, setDocument } from '../firebase/firestore';
import { signUp, logIn, logOut, resetPassword, logInWithGoogle } from '../firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch user document to get role
        try {
          const doc = await getDocument('users', user.uid);
          if (doc) {
            setUserData(doc);
          } else {
            // Fallback for an authenticated user with no doc (e.g. from tests)
            setUserData({ role: 'customer' });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData({ role: 'customer' });
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, name) => {
    const user = await signUp(email, password, name);
    // Create user document in Firestore
    const newUserData = {
      uid: user.uid,
      name,
      email,
      role: 'customer', // Default role
      isActive: true,
      createdAt: new Date().toISOString()
    };
    await setDocument('users', user.uid, newUserData);
    setUserData(newUserData);
    return user;
  };

  const login = async (email, password) => {
    return logIn(email, password);
  };

  const loginWithGoogle = async () => {
    const user = await logInWithGoogle();
    // Check if user document exists, if not create it
    const doc = await getDocument('users', user.uid);
    if (!doc) {
      const newUserData = {
        uid: user.uid,
        name: user.displayName || 'User',
        email: user.email,
        role: 'customer',
        isActive: true,
        createdAt: new Date().toISOString()
      };
      await setDocument('users', user.uid, newUserData);
      setUserData(newUserData);
    } else {
      setUserData(doc);
    }
    return user;
  };

  const logout = async () => {
    return logOut();
  };

  const value = {
    currentUser,
    userData,
    role: userData?.role || null,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
