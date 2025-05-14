// src/lib/playlistSync.ts
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function fetchPlaylistFromFirestore(userId: string) {
  if (!userId) return [];

  try {
    const ref = doc(db, 'playlists', userId);
    const docSnap = await getDoc(ref);

    if (docSnap.exists()) {
      return docSnap.data().userPlaylist || [];
    } else {
      // Initialize with an empty playlist if none exists
      await setDoc(ref, { userPlaylist: [] });
      return [];
    }
  } catch (error) {
    console.error('Error fetching playlist:', error);
    return [];
  }
}
export async function savePlaylistToFirestore(userId: string, playlist: any[]) {
    if (!userId) return;
  
    try {
      const ref = doc(db, 'playlists', userId);
      await setDoc(ref, { userPlaylist: playlist }, { merge: true });
    } catch (error) {
      console.error('Error saving playlist:', error);
    }
  }