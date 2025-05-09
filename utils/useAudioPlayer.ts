// useAudioPlayer.ts
import { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { nextTrack, previousTrack, play as playS, pause as pauseS } from '@/store/slices/player.slice';

export function useAudioPlayer() {
  const dispatch = useAppDispatch();
  const { playlist, currentTrackIndex, isPlaying, isRepeat } = useAppSelector((s) => s.player);
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);
  const soundRef = useRef<Howl | null>(null);
  let interval: { current: ReturnType<typeof setInterval> | null } = { current: null };

  const currentTrack = playlist[currentTrackIndex];

  const play = () => soundRef.current?.play();
  const pause = () => soundRef.current?.pause();
  const seekTo = (value: number) => {
    soundRef.current?.seek(value);
    setSeek(value);
  };
  // Set Media Session for background controls
  useEffect(() => {
    if ('mediaSession' in navigator) {
      const mediaSession = navigator.mediaSession;

      if (currentTrack) {
        mediaSession.metadata = new MediaMetadata({
          title: currentTrack.title,
          artist: currentTrack.artist,
          album: currentTrack.album,
          artwork: [
            { src: currentTrack.image!, sizes: '96x96', type: 'image/png' },
            { src: currentTrack.image!, sizes: '128x128', type: 'image/png' },
            { src: currentTrack.image!, sizes: '192x192', type: 'image/png' },
          ],
        });

        // Handle play/pause action from the lock screen
        mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

        mediaSession.setActionHandler('play', () => dispatch(playS()));
        mediaSession.setActionHandler('pause', () => dispatch(pauseS()));
        mediaSession.setActionHandler('nexttrack', () => dispatch(nextTrack()));

        // Optionally add previous track action
        mediaSession.setActionHandler('previoustrack', () => {
          // Handle previous track logic if needed
        });

        mediaSession.setActionHandler('stop', () => {
          // Handle stop action when the media session stops
        });
      }
    }
  }, [currentTrack, isPlaying, dispatch]);

  useEffect(() => {
    if (!currentTrack?.url) return;
    if (soundRef.current) {
      soundRef.current.unload();
    }

    soundRef.current = new Howl({
      src: [currentTrack.url],
      html5: true,
      onplay: () => {
        setDuration(soundRef.current?.duration() ?? 0);
        interval.current = setInterval(() => {
          setSeek(soundRef.current?.seek() as number);
        }, 1000);
      },
      onend: () => {
        if (interval.current !== null) {
          clearInterval(interval.current);
        }
        if (isRepeat) {
          play();
        } else {
          dispatch(nextTrack());
        }
      }
    });

    if (isPlaying) play();

    return () => {
      if (interval.current !== null) {
        clearInterval(interval.current);
      }
      soundRef.current?.unload();
    };
  }, [currentTrack?.url]);

  useEffect(() => {
    if (isPlaying) {
      play();
    } else {
      pause();
    }
  }, [isPlaying]);

  return { currentTrack, isPlaying, play, pause, seek, seekTo, duration };
}
