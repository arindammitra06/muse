'use client'

import AlbumList from '@/components/AlbumList/albumlist';
import { nprogress } from '@mantine/nprogress';
import { useEffect } from 'react';
import { Box, Button, Group, Overlay, Space, Stack, Title, useMantineTheme } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchArtistSongs } from '@/store/slices/jio.slice';
import React from 'react';
import { DownloadButton } from '@/components/DownloadButton/DownloadButton';
import { SkeletonCarousel, SkeletonSongBar, SongBar } from '@/components/SongBar/SongBar';
import '@mantine/carousel/styles.css';
import { IconPlayerPlay } from '@tabler/icons-react';
import { AppTitles } from '@/components/Common/custom-title';
import { setPageTitle } from '@/store/slices/pageTitleSlice';
import { capitalizeFirst } from '@/utils/generic.utils';

export default function ArtistDetailsPage({
  params,
}: {
  params: { type: string; albumid: string, singername: string; };
}) {

  const { type, albumid, singername } = params;
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const artistData = useAppSelector((state) => state.api.artistData);


  useEffect(() => {
    dispatch(setPageTitle(capitalizeFirst(type)));
    
    fetchCall();
  }, [type, albumid, singername]);

 

  function fetchCall() {
    nprogress.reset();
    nprogress.start();

    if (type === 'artist') {
      dispatch(fetchArtistSongs({
        artistToken: [singername],
        category: 'latest',
        sortOrder: 'desc'
      }))
        .then((res: any) => {
          nprogress.complete();
        });

    }

  }



  return (
    <Box p="0" mb={150} style={{ minHeight: '100vh', }}>
      {
        artistData !== null && artistData !== undefined && <Box
          style={{
            position: 'relative',
            backgroundImage: `url(${artistData['image']})`, // Replace with your image path
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '300px',
            color: 'white',
            overflow: 'hidden',
          }}
        >
          <Overlay gradient="linear-gradient(to top, #000, rgba(0,0,0,0.3))" zIndex={1} />



          <Group
            gap="xs"
            style={{ position: 'absolute', bottom: 20, left: 20, zIndex: 2 }}
          >
            <Title order={2}>{artistData['name']}</Title>
            <Group>
              <Button
                size="md"
                rightSection={<IconPlayerPlay size={16} />}
                radius="md"
                color={theme.primaryColor}
              >
                Play All
              </Button>
              <DownloadButton song={undefined} />
            </Group>
          </Group>
        </Box>
      }
      <Stack p={'xs'} >{

        artistData !== null && artistData !== undefined ?
          <Stack gap="0" mb={20} >
            <AppTitles title={'Top Songs'} />

            {artistData['Top Songs'] !== null && artistData['Top Songs'] !== undefined && artistData['Top Songs'].length > 0
              && artistData['Top Songs'].map((song: any, idx: number) => (
                <SongBar key={idx} id={song.id}  song={song} type={song.type}
                  isPlaying={false} currentPlayingTrack={undefined} onClickOverride={undefined} />
              ))
            }
          </Stack>
          :
          <SkeletonSongBar count={8} />
      }
      </Stack>

      {artistData ? (
        Object.entries(artistData)
          .filter(
            ([key, value]) =>
              !['Top Songs', 'artistId', 'name'].includes(key) && Array.isArray(value)
          )
          .map(([key, value]) => (
            <div key={key}>
              <AlbumList
                name={key}
                subtitle={key}
                list={value as any[]} // ✅ Explicit cast to array
              />
              <Space h={20} />
            </div>
          ))
      ) : (
        <SkeletonCarousel count={8} />
      )}


    </Box>
  );
}
