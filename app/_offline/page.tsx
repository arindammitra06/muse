import { Drawer, Stack, Button,Text } from "@mantine/core";
import { useAppSelector } from "@/store/hooks";
import { useDisclosure } from "@mantine/hooks";
import { RootState } from "@/store/store";
import SortableOfflineDrawer from "@/components/SongBar/SortableOfflineDrawer";

export default function OfflinePage() {
    const isOnline = useAppSelector((state: RootState) => state.network.isOnline);
    const { downloaded, isSavingOffline } = useAppSelector((s) => s.offlineTracks);
    const [drawerOfflineOpened, { open: openOfflineDrawer, close: closeOfflineDrawer },] = useDisclosure(false);



    return (
        <div style={{ padding: 32 }}>
            <Drawer
                opened={drawerOfflineOpened}
                onClose={closeOfflineDrawer}
                position="bottom"
                size="90%"
                withCloseButton
                padding="xs"
                radius="md"
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <Stack p={0}>
                        <SortableOfflineDrawer drawerOpened={drawerOfflineOpened} closeDrawer={closeOfflineDrawer} />
                    </Stack>
                </div>
            </Drawer>
            <Text size="xl" fw={700}>You're offline</Text>
            <Text mt="sm" c="dimmed">Connect to the internet to see latest playlists or songs.</Text>

            {downloaded.length > 0 && (
                <Button mt="xl" onClick={() => openOfflineDrawer()}>
                    Go to Offline Playlists
                </Button>
            )}
        </div>
    );
}