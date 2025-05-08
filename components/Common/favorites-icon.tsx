import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Track } from "@/store/slices/player.slice";
import { toggleFavorite } from "@/store/slices/playlist.slice";
import { Card, Group, ActionIcon } from "@mantine/core";
import { IconHeartFilled, IconHeart } from "@tabler/icons-react";


export function FavoriteButton({ song }: { song: Track }) {
    const dispatch = useAppDispatch();
    const favorites = useAppSelector((s) => s.playlist.userPlaylist.find((p) => p.id === 'favorites'));
    const isFavorited = favorites?.tracks.some((s) => s.id === song.id);

    return (<ActionIcon variant="light" color="white" radius="xl"
        c={isFavorited ? 'red' : 'gray'}
        onClick={() => dispatch(toggleFavorite(song))}>
        {isFavorited ? <IconHeartFilled size="1.2rem" /> : <IconHeart size="1.2rem" />}
    </ActionIcon>
    );
}