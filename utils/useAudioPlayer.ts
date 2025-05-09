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
        if ('mediaSession' in navigator && currentTrack) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: currentTrack.title ?? '',
            artist: currentTrack.artist ?? '',
            album: currentTrack.album ?? '',
            artwork: [
              { src: currentTrack.image ?? '', sizes: '512x512', type: 'image/png' },
            ],
          });
      
          navigator.mediaSession.setActionHandler('nexttrack', () => {
            dispatch(nextTrack());
          });
          navigator.mediaSession.setActionHandler('previoustrack', () => {
            dispatch(previousTrack());
          });
          navigator.mediaSession.setActionHandler('play', () => {
            dispatch(playS());
          });
          navigator.mediaSession.setActionHandler('pause', () => {
            dispatch(pauseS());
          });
        }
        
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
