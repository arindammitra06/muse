'use client'

import AlbumList from '@/components/AlbumList/albumlist';
import { nprogress } from '@mantine/nprogress';
import { FC, useEffect } from 'react';
import { Box, useMantineTheme } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchArtistSongs } from '@/store/slices/jio.slice';
import React from 'react';
import HomePageSkeleton from '@/components/Skeletons/HomeSkeleton';

type ArtistDetailsPageProps = {
  params: Promise<{
    type: string;
    albumid: string;
    singername: string;
  }>;
};
export default  async function ArtistDetailsPage({ params }: ArtistDetailsPageProps) {
 
  const { type, albumid, singername } = await params;
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const artistData = useAppSelector((state) => state.api.artistData);
  
  useEffect(() => {
    fetchCall();
  }, [type,albumid,singername]);


  console.log(decodeURIComponent(singername))
  

  function fetchCall() {
    nprogress.reset();
    nprogress.start();
    
    if (type === 'artist') {
      dispatch(fetchArtistSongs({ artistToken:[decodeURIComponent(singername)], 
        category:'latest' , 
        sortOrder:'desc' }))
        .then((res: any) => {
          console.log(res)
          nprogress.complete();
        });

    }

  }



  return (
    <Box p="sm"  style={{ minHeight: '100vh',}}>
      {
        artistData !== null && artistData !== undefined &&
        artistData.modules !== null && artistData.modules !== undefined ?
          <div>
            {(Object.entries(artistData.modules) as [keyof any, any[keyof any]][]).map(([key, value]) => (

              <AlbumList key={String(key)}
                name={value.title} subtitle={value.subtitle}
                list={artistData[String(key)]} />
            ))}
          </div>
          :
          <HomePageSkeleton />
      }
      

      {/* <Flex gap="md" align="center" mb="md" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
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
      </Stack>  */}
    </Box>
  );
}
