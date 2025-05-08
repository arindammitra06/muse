'use client'

import { nprogress } from '@mantine/nprogress';
import { useEffect, useState } from 'react';
import { Box, Group, Text, Stack, useMantineTheme, Flex, Image, Button, Skeleton } from '@mantine/core';
import { useAppDispatch } from '@/store/hooks';
import { fetchAlbumSongs, fetchFeaturedRadio, fetchPlaylistSongs } from '@/store/slices/jio.slice';
import { IconDownload, IconPlayerPlay } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { SkeletonSongBar, SongBar } from '@/components/SongBar/SongBar';

export default function AlbumDetailsPage({ params }: { params: { albumid: string, type: string } }) {
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const [albumData, setAlbumData] = useState<any>(null);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    fetchCall();
  }, [params]);


  

  function fetchCall() {
    nprogress.reset();
    nprogress.start();
    
    if (params.type === 'playlist') {
      dispatch(fetchPlaylistSongs({ albumId: params.albumid }))
        .then((res: any) => {
          nprogress.complete();
          setAlbumData(res.payload);
        });

    }if (params.type === 'artist') {
      dispatch(fetchFeaturedRadio({ names:['Hansraj Raghuwanshi'], stationType:params.type , language:'hindi' }))
        .then((res: any) => {
          nprogress.complete();
          setAlbumData(res.payload);
        });

    }  else {
      dispatch(fetchAlbumSongs({ albumId: params.albumid }))
        .then((res: any) => {
          nprogress.complete();
          setAlbumData(res.payload);
        });
    }

  }



  return (
    <Box p="sm"  style={{ minHeight: '100vh',}}>
      
      

      <Flex gap="md" align="center" mb="md" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
          <Skeleton w={200} h={150}  visible={albumData === null || albumData === undefined}>
            <Image src={albumData !== null && albumData !== undefined && albumData.image} radius="md" w={150} h={150} />
          </Skeleton>

          <Skeleton visible={albumData === null || albumData === undefined} style={{ minWidth: 0}}> 
            <Box style={{ minWidth: 0}}>
              <Text fw={700} size="lg" lineClamp={2} >
                {albumData !== null && albumData !== undefined && albumData.title}
              </Text>
              <Text size="sm" c="dimmed">
              {albumData !== null && albumData !== undefined && albumData.list.length>0 ? `${albumData.list.length} Songs` : '0 Songs'} 
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
                <Button
                  size="xs"
                  variant='light'
                  rightSection={<IconDownload size={16} />}
                  radius="md"
                  color={theme.primaryColor}
                  //onClick={()=>downloadFile()}
                >
                 Download
                </Button>
                
              </Group>
            </Box>
            </Skeleton>
      </Flex>

      <Text size="lg" fw={600} mt="lg" mb="sm" c={theme.primaryColor}>
        Songs
      </Text>
      
      <Stack gap="xs" mb={100} > 
        {albumData !== null && albumData !== undefined && albumData.list.length>0?
         albumData.list.map((song:any, idx:number) => (
          <SongBar key={idx} idx={idx} song={song} type={song.type} 
              isPlaying={false} currentPlayingTrack={undefined} onClickOverride={undefined} />
        ))
        :
        <SkeletonSongBar count={8}/>
        }
      </Stack> 
    </Box>
  );
}
