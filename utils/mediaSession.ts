import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { play, pause, nextTrack } from '@/store/slices/player.slice';
import { useAudioPlayer } from '@/utils/useAudioPlayer';

const useMediaSession = () => {
  const { currentTrack, isPlaying } = useAudioPlayer();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if ('mediaSession' in navigator) {
      const mediaSession = navigator.mediaSession;

      // Set media metadata
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

        mediaSession.setActionHandler('play', () => dispatch(play()));
        mediaSession.setActionHandler('pause', () => dispatch(pause()));
        mediaSession.setActionHandler('nexttrack', () => dispatch(nextTrack()));

        // Optionally add previous track action
        mediaSession.setActionHandler('previoustrack', () => {
          // Handle previous track logic
        });

        // Handle track end event for the next track to play
        mediaSession.setActionHandler('stop', () => {
          // Logic to stop or reset the player when media ends
        });
      }
    }
  }, [currentTrack, isPlaying, dispatch]);
};

export default useMediaSession;
