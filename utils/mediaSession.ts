// utils/mediaSession.ts

import { Track } from "@/store/slices/player.slice";

export function setMediaSession(track: Track, onPlay: () => void, onPause: () => void) {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist!,
      artwork: [
        { src: track.image!, sizes: '512x512', type: 'image/png' },
      ],
    });

    navigator.mediaSession.setActionHandler('play', onPlay);
    navigator.mediaSession.setActionHandler('pause', onPause);
    navigator.mediaSession.setActionHandler('nexttrack', () => {});
    navigator.mediaSession.setActionHandler('previoustrack', () => {});
  }
}
