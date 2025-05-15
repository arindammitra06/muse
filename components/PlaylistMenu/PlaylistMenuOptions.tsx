import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Menu, ActionIcon, Drawer, Image, Text, Group, rem, Paper, Stack, useMantineTheme } from "@mantine/core";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import { IconDotsVertical, IconPlaylist, IconAlbum, IconUser, IconShare, IconHeart, IconPlayCard, IconPlayerPause, IconPlayerPlay, IconPlayerTrackNext, IconClearAll, IconTrash, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import musicPlaceholder from '../../assets/images/music_placeholder.png';
import { addSongToPlaylist, copyPlaylist, removeSongFromPlaylist } from "@/store/slices/playlist.slice";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';
import { addMultiTracksAfterCurrent, addTrackAfterCurrent, removeTrackFromPlaylist } from "@/store/slices/player.slice";
import { formatSongsResponse, getLastSectionOfUrl } from "@/utils/generic.utils";
import { getSongFromToken } from "@/store/slices/jio.slice";
import { useRouter } from "next/navigation";
import { modals } from "@mantine/modals";
import { CreatePlaylistForm } from "../Common/CreatePlaylistForm";

interface PlaylistMenuOptionsProps {
    album: any | undefined;
    song: any | undefined;
    type: string;
    isForAlbums: boolean;
    isPlayingSongBar: boolean;
    albumType: string;
    playlistId: string;
}

export const PlaylistMenuOptions = ({ album, song, type, isForAlbums = false, isPlayingSongBar = false, albumType = 'session', playlistId }: PlaylistMenuOptionsProps) => {
    const [
        drawerOpened,
        { open: openDrawer, close: closeDrawer },
    ] = useDisclosure(false);
    const playlists = useAppSelector((state) => state.playlist.userPlaylist);
    const dispatch = useAppDispatch();
    const theme = useMantineTheme();
    const router = useRouter();
    const clipboard = useClipboard({ timeout: 2000 });


    const handleShare = async () => {
        let url = '';

        if (isForAlbums && album) {
            url = window.location.href;
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: album.title,
                        url,
                    });
                } catch (err) {
                    console.error('Share failed:', err);
                }
            } else {
                clipboard.copy(url); // fallback
            }
        }

    };

    function onClickAddTo(id: string): void {
        dispatch(addSongToPlaylist({ playlistId: id, song: song }));
        closeDrawer();
        toast.success('Added to playlist')
    }
    function onClickCopyPlaylist(album: any): void {
        dispatch(copyPlaylist({ id: uuidv4(), name: album.title, image: album.image, tracks: album.list }));
        toast.success(album.type + ' added as playlist')
    }



    async function onClickAddMultipleTracksNext(albumData: any): Promise<void> {
        toast.success('Adding tracks in background')
        let tracks: any[] | null | undefined = [];

        if (albumData !== null && albumData !== undefined && albumData.length > 0) {
            for (let i = 0; i < albumData.length; i++) {
                if (albumData[i] !== null && albumData[i] !== undefined && albumData[i].perma_url !== null && albumData[i].perma_url !== undefined) {
                    let token = getLastSectionOfUrl(albumData[i].perma_url);
                    if (token !== null && token !== undefined && token !== '') {
                        await dispatch(getSongFromToken({ token: token, type: albumData[i].type })).then(async (res: any) => {
                            if (res.payload !== null && res.payload !== undefined) {
                                let songsList = res.payload['songs'];
                                if (songsList !== null && songsList !== undefined && songsList.length > 0) {
                                    const songsFetched = await formatSongsResponse(songsList, type);
                                    tracks.push(songsFetched[0])
                                }
                            }
                        });
                    }
                }
            }
        }

        if (tracks !== null && tracks !== undefined && tracks.length > 0) {
            dispatch(addMultiTracksAfterCurrent(tracks));
            toast.success(album.title + ' tracks added to play next')
        }
    }

    function onClickAddTrackNext(song: any): void {
        dispatch(addTrackAfterCurrent(song));
        toast.success(song.title + ' added to play next')
    }
    function onClickRemoveFromHere(song: any): void {
        console.log(song)

        if (albumType === 'session') {
            dispatch(removeTrackFromPlaylist(song.id));
        } else {
            dispatch(removeSongFromPlaylist({ playlistId: playlistId, songId: song.id }));
        }

        toast.success(song.title + ' removed from ' + albumType)
    }
    function showCreatePlaylistModal() {
        modals.open({
          title: 'Add Playlist Name',
          centered: true,
          children: <CreatePlaylistForm />,
        });
      }
      
    function seeArtistPage(artist: any): void {
        if (artist !== null && artist !== undefined && artist.type === 'artist') {
            let token = getLastSectionOfUrl(artist.perma_url);
            router.push(`/${artist.type}/${artist.id}/${token}`);
        }
    }

    function seeAlbumPage(album_id: any): void {
        if (album_id !== null && album_id !== undefined) {
            router.push(`/album/${album_id}`);
        }
    }

    return (
        <div>
            <Menu shadow="md" width={220}>
                <Menu.Target >
                    <ActionIcon variant={isForAlbums ? "light" : "subtle"} radius={'xl'} pt={6}
                        color={isForAlbums ? theme.primaryColor : "gray"} onClick={(e) => e.stopPropagation()}>
                        <IconDotsVertical size={20} />
                    </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                    {/* This is for Albums/Playlist/Artists */}
                    {type !== 'song' && <Menu.Item onClick={() => onClickAddMultipleTracksNext(album!.list)} leftSection={<IconPlaylist size={14} />}>
                        Add to Queue
                    </Menu.Item>}
                    {type !== 'song' && <Menu.Item onClick={() => onClickCopyPlaylist(album)} leftSection={<IconHeart size={14} />}>
                        Save Playlist
                    </Menu.Item>}




                    {/* Below options for only tracks */}
                    {type === 'song' && !isPlayingSongBar
                        && <Menu.Item onClick={() => onClickAddTrackNext(song)} leftSection={<IconPlayerTrackNext size={14} />}>
                            Play Next
                        </Menu.Item>}

                    {type === 'song' && <Menu.Item onClick={openDrawer} leftSection={<IconPlaylist size={14} />}>
                        Add to Playlist
                    </Menu.Item>}

                    {type === 'song' && isPlayingSongBar && <Menu.Item onClick={() => onClickRemoveFromHere(song)} leftSection={<IconTrash size={14} />}>
                        Remove from {albumType}
                    </Menu.Item>}

                    {newFunction()}

                    {type === 'song'
                        && song?.more_info?.artistMap !== null && song?.more_info?.artistMap !== undefined
                        && song?.more_info?.artistMap?.artists !== null && song?.more_info?.artistMap?.artists !== undefined && song?.more_info?.artistMap?.artists.length > 0
                        && song!.more_info?.artistMap?.artists?.map((artist: any, index: number) => <Menu.Item key={index}
                            style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: 220, // adjust as needed
                            }}
                            onClick={() => seeArtistPage(artist)}
                            leftSection={<IconUser size={14} />}>
                            View {artist.name}
                        </Menu.Item>)}



                    {type !== 'song' && <Menu.Item onClick={() => handleShare()} leftSection={<IconShare size={14} />}>
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
                    <Paper shadow="xs" p="8" withBorder onClick={()=>showCreatePlaylistModal()}>
                        <Group justify="space-between">
                            <Group p={0}>
                                <ActionIcon variant="light" size={'xl'}>
                                    <IconPlus size={20} />
                                </ActionIcon>
                                <Text fw={600}>Create New Playlist</Text>
                            </Group>
                        </Group>
                    </Paper>

                    {playlists.map((playlist: any) => (
                        <Paper key={playlist.id} shadow="xs" p="5" withBorder onClick={() => onClickAddTo(playlist.id)}>
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

    function newFunction() {
        return type === 'song' && song?.more_info?.album !== null && song?.more_info?.album !== undefined
            && song?.more_info?.album_id !== null && song?.more_info?.album_id !== undefined ? <Menu.Item
                style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 220, // adjust as needed
                }}
                onClick={() => seeAlbumPage(song!.more_info!.album_id)}
                leftSection={<IconAlbum size={14} />}>
            View Album - {song!.more_info!.album}
        </Menu.Item>
            : type === 'song' && song?.album !== null && song?.album !== undefined
                && song?.album_id !== null && song?.album_id !== undefined ? <Menu.Item
                    style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: 220, // adjust as needed
                    }}
                    onClick={() => seeAlbumPage(song!.album_id)}
                    leftSection={<IconAlbum size={14} />}>
                View Album - {song!.album}
            </Menu.Item> : null;
    }
}