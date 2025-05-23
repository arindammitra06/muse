import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/playlist.slice";
import { useSortable } from "@dnd-kit/sortable";
import { ActionIcon, Tooltip } from "@mantine/core";
import { IconHeartFilled, IconHeart } from "@tabler/icons-react";
import { MouseEvent } from "react";

interface FavoriteButtonProps {
    song: any;
    borderColor?: string;
}

export const FavoriteButton = ({ song, borderColor }: FavoriteButtonProps) => {
    const dispatch = useAppDispatch();
    const favorites = useAppSelector((s) => s.playlist.userPlaylist.find((p) => p.id === 'favorites'));
    const isFavorited = favorites?.tracks.some((s) => {
        if (song !== null && song !== undefined && s.id === song!.id) {
            return true;
        } else {
            return false;
        }
    });

    function favoriteTheSong(e: any): void {
        e.stopPropagation();
        dispatch(toggleFavorite(song))
    }

    return (<Tooltip label={'Favorite track'} position="right" transitionProps={{ duration: 0 }}><ActionIcon variant="subtle" color={isFavorited ? 'red' :
        borderColor !== null && borderColor !== undefined ? borderColor : 'gray'} onClick={(e) => favoriteTheSong(e)}>
        {isFavorited ? <IconHeartFilled size={20} /> : <IconHeart size={20} />}
    </ActionIcon></Tooltip>)
}