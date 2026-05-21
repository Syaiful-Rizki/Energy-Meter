// =====================================================
// AUTH CONTEXT
// Provides authentication state across the app
// =====================================================

import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login with email & password
  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Register / Sign up with email & password
  async function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Logout
  async function logout() {
    return signOut(auth);
  }

  // Send password reset email
  async function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
