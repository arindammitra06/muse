// hooks/useSyncedLyrics.ts
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCurrentLineIndex } from '@/store/slices/lyrics.slice';

export const useSyncedLyrics = (seek: number) => {
  const dispatch = useAppDispatch();
  const { syncedLyrics, currentLineIndex } = useAppSelector((s) => s.lyrics);

  useEffect(() => {
    if (!syncedLyrics.length) return;

    const nextIndex = syncedLyrics.findIndex(
      (line: { time: number; }, idx: number) =>
        line.time <= seek &&
        (idx === syncedLyrics.length - 1 || syncedLyrics[idx + 1].time > seek)
    );

    if (nextIndex !== -1 && nextIndex !== currentLineIndex) {
      dispatch(setCurrentLineIndex(nextIndex));
    }
  }, [seek, syncedLyrics, dispatch, currentLineIndex]);
};
