import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getSongFromToken } from '@/store/slices/jio.slice';
import { playTrack } from '@/store/slices/player.slice';
import { getLastSectionOfUrl, formatSongsResponse } from '@/utils/generic.utils';
import { Flex, Group, Box, ActionIcon, Image, Text, useMantineTheme, Paper } from "@mantine/core"
import { IconDownload, IconDotsVertical } from "@tabler/icons-react"
import { PlayingIndicator } from '../SongBar/SongBar';
import { useRouter } from 'next/navigation';
import { downloadFile } from '@/utils/fileutil';
import toast from 'react-hot-toast';

export interface SearchResultSongBarProps {
    idx: string;
    song: any;
    type: string;
    title: string
}

export const SearchResultSongBar = ({ idx, song, type, title }: SearchResultSongBarProps) => {
    const dispatch = useAppDispatch();
    const theme = useMantineTheme();
    const { playlist, currentTrackIndex, isPlaying } = useAppSelector(s => s.player);
    const currentPlayingTrack = playlist[currentTrackIndex];
    const router = useRouter();


    const handleClick = () => {
        if (title === 'Top Result' || title === 'Artists') {
            toast.error('Top Results & Artist coming soon')
            
        } else {
            if (type === 'song') {
                playSongAndAddToPlaylist(song);
            } else {
                console.log(song);

                if (type === 'artist') {
                    router.push(`/${type}/${idx}/${song.title}`);
                } else {
                    router.push(`/${type}/${idx}/`);
                }
            }
        }

    };

    function playSongAndAddToPlaylist(song: any): void {
        if (type !== null && type !== undefined && song !== null && song !== undefined && song.perma_url !== null && song.perma_url !== undefined) {
            let token = getLastSectionOfUrl(song.perma_url);

            if (token !== null && token !== undefined && token !== '') {
                dispatch(getSongFromToken({ token: token, type: type })).then(async (res: any) => {
                    if (res.payload !== null && res.payload !== undefined) {

                        let songsList = res.payload['songs'];
                        if (songsList !== null && songsList !== undefined && songsList.length > 0) {
                            const songs = await formatSongsResponse(songsList, type);

                            if (currentPlayingTrack !== null && currentPlayingTrack !== undefined
                                && songs[0] !== null && songs[0] !== undefined && isPlaying && currentPlayingTrack.id === songs[0].id) {
                                // seekTo(0);
                            } else {
                                dispatch(playTrack(songs[0]));
                            }

                        }
                    }
                });;
            }
        }

    }


    return (
        <Flex ml={'xs'} onClick={handleClick} mb={10} style={{ cursor: 'pointer' }}>

            <Group gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>

                <Box pos="relative" >
                    <Paper shadow='sm'>
                        <Image src={song.image} 
                        style={{filter: title === 'Top Result' || title === 'Artists' ? 'grayscale(100%)' : 'none'}}
                        radius="md" w={50} h={50} />
                    </Paper>
                </Box>



                <Box style={{ minWidth: 0 }}>
                    <Text tt="capitalize" size="sm" fw={600}
                        c={currentPlayingTrack !== null && currentPlayingTrack !== undefined && song !== null && song !== undefined && isPlaying && currentPlayingTrack.id === song.id ? theme.primaryColor : undefined}
                        style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {song.title}
                    </Text>
                    <Text tt="capitalize" size="xs" c={currentPlayingTrack !== null && currentPlayingTrack !== undefined && song !== null && song !== undefined && isPlaying && currentPlayingTrack.id === song.id ? theme.primaryColor : 'dimmed'}
                        style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {song.type === 'artist' ? song.type : `${song.subtitle} • ${song.year !== null && song.year !== undefined ? song.year : song.count}`}
                    </Text>
                </Box>
            </Group>


            <Group gap="xs" wrap="nowrap">
                {song.type === 'song' && <ActionIcon variant="subtle" color="gray" onClick={() => downloadFile(song.url!, song.title!)}>
                    <IconDownload size={20} />
                </ActionIcon>}
                <ActionIcon variant="subtle" color="gray">
                    <IconDotsVertical size={20} />
                </ActionIcon>
            </Group>
        </Flex>)
}
