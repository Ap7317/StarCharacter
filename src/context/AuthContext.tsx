import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, AuthState } from '../types';

const AuthContext = createContext<AuthState | undefined>(undefined);

// Mock JWT token generation
function generateMockToken(username: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: username,
      exp: Date.now() + 3600000, // 1 hour from now
      iat: Date.now(),
    })
  );
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
}

// Parse token expiry
function getTokenExpiry(token: string): number {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.exp;
  } catch {
    return 0;
  }
}

// Mock credentials
const MOCK_CREDENTIALS = {
  username: 'luke',
  password: 'skywalker',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Check localStorage for existing session
    const stored = localStorage.getItem('starwars_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Check if token is still valid
        const expiry = getTokenExpiry(parsed.token);
        if (expiry > Date.now()) {
          return parsed;
        }
      } catch {
        localStorage.removeItem('starwars_user');
      }
    }
    return null;
  });

  // Silent token refresh
  useEffect(() => {
    if (!user) return;

    const checkAndRefreshToken = () => {
      const expiry = getTokenExpiry(user.token);
      const timeUntilExpiry = expiry - Date.now();

      // Refresh if less than 5 minutes remaining
      if (timeUntilExpiry < 300000 && timeUntilExpiry > 0) {
        const newToken = generateMockToken(user.username);
        const updatedUser = { ...user, token: newToken };
        setUser(updatedUser);
        localStorage.setItem('starwars_user', JSON.stringify(updatedUser));
        console.log('Token silently refreshed');
      }
    };

    // Check every minute
    const interval = setInterval(checkAndRefreshToken, 60000);
    checkAndRefreshToken(); // Check immediately

    return () => clearInterval(interval);
  }, [user]);

  const login = async (username: string, password: string): Promise<void> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (
      username === MOCK_CREDENTIALS.username &&
      password === MOCK_CREDENTIALS.password
    ) {
      const token = generateMockToken(username);
      const newUser = { username, token };
      setUser(newUser);
      localStorage.setItem('starwars_user', JSON.stringify(newUser));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('starwars_user');
  };

  const value: AuthState = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
