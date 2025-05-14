
'use client'
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useAuth } from '@/utils/useAuth';
import { Button, Container, Text, Space, Center, Group, TextInput, useMantineTheme, Divider } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { GoogleButton } from '../Common/GoogleButton';

export default function SignInPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [name, setName] = useState('');
    const {login, logout } = useAuth();
    
    const theme = useMantineTheme()


    return (
        <Container size="sm" style={{ minHeight: '100vh', paddingTop: '10vh' }}>
            <Text size="32px" fw={900} c={theme.primaryColor} mb={50}>Open. Stream. Repeat.</Text>
            <Text size="48px" fw={900} c={theme.colors.secondary[5]}>Your Music...</Text>
            <Text size="48px" fw={900} c="white">Your Server...</Text>

            <Space h="xl" />
            <TextInput
                leftSection={<IconUser size={20} />}
                placeholder="Enter Your Name"
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                size="md"
                radius="md"
            />
            <Group justify="center" mt="md">
                <Button
                    fullWidth
                    size="md"
                    radius="md"
                    
                >
                    Get Started
                </Button>
                <Divider my="0" label="Or use Google to save playlists" labelPosition="center" />

                <GoogleButton onClick={login} radius="md">Google</GoogleButton>
            </Group>

            <Space h="md" />
            <Text size="xs" c="dimmed">
                <strong>Disclaimer:</strong> We respect your privacy more than anything else. Only your name, which you will enter here, will be recorded.
            </Text>

        </Container>
    );
}
