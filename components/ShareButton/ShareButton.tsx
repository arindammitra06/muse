import { ActionIcon, Tooltip } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { IconShare } from "@tabler/icons-react";

interface ShareButtonProps {
    url: any;
    title: any;
}

export const ShareButton = ({ url, title }: ShareButtonProps) => {
    const clipboard = useClipboard({ timeout: 2000 });

    const handleShare = async () => {
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    url,
                });
            } catch (err) {
                console.error('Share failed:', err);
            }
        } else {
            clipboard.copy(url); // fallback
        }
    };





    return (<Tooltip label={clipboard.copied ? 'Copied!' : 'Copy URL'}>
        <ActionIcon variant="subtle" color={'gray'} onClick={(e) => handleShare()}>
            <IconShare size={20} />
        </ActionIcon></Tooltip>)
}