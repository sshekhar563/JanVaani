import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      try {
        // Decode JWT payload (base64)
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Check expiry
        if (payload.exp * 1000 > Date.now()) {
          setUser({ email: payload.sub, role: payload.role || role, token });
        } else {
          // Token expired
          localStorage.removeItem('token');
          localStorage.removeItem('role');
        }
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      }
    }
    setLoading(false);
  }, []);

  const login = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ email: payload.sub, role: payload.role || role, token });
    } catch {
      setUser({ email: '', role, token });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
