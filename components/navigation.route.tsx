'use client'
import { AppShell, ActionIcon, Box, TextInput, Transition, useMantineTheme, Paper, Flex, Text, Skeleton, Stack, Avatar, Group, Menu, UnstyledButton, Space, ScrollArea } from '@mantine/core';
import { ReactNode, useEffect, useState } from 'react';
import { AppLogo } from './Common/custom-logo.component';
import { IconChevronLeft, IconLogin, IconLogout, IconSearch, IconUserQuestion, IconX } from '@tabler/icons-react';
import { NowPlayingBar } from './NowPlaying/NowPlayingBar';
import { usePathname, useRouter } from 'next/navigation';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { NavbarMinimal } from './Navbar/NavbarMinimal';
import { FadingWeightLogo } from './Common/FadingWeightLogo';
import { BottomNavigation } from './BottomNavigation/BottomNavigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useAuth } from '@/utils/useAuth';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import OfflinePage from './Offline/OfflinePage';
import { useNetworkListener } from '@/utils/useNetworkListener';
import SignInPage from './Login/LoginPage';
import { modals } from '@mantine/modals';
export interface NavigationProps {
  children: ReactNode;
};

export default function Navigation({ children }: NavigationProps) {
  useNetworkListener();
  const pathname = usePathname();
  const [isSticky, setIsSticky] = useState(false);
  const theme = useMantineTheme();
  const router = useRouter();
  const [opened, { toggle }] = useDisclosure();
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.sm})`);
  const playlist = useAppSelector((state) => state.player.playlist);
  const user = useAppSelector((state) => state.user.currentUser);
  const { logout } = useAuth();
  const pageTitle = useSelector((state: RootState) => state.pageTitle.title);
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const isOnline = useAppSelector((state: RootState) => state.network.isOnline);

  const handleBack = () => {
    router.back();
  };

  const confirmLogout = () =>
    modals.openConfirmModal({
      title: 'Are you sure you want to logout?',
      centered: true,
      children: (
        <Text size="sm">
          This removes all offline & session playlist tracks
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: "Discard" },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => logout(),
    });

  useEffect(() => {
    const handleScroll = () => {
      if (pathname === '/') {
        setIsSticky(window.scrollY > 60);
      }
    };

    if (pathname === '/') {
      window.addEventListener('scroll', handleScroll);
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);


  if (user == undefined || user === null) {
    return <SignInPage />;
  }


  return (
    <AppShell
      header={{ height: 60 }}
      navbar={isDesktop ? { width: 50, breakpoint: 'sm' } : undefined}
      padding="0"
    >


      <AppShell.Header>
        <Flex
          justify="space-between"
          align="center"
          h="100%"
          px="sm"
        >
          <Flex
            justify="left"
            align="center"
            h="100%"
            px="0"
          >
            {pathname !== '/' && <ActionIcon variant="transparent"
              color="gray" size="lg"
              radius="lg" mx={'0'} px={0}
              onClick={() => handleBack()}>
              <IconChevronLeft size={'2rem'} stroke={2} />
            </ActionIcon>
            }

            {pathname === '/' ? <Flex justify="flex-start" align="flex-start" p={0}>
              <FadingWeightLogo text="muse" />
            </Flex> :
              <Flex justify="flex-start" align="flex-start" p={0}>
                <FadingWeightLogo text={pageTitle} />
              </Flex>}
          </Flex>


          {user && <Flex justify="flex-end" align="flex-end" w="100%">
            <Transition mounted={isSticky}
              transition="slide-up"
              duration={150}
              timingFunction="ease"
              keepMounted>
              {(styles) => (
                pathname === '/' ? <Box ml="auto" style={styles} maw={300} w="100%">
                  <Paper radius={'md'} shadow="md" p={0} style={{ boxShadow: '0 4px 12px rgba(93, 92, 92, 0.3)' }}>
                    <TextInput
                      readOnly
                      onClick={() => router.push(`/search`)}
                      placeholder="Songs, albums or artists"
                      leftSection={<IconSearch size={20} color={theme.colors[theme.primaryColor][5]} />}
                      size="sm"
                      variant="filled"
                      radius="md"
                      mx={0}
                      my={0}
                    />
                  </Paper>
                </Box> : <></>
              )}
            </Transition>

          </Flex>}

          <Menu
            width={100}
            position="bottom-end"
            transitionProps={{ transition: 'pop-top-right' }}
            withinPortal
            offset={2}
            withArrow
            arrowPosition="center"

          >

            <Menu.Target>
              <UnstyledButton style={{ paddingRight: '0px', paddingLeft: '6px' }}>
                <Group >
                  {user !== null && user !== undefined
                    && user.photo !== null && user.photo !== undefined && user.photo !== "" ?
                    <Avatar variant="outline" radius="xl" size={'md'} src={user.photo} />
                    :
                    user !== null && user !== undefined && user.name !== null && user.name !== null && user.name !== '' ?
                      <Avatar alt={'user profile'} style={{ padding: '0px' }} radius="xl" size={'md'} variant="filled">
                        {user.name.substring(0, 2)}
                      </Avatar>
                      :
                      <></>
                  }
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown >



              {user !== null && user !== undefined && user.name !== null && user.name !== undefined &&
                <Menu.Item onClick={() => confirmLogout()}>Logout</Menu.Item>

              }
            </Menu.Dropdown>
          </Menu>


        </Flex>

      </AppShell.Header>

      {isDesktop && user && (<AppShell.Navbar p="0" w={50}>
        <NavbarMinimal toggle={toggle} />
      </AppShell.Navbar>)}

      <AppShell.Main >
        <Box style={{ minHeight: '100vh', padding: '0px' }}>
          {pathname === '/' && user && !isSticky && (
            <Paper radius={'md'} shadow="md" p={0} m={'xs'} style={{ boxShadow: '0 4px 12px rgba(93, 92, 92, 0.3)' }}>
              <TextInput
                readOnly
                onClick={() => router.push(`/search`)}
                placeholder="Songs, albums or artists"
                leftSection={<IconSearch size={20} color={theme.colors[theme.primaryColor][5]} />}
                size="md"
                variant="filled"
                radius="md"
                mx={0}
              /></Paper>
          )}

          {isOnline ? children : <OfflinePage />}
        </Box>
      </AppShell.Main>

      <AppShell.Footer ml={{ base: 0, sm: '50px' }} style={{ padding: '0px', borderTop: '0px' }}>
        {user && <Stack gap="0" m={0}>
          {playlist !== null && playlist !== undefined && playlist.length > 0 && <NowPlayingBar />}
          {!isDesktop && <BottomNavigation />}
        </Stack>}
      </AppShell.Footer>
    </AppShell>
  );
}