import {
  Card,
  Image,
  Text,
  ActionIcon,
  rem,
  Stack,
  Center,
  useMantineTheme,
} from '@mantine/core';
import { IconPlayerPlayFilled } from '@tabler/icons-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { playTrack, } from '@/store/slices/player.slice';
import { getSongFromToken } from '@/store/slices/jio.slice';
import { getLastSectionOfUrl, formatSongsResponse } from '@/utils/generic.utils';
import { useMediaQuery } from '@mantine/hooks';

interface AlbumCardProps {
  id: string;
  image: string;
  title: string;
  type: string;
  subtitle: string;
  song: any;
  year: string;
  perma_url: string;
}

export function AlbumCard({ id, image, title, subtitle, type, song, year, perma_url }: AlbumCardProps) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.sm})`);

  function playSongAndAddToPlaylist(song: any): void {
    
    if (type !== null && type !== undefined && song !== null && song !== undefined && song.perma_url !== null && song.perma_url !== undefined) {
      let token = getLastSectionOfUrl(song.perma_url);

      if (token !== null && token !== undefined && token !== '') {
        dispatch(getSongFromToken({ token: token, type: type })).then(async (res: any) => {

          if (res.payload !== null && res.payload !== undefined) {

            let songsList = res.payload['songs'];
            if (songsList !== null && songsList !== undefined && songsList.length > 0) {
              const songs = await formatSongsResponse(songsList, type);
              
              dispatch(playTrack(songs[0]));
              //dispatch(playPause())
            }
          }
        });;
      }
    }

  }
  const handleClick = () => {
    if (type === 'artist') {
      let token = getLastSectionOfUrl(perma_url);
      router.push(`/${type}/${id}/${token}`);
    } else {
      if (type === 'song') {
        playSongAndAddToPlaylist(song);
      } else {
        router.push(`/${type}/${id}/`);
      }
    }
  };



  return (<Stack gap={0} style={{ width: '100%', maxWidth: rem(200) }} onClick={handleClick}>
    <Card
      radius={type === 'radio_station' ? '100px' : type === 'show' ? '100px' : 'md'}
      p={0}
      ml={10}
      withBorder
      shadow='sm'
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1 / 1',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 200ms ease, box-shadow 200ms ease',
        transform: hovered && isDesktop ? 'scale(1.02)' : 'scale(1)',
        boxShadow: hovered && isDesktop ? theme.shadows.md : theme.shadows.sm,
        zIndex: hovered ? 10 : 1, // optional: elevate above others
      }}
    >
      <Image
        src={image}
        alt={title}
        height="100%"
        width="100%"
        fit="cover"
        style={{ filter: type === 'artist' ? 'grayscale(100%)' : 'none' }}
      />
      {type !== null && type !== undefined && type === 'song' &&
        <Center
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            zIndex: 2,
          }}
        >
          <ActionIcon
            variant="filled"
            size="xl"
            radius="xl"
            onClick={() => playSongAndAddToPlaylist(song)}
          >
            <IconPlayerPlayFilled size="1.8rem" color="white" />
          </ActionIcon>
        </Center>}
    </Card>

    {/* Title and subtitle below the card */}
    <Text tt="capitalize" size="sm" fw={600} ta={'center'} lineClamp={1} mt={5} mx={10}>
      {title}
    </Text>
    <Text tt="capitalize" size="xs" c="dimmed" ta={'center'} lineClamp={1} m={0} mx={10}>
      {subtitle}
    </Text>
  </Stack>
  );
}
