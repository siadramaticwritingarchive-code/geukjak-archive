import { createContext } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import type { UserProfile } from '../types/user';

export type DevRole =
  | 'dramaticwriting'
  | 'other'
  | 'professor'
  | 'staff'
  | 'admin';
  

export type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
  devRole: DevRole;
  setDevRole: (role: DevRole) => void;
  effectiveRole: DevRole;
  canAccessAdmin: boolean;
  canManageAdminPermissions: boolean;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
