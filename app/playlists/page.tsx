'use client'

import { Box, Stack, useMantineTheme, ActionIcon, Image, Text, Paper, Button, Group, TextInput, Menu } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { IconPlus, IconTrash, IconClearAll, IconDotsVertical } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { modals } from '@mantine/modals';
import { useEffect, useState } from 'react';
import { createPlaylist, clearPlaylist, deletePlaylist } from '@/store/slices/playlist.slice';
import { v4 as uuidv4 } from 'uuid';
import musicPlaceholder from '../../assets/images/music_placeholder.png';
import { AppTitles } from '@/components/Common/custom-title';
import { useDisclosure } from '@mantine/hooks';
import SortablePlaylistDrawer from '@/components/SortablePlaylistViewer/SortablePlaylistViewer';
import { setPageTitle } from '@/store/slices/pageTitleSlice';
import { capitalizeFirst } from '@/utils/generic.utils';

export default function PlaylistManager() {
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const router = useRouter();
  const playlists = useAppSelector((state) => state.playlist.userPlaylist);
  const isDarkTheme = useAppSelector((state) => state.settings.isDarkTheme);
  const otherPlaylists = playlists.filter((p) => p.id !== 'favorites');
  const favorites = playlists.find((p) => p.id === 'favorites');
  const [
    drawerOpened,
    { open: openDrawer, close: closeDrawer },
  ] = useDisclosure(false);


  const [playlistId, setPlaylistId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(setPageTitle(capitalizeFirst('playlist')));

  }, [dispatch]);


  const openPlaylist = (id: string) => {
    setPlaylistId(id);
    openDrawer();
  };

  function showCreatePlaylistModal() {
    modals.open({
      title: 'Add Playlist Name',
      centered: true,
      children: <CreatePlaylistForm />,
    });
  }
  const openDeleteModal = (id: string, name: string) =>
    modals.openConfirmModal({
      title: 'Delete Playlist?',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete the playlist - {name}?
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: "No" },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => dispatch(deletePlaylist(id)),
    });

  const openClearModal = (id: string, name: string) =>
    modals.openConfirmModal({
      title: 'Clear Playlist?',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to clear all tracks from playlist - {name}?
        </Text>
      ),
      labels: { confirm: 'Clear', cancel: "No" },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => dispatch(clearPlaylist(id)),
    });

  return (
    <Box p="xs">
      {playlistId && (
        <SortablePlaylistDrawer
          playlistId={playlistId}
          drawerOpened={drawerOpened}
          closeDrawer={() => closeDrawer()}
        />
      )}

      <Group justify="space-between">
        <AppTitles title={'My Playlists'} />
        <Button
          size="xs"
          rightSection={<IconPlus size={16} />}
          radius="md"
          onClick={() => showCreatePlaylistModal()}>
          Create Playlist
        </Button>
      </Group>

      <Stack mt="sm" gap="sm">
        {favorites && (
          <Paper shadow="xs" p="5" withBorder onClick={() => openPlaylist('favorites')}>
            <Group justify="space-between">
              <Group p={0}>
                <Image src={musicPlaceholder.src} radius="md" w={50} h={50} />
                <Text fw={600}>Favorites</Text>
              </Group>

              <Group>
                <Text size="sm" fw={500} c="dimmed">{favorites.tracks.length} Tracks</Text>
                <Menu shadow="md">
                  <Menu.Target>
                    <ActionIcon variant="transparent" color="gray" ><IconDotsVertical /></ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item onClick={() => openClearModal('favorites', 'Favorites')} leftSection={<IconClearAll size={14} />}>
                      Clear Tracks
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Group>
          </Paper>
        )}

        {otherPlaylists.map((playlist) => (
          <Paper key={playlist.id} shadow="xs" p="5" withBorder onClick={() => openPlaylist(playlist.id)}>
            <Group justify="space-between" wrap="nowrap">
              {/* Playlist Image and Name */}
              <Group p={0} wrap="nowrap" style={{ minWidth: 0 }}>
                <Image
                  src={
                    playlist?.image ?? musicPlaceholder.src
                  }
                  radius="md"
                  w={50}
                  h={50}
                />
                <Text
                  fw={600}
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 180, // adjust based on your layout
                  }}
                >
                  {playlist.name}
                </Text>
              </Group>

              {/* Tracks count and menu */}
              <Group wrap="nowrap">
                <Text size="sm" fw={500} c="dimmed" style={{ whiteSpace: 'nowrap' }}>
                  {playlist.tracks.length} Tracks
                </Text>
                <Menu shadow="md">
                  <Menu.Target>
                    <ActionIcon variant="transparent" color="gray">
                      <IconDotsVertical />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      onClick={() => openClearModal(playlist.id, playlist.name)}
                      leftSection={<IconClearAll size={14} />}
                    >
                      Clear Tracks
                    </Menu.Item>
                    <Menu.Item
                      color="red"
                      onClick={() => openDeleteModal(playlist.id, playlist.name)}
                      leftSection={<IconTrash size={14} />}
                    >
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}

export function CreatePlaylistForm() {
  const [playlistName, setPlaylistName] = useState('');
  const dispatch = useAppDispatch();

  useEffect(() => {
    setPlaylistName(''); // resets on mount
  }, []);

  return (
    <Stack>
      <TextInput
        placeholder="Add Playlist Name"
        value={playlistName}
        radius={'sm'}
        onChange={(e) => setPlaylistName(e.currentTarget.value)}
        data-autofocus />
      <Button
        radius={'md'}
        fullWidth
        onClick={() => {
          if (playlistName.trim()) {
            dispatch(createPlaylist({ id: uuidv4(), name: playlistName.trim(), image: null }));
            setPlaylistName('');
          }
          modals.closeAll()
        }
        } mt="md">
        Submit
      </Button>
    </Stack>
  );
}
