import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { AuthContext, type AuthContextValue, type DevRole } from './authContextValue';
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';
import type { UserProfile } from '../types/user';

const mockUser: User = {
  id: 'dev-user',
  email: 'hyojeong@sia.ac.kr',
  created_at: '2026-06-01T00:00:00.000Z',
  updated_at: '2026-06-01T00:00:00.000Z',
  aud: 'authenticated',
  role: 'authenticated',
  app_metadata: {},
  user_metadata: { name: '이효정' },
  identities: [],
  is_anonymous: false
} as User;

const mockProfile: UserProfile = {
  id: 'dev-user',
  email: 'hyojeong@sia.ac.kr',
  display_name: '이효정',

  student_id: '2442123',
  department: '극작과',
  student_year: 24,

  avatar_path: null,
  role: 'dramaticwriting',
  bio: '극작과 재학생',
  is_blocked: false,
  created_at: '2026-06-01T00:00:00.000Z',
  updated_at: '2026-06-01T00:00:00.000Z'
};

const mockSession: Session = {
  access_token: 'mock-access-token',
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  refresh_token: 'mock-refresh-token',
  user: mockUser
} as Session;

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const useMockAuth = false;
  const [session, setSession] = useState<Session | null>(useMockAuth ? mockSession : null);
  const [profile, setProfile] = useState<UserProfile | null>(useMockAuth ? mockProfile : null);
  const [isLoading, setIsLoading] = useState(!useMockAuth);
  const [devRole, setDevRole] = useState<DevRole>('dramaticwriting');

  const loadProfile = async (currentSession: Session | null) => {
    if (!currentSession?.user) {
      setProfile(null);
      return;
    }

    const { data, error } = await profileService.getProfile(currentSession.user.id);

    if (error) {
      setProfile(null);
      return;
    }

    setProfile(data);
  };

  const refreshProfile = useCallback(async () => {
    await loadProfile(session);
  }, [session]);

  useEffect(() => {
    if (useMockAuth) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    authService.getSession().then(async ({ data }) => {
      if (!isMounted) {
        return;
      }

      setSession(data.session);
      await loadProfile(data.session);
      setIsLoading(false);
    });

    const {
      data: { subscription }
    } = authService.onAuthStateChange(async (_, nextSession) => {
      setSession(nextSession);
      await loadProfile(nextSession);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [useMockAuth]);

  const effectiveRole = useMemo<DevRole>(() => {
    if (import.meta.env.DEV) {
      return devRole;
    }

   return profile?.role ?? 'other';
  }, [devRole, profile?.role]);

  const canAccessAdmin = effectiveRole === 'staff' || effectiveRole === 'admin';
  const canManageAdminPermissions = effectiveRole === 'admin';

  const value = useMemo<AuthContextValue>(
    () => ({
      session: useMockAuth ? mockSession : session,
      user: useMockAuth ? mockUser : session?.user ?? null,
      profile: useMockAuth ? mockProfile : profile,
      isLoading: useMockAuth ? false : isLoading,
      refreshProfile: useMockAuth ? async () => undefined : refreshProfile,
      signOut: useMockAuth ? async () => undefined : authService.signOut,
      devRole,
      setDevRole,
      effectiveRole,
      canAccessAdmin,
      canManageAdminPermissions
    }),
    [canAccessAdmin, canManageAdminPermissions, devRole, effectiveRole, isLoading, profile, refreshProfile, session, useMockAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
