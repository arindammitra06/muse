import { useAppDispatch } from '@/store/hooks';
import { getSongFromToken } from '@/store/slices/jio.slice';
import { playTrack } from '@/store/slices/player.slice';
import { getLastSectionOfUrl, formatSongsResponse } from '@/utils/generic.utils';
import { Flex, Group, Box, ActionIcon, Image, Text, Skeleton, useMantineTheme } from "@mantine/core"
import { IconDotsVertical, IconGripVertical } from "@tabler/icons-react"
import classes from './songbar.module.css';
import { useRef, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FavoriteButton } from '../FavoriteButton/FavoriteButton';
import { DownloadButton } from '../DownloadButton/DownloadButton';


export interface SongBarProps {
    idx: number;
    song: any;
    type: string;
    isPlaying: boolean;
    currentPlayingTrack: any;
    onClickOverride: any;
    dragHandleProps?: any;
    withHandle?: boolean;
}

export const SongBar = ({ idx, song, type, isPlaying, onClickOverride, currentPlayingTrack, dragHandleProps, withHandle = false }: SongBarProps) => {
    const dispatch = useAppDispatch();
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: song.id });
    const theme = useMantineTheme();
    const [dragging, setDragging] = useState(false);
    const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const handlePointerDown = () => {
        // Assume dragging will happen
        setDragging(false);
        if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
        dragTimeoutRef.current = setTimeout(() => {
            setDragging(true);
        }, 150); // time to consider it a drag
    };

    const handlePointerUp = () => {
        if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
    };

    const handleClick = () => {
        if (!dragging) {
            playSongAndAddToPlaylist(song);
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
                                onClickOverride();
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
        <Flex key={idx}
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onClick={handleClick} >
            <Group gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                {withHandle && (
                    <ActionIcon m={0} variant="subtle" color="gray" {...listeners} {...attributes} >
                        <IconGripVertical size={20} />
                    </ActionIcon>
                )}

                <Box pos="relative">
                    <Image src={song.image} radius="md" w={60} h={60} />

                    {currentPlayingTrack !== null && currentPlayingTrack !== undefined
                            && song !== null && song !== undefined && isPlaying && currentPlayingTrack.id === song.id &&<Box
                        pos="absolute"
                        top={0}
                        left={0}
                        w="100%"
                        h="100%"
                        display="flex"
                        ta="center"
                        flex="center"
                        bg="rgba(0, 0, 0, 0.1)" >
                         <PlayingIndicator />
                    </Box>}
                </Box>



                <Box style={{ minWidth: 0 }}>
                    <Text size="sm" fw={600}
                        c={currentPlayingTrack !== null && currentPlayingTrack !== undefined && song !== null && song !== undefined && isPlaying && currentPlayingTrack.id === song.id ? theme.primaryColor : undefined}
                        style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {song.title}
                    </Text>
                    <Text size="xs" c={currentPlayingTrack !== null && currentPlayingTrack !== undefined && song !== null && song !== undefined && isPlaying && currentPlayingTrack.id === song.id ? theme.primaryColor : 'dimmed'}
                        style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {song.subtitle} • {song.year}
                    </Text>
                </Box>
            </Group>


            <Group gap="xs" wrap="nowrap">
                <FavoriteButton song={song}/>
                <DownloadButton song={song}/>
                <ActionIcon variant="subtle" color="gray">
                    <IconDotsVertical size={20} />
                </ActionIcon>
            </Group>
        </Flex>)
}

export const SkeletonSongBar = (props: any) => {
    return <>
        {Array.from({ length: props.count }, (_, index) => (
            <Flex key={index} justify="space-between" align="center" gap="0" >
                <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                    <Skeleton height={50} circle mb="sm" />
                    <Box style={{ minWidth: 200, marginBottom: 10 }}>
                        <Skeleton height={8} mt={6} radius="xl" width="100%" />
                        <Skeleton height={8} mt={6} width="70%" radius="xl" />
                    </Box>
                </Group>
                <Group gap="xs" wrap="nowrap" mt="md">
                    <Skeleton height={12} circle mb="xl" />
                    <Skeleton height={12} circle mb="xl" />
                </Group>
            </Flex>
        ))}
    </>
}


export const PlayingIndicator = () => {
    const theme = useMantineTheme();
    return (
        <Box className={classes.playingindicator}
            style={{ '--bar-color': theme.colors[theme.primaryColor][6] }}>
            <span /><span /><span /><span />
        </Box>
    );
    
}