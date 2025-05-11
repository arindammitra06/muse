'use client'

import { Box, Stack, useMantineTheme, Title, Switch, ActionIcon, Image, useMantineColorScheme, Text, Paper, Button, Checkbox, Group, Modal, Badge, TextInput, SimpleGrid, Tooltip, Menu } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import SettingsList from '@/components/SettingsList/SettingsList';
import { ThemeDropdown } from '@/components/Common/themeDropdown';
import { IconSun, IconMoon, IconLanguage, IconPlus, IconTrash, IconClearAll, IconArrowsLeftRight, IconDotsVertical, IconMessageCircle, IconPhoto, IconSearch, IconSettings, IconHeart, IconChevronRight, IconRefresh, IconHistory, IconDownload, IconPlaylist } from '@tabler/icons-react';
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

export default function Library() {
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const router = useRouter();
  const playlists = useAppSelector((state) => state.playlist.userPlaylist);
  const otherPlaylists = playlists.filter((p) => p.id !== 'favorites');
  const favorites = playlists.find((p) => p.id === 'favorites');

  return (
    <Box p="xs">
      <Group justify="space-between">
        <AppTitles title={'Library'} />
      </Group>

      <Stack mt="xs" gap="xs">

        <Paper shadow="xs" p="5" withBorder >
          <Group justify="space-between">
            <Group p={'sm'}>
              <IconHistory size={'1.5rem'} />
              <Text fw={600}>Last Session</Text>
            </Group>
            <IconChevronRight size={'1.5rem'} color='gray' />
          </Group>
        </Paper>

        <Paper shadow="xs" p="5" withBorder >
          <Group justify="space-between">
            <Group p={'sm'}>
              <IconHeart size={'1.5rem'} />
              <Text fw={600}>Favorites</Text>
            </Group>
            <IconChevronRight size={'1.5rem'} color='gray' />
          </Group>
        </Paper>

        <Paper shadow="xs" p="5" withBorder >
          <Group justify="space-between">
            <Group p={'sm'}>
              <IconDownload size={'1.5rem'} />
              <Text fw={600}>Downloads</Text>
            </Group>
            <IconChevronRight size={'1.5rem'} color='gray' />
          </Group>
        </Paper>

        <Paper shadow="xs" p="5" withBorder onClick={()=>router.push("/playlists")}>
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
