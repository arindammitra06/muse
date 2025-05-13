import { Group, Image, Text, Button, Box, useMantineTheme, Stack, Pill } from '@mantine/core';
import musicPlaceholder from '../../assets/images/music_placeholder.png';
import Marquee from 'react-fast-marquee';
import { FavoriteButton } from '../FavoriteButton/FavoriteButton';
import { IconPlayerPlay, IconPlaylist } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';


function BottomStickyItem({ exactNextTrack }: any) {
    const theme = useMantineTheme();
    const router = useRouter();
    return (
        <div style={{ display: 'flex', flexDirection: 'column', }}>
            <div style={{ flex: 1 }}>
                {/* Other content goes here */}
            </div>

            
                <Group
                    justify="space-between"
                    wrap="nowrap"
                    p={'xs'}
                    style={{
                        padding: 'xs',
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0, // optional, for background color
                        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)', // optional, for shadow
                        zIndex: 1000, // optional, to ensure it's on top
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
        </div>
    );
}

export default BottomStickyItem;
