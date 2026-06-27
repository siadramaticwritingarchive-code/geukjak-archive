import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthStateChangeCallback = (
  event: AuthChangeEvent,
  session: Session | null,
) => void;

type SignupInput = {
  email: string;
  password: string;
  displayName: string;
};

type LoginInput = {
  email: string;
  password: string;
};

export const authService = {
  getSession() {
    return supabase.auth.getSession();
  },

  getUser() {
    return supabase.auth.getUser();
  },

  onAuthStateChange(callback: AuthStateChangeCallback) {
    return supabase.auth.onAuthStateChange(callback);
  },

  signUp({ email, password, displayName }: SignupInput) {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName
        }
      }
    });
  },

  signInWithPassword({ email, password }: LoginInput) {
    return supabase.auth.signInWithPassword({
      email,
      password
    });
  },

  signOut() {
    return supabase.auth.signOut().then(({ error }) => {
      if (error) {
        throw error;
      }
    });
  },

  resetPassword(email: string) {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`
    });
  }
};
