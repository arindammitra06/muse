'use client'

import { Box, Stack, useMantineTheme, Title, Switch, ActionIcon, useComputedColorScheme, useMantineColorScheme, Text, Paper, Button, Checkbox, Group, Modal } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import SettingsList from '@/components/SettingsList/SettingsList';
import { ThemeDropdown } from '@/components/Common/themeDropdown';
import { IconSun, IconMoon, IconLanguage } from '@tabler/icons-react';
import { setDarkTheme, setSelectedLanguages } from '@/store/slices/settings.slice';
import { useRouter } from 'next/navigation';
import { modals } from '@mantine/modals';
import { useDisclosure } from '@mantine/hooks';
import { languages } from '@/utils/generic.utils';
import { RootState } from '@/store/store';


export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const { isDarkTheme } = useAppSelector((state) => state.settings);
  const router = useRouter();


  const goToUrl = (url: string) => {
    router.push(url);
  };

  const openClearCacheModal = () =>
    modals.openConfirmModal({
      title: 'Clear all cache?',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to clear all cache and logout? This removes all your favorites, playlists, sessions and preferences.
        </Text>
      ),
      labels: { confirm: 'Clear', cancel: "Discard" },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => console.log('Confirmed'),
    });

  return (
    <Box p="0">
      <Stack gap="8" mt={10}>
        <Paper
          mx={'xs'}
          withBorder
          shadow="sm"
        >
          <Title order={3} c={theme.primaryColor} ml={'sm'} mt={'xs'}>
            Theme
          </Title>
          <SettingsList title={'Dark Mode'} subtitle='Select muse theme'
            rightElement={<ThemeCheckboxPage />} onClick={undefined} />

          <SettingsList title={'Primary Color'} subtitle='Main accent color in theme' 
          rightElement={<ThemeDropdown />} onClick={undefined} />
        </Paper>

        <Paper
          mx={'xs'}
          withBorder
          shadow="sm"
        >
          <Title order={3} c={theme.primaryColor} ml={'sm'} mt={'xs'}>
            Music & Playback
          </Title>
          <SettingsList title={'Music Language'} subtitle='My preferred language for music'
            rightElement={<LanguageSelectorModal/>} onClick={undefined} />

          <SettingsList title={'Streaming Quality'} subtitle='Higher quality uses more data'
            rightElement={<></>} onClick={undefined} />

          <SettingsList title={'Retain Session'} subtitle='Add all played songs/playlist to session'
            rightElement={<></>} onClick={undefined} />
        </Paper>

        <Paper
          mx={'xs'}
          withBorder
          shadow="sm"
        >
          <Title order={3} c={theme.primaryColor} ml={'sm'} mt={'xs'}>
            Backup & Clear
          </Title>
          <SettingsList title={'Clear Cache'} subtitle='Deletes all cache and logs you out'
            rightElement={<></>} onClick={() => openClearCacheModal()} />
        </Paper>

        <Paper
          mx={'xs'}
          withBorder
          shadow="sm"
        >
          <Title order={3} c={theme.primaryColor} ml={'sm'} mt={'xs'} >
            About
          </Title>
          <SettingsList title={'More Info'} subtitle='' rightElement={<></>} onClick={() => goToUrl('/abouts')} />
        </Paper>
      </Stack>
    </Box>
  );
}


export function ThemeCheckboxPage() {
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const { isDarkTheme } = useAppSelector((state) => state.settings);
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });


  function changeTheme(): void {
    dispatch(setDarkTheme(!isDarkTheme));
    setColorScheme(isDarkTheme ? 'dark' : 'light')
  }

  return (
    <ActionIcon
      onClick={() => changeTheme()}
      variant="default"
      size="md"
      aria-label="Toggle color scheme"
    >
      {!isDarkTheme ? <IconSun stroke={1.5} /> : <IconMoon stroke={1.5} />}

    </ActionIcon>
  );
}

export function LanguageSelectorModal() {
  const [opened, { open, close }] = useDisclosure(false);
  const dispatch = useAppDispatch();
  const selectedLanguages = useAppSelector((state: RootState) => state.settings.selectedLanguages) ?? [];
  console.log(selectedLanguages);

  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      dispatch(setSelectedLanguages(selectedLanguages.filter((l) => l !== lang)));
    } else {
      dispatch(setSelectedLanguages([...selectedLanguages, lang]));
    }
  };

  return (
    <>
      <ActionIcon
        onClick={open}
        variant="default"
        size="md"
        aria-label="Select Languages">
          <IconLanguage stroke={1.5}></IconLanguage>
        </ActionIcon>
      <Modal
        opened={opened}
        onClose={close}
        title="Select Preferred Music Languages"
        size="md"
        radius="lg"
        centered
        overlayProps={{ blur: 4 }}
        transitionProps={{ transition: 'pop', duration: 200 }}
      >
        <Stack gap="sm">
          {languages.map((lang:string) => (
            <Checkbox
              key={lang}
              label={lang}
              checked={selectedLanguages!==undefined && selectedLanguages.includes(lang)}
              onChange={() => toggleLanguage(lang)}
              size="md"
            />
          ))}
        </Stack>
      </Modal>
    </>
  );
}