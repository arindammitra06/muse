import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setPrimaryColor } from "@/store/slices/theme.slice";
import { RootState } from "@/store/store";
import { generateMantineColorSwatch } from "@/utils/generic.utils";
import { useMantineTheme, Menu, ActionIcon, useStyles, Tooltip, Card, Group, SimpleGrid, ColorSwatch, CheckIcon, ColorPicker, HoverCard } from "@mantine/core";
import { IconPalette, IconPaletteFilled } from "@tabler/icons-react";
import { FC, forwardRef, MouseEvent } from "react";
import { useSelector } from "react-redux";





export function ThemeDropdown() {

    const theme = useMantineTheme();
    const dispatch = useAppDispatch();
    const primaryColor = useSelector((state: RootState) => state.theme.primaryColor);


    function setColorSelection(color: any): void {
        if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
            dispatch(setPrimaryColor(color));
        } else {
            alert('Please select a valid hex color');
        }
    }



    return (
        <Group justify="center">
            <HoverCard width={280} shadow="md">
                <HoverCard.Target>
                    <ActionIcon
                        variant="default"
                        size="md"
                        aria-label="Toggle Colors" >
                        <IconPalette stroke={1.5} />
                    </ActionIcon>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                    <ColorPicker
                        swatchesPerRow={8}
                        format="hex"
                        value={primaryColor}
                        onChange={(color) => setColorSelection(color)}
                        swatches={['#fa5252', '#e64980', '#be4bdb', '#9b5de5', '#7950f2',
                            '#3a0ca3', '#228be6', '#15aabf', '#12b886', '#40c057',
                            "#780000", "#1121f", "#f73c87", "#003049", "#669bbc",
                            "#7c6a0a", "#babd8d", "#ffdac6", "#ff9770", "#eb6424",
                            '#d7263d', '#ffd60a', '#1b998b', '#c5d86d']}
                    />
                </HoverCard.Dropdown>
            </HoverCard>
        </Group>




    );

}


