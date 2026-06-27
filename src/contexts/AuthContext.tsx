import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { AuthContext, type AuthContextValue } from './authContextValue';
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';
import type { UserProfile } from '../types/user';

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      isLoading,
      refreshProfile,
      signOut: authService.signOut
    }),
    [isLoading, profile, refreshProfile, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
