'use client';
import { useState } from 'react';
import {
  IconHome,
  IconHomeFilled,
  IconLayoutList,
  IconLayoutListFilled,
  IconLogout,
  IconSearch,
  IconSettings,
  IconSettingsFilled,
  IconZoomFilled,
} from '@tabler/icons-react';
import { Stack, Tooltip, UnstyledButton,Text } from '@mantine/core';

import classes from './NavbarMinimal.module.css';


import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/utils/useAuth';
import { modals } from '@mantine/modals';

interface NavbarLinkProps {
  icon: any;
  icon2: any;
  label: string;
  active?: boolean;
  onClick?: () => void;
  href: string;
  toggle: () => {};
}

function NavbarLink({ icon: Icon, icon2: IconSelected, label, href, toggle }: NavbarLinkProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = pathname === href;
  
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={() => { router.push(href); toggle() }}
        style={(theme) => ({
          borderRadius: theme.radius.sm,
          color: isActive ? theme.colors[theme.primaryColor][6] : 'gray',
          fontWeight: isActive ? 600 : 400,
          marginBottom: '10px',
          '&:hover': {
            backgroundColor: theme.colors[theme.primaryColor][1],
            color: theme.colors[theme.primaryColor][7],
          },
        })}>
        {isActive ? <IconSelected size={30} stroke={2} /> : <Icon size={30} stroke={2} />}
      </UnstyledButton>
    </Tooltip>
  );
}

export const mockdata = [
  { icon: IconHome, iconSelected: IconHomeFilled, label: 'Home', href: '/' },
  { icon: IconSearch,iconSelected: IconZoomFilled,  label: 'Search', href: '/search' },
  { icon: IconLayoutList, iconSelected: IconLayoutListFilled, label: 'Library', href: '/library' },
  { icon: IconSettings, iconSelected: IconSettingsFilled,  label: 'Settings', href: '/settings' },
];

export function NavbarMinimal({ toggle }: any) {
  const [active, setActive] = useState(2);
  const { logout } = useAuth();
  const links = mockdata.map((link, index) => (
    <NavbarLink
      href={link.href}
      key={link.label}
      icon={link.icon}
      icon2={link.iconSelected}
      label={link.label}
      toggle={toggle} />
  ));

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

  return (
    <nav className={classes.navbar}>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <Tooltip label={'Logout'} position="right" transitionProps={{ duration: 0 }}>
          <UnstyledButton
            onClick={() => confirmLogout()}
            style={(theme) => ({
              borderRadius: theme.radius.sm,
              color:  'gray',
              fontWeight:   400,
              marginBottom: '10px',
              '&:hover': {
                backgroundColor: theme.colors[theme.primaryColor][1],
                color: theme.colors[theme.primaryColor][7],
              },
            })}>
            <IconLogout size={30} stroke={2} />
          </UnstyledButton>
        </Tooltip>
      </Stack>
    </nav>
  );
}