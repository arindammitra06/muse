import React from 'react';
import { Skeleton, Title, Group, Box, ScrollArea, useMantineTheme } from '@mantine/core';

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
        <div style={{padding: '12px'}}>
            
            {/* Trending Now */}
            <Title order={4} c={theme.primaryColor} ml={'0'} mt={'xs'} mb={'sm'}>
                Trending Now
            </Title>
            <ScrollArea type="never" scrollbars="x" offsetScrollbars>
                <Group gap="md" wrap="nowrap">
                    {renderCardSkeleton(8)}
                </Group>
            </ScrollArea>

            {/* Top Charts */}
            <Title order={4} c={theme.primaryColor} ml={'0'} mt={'xl'} mb={'sm'}>
                Top Charts
            </Title>
            <ScrollArea type="never" scrollbars="x"  offsetScrollbars>
                <Group gap="md" wrap="nowrap">
                    {renderCardSkeleton(8)}
                </Group>
            </ScrollArea>

            {/* New Releases */}
            <Title order={4} c={theme.primaryColor} ml={'0'} mt={'xl'} mb={'sm'}>
                New Releases
            </Title>
            <ScrollArea type="never" scrollbars="x" offsetScrollbars>
                <Group gap="md" wrap="nowrap">
                    {renderCardSkeleton(8)}
                </Group>
            </ScrollArea>
        </div>
    );
};

export default HomePageSkeleton;
