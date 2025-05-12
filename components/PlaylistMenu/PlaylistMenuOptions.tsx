import { Menu, ActionIcon } from "@mantine/core";
import { IconDotsVertical, IconPlaylist, IconAlbum, IconUser, IconShare, IconHeart } from "@tabler/icons-react";

interface PlaylistMenuOptionsProps {
    song: any;
    type: string;
}

export const PlaylistMenuOptions = ({ song, type }: PlaylistMenuOptionsProps) => {

    return (<Menu shadow="md" width={200}>
        <Menu.Target>
            <ActionIcon variant="subtle" color="gray" onClick={(e)=>  e.stopPropagation()}>
                <IconDotsVertical size={20} />
            </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
            {type!=='song' && <Menu.Item leftSection={<IconPlaylist size={14} />}>
                Add to Queue
            </Menu.Item>}
            {type!=='song' && <Menu.Item leftSection={<IconHeart size={14} />}>
                Save Playlist
            </Menu.Item>}


            {type==='song' && <Menu.Item leftSection={<IconPlaylist size={14} />}>
                Play Next
            </Menu.Item>}
            {type==='song' && <Menu.Item leftSection={<IconAlbum size={14} />}>
                View Album
            </Menu.Item>}
            {type==='song' && <Menu.Item leftSection={<IconUser size={14} />}>
                View Artist
            </Menu.Item>}
            {type==='song' && <Menu.Item leftSection={<IconShare size={14} />}>
                Share
            </Menu.Item>}
        </Menu.Dropdown>
    </Menu>)
}