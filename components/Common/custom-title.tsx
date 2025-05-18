import { Title, useMantineTheme } from "@mantine/core";
import { FC } from "react";

interface AppTitles {
    title: string;
    px : any;
}
export const AppTitles: FC<AppTitles> = ({ title, px }) => {
    const theme = useMantineTheme();
    
    return (<Title order={3} 
            c={theme.primaryColor} 
            mx={px} my={'xs'} 
            style={{fontFamily:'var(--font-ui)'}}>
                {title}
            </Title>)
};
