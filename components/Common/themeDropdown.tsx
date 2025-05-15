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
                        format="hex"
                        value={primaryColor}
                        onChange={(color) => setColorSelection(color)}
                        swatches={['#272640', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14',]}
                    />
                </HoverCard.Dropdown>
            </HoverCard>
        </Group>




    );

}


