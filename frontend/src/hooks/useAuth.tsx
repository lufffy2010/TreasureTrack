import { useState, useEffect } from 'react';

type BackendUser = {
  _id: string;
  username?: string;
  email?: string;
  avatar?: string;
  xp?: number;
  badges?: any[];
};

export const useAuth = () => {
  const [user, setUser] = useState<BackendUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrent = async (token: string | null) => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('http://localhost:3001/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setUser(null);
      } else {
        const data = await res.json();
        setUser(data.user ?? null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetchCurrent(token);

    // listen for storage changes (login in another tab)
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'token') {
        fetchCurrent(e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const signOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, loading, signOut };
};