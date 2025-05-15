import React from 'react';
import { Skeleton, Title, Group, Box, ScrollArea, useMantineTheme, Space } from '@mantine/core';
import { AppTitles } from '../Common/custom-title';


const HomePageSkeleton = () => {
    const theme = useMantineTheme();
    const renderCardSkeleton = (count: number) =>
        Array.from({ length: count }).map((_, index) => (
            <Box key={index} style={{ minWidth: 160 }}>
                <Skeleton height={160} radius="md" />
                <Skeleton height={12} mt="sm" width="80%" />
                <Skeleton height={10} mt={6} width="60%" />
            </Box>
        ));

    return (
        <div >
            
            {/* Trending Now */}
            <AppTitles title={'Trending Now'}/>
            <ScrollArea type="never" scrollbars="x" offsetScrollbars style={{paddingLeft: '12px'}}>
                <Group gap="md" wrap="nowrap">
                    {renderCardSkeleton(10)}
                </Group>
            </ScrollArea>
            <Space h={30}/>
            {/* Top Charts */}
            <AppTitles title={'Top Charts'}/>
            <ScrollArea type="never" scrollbars="x"  offsetScrollbars style={{paddingLeft: '12px'}}>
                <Group gap="md" wrap="nowrap">
                    {renderCardSkeleton(10)}
                </Group>
            </ScrollArea>
            <Space h={30}/>
            {/* New Releases */}
            <AppTitles title={'New Releases'}/>
            <ScrollArea type="never" scrollbars="x" offsetScrollbars style={{paddingLeft: '12px'}}>
                <Group gap="md" wrap="nowrap">
                    {renderCardSkeleton(10)}
                </Group>
            </ScrollArea>
            <Space h={30}/>
        </div>
    );
};

export default HomePageSkeleton;
