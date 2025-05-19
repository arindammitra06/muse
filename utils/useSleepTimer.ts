// hooks/useSleepTimer.ts
import { useAppSelector } from '@/store/hooks';
import { pause } from '@/store/slices/player.slice';
import { updateRemaining, clearSleepTimer } from '@/store/slices/sleepTimer.slice';
import { RootState } from '@reduxjs/toolkit/query';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useSleepTimer = () => {
  const dispatch = useDispatch();
  const { endTime, isActive } = useAppSelector((state) => state.sleepTimer);

  useEffect(() => {
    if (!isActive || !endTime) return;

    const interval = setInterval(() => {
      dispatch(updateRemaining());
    }, 1000);

    const timeout = setTimeout(() => {
      dispatch(pause()); // stops the player
      dispatch(clearSleepTimer());
    }, endTime - Date.now());

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isActive, endTime, dispatch]);
};
