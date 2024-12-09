import { useState, useEffect } from 'react';
import { getCurrentUser, signIn, signOut, signUp } from '../services/authService';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await getCurrentUser();
      setUser(data.user);
      setLoading(false);
    };
    checkUser();
  }, []);

  return {
    user,
    loading,
    signIn: async (email: string, password: string) => {
      const { user } = await signIn(email, password);
      setUser(user);
    },
    signUp: async (email: string, password: string) => {
      const { user } = await signUp(email, password);
      setUser(user);
    },
    signOut: async () => {
      await signOut();
      setUser(null);
    },
  };
}

