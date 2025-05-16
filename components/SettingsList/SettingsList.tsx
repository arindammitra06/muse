import { Box, Paper, SimpleGrid, Stack, Switch, Text, useMantineTheme } from "@mantine/core";
import React, { ReactNode } from "react";

export interface SettingsListProps {
    title: string;
    subtitle?: string;
    rightElement: ReactNode;
    onClick?: () => void;
};


export default function SettingsList({ title, subtitle, rightElement , onClick}: SettingsListProps) {
    const theme = useMantineTheme();
    
    const handleClick = () => {
        onClick?.(); // Only calls onClick if it's defined
      };

    return (
        <Box
            onClick={handleClick}
            p="xs"
            mb={'0'}
            mx={'0'}
            h={60}
            style={{
                borderRadius: theme.radius.md,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                //border: '0.5px solid gray'
              }}
            >
            <Stack gap={0}>
                <Text size="md" fw={600}>
                    {title}
                </Text>
                <Text size="xs" c="dimmed">
                    {subtitle}
                </Text>
            </Stack>
            {rightElement}
        </Box>
    );
}
