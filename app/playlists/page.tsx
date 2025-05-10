'use client'

import { Box, Stack, useMantineTheme, Title, Switch, ActionIcon, Image, useMantineColorScheme, Text, Paper, Button, Checkbox, Group, Modal, Badge, TextInput, SimpleGrid, Tooltip, Menu } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import SettingsList from '@/components/SettingsList/SettingsList';
import { ThemeDropdown } from '@/components/Common/themeDropdown';
import { IconSun, IconMoon, IconLanguage, IconPlus, IconTrash, IconClearAll, IconArrowsLeftRight, IconDotsVertical, IconMessageCircle, IconPhoto, IconSearch, IconSettings } from '@tabler/icons-react';
import { setDarkTheme, setSelectedLanguages } from '@/store/slices/settings.slice';
import { useRouter } from 'next/navigation';
import { modals } from '@mantine/modals';
import { useDisclosure } from '@mantine/hooks';
import { languages } from '@/utils/generic.utils';
import { RootState } from '@/store/store';
import { useEffect, useState } from 'react';
import { createPlaylist, clearPlaylist, deletePlaylist } from '@/store/slices/playlist.slice';
import { v4 as uuidv4 } from 'uuid';
import musicPlaceholder from '../../assets/images/music_placeholder.png';
import { AppTitles } from '@/components/Common/custom-title';

export default function PlaylistManager() {
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const router = useRouter();
  const playlists = useAppSelector((state) => state.playlist.userPlaylist);
  const isDarkTheme = useAppSelector((state) => state.settings.isDarkTheme);
  const otherPlaylists = playlists.filter((p) => p.id !== 'favorites');
  const favorites = playlists.find((p) => p.id === 'favorites');




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
      <Group justify="space-between">
        <AppTitles title={'My Playlists'} />
        <Button
          size="xs"
          rightSection={<IconPlus size={16} />}
          radius="md"
          color={theme.colors.secondary[5]}
          onClick={() => showCreatePlaylistModal()}>
          Create Playlist
        </Button>
      </Group>

      <Stack mt="xl" gap="sm">
        {favorites && (
          <Paper shadow="xs" p="5" withBorder bg={isDarkTheme ? theme.colors.secondary[0]: theme.colors.secondary[9]}>
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
          <Paper key={playlist.id} shadow="xs" p="5" withBorder>
            <Group justify="space-between">
              <Group p={0}>
                <Image src={playlist !== null && playlist !== undefined && playlist.image !== null && playlist.image !== undefined
                  ? playlist.image : musicPlaceholder.src} radius="md" w={50} h={50} />
                <Text fw={600}>{playlist.name}</Text>
              </Group>
              <Group>
                <Text size="sm" fw={500} c="dimmed">{playlist.tracks.length} Tracks</Text>
                <Menu shadow="md">
                  <Menu.Target>
                    <ActionIcon variant="transparent" color="gray" ><IconDotsVertical /></ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item onClick={() => openClearModal(playlist.id, playlist.name)} leftSection={<IconClearAll size={14} />}>
                      Clear Tracks
                    </Menu.Item>
                    <Menu.Item
                      color="red" onClick={() => openDeleteModal(playlist.id, playlist.name)}
                      leftSection={<IconTrash size={14} />}  >
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

function CreatePlaylistForm() {
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