import { Paper, Group, ActionIcon, Text, Tooltip, Stack, useMantineTheme } from '@mantine/core';
import {
    IconHome2,
    IconSearch,
    IconPlaylist,
    IconUser,
} from '@tabler/icons-react';
import { mockdata } from '../Navbar/NavbarMinimal';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';


interface BottomNavProps {
    icon: typeof IconHome2;
    label: string;
    active?: boolean;
    onClick?: () => void;
    href: string;
}

function BottomNavLink({ icon: Icon, label, href }: BottomNavProps) {
    const pathname = usePathname();
    const router = useRouter();
    const theme = useMantineTheme();
    const isActive = pathname === href;

    return (
        <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
            <Stack
                my={'0'}
                key={label}
                align="center"
                gap={0}
                onClick={() => { router.push(href) }}
                style={{ cursor: 'pointer' }}
            >
                <ActionIcon variant={isActive ? 'light' : 'subtle'} size="xl" mx={'sm'} radius={'md'} >
                    <Icon size={30} stroke={2} />
                </ActionIcon>
                <Text size="xs" fw={600} c={isActive ? theme.primaryColor : 'dimmed'}>
                    {label}
                </Text>
            </Stack>

        </Tooltip>
    );
}


export function BottomNavigation() {


    return (
        <Paper
            shadow="md"
            radius={0}
            px="lg"
            py={'2'}
            withBorder
        >
            <Group justify="space-between">
                {mockdata.map((link, index) => (
                    <BottomNavLink
                        href={link.href}
                        key={link.label}
                        icon={link.icon}
                        label={link.label} />
                ))
                }
            </Group>
        </Paper>
    );
}
