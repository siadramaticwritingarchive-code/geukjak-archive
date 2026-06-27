import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { authService } from '../services/authService';

type AuthSessionState = {
  session: Session | null;
  isLoading: boolean;
};

export function useAuthSession() {
  const [state, setState] = useState<AuthSessionState>({
    session: null,
    isLoading: true
  });

  useEffect(() => {
    let isMounted = true;

    authService.getSession().then(({ data }) => {
      if (!isMounted) {
        return;
      }

      setState({
        session: data.session,
        isLoading: false
      });
    });

    const {
      data: { subscription }
    } = authService.onAuthStateChange((_, session) => {
      setState({
        session,
        isLoading: false
      });
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
