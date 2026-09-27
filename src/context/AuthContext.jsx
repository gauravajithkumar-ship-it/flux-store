import { createContext, useContext, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('flux_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const signIn = async (username, password) => {
    try {
      const name = username.trim();

      const { data: existing, error: findError } = await supabase
        .from('customers')
        .select('*')
        .eq('username', name)
        .maybeSingle();

      if (findError) return { error: findError };

      // First-time login: auto-register the customer so data is stored
      if (!existing) {
        const { data: created, error: createError } = await supabase
          .from('customers')
          .insert({ username: name, password, full_name: name, status: 'Active' })
          .select()
          .single();

        if (createError) return { error: createError };

        setUser(created);
        localStorage.setItem('flux_user', JSON.stringify(created));
        return { data: created };
      }

      if (existing.password !== password) {
        return { error: { message: 'Invalid password.' } };
      }

      setUser(existing);
      localStorage.setItem('flux_user', JSON.stringify(existing));
      return { data: existing };
    } catch (err) {
      return { error: { message: err.message } };
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('flux_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};