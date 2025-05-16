'use client'

import { Box, Stack, useMantineTheme, Text, Paper, Group, ActionIcon, Button, Drawer, Flex, rem, SimpleGrid, Title } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { IconHeart, IconChevronRight, IconHistory, IconDownload, IconPlaylist, IconPlayerPlay, IconX, IconRefresh, IconWifiOff } from '@tabler/icons-react';
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
import SortableSessionDrawer from '@/components/SongBar/SortableSessionDrawer';
import { setPageTitle } from '@/store/slices/pageTitleSlice';
import { capitalizeFirst } from '@/utils/generic.utils';
import { useEffect } from 'react';
import { syncPlaylistWithFirestore } from '@/utils/playlistHooks';
import { modals } from '@mantine/modals';
import toast from 'react-hot-toast';
import SortableOfflineDrawer from '@/components/SongBar/SortableOfflineDrawer';

export default function Library() {
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const router = useRouter();
  const { playlist, currentTrackIndex, isPlaying } = useAppSelector(s => s.player);
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const userPlaylist = useAppSelector((s) => s.playlist.userPlaylist);
  const { downloaded } = useAppSelector(s => s.offlineTracks);


  useEffect(() => {
    dispatch(setPageTitle(capitalizeFirst('library')));

  }, [dispatch]);



  const [
    drawerOpened,
    { open: openDrawer, close: closeDrawer },
  ] = useDisclosure(false);

  const [
    drawerOfflineOpened,
    { open: openOfflineDrawer, close: closeOfflineDrawer },
  ] = useDisclosure(false);

  const openSessionPage = () => {
    openDrawer();
  };

  const openOfflinePage = () => {
    openOfflineDrawer();
  };

  const saveToCloudModal = () =>
    modals.openConfirmModal({
      title: 'Sync playlists to cloud?',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to sync playlists to cloud?
        </Text>
      ),
      labels: { confirm: 'Sync', cancel: "Discard" },
      confirmProps: { color: 'green' },
      onCancel: () => console.log('Cancel'),
      onConfirm: async () => {
        await syncPlaylistWithFirestore(currentUser?.uid!, userPlaylist)
      },
    });

  return (
    <Box p="xs">
      <Group justify="space-between">
        <AppTitles title={'My Music'} />
        <Button
          size="xs"
          rightSection={<IconRefresh size={16} />}
          radius="md"
          disabled={currentUser?.uid! ? false : true}
          onClick={() => currentUser?.uid ? saveToCloudModal() : toast.error('Signin with google to allow sync')}>
          Sync Playlists
        </Button>
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

      <Drawer
        opened={drawerOfflineOpened}
        onClose={closeOfflineDrawer}
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
            <SortableOfflineDrawer drawerOpened={drawerOfflineOpened} closeDrawer={closeOfflineDrawer} />
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

        <Paper shadow="xs" p="5" withBorder onClick={() => openOfflinePage()}>
          <Group justify="space-between">
            <Group p={'sm'}>
              <IconWifiOff size={'1.5rem'} />
              <Text fw={600}>Offline</Text>
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
