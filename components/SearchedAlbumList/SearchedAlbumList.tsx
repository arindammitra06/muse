import { Button, Flex, SimpleGrid, Title, useMantineTheme } from "@mantine/core";
import React from "react";
import '@mantine/carousel/styles.css';
import { SearchResultSongBar } from "./SearchResultSongBar";
import { IconChevronRight } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export interface SearchedAlbumListProps {
    title: string;
    type: string;
    query: string;
    list: any[]
};


export default function SearchedAlbumList({ title, list, type, query }: SearchedAlbumListProps) {
    const theme = useMantineTheme();
    const router = useRouter();
    
    return (
        <SimpleGrid cols={1} spacing="xs" verticalSpacing="0">


            <Flex justify="space-between" align="center" w="100%">
                <Title style={{ fontFamily: 'var(--font-ui)' }} 
                    order={4} c={title === 'Top Result' ? 'gray' : theme.primaryColor} ml={'xs'} mt={'xs'} mb={'xs'}>
                    {title}
                </Title>
                {title !== 'Top Result' && <Button
                    size="xs"
                    variant="transparent"
                    rightSection={<IconChevronRight size={16} />}
                    radius="md"
                    color={'gray'}
                    onClick={() => router.push(`/search/fetch/${type}/${query}`)}>
                    View All
                </Button>}
            </Flex>

            <div
                style={{
                    resize: 'horizontal',
                    overflow: 'hidden',
                    maxWidth: '100%',
                    minWidth: 250,
                }}>{
                    list !== null && list !== undefined && list.length > 0 && list.map((item, index) => (
                        <SearchResultSongBar key={index} idx={item.id} song={item} 
                                        type={item.type} title={title} 
                                        perma_url={item.perma_url}  />
                    ))
                }
            </div>
        </SimpleGrid>
    );
}
