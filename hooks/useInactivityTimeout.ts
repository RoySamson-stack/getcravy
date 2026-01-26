import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

interface UseInactivityTimeoutOptions {
  timeoutMinutes?: number;
  onTimeout: () => void;
  enabled?: boolean;
}

export const useInactivityTimeout = ({
  timeoutMinutes = 15,
  onTimeout,
  enabled = true,
}: UseInactivityTimeoutOptions) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const appStateRef = useRef<AppStateStatus>('active');

  const resetTimeout = () => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Update last activity time
    lastActivityRef.current = Date.now();

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      const inactiveMinutes = (Date.now() - lastActivityRef.current) / (1000 * 60);
      
      // Only timeout if app is active and user has been inactive
      if (appStateRef.current === 'active' && inactiveMinutes >= timeoutMinutes) {
        onTimeout();
      }
    }, timeoutMinutes * 60 * 1000);
  };

  useEffect(() => {
    if (!enabled) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    // Track app state changes
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        // App came to foreground, check if timeout expired
        const inactiveMinutes = (Date.now() - lastActivityRef.current) / (1000 * 60);
        if (inactiveMinutes >= timeoutMinutes) {
          onTimeout();
        } else {
          resetTimeout();
        }
      }
      appStateRef.current = nextAppState;
    });

    // Initial timeout setup
    resetTimeout();

    // Reset timeout on any touch/interaction
    const events = ['touchstart', 'touchmove', 'touchend', 'scroll'];
    const handleActivity = () => resetTimeout();

    // Note: In React Native, we'll use a different approach
    // We'll reset timeout in component interactions instead

    return () => {
      subscription.remove();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, timeoutMinutes, onTimeout]);

  // Expose reset function for manual reset
  return { resetTimeout };
};





