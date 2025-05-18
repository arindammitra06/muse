// hooks/useNetworkListener.ts
import { setOnlineStatus } from '@/store/slices/network.slice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const useNetworkListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const updateOnlineStatus = () => {
      dispatch(setOnlineStatus(navigator.onLine));
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Set the initial status
    updateOnlineStatus();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [dispatch]);
};
