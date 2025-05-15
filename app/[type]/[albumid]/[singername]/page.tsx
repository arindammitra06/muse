'use client'

import AlbumList from '@/components/AlbumList/albumlist';
import { nprogress } from '@mantine/nprogress';
import { useEffect } from 'react';
import { Box, Button, Group, Overlay, Space, Stack, Title, useMantineTheme, Text, ActionIcon } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchArtistSongs } from '@/store/slices/jio.slice';
import React from 'react';
import { SkeletonCarousel, SkeletonSongBar, SongBar } from '@/components/SongBar/SongBar';
import '@mantine/carousel/styles.css';
import { IconDownload, IconPlayerPlay } from '@tabler/icons-react';
import { AppTitles } from '@/components/Common/custom-title';
import { setPageTitle } from '@/store/slices/pageTitleSlice';
import { capitalizeFirst } from '@/utils/generic.utils';
import { modals } from '@mantine/modals';
import usePlayDownload from '@/utils/playDownloadHooks';

export default function ArtistDetailsPage({
  params,
}: {
  params: { type: string; albumid: string, singername: string; };
}) {

  const { type, albumid, singername } = params;
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const artistData = useAppSelector((state) => state.api.artistData);
  
  const { fetchAllSongsFromPlayNow , fetchAndDownloadMultipleFiles} = usePlayDownload();

  useEffect(() => {
    dispatch(setPageTitle(capitalizeFirst(type)));

    fetchCall();
  }, [type, albumid, singername]);

  const openConfirmodal = () =>
    modals.openConfirmModal({
      title: 'Download all tracks?',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to download all tracks?
        </Text>
      ),
      labels: { confirm: 'Yes', cancel: "No" },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => fetchAndDownloadMultipleFiles(artistData['Top Songs'], type),
    });

  

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



          <Group justify="space-between"
            wrap="nowrap"
            p={'xs'}
            style={{width:'100%', flex: 1, minWidth: 0, position: 'absolute', bottom: 0, left: 0, zIndex: 2 }}
          >
            <Group wrap="nowrap" style={{ flex: 1, minWidth: 0 }} gap={'xs'}>
              <Title order={2}>{artistData['name']}</Title>
            </Group>

            <Group gap="sm" wrap="nowrap">
              <Button
                size="md"
                rightSection={<IconPlayerPlay size={16} />}
                radius="md"
                onClick={() => fetchAllSongsFromPlayNow(artistData['Top Songs'])}
                disabled={artistData !== null && artistData !== undefined &&
                  artistData['Top Songs'] !== null && artistData['Top Songs'] !== undefined && artistData['Top Songs'].length > 0 ? false : true}
                color={theme.primaryColor}>Play All</Button>

              <ActionIcon 
                variant="filled"
                size={'xl'}
                radius="md" 
                aria-label="Download All"
                disabled={artistData !== null && artistData !== undefined &&
                  artistData['Top Songs'] !== null && artistData['Top Songs'] !== undefined && artistData['Top Songs'].length > 0 ? false : true}
                onClick={() => openConfirmodal()}
                >
                <IconDownload size={22} stroke={2} />
              </ActionIcon>
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
                <SongBar key={idx} id={song.id} song={song} type={song.type}
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
