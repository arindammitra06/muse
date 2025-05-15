import { SortableSongBar } from "@/components/SongBar/SortableSongBar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updatePlaylistOrder } from "@/store/slices/playlist.slice";
import { useSensors, useSensor, PointerSensor, DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Box, Title, Drawer, rem, ActionIcon, Group, Text, SimpleGrid, Button, useMantineTheme, Flex } from "@mantine/core";
import { IconX, IconPlayerPlay } from "@tabler/icons-react";
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import usePlayDownload from "@/utils/playDownloadHooks";

interface SortablePlaylistDrawerProps {
    playlistId: string;
    drawerOpened: boolean;
    closeDrawer: () => void;
}

export default function SortablePlaylistDrawer({ playlistId, drawerOpened, closeDrawer }: SortablePlaylistDrawerProps) {
    const dispatch = useAppDispatch();
    const userplaylist = useAppSelector((state) =>
        state.playlist.userPlaylist.find((p) => p.id === playlistId)
    );
    const { playlist, currentTrackIndex, isPlaying } = useAppSelector(s => s.player);
    const theme = useMantineTheme();
    const { fetchAllSongsFromPlayNow } = usePlayDownload();
    const sensors = useSensors(useSensor(PointerSensor));

    if (!userplaylist) return <div>Playlist not found</div>;

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = userplaylist.tracks.findIndex((t: { id: any; }) => t.id === active.id);
        const newIndex = userplaylist.tracks.findIndex((t: { id: any; }) => t.id === over.id);

        const newTracks = arrayMove(userplaylist.tracks, oldIndex, newIndex);
        dispatch(updatePlaylistOrder({ playlistId: userplaylist.id, tracks: newTracks }));
    };


    

    return (
        <Drawer
            opened={drawerOpened}
            onClose={closeDrawer}
            position="bottom"
            size="90%"
            withCloseButton={false}
            padding="xs"
            radius="md"
            styles={{
                body: { paddingTop: rem(12) },
            }}
        >
            <Box p="xs">
                <Group justify="space-between" align="flex-start" wrap="nowrap" mb={'md'}>
                    <SimpleGrid cols={1} verticalSpacing={'xs'} style={{ minWidth: 0 }}>
                        <Title
                            fw={600}
                            order={3}
                            style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: 300, // adjust based on your layout
                            }}
                        >
                            {userplaylist.name}
                        </Title>
                        <Text size="sm" fw={500} c="dimmed" style={{ whiteSpace: 'nowrap' }}>
                            {userplaylist.tracks.length} Tracks
                        </Text>


                    </SimpleGrid>

                    {/* Tracks count and menu */}
                    <Group wrap="nowrap">
                        <ActionIcon variant="light" color="gray" size="lg" radius="lg" onClick={() => closeDrawer()}>
                            <IconX size={'1.5rem'} stroke={2.5} />
                        </ActionIcon>
                    </Group>
                </Group>
                <Flex justify="flex-end" align="flex-end" w="100%" mb={10}>
                <Button
                    onClick={() =>fetchAllSongsFromPlayNow(userplaylist.tracks) }
                    size="xs"
                    rightSection={<IconPlayerPlay size={16} />}
                    radius="md"
                    disabled={userplaylist?.tracks?.length === 0}
                    color={theme.primaryColor}
                >
                    Play All
                </Button>
                </Flex>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}
                 modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
                    <SortableContext
                        items={userplaylist.tracks.map(track => track.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {userplaylist.tracks.map((track, index) => (
                            <SortableSongBar key={track.id}
                                id={track.id}
                                song={track}
                                type={track.type}
                                isPlaying={isPlaying}
                                isPlayingSongBar={true}
                                albumType={'album'}
                                playlistId={playlistId}
                                currentPlayingTrack={playlist[currentTrackIndex]}
                                onClickOverride={() => {/* restart playback */ }} />
                        ))}
                    </SortableContext>
                </DndContext>
            </Box>
        </Drawer>
    );
}