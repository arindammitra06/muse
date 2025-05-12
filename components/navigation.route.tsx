'use client'
import { AppShell, ActionIcon, Box, TextInput, Transition, useMantineTheme, Paper, Flex, Burger, Skeleton, Stack } from '@mantine/core';
import { ReactNode, useEffect, useState } from 'react';
import { AppLogo } from './Common/custom-logo.component';
import { IconSearch, IconX } from '@tabler/icons-react';
import { NowPlayingBar } from './NowPlaying/NowPlayingBar';
import { usePathname, useRouter } from 'next/navigation';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { NavbarMinimal } from './Navbar/NavbarMinimal';
import { FadingWeightLogo } from './Common/FadingWeightLogo';
import { BottomNavigation } from './BottomNavigation/BottomNavigation';
export interface NavigationProps {
  children: ReactNode;
};

export default function Navigation({ children }: NavigationProps) {
  const pathname = usePathname();
  const [isSticky, setIsSticky] = useState(false);
  const theme = useMantineTheme();
  const router = useRouter();
  const [opened, { toggle }] = useDisclosure();
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.sm})`);


  const handleBack = () => {
    router.back();
  };

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
          px="xs"
        >
          <Flex justify="flex-start" align="flex-start" p={0}>
            <FadingWeightLogo text="muse" />
          </Flex>
          <Flex justify="flex-end" align="flex-end" w="100%">
            <Transition mounted={isSticky}
              transition="slide-up"
              duration={150}
              timingFunction="ease"
              keepMounted>
              {(styles) => (
                pathname === '/' ? <Box ml="auto" style={styles} maw={300} w="100%">
                  <Paper radius={'xl'} shadow="md" p={0} style={{ boxShadow: '0 4px 12px rgba(93, 92, 92, 0.3)' }}>
                    <TextInput
                      readOnly
                      onClick={() => router.push(`/search`)}
                      placeholder="Songs, albums or artists"
                      leftSection={<IconSearch size={20} color={theme.colors[theme.primaryColor][5]} />}
                      size="sm"
                      variant="filled"
                      radius="xl"
                      mx={0}
                      my={0}
                    />
                  </Paper>
                </Box> : <></>
              )}
            </Transition>
            {pathname !== '/' && <ActionIcon variant="light" color="gray" size="lg" radius="lg" onClick={() => handleBack()}>
              <IconX size={'1.5rem'} stroke={2.5} />
            </ActionIcon>}
          </Flex>
        </Flex>

      </AppShell.Header>

      {isDesktop && (<AppShell.Navbar p="0" w={50}>
        <NavbarMinimal toggle={toggle} />
      </AppShell.Navbar>)}

      <AppShell.Main>
        {pathname === '/' && !isSticky && (
          <Paper radius={'xl'} shadow="md" p={0} m={'xs'} style={{ boxShadow: '0 4px 12px rgba(93, 92, 92, 0.3)' }}>
            <TextInput
              readOnly
              onClick={() => router.push(`/search`)}
              placeholder="Songs, albums or artists"
              leftSection={<IconSearch size={20} color={theme.colors[theme.primaryColor][5]} />}
              size="md"
              variant="filled"
              radius="xl"
              mx={0}
            /></Paper>
        )}

        {children}

      </AppShell.Main>
      <AppShell.Footer ml={{ base: 0, sm: '50px' }} style={{ padding: '0px', borderTop: '0px' }}>
        <Stack gap="0" m={0}>
          <NowPlayingBar />
          {!isDesktop && <BottomNavigation />}
        </Stack>
      </AppShell.Footer>
    </AppShell>
  );
}