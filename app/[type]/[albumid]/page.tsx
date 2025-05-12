'use client'

import { nprogress } from '@mantine/nprogress';
import { useEffect, useState } from 'react';
import { Box, Group, Text, Stack, useMantineTheme, Flex, Image, Button, Skeleton, ActionIcon } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAlbumSongs, fetchFeaturedRadio, fetchPlaylistSongs, getSongFromToken } from '@/store/slices/jio.slice';
import { IconAdjustments, IconDownload, IconPlayerPlay } from '@tabler/icons-react';
import { SkeletonSongBar, SongBar } from '@/components/SongBar/SongBar';
import { DownloadButton } from '@/components/DownloadButton/DownloadButton';
import { downloadAllFiles, downloadFile } from '@/utils/fileutil';
import { formatSongsResponse, getLastSectionOfUrl, getPreferredStreamingQualityUrl } from '@/utils/generic.utils';
import { modals } from '@mantine/modals';
import toast from 'react-hot-toast';


export default function AlbumDetailsPage({
  params,
}: {
  params: { type: string; albumid: string };
}) {
  const { type, albumid } = params;
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const [albumData, setAlbumData] = useState<any>(null);
  const { downloadQuality } = useAppSelector((s) => s.settings);



  useEffect(() => {
    fetchCall();
  }, [type, albumid]);


  async function fetchAndDownloadAllFiles(albumData: any, downloadQuality: string) {
    toast.success('Starting download in background')
            
    if (albumData !== null && albumData !== undefined && albumData.length > 0) {
      for (let i = 0; i < albumData.length; i++) {
        if (albumData[i] !== null && albumData[i] !== undefined  && albumData[i].perma_url !== null && albumData[i].perma_url !== undefined) {
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
        onConfirm: () => fetchAndDownloadAllFiles(albumData.list, downloadQuality),
      });

  function fetchCall() {
    nprogress.reset();
    nprogress.start();

    if (type === 'playlist') {
      dispatch(fetchPlaylistSongs({ albumId: albumid }))
        .then((res: any) => {
          nprogress.complete();
          setAlbumData(res.payload);
        });

    } if (type === 'artist') {
      dispatch(fetchFeaturedRadio({ names: ['Hansraj Raghuwanshi'], stationType: type, language: 'hindi' }))
        .then((res: any) => {
          nprogress.complete();
          setAlbumData(res.payload);
        });

    } else {
      dispatch(fetchAlbumSongs({ albumId: albumid }))
        .then((res: any) => {
          nprogress.complete();
          setAlbumData(res.payload);
        });
    }

  }





  return (
    <Box p="sm" style={{ minHeight: '100vh', }}>



      <Flex gap="md" align="center" mb="md" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
        <Skeleton w={200} h={150} visible={albumData === null || albumData === undefined}>
          <Image src={albumData !== null && albumData !== undefined && albumData.image} radius="md" w={150} h={150} />
        </Skeleton>

        <Skeleton visible={albumData === null || albumData === undefined} style={{ minWidth: 0 }}>
          <Box style={{ minWidth: 0 }}>
            <Text fw={700} size="lg" lineClamp={2} >
              {albumData !== null && albumData !== undefined && albumData.title}
            </Text>
            <Text size="sm" c="dimmed">
              {albumData !== null && albumData !== undefined && albumData.list.length > 0 ? `${albumData.list.length} Songs` : '0 Songs'}
            </Text>
            <Text size="sm" c="dimmed">
              {albumData !== null && albumData !== undefined && albumData.header_desc}
            </Text>
            <Group mt="xs" gap="xs">
              <Button
                size="xs"
                rightSection={<IconPlayerPlay size={16} />}
                radius="md"
                color={theme.primaryColor}
              >
                Play All
              </Button>

              <ActionIcon variant="light" size={'md'}
                radius="xl" aria-label="Download All"
                onClick={() => openConfirmodal()}>
                <IconDownload size={24} stroke={2} />
              </ActionIcon>


            </Group>
          </Box>
        </Skeleton>
      </Flex>

      <Text size="lg" fw={600} mt="lg" mb="sm" c={theme.primaryColor}>
        Songs
      </Text>

      <Stack gap="0" mb={100} >
        {albumData !== null && albumData !== undefined && albumData.list.length > 0 ?
          albumData.list.map((song: any, idx: number) => (
            <SongBar key={idx} idx={idx} song={song} type={song.type}
              isPlaying={false} currentPlayingTrack={undefined} onClickOverride={undefined} />
          ))
          :
          <SkeletonSongBar count={8} />
        }
      </Stack>
    </Box>
  );
}
