import { useAppSelector } from "@/store/hooks";
import { downloadFile } from "@/utils/fileutil";
import { getPreferredStreamingQualityUrl } from "@/utils/generic.utils";
import { ActionIcon } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";

interface DownloadButtonProps {
    song: any;
}

export const DownloadButton = ({ song }: DownloadButtonProps) => {
    const { downloadQuality } = useAppSelector((s) => s.settings);

    function downloadTheSong(e: any): void {
        e.stopPropagation();
        const newUrl = getPreferredStreamingQualityUrl(song.url!, downloadQuality)
        downloadFile(newUrl!==null && newUrl!==undefined  ? newUrl : song.url!, song.title!);
    }


    return (<ActionIcon variant="subtle" color="gray" onClick={(e) => downloadTheSong(e)}>
        <IconDownload size={20} />
    </ActionIcon>)
}