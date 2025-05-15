
'use client'
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useAuth } from '@/utils/useAuth';
import { Button, Container, Text, Space, Title, Group, TextInput, useMantineTheme, Divider, Checkbox } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { GoogleButton } from '../Common/GoogleButton';
import toast from 'react-hot-toast';
import { isValidName } from '@/utils/generic.utils';

export default function SignInPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [name, setName] = useState('');
    const { login,getStarted } = useAuth();
    const [checked, setChecked] = useState(true);
    const theme = useMantineTheme()
    
    const capitalizeWords = (str: string) =>
        str
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

    function createAccountGetStarted(): void {
       if(!checked){
        toast.error('Please accept terms');
       }else{
        if(name!==null && name!==undefined && isValidName(name)){
            getStarted(name);
        }else{
            toast.error('Enter valid name');
        }
       }
    }

    return (
        <Container size="xs" style={{ minHeight: '90vh', paddingTop: '5vh' }}>
            <Text size="32px" fw={900} c={theme.primaryColor} mb={'20vh'}>Open. Stream. Repeat.</Text>
            <Text size="48px" fw={900} c={'#BDBDBD'}>Your Music...</Text>
            <Text size="48px" fw={900} >Your Server...</Text>

            <Space h="xl" />
            <TextInput
                leftSection={<IconUser size={20} />}
                placeholder="Enter Your Name"
                value={name}
                onChange={(e) => setName(capitalizeWords(e.currentTarget.value))}
                size="md"
                radius="md"
            />
            <Group justify="center" mt="md">
                <Button
                    fullWidth
                    size="md"
                    radius="md"
                    disabled={!checked}
                    onClick={()=>createAccountGetStarted()}
                >
                    Get Started
                </Button>
                <Divider variant="dashed" w={'100%'} my="0" label="or use google to save playlists" labelPosition="center" />

                <GoogleButton disabled={!checked} 
                        onClick={()=>checked ? login() : toast.error('Please accept terms')} radius="md">Sign-in with Google</GoogleButton>
            </Group>

            <Space h="md" />
            <Checkbox
                defaultChecked
                label="I agree to use the App for educational purposes only"
                checked={checked}
                onChange={(event: { currentTarget: { checked: boolean | ((prevState: boolean) => boolean); }; }) => setChecked(event.currentTarget.checked)}
            />
            <Space h="md" />
            <Text size="xs" c="dimmed">
                <strong>Disclaimer:</strong> We respect your privacy more than anything else. We do not sell or share your data with anyone else.
            </Text>

        </Container>
    );
}
