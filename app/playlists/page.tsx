'use client'

import { Box, Stack, useMantineTheme, Title, Switch, ActionIcon, Image, useMantineColorScheme, Text, Paper, Button, Checkbox, Group, Modal, Badge, TextInput, SimpleGrid, Tooltip } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import SettingsList from '@/components/SettingsList/SettingsList';
import { ThemeDropdown } from '@/components/Common/themeDropdown';
import { IconSun, IconMoon, IconLanguage, IconPlus, IconTrash, IconClearAll } from '@tabler/icons-react';
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

export default function PlaylistManager() {
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const router = useRouter();
  const playlists = useAppSelector((state) => state.playlist.userPlaylist);

  const otherPlaylists = playlists.filter((p) => p.id !== 'favorites');
  const favorites = playlists.find((p) => p.id === 'favorites');


  const goToUrl = (url: string) => {
    router.push(url);
  };

  function showCreatePlaylistModal() {
    modals.open({
      title: 'Add Playlist Name',
      centered: true,
      children: <CreatePlaylistForm />,
    });
  }
  const openDeleteModal = (id:string, name:string) =>
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

    const openClearModal = (id:string, name:string) =>
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
        <Title order={3} c={theme.primaryColor} >My Playlists</Title>
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
          <Paper shadow="xs" p="5" withBorder bg="yellow.0">
            <Group justify="space-between">
              <SimpleGrid cols={1} spacing={1}>
              <Text fw={600}>❤️ Favorites </Text>
                <Badge ml={20} color="pink" radius={'xs'} variant="light">{favorites.tracks.length} songs</Badge>
              </SimpleGrid>
              <Tooltip label={'Clear All Tracks'}  transitionProps={{ duration: 0 }}>
                <ActionIcon size="md" color="orange" variant="light" onClick={() => openClearModal('favorites', 'Favorites')}>
                  <IconClearAll size={'1.5rem'} stroke={1.5}/>
                </ActionIcon>
                </Tooltip>
              </Group>
          </Paper>
        )}

        {otherPlaylists.map((playlist) => (
          <Paper key={playlist.id} shadow="xs" p="5" withBorder>
            <Group justify="space-between">
              <Group p={0}>
                <Image src={playlist !== null && playlist !== undefined && playlist.image!== null && playlist.image !== undefined 
                    ?  playlist.image : musicPlaceholder.src} radius="md" w={50} h={50} />
                  <Text fw={600}>{playlist.name}</Text>
                </Group>
              <Group>
                <Text size="sm" fw={500} c="dimmed">{playlist.tracks.length} Tracks</Text>
                <Tooltip label={'Clear All Tracks'}  transitionProps={{ duration: 0 }}>
                <ActionIcon size="md" color="orange" variant="light" onClick={() => openClearModal(playlist.id, playlist.name)}>
                  <IconClearAll size={'1.5rem'} stroke={1.5}/>
                </ActionIcon>
                </Tooltip>
                
                <Tooltip label={'Delete Playlist'}  transitionProps={{ duration: 0 }}>
                <ActionIcon size="md" color="red" variant="filled" onClick={() => openDeleteModal(playlist.id, playlist.name)}>
                  <IconTrash size={'1.5rem'} stroke={1.5}/>
                </ActionIcon>
                </Tooltip>
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
            dispatch(createPlaylist({ id: uuidv4(), name: playlistName.trim() , image: null}));
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