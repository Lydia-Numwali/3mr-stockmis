import { createContext } from 'react';
import { IUser } from '@/hooks/useAuth';
interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: IUser) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined); 