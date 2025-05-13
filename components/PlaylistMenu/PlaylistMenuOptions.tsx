import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Menu, ActionIcon, Drawer, Image, Text, Group, rem, Paper, Stack, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDotsVertical, IconPlaylist, IconAlbum, IconUser, IconShare, IconHeart, IconPlayCard, IconPlayerPause, IconPlayerPlay, IconPlayerTrackNext, IconClearAll, IconTrash, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import musicPlaceholder from '../../assets/images/music_placeholder.png';
import { addSongToPlaylist, copyPlaylist, removeSongFromPlaylist } from "@/store/slices/playlist.slice";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';
import { addTrackAfterCurrent, removeTrackFromPlaylist } from "@/store/slices/player.slice";

interface PlaylistMenuOptionsProps {
    album:any|undefined;
    song: any|undefined;
    type: string;
    isForAlbums: boolean;
    isPlayingSongBar: boolean;
    albumType: string;
    playlistId: string;
}

export const PlaylistMenuOptions = ({album, song, type, isForAlbums=false, isPlayingSongBar=false , albumType='session', playlistId}: PlaylistMenuOptionsProps) => {
    const [
        drawerOpened,
        { open: openDrawer, close: closeDrawer },
    ] = useDisclosure(false);
    const playlists = useAppSelector((state) => state.playlist.userPlaylist);
    const dispatch = useAppDispatch();
    const theme = useMantineTheme();
    
    function onClickAddTo(id: string): void {
        dispatch(addSongToPlaylist({playlistId: id, song: song}));
        closeDrawer();
        toast.success('Added to playlist')
    }
    function onClickCopyPlaylist(album: any): void {
        dispatch(copyPlaylist({id: uuidv4(), name: album.title, image:album.image, tracks: album.list}));
        toast.success(album.type+' added as playlist')
    }
    
    function onClickAddTrackNext(song: any): void {
        dispatch(addTrackAfterCurrent(song));
        toast.success(song.title+' added to play next')
    }
    function onClickRemoveFromHere(song: any): void {
        console.log(song)
        
        if(albumType==='session'){
            dispatch(removeTrackFromPlaylist(song.id));
        }else{
            dispatch(removeSongFromPlaylist({playlistId: playlistId, songId: song.id}));
        }
        
        toast.success(song.title+' removed from '+albumType)
    }
    return (
        <div>
            <Menu shadow="md" width={220}>
                <Menu.Target>
                    <ActionIcon  variant={isForAlbums ? "light": "subtle"} radius={'xl'}
                         color={isForAlbums ? theme.primaryColor: "gray"} onClick={(e) => e.stopPropagation()}>
                        <IconDotsVertical size={20} />
                    </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                    {/* This is for Albums/Playlist/Artists */}
                    {type !== 'song' && <Menu.Item  leftSection={<IconPlaylist size={14} />}>
                        Add to Queue
                    </Menu.Item>}
                    {type !== 'song' && <Menu.Item onClick={()=>onClickCopyPlaylist(album)} leftSection={<IconHeart size={14} />}>
                        Save Playlist
                    </Menu.Item>}
                    
                    


                    {/* Below options for only tracks */}
                    {type === 'song' && !isPlayingSongBar && <Menu.Item onClick={()=>onClickAddTrackNext(song)} leftSection={<IconPlayerTrackNext size={14} />}>
                        Play Next
                    </Menu.Item>}

                    {type === 'song' && <Menu.Item onClick={openDrawer} leftSection={<IconPlaylist size={14} />}>
                        Add to Playlist
                    </Menu.Item>}
                    
                    {type === 'song' && isPlayingSongBar && <Menu.Item onClick={()=>onClickRemoveFromHere(song)} leftSection={<IconTrash size={14} />}>
                       Remove from {albumType}
                    </Menu.Item>}

                    {type === 'song' && <Menu.Item leftSection={<IconAlbum size={14} />}>
                        View Album
                    </Menu.Item>}

                    {type === 'song' && <Menu.Item leftSection={<IconUser size={14} />}>
                        View Artist
                    </Menu.Item>}

                    {type === 'song' && <Menu.Item leftSection={<IconShare size={14} />}>
                        Share
                    </Menu.Item>}
                </Menu.Dropdown>
            </Menu>
            {/* Drawer for creating new playlist */}
            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                position="bottom"
                size="30%"
                withCloseButton={false}
                padding="xs"
                radius="md"
                styles={{
                    body: { paddingTop: rem(12) },
                }}
            >
                <Stack align="stretch"
                    justify="center"
                    gap="xs">
                    <Paper shadow="xs" p="8" withBorder>
                        <Group justify="space-between">
                            <Group p={0}>
                               <ActionIcon variant="light" size={'xl'}><IconPlus size={20} /></ActionIcon> 
                                <Text fw={600}>Create New Playlist</Text>
                            </Group>
                            <Group>
                            </Group>
                        </Group>
                    </Paper>

                    {playlists.map((playlist) => (
                        <Paper key={playlist.id} shadow="xs" p="5" withBorder onClick={()=> onClickAddTo(playlist.id)}>
                        <Group justify="space-between" wrap="nowrap">
                          {/* Playlist Image and Name */}
                          <Group p={0} wrap="nowrap" style={{ minWidth: 0 }}>
                            <Image
                              src={
                                playlist?.image ?? musicPlaceholder.src
                              }
                              radius="md"
                              w={50}
                              h={50}
                            />
                            <Text
                              fw={600}
                              style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: 180, // adjust based on your layout
                              }}
                            >
                              {playlist.name}
                            </Text>
                          </Group>
                      
                          {/* Tracks count and menu */}
                          <Group wrap="nowrap">
                            <Text size="sm" fw={500} c="dimmed" style={{ whiteSpace: 'nowrap' }}>
                              {playlist.tracks.length} Tracks
                            </Text>
                            
                          </Group>
                        </Group>
                      </Paper>
                    ))}
                </Stack>
            </Drawer>

        </div>)
}