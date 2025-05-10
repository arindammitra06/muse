import { SimpleGrid, Flex, Title, useMantineTheme, rem } from "@mantine/core";
import { AlbumCard } from "../AlbumCard/AlbumCard";
import React from "react";
import { Carousel } from "@mantine/carousel";
import '@mantine/carousel/styles.css';
import { AppTitles } from "../Common/custom-title";
export interface AlbumListProps {
    name: string;
    subtitle: string;
    list: any[]
};


export default function AlbumList({ name, subtitle, list }: AlbumListProps) {
    const theme = useMantineTheme();
    const [selected, setSelected] = React.useState<string[]>([]);



    return (
        <SimpleGrid cols={1} spacing="xs" verticalSpacing="0">
            <AppTitles title={name} />
            <div
                style={{
                    resize: 'horizontal',
                    overflow: 'hidden',
                    maxWidth: '100%',
                    minWidth: 250,
                }}
            >
                <Carousel
                    dragFree
                    slideGap={rem(8)}      // 5px spacing
                    align="start"
                    slideSize="auto"       // Allow cards to size responsively
                    withControls
                    height="auto"
                >
                    {
                        list !== null && list !== undefined && list.length > 0 && list.map((item, index) => (
                            <Carousel.Slide key={index} style={{ width: 'min(40vw, 200px)' }} >
                                <AlbumCard
                                    key={index}
                                    image={item.image}
                                    title={item.title}
                                    subtitle={item.subtitle}
                                    type={item.type}
                                    id={item.id}
                                    song={item.type !== null && item.type !== undefined && item.type === 'song' ? item : undefined}
                                    year={item.year} />
                            </Carousel.Slide>
                        ))
                    }
                </Carousel>
            </div>
        </SimpleGrid>
    );
}
