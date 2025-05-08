'use client';
import { useState } from 'react';
import {
  IconCalendarStats,
  IconDeviceDesktopAnalytics,
  IconDownload,
  IconFingerprint,
  IconGauge,
  IconHome2,
  IconLogout,
  IconPlaylist,
  IconSearch,
  IconSettings,
  IconSwitchHorizontal,
  IconUser,
} from '@tabler/icons-react';
import { Center, Stack, Tooltip, UnstyledButton } from '@mantine/core';

import classes from './NavbarMinimal.module.css';
import { AppLogo } from '../Common/custom-logo.component';


import { usePathname, useRouter } from 'next/navigation';

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?: () => void;
  href: string;
  toggle:()=>{};
}

function NavbarLink({ icon: Icon, label,  href, toggle}: NavbarLinkProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = pathname === href;
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton 
      onClick={() => {router.push(href); toggle()}}
      style={(theme) => ({
        borderRadius: theme.radius.sm,
        color: isActive ? theme.colors[theme.primaryColor][5] : 'gray',
        fontWeight: isActive ? 600 : 400,
        marginBottom: '10px',
        '&:hover': {
          backgroundColor: theme.colors[theme.primaryColor][1],
          color: theme.colors[theme.primaryColor][7],
        },
      })}>
        <Icon size={30} stroke={2} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: 'Home', href:'/' },
  { icon: IconSearch, label: 'Search' , href:'/search'},
  { icon: IconPlaylist, label: 'Playlists' , href:'/playlists'},
  { icon: IconSettings, label: 'Settings' , href:'/settings'},
];

export function NavbarMinimal({toggle}:any) {
  const [active, setActive] = useState(2);

  const links = mockdata.map((link, index) => (
    <NavbarLink
      href={link.href}
      key={link.label}
      icon={link.icon} 
      label={link.label} 
      toggle={toggle}   />
  ));

  return (
    <nav className={classes.navbar}>
      
      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink icon={IconLogout} label="Logout" href={''} toggle={toggle} />
      </Stack>
    </nav>
  );
}