import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getSongFromToken } from '@/store/slices/jio.slice';
import { playTrack } from '@/store/slices/player.slice';
import { getLastSectionOfUrl, formatSongsResponse } from '@/utils/generic.utils';
import { Flex, Group, Box, Image, Text, useMantineTheme, Paper } from "@mantine/core"
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FavoriteButton } from '../FavoriteButton/FavoriteButton';
import { DownloadButton } from '../DownloadButton/DownloadButton';
import { PlaylistMenuOptions } from '../PlaylistMenu/PlaylistMenuOptions';

export interface SearchResultSongBarProps {
    idx: string;
    song: any;
    type: string;
    title: string
    perma_url: string
}

export const SearchResultSongBar = ({ idx, song, type, title,perma_url }: SearchResultSongBarProps) => {
    const dispatch = useAppDispatch();
    const theme = useMantineTheme();
    const { playlist, currentTrackIndex, isPlaying } = useAppSelector(s => s.player);
    const currentPlayingTrack = playlist[currentTrackIndex];
    const router = useRouter();
    

    const handleClick = () => {
        if (title === 'Top Result') {
            toast.error('Top Results unavailable')
            
        } else if (title === 'Artists') {
            toast.error('Check View All')
            
        }else {
            if (type === 'song') {
                playSongAndAddToPlaylist(song);
            } else {
                if (type === 'artist') {
                    let token = getLastSectionOfUrl(perma_url);
                    router.push(`/${type}/${idx}/${token}`);
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
                        style={{filter: title === 'Top Result' || title === 'Artists'  ? 'grayscale(100%)' : 'none'}}
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


            <Group gap="xs" wrap="nowrap" mr={'xs'}>
                
                {song.type === 'song' && <FavoriteButton song={song}/>}
                {song.type === 'song' && <DownloadButton song={song}/>}
                {song.type === 'song' &&  <Box onClick={(e) => e.stopPropagation()}>
                    <PlaylistMenuOptions song={song} type={song.type} album={undefined} isForAlbums={false} isPlayingSongBar={false} albumType={''} playlistId={''}/></Box>}
            </Group>
        </Flex>)
}
