import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

const unavailableError = new Error(
  'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.',
);

type AuthStateChangeCallback = (
  event: AuthChangeEvent,
  session: Session | null,
) => void;

type SignupInput = {
  email: string;
  password: string;
  displayName: string;
  role: 'dramaticwriting' | 'other' | 'professor';
  studentId?: string;
};


type LoginInput = {
  email: string;
  password: string;
};

export const authService = {
  getSession() {
    if (!supabase) {
      return Promise.resolve({ data: { session: null }, error: null });
    }

    return supabase.auth.getSession();
  },

  getUser() {
    if (!supabase) {
      return Promise.resolve({ data: { user: null }, error: null });
    }

    return supabase.auth.getUser();
  },

  onAuthStateChange(callback: AuthStateChangeCallback) {
    if (!supabase) {
      return {
        data: {
          subscription: {
            unsubscribe() {}
          }
        }
      };
    }

    return supabase.auth.onAuthStateChange(callback);
  },

  signUp({
  email,
  password,
  displayName,
  role,
  studentId
}: SignupInput) {

  if (!supabase) {
    return Promise.resolve({
      data: {
        user: null,
        session: null
      },
      error: unavailableError
    } as any);
  }

    return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
        role,
        student_id: studentId
      }
    }
  });
},

signInWithPassword({ email, password }: LoginInput) {
    if (!supabase) {
      return Promise.resolve({ data: { user: null, session: null }, error: unavailableError } as any);
    }

    return supabase.auth.signInWithPassword({
      email,
      password
    });
  },

  signOut() {
    if (!supabase) {
      return Promise.resolve();
    }

    return supabase.auth.signOut().then(({ error }) => {
      if (error) {
        throw error;
      }
    });
  },

  resetPassword(email: string) {
    if (!supabase) {
      return Promise.resolve({ data: null, error: unavailableError } as any);
    }

    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`
    });
  }
};
