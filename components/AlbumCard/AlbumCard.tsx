import {
  Card,
  Image,
  Text,
  Overlay,
  Group,
  ActionIcon,
  rem,
  Stack,
  Center,
} from '@mantine/core';
import { IconPlayerPlayFilled, IconShare } from '@tabler/icons-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { playTrack, } from '@/store/slices/player.slice';
import { getSongFromToken } from '@/store/slices/jio.slice';
import { getLastSectionOfUrl, formatSongsResponse } from '@/utils/generic.utils';
import toast from 'react-hot-toast';
import { FavoriteButton } from '../FavoriteButton/FavoriteButton';

interface AlbumCardProps {
  id: string;
  image: string;
  title: string;
  type: string;
  subtitle: string;
  song: any;
  year: string;
}

export function AlbumCard({ id, image, title, subtitle, type, song, year }: AlbumCardProps) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();


  function playSongAndAddToPlaylist(song: any): void {
    if (type !== null && type !== undefined && song !== null && song !== undefined && song.perma_url !== null && song.perma_url !== undefined) {
      let token = getLastSectionOfUrl(song.perma_url);

      if (token !== null && token !== undefined && token !== '') {
        dispatch(getSongFromToken({ token: token, type: type })).then(async (res: any) => {
          console.log(type)
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
      toast.error('Top Results & Artist coming soon')

    } else {

      if (type === 'song') {
        playSongAndAddToPlaylist(song);
      } else {
        router.push(`/${type}/${id}/`);
      }
    }
  };



  return (
    <Stack gap={0} style={{ width: '100%', maxWidth: rem(200) }} onClick={handleClick}>
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
          aspectRatio: '1 / 1', // Square shape
          overflow: 'hidden',
          cursor: 'pointer',
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



        {hovered && (
          <>
            <Overlay
              color="black"
              opacity={0.5}
              zIndex={1}
              style={{ transition: 'opacity 200ms ease' }}
            />

            <Group
              flex="right"
              style={{
                position: 'absolute',
                top: rem(10),
                right: rem(10),
                zIndex: 2,
              }}
              gap="xs"
            >
              <FavoriteButton song={song}/>
              <ActionIcon variant="light" color="white" radius="xl">
                <IconShare size="1.2rem" />
              </ActionIcon>
            </Group>

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
                  <IconPlayerPlayFilled size="1.5rem" color="black" />
                </ActionIcon>
              </Center>}
          </>
        )}
      </Card>

      {/* Title and subtitle below the card */}
      <Text tt="capitalize" size="sm" fw={600} ta={'center'} lineClamp={1} mt={5} mx={10}>
        {title}
      </Text>
      <Text tt="capitalize" size="xs" c="dimmed" ta={'center'} lineClamp={1} m={0} mx={10}>
        {type} • {subtitle !== null && subtitle !== undefined ? subtitle : year}
      </Text>
    </Stack>
  );
}
