'use client'

import { Box, Stack, useMantineTheme, Text, Paper, Group, ActionIcon, Button, Drawer, Flex, rem, SimpleGrid, Title } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { IconHeart, IconChevronRight, IconHistory, IconDownload, IconPlaylist, IconPlayerPlay, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { AppTitles } from '@/components/Common/custom-title';
import { useDisclosure } from '@mantine/hooks';
import SortablePlaylistDrawer from '@/components/SortablePlaylistViewer/SortablePlaylistViewer';
import { closestCenter, DndContext, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableSongBar } from '@/components/SongBar/SortableSongBar';
import { updatePlaylistOrder } from '@/store/slices/playlist.slice';
import { restrictToVerticalAxis, restrictToParentElement, restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { reorderPlaylist } from '@/store/slices/player.slice';
import { SkeletonSongBar } from '@/components/SongBar/SongBar';
import SortableSessionDrawer from '@/components/SongBar/SortablePlaylist';
import { setPageTitle } from '@/store/slices/pageTitleSlice';
import { capitalizeFirst } from '@/utils/generic.utils';
import { useEffect } from 'react';

export default function Library() {
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const router = useRouter();
  const { playlist, currentTrackIndex, isPlaying } = useAppSelector(s => s.player);

  useEffect(() => {
    dispatch(setPageTitle(capitalizeFirst('library')));

  }, [dispatch]);



  const [
    drawerOpened,
    { open: openDrawer, close: closeDrawer },
  ] = useDisclosure(false);


  const openSessionPage = () => {
    openDrawer();
  };


  return (
    <Box p="xs">
      <Group justify="space-between">
        <AppTitles title={'Library'} />
      </Group>
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
              <SkeletonSongBar count={8} />
            }
          </Stack>
        </div>
      </Drawer>
      <Stack mt="xs" gap="xs">

        <Paper shadow="xs" p="5" withBorder onClick={() => openSessionPage()}>
          <Group justify="space-between">
            <Group p={'sm'}>
              <IconHistory size={'1.5rem'} />
              <Text fw={600}>Last Session</Text>
            </Group>
            <IconChevronRight size={'1.5rem'} color='gray' />
          </Group>
        </Paper>



        <Paper shadow="xs" p="5" withBorder onClick={() => router.push("/playlists")}>
          <Group justify="space-between">
            <Group p={'sm'}>
              <IconPlaylist size={'1.5rem'} />
              <Text fw={600}>Playlists</Text>
            </Group>
            <IconChevronRight size={'1.5rem'} color='gray' />
          </Group>
        </Paper>

      </Stack>
    </Box>
  );
}
