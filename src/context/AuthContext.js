import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    // createUserWithEmailAndPassword as createUserWithNameAndPassword, 
    // signInWithEmailAndPassword as signInWithNameAndPassword,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "firebase/auth";
import { auth } from '../firebaseConfig'; // Adjust path as needed

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle initial auth state check

  // function signup(name, password) {
  function signup(email, password) {
    // Firebase validates email format and password length (>=6)
    // return createUserWithNameAndPassword(auth, name, password);
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // function login(name, password) {
  function login(email, password) {
    // return signInWithNameAndPassword(auth, name, password);
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false); // Finished loading auth state
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
  };

  // Don't render children until the initial auth state check is complete
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 