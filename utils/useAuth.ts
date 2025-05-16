'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { auth, provider } from './firebase';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutSlice, setCurrentUser } from '@/store/slices/user.slice';
import { resetAll } from '@/store/actions';
import { useRouter } from 'next/navigation';
import { fetchPlaylistFromFirestore, syncPlaylistWithFirestore } from './playlistHooks';
import { setUserPlaylists } from '@/store/slices/playlist.slice';
import { hideGlobalLoader, showGlobalLoader } from './useLoader';


export function useAuth() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const userPlaylist = useAppSelector((s) => s.playlist.userPlaylist);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {

      if (user !== null && user !== undefined) {
        //just for firebase
        if (user?.uid !== null && user?.uid !== undefined) {
          dispatch(
            setCurrentUser({
              uid: user?.uid,
              name: user?.displayName!,
              email: user?.email!,
              photo: user?.photoURL!,
              isGoogleLoggedIn: true,
              language: []
            })
          )
        }

      } else {
        dispatch(
          setCurrentUser(null)
        )
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, provider);
      dispatch(setCurrentUser({
        uid: result?.user?.uid || '',
        name: result?.user?.displayName || '',
        email: result?.user?.email || '',
        photo: result?.user?.photoURL || '',
        isGoogleLoggedIn: true,
        language: []
      })
      );
      const playlist = await fetchPlaylistFromFirestore(result?.user?.uid);
      dispatch(setUserPlaylists(playlist));

    } catch (err: any) {
      console.error('Login error:', err);
      setError(err);
    }
  };

  const getStarted = async (name: string) => {
    setError(null);
    try {
      dispatch(setCurrentUser({
        name: name,
        isGoogleLoggedIn: false,
        language: []
      })
      );
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err);
    }
  };

  const logout = async () => {
    try {
      if (currentUser) {
        showGlobalLoader('Logging out...');
        if (currentUser.uid !== null && currentUser.uid !== undefined) {
          await syncPlaylistWithFirestore(currentUser.uid!, userPlaylist);
          await signOut(auth);
        }
        dispatch(resetAll());
        dispatch(logoutSlice());
        router.push('/')
        hideGlobalLoader();
      }
    } catch (err: any) {
      console.error('Logout error:', err);
      setError(err);
    }
  };

  return { loading, error, getStarted, login, logout };
}
