import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  nextTrack,
  previousTrack,
  play as playS,
  pause as pauseS,
} from '@/store/slices/player.slice';

export function useAudioPlayer() {
  const dispatch = useAppDispatch();
  const { playlist, currentTrackIndex, isPlaying, isRepeat } = useAppSelector((s) => s.player);
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRepeatRef = useRef(false);

  const currentTrack = playlist[currentTrackIndex];

  const play = () => {
    audioRef.current?.play();
  };

  const pause = () => {
    audioRef.current?.pause();
  };

  const seekTo = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setSeek(value);
    }
  };

  // Keep repeat value in a ref
  useEffect(() => {
    isRepeatRef.current = isRepeat;
  }, [isRepeat]);

  // Initialize or update audio element
  useEffect(() => {
    if (!currentTrack?.url) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(currentTrack.url);
    } else {
      audioRef.current.src = currentTrack.url;
    }

    const audio = audioRef.current;

    // Autoplay if required
    if (isPlaying) audio.play();

    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
    };

    audio.ontimeupdate = () => {
      setSeek(audio.currentTime);
    };

    audio.onended = () => {
      if (isRepeatRef.current) {
        audio.currentTime = 0;
        audio.play();
      } else {
        dispatch(nextTrack());
      }
    };

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [currentTrack?.url]);

  // Sync play/pause from Redux
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Setup Media Session for lock screen controls
useEffect(() => {
  if ('mediaSession' in navigator && currentTrack) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: currentTrack.artist,
      album: currentTrack.album,
      artwork: currentTrack.image
        ? [
            { src: currentTrack.image, sizes: '96x96', type: 'image/png' },
            { src: currentTrack.image, sizes: '128x128', type: 'image/png' },
            { src: currentTrack.image, sizes: '192x192', type: 'image/png' },
          ]
        : [],
    });

    navigator.mediaSession.setActionHandler('play', () => dispatch(playS()));
    navigator.mediaSession.setActionHandler('pause', () => dispatch(pauseS()));
    navigator.mediaSession.setActionHandler('nexttrack', () => dispatch(nextTrack()));
    navigator.mediaSession.setActionHandler('previoustrack', () => dispatch(previousTrack()));
    navigator.mediaSession.setActionHandler('stop', () => pause());

    
    // ✅ Guard against NaN or invalid values
    if (
      typeof duration === 'number' &&
      typeof seek === 'number' &&
      !isNaN(duration) &&
      !isNaN(seek) &&
      duration > 0 &&
      seek <= duration &&
      'setPositionState' in navigator.mediaSession
    ) {
      navigator.mediaSession.setPositionState({
        duration,
        position: seek,
        playbackRate: 1,
      });
    }
  }
}, [currentTrack, isPlaying, seek, duration, dispatch]);


  return {
    currentTrack,
    isPlaying,
    play,
    pause,
    seek,
    seekTo,
    duration,
  };
}
