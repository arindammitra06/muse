import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { nextTrack, play, pause, previousTrack, toggleRepeat, toggleShuffle, } from '@/store/slices/player.slice';
import { formatTime } from '@/utils/formatTime';
import { useAudioPlayer } from '@/utils/useAudioPlayer';
import { Box, Group, Image, Text, Slider, ActionIcon, Card, Flex, useMantineTheme, Modal, Center, Stack, Button, Drawer, Loader, Overlay } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import musicPlaceholder from '../../assets/images/music_placeholder.png';
import Marquee from "react-fast-marquee";

import { IconArrowsShuffle, IconChevronDown, IconNotes, IconPlayerPauseFilled, IconPlayerPlayFilled, IconPlayerSkipBackFilled, IconPlayerSkipForwardFilled, IconRepeat, IconRepeatOnce } from '@tabler/icons-react';
import { SkeletonSongBar } from '../SongBar/SongBar';
import { NowPlayingOverlay } from './NowPlayingOverlay';
import { DownloadButton } from '../DownloadButton/DownloadButton';
import { FavoriteButton } from '../FavoriteButton/FavoriteButton';
import { PlaylistMenuOptions } from '../PlaylistMenu/PlaylistMenuOptions';
import BottomStickyItem from './BottomStickyItem';
import SortableSessionDrawer from '../SongBar/SortablePlaylist';
import { useEffect, useState } from 'react';
import { Lyrics } from '@/utils/lyrics';
import { ProgressiveLyrics } from '../Common/ProgressiveLyrics';
import toast from 'react-hot-toast';
import '@gfazioli/mantine-flip/styles.layer.css';
import { LineSyncedLyrics } from './SyncedLyrics';
export function NowPlayingBar() {
  const [opened, { open, close }] = useDisclosure(false);
  const [drawerOpened, { open: openDrawer, close: closeDrawer },] = useDisclosure(false);
  const allowSwipeGesture = (useAppSelector((state) => state.settings.allowSwipeGesture) ?? false) as boolean;
  const { currentTrack, isPlaying, seek, duration, seekTo } = useAudioPlayer();
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const { isLoading, isRepeat, isShuffle, currentTrackIndex } = useAppSelector((s) => s.player);
  const playlist = useAppSelector((state) => state.player.playlist);
  const hasPrevious = currentTrackIndex > 0;
  const hasNext = currentTrackIndex < playlist.length - 1;
  let exactNextTrack = hasNext ? playlist[currentTrackIndex + 1] : undefined;
  const [flipped, setFlipped] = useState(false);
  const [lyricsFetched, setFetchedLyrics] = useState<any[]>([]);
  const [lyricsType, setLyricsType] = useState<string>('');

  //Uncomment if you have musixmatch API key.. I didnt get one approved
  // useEffect(() => {
  //   if (currentTrack) {
  //     dispatch(
  //       fetchLyrics({ title: currentTrack.title!, artist: currentTrack.artist! })
  //     );
  //   }
  // }, [currentTrack]);


  useEffect(() => {
    setFlipped(false);
    setLyricsType('');
  }, [currentTrack]);

  function flipOrUnflipLyrics(): void {
    if (!flipped) {
      getLyricsNow();
    } else {
      setFlipped(false);
    }
  }

  async function getLyricsNow() {
    if (currentTrack) {

      let songFoundPlaying = playlist[currentTrackIndex];
      await Lyrics.getLyrics({
        id: songFoundPlaying.id, saavnHas: false,
        title: songFoundPlaying.title!,
        artist: String(songFoundPlaying.artist)
      }).then((res: any) => {
        if (res !== null && res !== undefined && res.lyrics !== null && res.lyrics !== undefined && res.lyrics.length > 0) {
          setFetchedLyrics(res.lyrics);
          setLyricsType(res.type);
          setFlipped(true);
        } else {
          setFlipped(false);
          setLyricsType('');
          toast.error('Lyrics unavailable')
        }
      });

    }
  }


  const renderRepeatIcon = () => {
    if (isRepeat) return <IconRepeatOnce color={theme.colors[theme.primaryColor][5]} size="1.4rem" stroke={1.5} />;
    return <IconRepeat color="gray" size="1.4rem" stroke={1.5} />;
  };



  function doNoExpandAndPlay(e: React.MouseEvent): void {
    e.stopPropagation();
    dispatch(isPlaying ? pause() : play())
  }

  function doNoExpandAndNext(e: React.MouseEvent): void {
    e.stopPropagation();
    dispatch(nextTrack());
    dispatch(play())
  }


  //Get Now Playing Bar Header..
  const getHeader = <Flex align="center" justify="space-between" mb="sm" style={{ flex: 1, minWidth: 0 }} px={'xs'}>

    <ActionIcon size={'xl'} variant="subtle" color="gray" onClick={() => close()} ml={5}>
      <IconChevronDown size={'1.5rem'} />
    </ActionIcon>

    <Group gap="xs">

      <ActionIcon variant={flipped ? "filled" : "subtle"} color={'gray'} onClick={(e) => flipOrUnflipLyrics()}>
        <IconNotes size={20} />
      </ActionIcon>

      <FavoriteButton song={currentTrack} />
      <DownloadButton song={currentTrack} />

      {currentTrack !== null && currentTrack !== undefined && currentTrack.type === 'song'
        && <Box onClick={(e) => e.stopPropagation()}>
          <PlaylistMenuOptions
            song={currentTrack}
            type={currentTrack.type}
            album={undefined}
            isForAlbums={false}
            isPlayingSongBar={false}
            albumType={''}
            playlistId={''} />
        </Box>}
    </Group>
  </Flex>;

  //Get FullScreen Body
  const getFullScreenPage = <Center>
    <Stack align="center" gap="4" w="100%" px="md" py="sm">
      {/* Uncomment if you have musixmatch API key */}
      {/* <NowPlayingLyrics /> */}

      <Box pos="relative" w="40vh" h="40vh" style={{ overflow: "hidden", borderRadius: '0.5rem' }}>
        <Image
          src={currentTrack?.image || musicPlaceholder.src}
          w={'40vh'}
          radius="md"
          fit="cover" />
        {flipped && (
          <Overlay
            backgroundOpacity={0.6}
            blur={4}
            center
            zIndex={2}
            style={{
              padding: '1rem',
              textAlign: 'center',
              color: 'white',
            }}
          >

            {lyricsType === 'LINE_SYNCED' ?
              <LineSyncedLyrics lines={lyricsFetched} currentTime={seek} />
              : <ProgressiveLyrics
                lines={lyricsFetched}
                duration={duration}
                currentTime={seek} />}
          </Overlay>
        )}
      </Box>

      {currentTrack !== null && currentTrack.title !== undefined &&
        currentTrack.title !== null && currentTrack.title !== undefined && currentTrack.title.length > 20
        ? <Marquee pauseOnHover delay={3} speed={15}>
          <Text my={'xl'} fw={700} size="32px" ta={'center'} style={{ whiteSpace: 'nowrap' }}>
            {currentTrack.title}
          </Text>
        </Marquee>
        :
        <Text my={'xl'} fw={700} size="32px" ta={'center'} style={{ whiteSpace: 'nowrap' }}>
          {currentTrack.title}
        </Text>}

      {/* Subtitle */}
      <Marquee pauseOnHover delay={3} speed={15}>
        <Text ta="center" c="dimmed" size="md" truncate w="100%">
          {currentTrack.subtitle !== null && currentTrack.subtitle !== undefined && currentTrack.subtitle !== ''
            ? `${currentTrack.subtitle} • ${currentTrack.year}` : `${currentTrack.artist} • ${currentTrack.genre} • ${currentTrack.year}`}
        </Text></Marquee>

      {/* Seekbar */}
      <Box w="100%" mt="sm">
        <Slider
          value={seek}
          min={0}
          onChange={seekTo}
          label={(value) => formatTime(value)}
          max={duration}
          size="sm"
          radius={'xl'}
          color={theme.primaryColor} />
        <Group justify="space-between" mt={4}>
          <Text size="xs">{formatTime(seek)}</Text>
          <Text size="xs">{formatTime(duration)}</Text>
        </Group>
      </Box>

      {/* Controls */}
      <Group justify="center" mt="md" gap="md">
        <ActionIcon variant="subtle" size="xl" radius="lg" onClick={() => dispatch(toggleShuffle())}>
          <IconArrowsShuffle color={isShuffle ? theme.colors[theme.primaryColor][5] : 'gray'} size="1.4rem" stroke={1.5} />
        </ActionIcon>

        <ActionIcon disabled={!hasPrevious} c={hasPrevious ? theme.primaryColor : 'gray'} variant="subtle" size="xl" radius="lg" onClick={() => dispatch(previousTrack())}>
          <IconPlayerSkipBackFilled size="1.8rem" stroke={1.5} />
        </ActionIcon>

        <ActionIcon
          variant="light"
          size="4rem"
          radius="lg"
          onClick={() => dispatch(isPlaying ? pause() : play())}
        >
          {isPlaying ? (
            <IconPlayerPauseFilled size="3.6rem" stroke={1.5} />
          ) : (
            <IconPlayerPlayFilled size="3.6rem" stroke={1.5} />
          )}
        </ActionIcon>

        <ActionIcon variant="subtle" size="xl" c={hasNext ? theme.primaryColor : 'gray'} radius="lg" onClick={() => dispatch(nextTrack())} disabled={!hasNext}>
          <IconPlayerSkipForwardFilled size="1.8rem" stroke={1.5} />
        </ActionIcon>

        <ActionIcon variant="subtle" size="xl" radius="lg" onClick={() => dispatch(toggleRepeat())}>
          {renderRepeatIcon()}
        </ActionIcon>
      </Group>

      <Button mt={5} variant="transparent" size='md' onClick={openDrawer}> Up Next</Button>

      {exactNextTrack && <BottomStickyItem exactNextTrack={exactNextTrack} />}

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        position="bottom"
        size="90%"
        withCloseButton
        padding="xs"
        radius="md"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Stack p={0}>
            {playlist !== null && playlist !== undefined && playlist.length > 0 ?
              <SortableSessionDrawer drawerOpened={drawerOpened} closeDrawer={closeDrawer} />
              :
              <SkeletonSongBar count={8} />}
          </Stack>
        </div>
      </Drawer>
    </Stack>


  </Center>;



  return (
    <>
      <Modal.Root
        opened={opened}
        onClose={close}
        fullScreen
        radius={0}
        transitionProps={{ transition: 'fade', duration: 200 }}
      >
        <Modal.Overlay />
        <Modal.Content>

          <Modal.Body>
            {allowSwipeGesture ?
              <NowPlayingOverlay opened={opened} onClose={close} closeDrawer={closeDrawer} >
                {getHeader}

                {opened && (
                  getFullScreenPage
                )}
              </NowPlayingOverlay>
              :
              <>
                {getHeader}

                {opened && (
                  getFullScreenPage
                )}
              </>
            }
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>

      <Card radius={0} p={0} w="100%" onClick={open}>
        <Slider
          key="slider1"
          my={0}
          value={seek}
          min={0}
          label={(value) => formatTime(value)}
          onChange={seekTo}
          max={duration}
          size="sm"
          radius={'xl'}
          color={theme.primaryColor}
          defaultValue={0}
        />
        <Flex justify="space-between" align="center" px={'md'} py={4} style={{ flex: 1, minWidth: 0 }}>
          <Group wrap="nowrap" style={{ flex: 1, minWidth: 0 }} gap={'xs'}>
            <Image
              src={currentTrack?.image || musicPlaceholder.src}
              radius="md"
              w={40}
              h={40}
              alt={currentTrack?.title}
            />
            <Box style={{ minWidth: 0 }} >
              <Text size="md" fw={500} truncate>
                {currentTrack?.title ?? 'No track playing'}
              </Text>
              <Marquee pauseOnHover delay={3} speed={15}>
                <Text size="xs" c="dimmed" truncate lineClamp={1}>
                  {currentTrack?.title ? `${currentTrack.subtitle} • ${currentTrack.year}` : ''}
                </Text>
              </Marquee>


            </Box>
          </Group>
          <Group gap="sm" wrap="nowrap">
            <FavoriteButton song={currentTrack} />
            <ActionIcon variant="subtle" px={0}
              size="md" radius="lg" onClick={(e) => doNoExpandAndPlay(e)}>
              {isLoading ? <Loader size={'2rem'} /> : isPlaying ? <IconPlayerPauseFilled size={'2rem'} stroke={1.5} /> : <IconPlayerPlayFilled size={'2rem'} stroke={1.5} />}
            </ActionIcon>

            <ActionIcon variant="subtle" p={'2'} size="md" mr={10} radius="lg" onClick={(e) => doNoExpandAndNext(e)} disabled={!hasNext}>
              <IconPlayerSkipForwardFilled size={'2rem'} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Flex>

      </Card>
    </>
  );
}

