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

  export async function syncPlaylistWithFirestore(userId: string, localPlaylist: any[]) {
    if (!userId) return;
  
    try {
      const ref = doc(db, 'playlists', userId);
      const snapshot = await getDoc(ref);
  
      const remotePlaylist: any[] = snapshot.exists() ? snapshot.data().userPlaylist || [] : [];
  
      // Merge local and remote playlists (avoid duplicates)
      const mergedPlaylist = [...remotePlaylist];
  
      localPlaylist.forEach((localTrack) => {
        const exists = remotePlaylist.some((remoteTrack) => remoteTrack.id === localTrack.id);
        if (!exists) {
          mergedPlaylist.push(localTrack);
        }
      });
  
      // Save the merged playlist back to Firestore
      await setDoc(ref, { userPlaylist: mergedPlaylist }, { merge: true });
  
      return mergedPlaylist;
    } catch (error) {
      console.error('Error syncing playlist:', error);
      return null;
    }
  }