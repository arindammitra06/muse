import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { nextTrack, play, pause, previousTrack, toggleRepeat, toggleShuffle, } from '@/store/slices/player.slice';
import { formatTime } from '@/utils/formatTime';
import { useAudioPlayer } from '@/utils/useAudioPlayer';
import { Box, Group, Image, Text, Slider, ActionIcon, Card, Flex, useMantineTheme, Modal, Center, Stack, Button, Drawer, rem, Loader } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import musicPlaceholder from '../../assets/images/music_placeholder.png';
import Marquee from "react-fast-marquee";

import { IconArrowsShuffle, IconChevronDown, IconDotsVertical, IconPlayerPauseFilled, IconPlayerPlayFilled, IconPlayerSkipBackFilled, IconPlayerSkipForwardFilled, IconRepeat, IconRepeatOnce, IconShare } from '@tabler/icons-react';
import { SkeletonSongBar } from '../SongBar/SongBar';
import { PlaylistDndList } from '../SongBar/SortablePlaylist';
import { NowPlayingOverlay } from './NowPlayingOverlay';
import { DownloadButton } from '../DownloadButton/DownloadButton';
import { FavoriteButton } from '../FavoriteButton/FavoriteButton';

export function NowPlayingBar() {
  const [opened, { open, close }] = useDisclosure(false);
  const [
    drawerOpened,
    { open: openDrawer, close: closeDrawer },
  ] = useDisclosure(false);


  const { currentTrack, isPlaying, seek, duration, seekTo } = useAudioPlayer();
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const {isLoading, isRepeat, isShuffle, currentTrackIndex } = useAppSelector((s) => s.player);
  const playlist = useAppSelector((state) => state.player.playlist);
  const hasPrevious = currentTrackIndex > 0;
  const hasNext = currentTrackIndex < playlist.length - 1;
  


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
            <NowPlayingOverlay opened={opened} onClose={close} closeDrawer={closeDrawer} >

              <Flex align="end" justify="space-between" mb="sm" style={{ flex: 1, minWidth: 0 }} px={'xs'}>

                <ActionIcon size={'xl'} variant="subtle" color="gray" onClick={() => close()} ml={5}>
                  <IconChevronDown size={'1.5rem'} />
                </ActionIcon>

                <Group gap="xs">
                  <FavoriteButton song={currentTrack}/>
                  <DownloadButton song={currentTrack}/>
                  
                  <ActionIcon size={'xl'} variant="subtle" color="gray">
                    <IconShare size={'1.5rem'} />
                  </ActionIcon>
                  <ActionIcon size={'xl'} variant="subtle" color="gray">
                    <IconDotsVertical size={'1.5rem'} />
                  </ActionIcon>
                </Group>
              </Flex>

              {opened && (
                <Center>
                  <Stack align="center" gap="4" w="100%" px="md" py="sm">
                    <Image
                      src={currentTrack?.image || musicPlaceholder.src}
                      w={350}
                      h={350}
                      radius="md"
                      fit="cover"
                    />

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
                      </Text>
                    }

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
                        color={theme.primaryColor}
                      />
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

                    <Button mt={20} variant="transparent" size='md' onClick={openDrawer} > Up Next</Button>

                    <Drawer
                      opened={drawerOpened}
                      onClose={closeDrawer}
                      position="bottom"
                      size="60%"
                      withCloseButton={false}
                      padding="xs"
                      radius="md"
                      styles={{
                        body: { paddingTop: rem(12) },
                      }}
                    >
                      {/* Holder (grab handle) */}
                      <Center>
                        <Box
                          style={{
                            width: rem(40),
                            height: rem(4),
                            borderRadius: rem(4),
                            backgroundColor: '#ccc',
                            marginBottom: rem(12),
                          }}
                        />
                      </Center>

                      {/* Your content */}
                      <Stack>
                        {playlist !== null && playlist !== undefined && playlist.length > 0 ?
                          <PlaylistDndList />
                          :
                          <SkeletonSongBar count={8} />
                        }
                      </Stack>
                    </Drawer>
                  </Stack>


                </Center>
              )}
            </NowPlayingOverlay>
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
            <FavoriteButton song={currentTrack}/>
            <ActionIcon variant="subtle" px={0}
              size="md" radius="lg" onClick={(e) => doNoExpandAndPlay(e)}>
              {isLoading ? <Loader size={'2rem'}/> :  isPlaying ? <IconPlayerPauseFilled size={'2rem'} stroke={1.5} /> : <IconPlayerPlayFilled size={'2rem'} stroke={1.5} />}
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
