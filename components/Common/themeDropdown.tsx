import { useAppDispatch } from "@/store/hooks";
import { setCurrentTheme } from "@/store/slices/theme.slice";
import { staticThemes } from "@/theme";
import { useMantineTheme, Menu, ActionIcon, useStyles, Tooltip, Card, Group, SimpleGrid } from "@mantine/core";
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

 

    return (

        <Menu shadow="md" >
            <Menu.Target>
            <ActionIcon
                variant="subtle"
                size="md"
                aria-label="Toggle theme" >
                <IconPaletteFilled stroke={1.5} />
            </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                {staticThemes.map((eachTheme:any, index:number) => (
                    <Menu.Item p={1} key={index}
                        rightSection={<ThemeCard label={eachTheme.label} value={eachTheme.label} description={""} image={""} themeObj={eachTheme.theme} />} >
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

            <Card onClick={() => setThemeAndWait(themeObj)}

            withBorder shadow="sm" radius="md" mb={4} pl={10} pr={10} pt={0} pb={0}

            style={{ backgroundColor:  '#F5F7F8' , width:'100%', cursor:'pointer'}}>

           

            <Group>

                <SimpleGrid cols={7} ml={5} mt={4} mr={5} mb={5} spacing={3} p={0}>

                    {Object.keys(themeObj.colors).map((key, index) => {

                       

                        return (<div key={index} style={{
                            width: '8px', height: '20px',
                            border: `0.1px solid ${'#212121'}`,
                            borderRadius: '50px',
                            backgroundColor: themeObj.colors[key].length === 1 ? themeObj.colors[key][0] : themeObj.colors[key][5]

                        }}></div>)

                    })}

                </SimpleGrid>

            </Group>

        </Card>

       

        </Tooltip>

    )

};