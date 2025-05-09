import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { nextTrack, previousTrack, play, pause } from '@/store/slices/player.slice';

export function useAudioPlayer() {
  const dispatch = useAppDispatch();
  const { playlist, currentTrackIndex, isPlaying, repeatMode } = useAppSelector((s) => s.player);

  const currentTrack = playlist[currentTrackIndex];
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);

  // --- Play / Pause Sync ---
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // --- Load New Track ---
  useEffect(() => {
    if (!currentTrack?.url || !audioRef.current) return;

    audioRef.current.src = currentTrack.url;
    audioRef.current.load();

    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    }

    setupMediaSession();
  }, [currentTrack?.url]);

  // --- Media Session API ---
  const setupMediaSession = () => {
    if (!('mediaSession' in navigator) || !currentTrack) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title ?? '',
      artist: currentTrack.artist ?? '',
      album: currentTrack.album ?? '',
      artwork: currentTrack.image
        ? [{ src: currentTrack.image, sizes: '512x512', type: 'image/png' }]
        : [],
    });

    navigator.mediaSession.setActionHandler('play', () => dispatch(play()));
    navigator.mediaSession.setActionHandler('pause', () => dispatch(pause()));
    navigator.mediaSession.setActionHandler('nexttrack', () => dispatch(nextTrack()));
    navigator.mediaSession.setActionHandler('previoustrack', () => dispatch(previousTrack()));
  };

  // --- Handle Audio Events ---
  const onTimeUpdate = () => {
    if (audioRef.current) {
      setSeek(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const onEnded = () => {
    if (repeatMode === 'one') {
      audioRef.current?.play();
    } else if (repeatMode === 'all') {
      dispatch(nextTrack());
    } else if (repeatMode === 'none') {
      if (currentTrackIndex < playlist.length - 1) {
        dispatch(nextTrack());
      } else {
        dispatch(pause());
      }
    }
  };

  const seekTo = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setSeek(value);
    }
  };

  // --- Return the audio control functions and ref ---
  return {
    currentTrack,
    isPlaying,
    play: () => dispatch(play()),
    pause: () => dispatch(pause()),
    seek,
    seekTo,
    duration,
    audioRef, // Return the ref here, not the JSX
  };
}
