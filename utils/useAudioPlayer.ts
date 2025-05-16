import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  nextTrack,
  previousTrack,
  play as playS,
  pause as pauseS,
} from '@/store/slices/player.slice';
import {  getPreferredStreamingQualityUrl } from './generic.utils';
import { getTrackBlobUrl } from '@/store/slices/offlineTracks.slice';

export function useAudioPlayer() {
  const dispatch = useAppDispatch();
  const { playlist, currentTrackIndex, isPlaying, isRepeat } = useAppSelector((s) => s.player);
  const { streamingQuality } = useAppSelector((s) => s.settings);
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isRepeatRef = useRef(false);
  const currentTrack = playlist[currentTrackIndex];
  const { downloaded } = useAppSelector((s) => s.offlineTracks);
  const isAlreadyDownloaded = downloaded.some((track) => track.id === currentTrack.id); ;
      

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

  // Update repeat ref
  useEffect(() => {
    isRepeatRef.current = isRepeat;
  }, [isRepeat]);

  // Load and switch audio source (online or offline)
  useEffect(() => {
    if (!currentTrack?.url) return;

    const loadAudio = async () => {
      const audio = audioRef.current ?? new Audio();
      audioRef.current = audio;

      // Choose source: offline blob or remote URL
      
      if (isAlreadyDownloaded) {
        console.log('Playing Offline')
        
        const blobUrl = await getTrackBlobUrl(currentTrack!.id!); // e.g. 'track.mp3' -> blob URL
        if (blobUrl) {
          audio.src = blobUrl;
        } else {
          console.warn('Offline track not found, skipping');
          dispatch(nextTrack());
          return;
        }
      } else {
        console.log('Not Offline')
        
        audio.src = getPreferredStreamingQualityUrl(currentTrack!.url!, streamingQuality);
      }

      // Autoplay if needed
      if (isPlaying) audio.play();

      // Events
      audio.onloadedmetadata = () => setDuration(audio.duration);
      audio.ontimeupdate = () => setSeek(audio.currentTime);
      audio.onended = () => {
        if (isRepeatRef.current) {
          audio.currentTime = 0;
          audio.play();
        } else {
          dispatch(nextTrack());
        }
      };
    };

    loadAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [currentTrack?.url, isAlreadyDownloaded, streamingQuality]);

  // Sync play/pause state from Redux
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    isPlaying ? audio.play() : audio.pause();
  }, [isPlaying]);

  // Media Session integration
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
      navigator.mediaSession.setActionHandler('stop', pause);

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
