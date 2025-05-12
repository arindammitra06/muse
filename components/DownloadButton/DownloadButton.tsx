import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getSongFromToken } from "@/store/slices/jio.slice";
import { downloadFile } from "@/utils/fileutil";
import { formatSongsResponse, getLastSectionOfUrl, getPreferredStreamingQualityUrl } from "@/utils/generic.utils";
import { ActionIcon } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";

interface DownloadButtonProps {
    song: any;
}

export const DownloadButton = ({ song }: DownloadButtonProps) => {
    const { downloadQuality } = useAppSelector((s) => s.settings);
    const dispatch = useAppDispatch();
  
    function downloadTheSong(e: any): void {
        e.stopPropagation();
       
        if(song !== null && song !== undefined && song.url!==null && song.url!==undefined){
            const newUrl = getPreferredStreamingQualityUrl(song.url!, downloadQuality)
            downloadFile(newUrl!==null && newUrl!==undefined  ? newUrl : song.url!, song.title!);
        }else{
            if (song !== null && song !== undefined && song.perma_url !== null && song.perma_url !== undefined) {
                let token = getLastSectionOfUrl(song.perma_url);
    
                if (token !== null && token !== undefined && token !== '') {
                    dispatch(getSongFromToken({ token: token, type: song.type })).then(async (res: any) => {
                        if (res.payload !== null && res.payload !== undefined) {
    
                            let songsList = res.payload['songs'];
                            
                            if (songsList !== null && songsList !== undefined && songsList.length > 0) {
                                const songFetched = await formatSongsResponse(songsList, song.type);
                                
                                if(songFetched!==null && songFetched!==undefined){
                                    const newUrl = getPreferredStreamingQualityUrl(songFetched[0].url!, downloadQuality)
                                    downloadFile(newUrl!==null && newUrl!==undefined  ? newUrl : song.url!, song.title!);
                                }
                            }
                        }
                    });;
                }
            }
        }
        
        
    }


    return (<ActionIcon variant="subtle" color="gray" onClick={(e) => downloadTheSong(e)}>
        <IconDownload size={20} />
    </ActionIcon>)
}