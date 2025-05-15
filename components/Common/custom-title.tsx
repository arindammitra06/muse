import { Title, useMantineTheme } from "@mantine/core";
import { FC } from "react";

interface AppTitles {
    title: string;
}
export const AppTitles: FC<AppTitles> = ({ title }) => {
    const theme = useMantineTheme();
    
    return (<Title order={3} 
            c={theme.primaryColor} 
            mx={'sm'} my={'xs'} 
            style={{fontFamily:'var(--font-ui)'}}>
                {title}
            </Title>)
};
