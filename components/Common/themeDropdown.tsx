import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrentTheme } from "@/store/slices/theme.slice";
import { staticThemes } from "@/theme";
import { useMantineTheme, Menu, ActionIcon, useStyles, Tooltip, Card, Group, SimpleGrid, ColorSwatch, CheckIcon } from "@mantine/core";
import { IconPalette, IconPaletteFilled } from "@tabler/icons-react";
import { FC, forwardRef } from "react";





export type ThemeCardProps = {

    label: string,

    value: string,

    description: string,

    image: string,

    themeObj: any,

};




const SelectItem = forwardRef<HTMLDivElement, ThemeCardProps>(

    ({ label, value, image, description, themeObj, ...others }: ThemeCardProps, ref) => (

        <ThemeCard
            label={label} value={value}
            themeObj={themeObj}
            image={""} description={""} />

    )

);



export function ThemeDropdown() {

    const theme = useMantineTheme();
    const dispatch = useAppDispatch();
    const themeSelected = useAppSelector((state) => state.theme);

    function setThemeAndWait(themeObj: any): void {
        dispatch(setCurrentTheme({ theme: themeObj }));

    }



    return (

        <Menu shadow="md" >
            <Menu.Target>
                <ActionIcon
                    variant="default"
                    size="md"
                    aria-label="Toggle theme" >
                    <IconPalette stroke={1.5} />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown data-mantine-focus-auto="false">
                {staticThemes.map((eachTheme: any, index: number) => (
                    <Menu.Item key={index}
                        onClick={() => setThemeAndWait(eachTheme.theme)}
                        leftSection={<SimpleGrid cols={2}>
                            <ColorSwatch color={eachTheme.theme.colors[eachTheme.theme.primaryColor][5]} >P</ColorSwatch>
                            <ColorSwatch color={eachTheme.theme.colors.secondary[7]} >S</ColorSwatch>
                        </SimpleGrid>} >
                        {eachTheme.label}
                    </Menu.Item>
                ))}

            </Menu.Dropdown>

        </Menu>



    );

}



export const ThemeCard: FC<ThemeCardProps> = ({ label, image, value, description, themeObj }) => {

    const dispatch = useAppDispatch();


    function setThemeAndWait(themeObj: any): void {
        dispatch(setCurrentTheme({ theme: themeObj }));

    }



    return (

        <Tooltip label={label}>
            <div onClick={() => setThemeAndWait(themeObj)} style={{
                width: '50px',
                height: '20px',
                border: `0.1px solid ${'#212121'}`,
                marginBottom: '10px',
                borderRadius: '2px',
                backgroundColor: themeObj.primaryColor
            }}>

            </div>
        </Tooltip>

    )

};