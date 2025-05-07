import { SimpleGrid, Title, useMantineTheme } from "@mantine/core";
import React from "react";
import '@mantine/carousel/styles.css';
import { SearchResultSongBar } from "./SearchResultSongBar";

export interface SearchedAlbumListProps {
    title: string;
    list: any[]
};


export default function SearchedAlbumList({ title, list }: SearchedAlbumListProps) {
    const theme = useMantineTheme();


    return (
        <SimpleGrid cols={1} spacing="xs" verticalSpacing="0">
            <Title order={4} c={theme.primaryColor} ml={'xs'} mt={'xs'} mb={'xs'}>
                {title}
            </Title>
            
            <div
                style={{
                    resize: 'horizontal',
                    overflow: 'hidden',
                    maxWidth: '100%',
                    minWidth: 250,
                }}>{
                        list !== null && list !== undefined && list.length > 0 && list.map((item, index) => (
                            <SearchResultSongBar key={index} idx={item.id} song={item} type={item.type}  />
                        ))
                    }
            </div>
        </SimpleGrid>
    );
}
