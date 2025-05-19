import { Group, Image, Text, Button, Box, useMantineTheme, Stack, Pill } from '@mantine/core';
import musicPlaceholder from '../../assets/images/music_placeholder.png';
import Marquee from 'react-fast-marquee';
import { FavoriteButton } from '../FavoriteButton/FavoriteButton';
import { IconPlayerPlay, IconPlaylist } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';


function BottomStickyItem({ exactNextTrack , onClick}: any) {
    const theme = useMantineTheme();
    const { isActive, remaining } = useAppSelector((state: RootState) => state.sleepTimer);
    const router = useRouter();
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', }} onClick={()=>onClick()}>
            <div style={{ flex: 1 }}>
                {/* Other content goes here */}
            </div>

                <Stack
                    gap={0}
                    justify="normal"
                    p={0}
                    style={{
                        padding: 'xs',
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0, // optional, for background color
                        zIndex: 1000, // optional, to ensure it's on top
                    }}
                >
                    {isActive && 
                    <Text lineClamp={1} ta={'center'} size='xs' truncate 
                    c={theme.colors[theme.primaryColor][6]}>Sleeping in {Math.ceil((remaining ?? 0) / 60000)} min</Text>}
                <Group
                    justify="space-between"
                    wrap="nowrap"
                    p={'xs'}
                    style={{
                        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)', 
                    }}
                >
                    <Group wrap="nowrap" style={{ flex: 1, minWidth: 0 }} gap={'xs'}>
                        <Image
                            src={exactNextTrack?.image || musicPlaceholder.src}
                            radius="md"
                            w={40}
                            h={40}
                            alt={exactNextTrack?.title}
                        />
                        <Box style={{ minWidth: 0 }} >
                            <Text size="md" fw={500} truncate >
                                {exactNextTrack?.title ?? 'No next track...'}
                            </Text>
                            <Marquee pauseOnHover delay={3} speed={15}>
                                <Text size="xs" c="dimmed" truncate lineClamp={1}>
                                    {exactNextTrack?.title ? `${exactNextTrack.subtitle} • ${exactNextTrack.year}` : ''}
                                </Text>
                            </Marquee>


                        </Box>
                    </Group>
                    <Group gap="sm" wrap="nowrap">
                        <Pill c={theme.primaryColor}  size="sm">Up Next</Pill>
                    </Group>
                </Group>
                </Stack>
        </div>
    );
}

export default BottomStickyItem;
