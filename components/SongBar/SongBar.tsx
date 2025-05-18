import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getSongFromToken } from '@/store/slices/jio.slice';
import { playTrack } from '@/store/slices/player.slice';
import { getLastSectionOfUrl, formatSongsResponse } from '@/utils/generic.utils';
import { Flex, Group, Box, ActionIcon, Image, Text, Skeleton, useMantineTheme, ScrollArea } from "@mantine/core"
import { IconGripVertical } from "@tabler/icons-react"
import classes from './songbar.module.css';
import { useRef, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FavoriteButton } from '../FavoriteButton/FavoriteButton';
import { DownloadButton } from '../DownloadButton/DownloadButton';
import { PlaylistMenuOptions } from '../PlaylistMenu/PlaylistMenuOptions';
import { RootState } from '@/store/store';


export interface SongBarProps {
    id: string;
    song: any;
    type: string;
    isPlaying: boolean;
    currentPlayingTrack: any;
    onClickOverride: any;
    dragHandleProps?: any;
    withHandle?: boolean;
    isPlayingSongBar?: boolean;
    albumType?: string;
    playlistId?: string;
}

export const SongBar = ({ id, song, type, isPlaying, onClickOverride, currentPlayingTrack, dragHandleProps, withHandle = false, isPlayingSongBar = false, albumType = 'session', playlistId = "" }: SongBarProps) => {
    const dispatch = useAppDispatch();
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id });
    const theme = useMantineTheme();
    const [dragging, setDragging] = useState(false);
    const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isOnline = useAppSelector((state: RootState) => state.network.isOnline);


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
            if (isOnline) {
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
            }else{
                  dispatch(playTrack(song));
            }

        }

    }


    return (
        <Flex
            key={id + ''}
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                cursor: 'pointer',
                marginBottom: '8px'
            }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onClick={handleClick} >

            <Group gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                {withHandle && (
                    <Group
                        {...dragHandleProps}
                        className="drag-handle"
                        style={{ touchAction: 'none', cursor: 'grab' }}
                    >
                        <IconGripVertical size={26} />
                    </Group>
                )}

                <Box pos="relative">
                    <Image src={song.image}
                        fallbackSrc={`https://placehold.co/600x400?text=${type}`}
                        fit='cover' radius="md" w={60} h={60} />

                    {currentPlayingTrack !== null && currentPlayingTrack !== undefined
                        && song !== null && song !== undefined && isPlaying && currentPlayingTrack.id === song.id && <Box
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
                <FavoriteButton song={song} />
                <DownloadButton song={song} />
                <Box onClick={(e) => e.stopPropagation()}>
                    <PlaylistMenuOptions
                        song={song} type={song.type} album={undefined} isForAlbums={false}
                        isPlayingSongBar={isPlayingSongBar}
                        albumType={albumType}
                        playlistId={playlistId} />
                </Box>

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

export const SkeletonCarousel = (props: any) => {
    const renderCardSkeleton = (count: number) =>
        Array.from({ length: count }).map((_, index) => (
            <Box key={index} style={{ minWidth: 160 }}>
                <Skeleton height={160} radius="md" />
                <Skeleton height={12} mt="sm" width="80%" />
                <Skeleton height={10} mt={6} width="60%" />
            </Box>
        ));

    return <>
        <div >

            <Skeleton height={12} ml={'12px'} mb="sm" width="30%" />
            <ScrollArea type="never" scrollbars="x" offsetScrollbars style={{ paddingLeft: '12px' }}>
                <Group gap="md" wrap="nowrap">
                    {renderCardSkeleton(10)}
                </Group>
            </ScrollArea>
        </div>
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