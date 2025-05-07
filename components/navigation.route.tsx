'use client'
import { AppShell, ActionIcon, Box, TextInput, Transition, useMantineTheme, Paper, Flex } from '@mantine/core';
import { ReactNode, useEffect, useState } from 'react';
import { AppLogo } from './Common/custom-logo.component';
import { IconSearch, IconX } from '@tabler/icons-react';
import { NowPlayingBar } from './NowPlaying/NowPlayingBar';
import { usePathname, useRouter } from 'next/navigation';
export interface NavigationProps {
  children: ReactNode;
};

export default function Navigation({ children }: NavigationProps) {
  const pathname = usePathname();
  const [isSticky, setIsSticky] = useState(false);
  const theme = useMantineTheme();
  const router = useRouter();
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
      padding="0"
    >


      <AppShell.Header>
        <Flex
          justify="space-between"
          align="center"
          h="100%"
          px="md"
        >
          <AppLogo logoPath={''} alt={''} size={''} />

          <Flex justify="flex-end" align="flex-end" w="100%">
              <Transition mounted={isSticky} transition="slide-up" duration={200}>
              {(styles) => (
                pathname === '/' ? <Box ml="auto" style={styles} maw={300} w="100%">
                  <Paper shadow="md" p={0} style={{ boxShadow: '0 4px 12px rgba(93, 92, 92, 0.3)' }}>
                    <TextInput
                      onClick={() => router.push(`/search`)}
                      placeholder="Songs, albums or artists"
                      leftSection={<IconSearch size={20} color={theme.primaryColor} />}
                      size="sm"
                      variant="filled"
                      radius="sm"
                      mx={0}
                      my={0}
                    />
                  </Paper>
                </Box> : <></>
              )}
            </Transition>
            {pathname !== '/' && <ActionIcon variant="light" color="gray" size="lg" radius="lg" onClick={()=>handleBack()}>
              <IconX size={'1.5rem'} stroke={2.5}/>
            </ActionIcon>}
          </Flex>
        </Flex>



        {/* <ThemeDropdown />
          <ActionIcon
            onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
            variant="subtle"
            size="md"
            aria-label="Toggle color scheme"
          >
            <IconSunFilled className={cx(classes.icon, classes.light)} stroke={1.5} />
            <IconMoonFilled className={cx(classes.icon, classes.dark)} stroke={1.5} />
          </ActionIcon> */}
      </AppShell.Header>
      <AppShell.Main>
        {pathname === '/' && (
          <Paper shadow="md" p={0} m={'xs'} style={{ boxShadow: '0 4px 12px rgba(93, 92, 92, 0.3)' }}>
            <TextInput
              onClick={() => router.push(`/search`)}
              placeholder="Songs, albums or artists"
              leftSection={<IconSearch size={20} color={theme.primaryColor} />}
              size="md"
              variant="filled"
              radius="sm"
              mx={0}
            /></Paper>
        )}

        {children}
      </AppShell.Main>
      <AppShell.Footer style={{ padding: '0px', borderTop: '0px' }}>
        <NowPlayingBar />
      </AppShell.Footer>
    </AppShell>
  );
}