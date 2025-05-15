import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { play, pause, nextTrack, setPlaylistAndPlay } from '@/store/slices/player.slice';
import { useAudioPlayer } from '@/utils/useAudioPlayer';
import toast from 'react-hot-toast';
import { formatSongsResponse, getLastSectionOfUrl, getPreferredStreamingQualityUrl } from './generic.utils';
import { getSongFromToken } from '@/store/slices/jio.slice';
import { downloadFile } from './fileutil';
import { showGlobalLoader } from './useLoader';

const usePlayDownload = () => {
  const dispatch = useAppDispatch();
  const { downloadQuality } = useAppSelector((s) => s.settings);
  
  async  function fetchAllSongsFromPlayNow(albumData: any[]) {
    toast.success('Please wait. Adding songs in queue');
    const fetchedAlbumList: any[] = [];

    if (Array.isArray(albumData) && albumData.length > 0) {
      for (const album of albumData) {
        if (album?.perma_url) {
          const token = getLastSectionOfUrl(album.perma_url);
          if (token) {
            try {
              const res: any = await dispatch(
                getSongFromToken({ token: token, type: album.type })
              );
              const songsList = res?.payload?.songs;
              if (Array.isArray(songsList) && songsList.length > 0) {
                const songsFetched = await formatSongsResponse(songsList, songsList[0].type);
                if (songsFetched.length > 0) {
                  fetchedAlbumList.push(songsFetched[0]);
                }
              }
            } catch (error) {
              console.error('Error fetching song from token:', error);
            }
          }
        }
      }
    }
  
    dispatch(setPlaylistAndPlay(fetchedAlbumList));
  }

  async function fetchAndDownloadMultipleFiles(albumData: any, type:string) {
      toast.success('Starting download in background')
      
      if (albumData !== null && albumData !== undefined && albumData.length > 0) {
        for (let i = 0; i < albumData.length; i++) {
          if (albumData[i] !== null && albumData[i] !== undefined && albumData[i].perma_url !== null && albumData[i].perma_url !== undefined) {
            let token = getLastSectionOfUrl(albumData[i].perma_url);
            if (token !== null && token !== undefined && token !== '') {
              await dispatch(getSongFromToken({ token: token, type: albumData[i].type })).then(async (res: any) => {
                if (res.payload !== null && res.payload !== undefined) {
                  let songsList = res.payload['songs'];
  
                  if (songsList !== null && songsList !== undefined && songsList.length > 0) {
                    const songsFetched = await formatSongsResponse(songsList, type);
                    const newUrl = getPreferredStreamingQualityUrl(songsFetched[0].url!, downloadQuality)
                    downloadFile(newUrl, songsFetched[0].title);
                  }
                }
              });
            }
          }
        }
      }

    }

  return {
    fetchAllSongsFromPlayNow,
    fetchAndDownloadMultipleFiles
  };
  
};

export default usePlayDownload;
