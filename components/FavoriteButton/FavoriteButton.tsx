import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/playlist.slice";
import { useSortable } from "@dnd-kit/sortable";
import { ActionIcon } from "@mantine/core";
import { IconHeartFilled, IconHeart } from "@tabler/icons-react";
import { MouseEvent } from "react";

interface FavoriteButtonProps {
    song: any;
}

export const FavoriteButton = ({ song }: FavoriteButtonProps) => {
    const dispatch = useAppDispatch();
    const favorites = useAppSelector((s) => s.playlist.userPlaylist.find((p) => p.id === 'favorites'));
    const isFavorited = favorites?.tracks.some((s) => {
        if(song!==null && song!==undefined && s.id === song!.id){
            return true;
        }else{
            return false;
        }
    });


    function favoriteTheSong(e: any): void {
        e.stopPropagation();
        dispatch(toggleFavorite(song))
    }

    return (<ActionIcon variant="subtle" color={isFavorited ? 'red' : 'gray'} onClick={(e) => favoriteTheSong(e)}>
                {isFavorited ? <IconHeartFilled size={20} /> : <IconHeart size={20} />}
            </ActionIcon>)
}