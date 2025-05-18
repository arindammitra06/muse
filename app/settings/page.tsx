'use client'

import { Box, Stack, useMantineTheme, Title, Switch, ActionIcon, useComputedColorScheme, useMantineColorScheme, Text, Paper, Button, Checkbox, Group, Modal, Menu, ScrollArea } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import SettingsList from '@/components/SettingsList/SettingsList';
import { ThemeDropdown } from '@/components/Common/themeDropdown';
import { IconSun, IconMoon, IconLanguage, IconBrandYoutube, IconCheck, IconDownload } from '@tabler/icons-react';
import { setDarkTheme, setDownloadQuality, setSelectedLanguages, setStreamingQuality, setSwipeGesture } from '@/store/slices/settings.slice';
import { useRouter } from 'next/navigation';
import { modals } from '@mantine/modals';
import { useDisclosure } from '@mantine/hooks';
import { languages } from '@/utils/generic.utils';
import { RootState } from '@/store/store';
import { AppTitles } from '@/components/Common/custom-title';
import {  syncPlaylistWithFirestore } from '@/utils/playlistHooks';
import { clearNowPlayinglist } from '@/store/slices/player.slice';
import { setPageTitle } from '@/store/slices/pageTitleSlice';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/utils/useAuth';


export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const { isDarkTheme, streamingQuality, downloadQuality } = useAppSelector((state) => state.settings);
  const { allowSwipeGesture } = useAppSelector((state) => state.settings) ?? false;
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const userPlaylist = useAppSelector((s) => s.playlist.userPlaylist);
  const router = useRouter();
  const { logout } = useAuth();
  useEffect(() => {
    dispatch(setPageTitle('Settings'));
  },
    [dispatch]);

  const goToUrl = (url: string) => {
    router.push(url);
  };

  const openClearCacheModal = () =>
    modals.openConfirmModal({
      title: 'Clear current playing session?',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to clear all currently playing songs? This does'nt clear your settings or playlists.
        </Text>
      ),
      labels: { confirm: 'Clear', cancel: "Discard" },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => dispatch(clearNowPlayinglist()),
    });

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
    <Box p="0" pb={150}>
      <Stack gap="8" mt={10}>
        <Paper
          mx={'xs'}
          withBorder
          shadow="sm"
        >
          <AppTitles title={'Theme'} px={'xs'} />
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
          <AppTitles title={'Music & Playback'}px={'xs'}  />
          <SettingsList title={'Music Language'} subtitle='My preferred language for music'
            rightElement={<LanguageSelectorModal />} onClick={undefined} />

          <SettingsList title={'Streaming Quality'} subtitle='Higher quality uses more data'
            rightElement={<>
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon
                    variant="default"
                    size="md"
                    aria-label="Select Quality">
                    <IconBrandYoutube stroke={1.5}></IconBrandYoutube>
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  {['96 kbps', '160 kbps', '320 kbps'].map((val, index) => {
                    return (<Menu.Item
                      key={index}
                      rightSection={val === streamingQuality ? <IconCheck size={14} /> : null}
                      onClick={() => dispatch(setStreamingQuality(val))}>
                      {val}
                    </Menu.Item>)
                  })}

                </Menu.Dropdown>
              </Menu></>} onClick={undefined} />


          <SettingsList title={'Download Quality'} subtitle='Higher quality uses more disk space'
            rightElement={<>
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon
                    variant="default"
                    size="md"
                    aria-label="Select Quality">
                    <IconDownload stroke={1.5}></IconDownload>
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  {['96 kbps', '160 kbps', '320 kbps'].map((val, index) => {
                    return (<Menu.Item
                      key={index}
                      rightSection={val === downloadQuality ? <IconCheck size={14} /> : null}
                      onClick={() => dispatch(setDownloadQuality(val))}>
                      {val}
                    </Menu.Item>)
                  })}

                </Menu.Dropdown>
              </Menu></>} onClick={undefined} />


        </Paper>

        <Paper
          mx={'xs'}
          withBorder
          shadow="sm"
        >
          <AppTitles title={'Backup & Clear'} px={'xs'} />

          <SettingsList title={'Clear current session'} subtitle='Clears currently playing songs'
            rightElement={<></>} onClick={() => openClearCacheModal()} />

          <SettingsList title={'Sync playlist to cloud'} subtitle='Saves favorites, custom playlists to firebase cloud'
            rightElement={<></>} onClick={() => currentUser?.uid ? saveToCloudModal() : toast.error('Signin with google to allow sync')}/>

        </Paper>

        <Paper
          mx={'xs'}
          withBorder
          shadow="sm"
        >
          <AppTitles title={'Others'} px={'xs'} />
          <SettingsList title={'Swipe Gesture'} subtitle='Turn off swipe gesture for Now Playing Bar if broken'
            rightElement={<Checkbox
              checked={allowSwipeGesture===undefined? true : allowSwipeGesture}
              onChange={(event) => dispatch(setSwipeGesture(event.currentTarget.checked))}
            />} onClick={undefined} />
          <SettingsList title={'More Info'} subtitle='' rightElement={<></>} onClick={() => goToUrl('/abouts')} />

          <SettingsList title={'Logout'} subtitle='' rightElement={<></>} onClick={() => logout()} />
        </Paper>
      </Stack>
    </Box>
  );
}


function ThemeCheckboxPage() {
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

function LanguageSelectorModal() {
  const [opened, { open, close }] = useDisclosure(false);
  const dispatch = useAppDispatch();
  const selectedLanguages = useAppSelector((state: RootState) => state.settings.selectedLanguages) ?? [];


  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      dispatch(setSelectedLanguages(selectedLanguages.filter((l: string) => l !== lang)));
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
          {languages.map((lang: string) => (
            <Checkbox
              key={lang}
              label={lang}
              checked={selectedLanguages !== undefined && selectedLanguages.includes(lang)}
              onChange={() => toggleLanguage(lang)}
              size="md"
            />
          ))}
        </Stack>
      </Modal>
    </>
  );
}