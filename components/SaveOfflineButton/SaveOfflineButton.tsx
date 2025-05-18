import { Tooltip, ActionIcon, Loader, Text, useMantineTheme } from '@mantine/core';
import { IconWifiOff } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';
import { saveOfflineTrack } from '@/store/slices/offlineTracks.slice';
import { modals } from '@mantine/modals';

const SaveOfflineButton = ({ song,  id, url }: {song:any, id: string, url: string }) => {
    const dispatch = useAppDispatch();
    const { downloaded, isSavingOffline } = useAppSelector((s) => s.offlineTracks);
    const theme = useMantineTheme();
    const isDownloaded = downloaded.some((track) => track.id === id);

    
    //   useEffect(() => {
    //     if (url) {
    //       dispatch(checkOfflineStatus(url));
    //     }
    //   }, [url, dispatch]);

    const handleClick = () => {
        if (!isDownloaded && !isSavingOffline) {
            modals.openConfirmModal({
                title: 'Save offline?',
                centered: true,
                children: (
                    <Text size="sm">
                        Do you want to save the track for offline playback?
                    </Text>
                ),
                labels: { confirm: 'Save', cancel: "No" },
                onCancel: () => console.log('Cancel'),
                onConfirm: () => dispatch(saveOfflineTrack({song:song, id: id, url: url })),
            });
        }
    };

    return (
        <Tooltip
            label={
                isDownloaded
                    ? 'Saved Offline'
                    : isSavingOffline
                        ? 'Saving...'
                        : 'Tap to save track Offline'
            }
        >
            <ActionIcon
                variant={isDownloaded ? 'filled' : 'subtle'}
                color={isDownloaded ? theme.colors[theme.primaryColor][6] : 'gray'}
                onClick={handleClick}
                disabled={isSavingOffline}
            >
                {isSavingOffline ? <Loader size={18} /> : <IconWifiOff size={20} />}
            </ActionIcon>
        </Tooltip>
    );
};

export default SaveOfflineButton;
