import { SortableSongBar } from "@/components/SongBar/SortableSongBar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useSensors, useSensor, PointerSensor, DndContext, closestCenter, TouchSensor } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Box, useMantineTheme,Text } from "@mantine/core";
import { restrictToVerticalAxis, restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers';

import { updateDownloadedOrder } from "@/store/slices/offlineTracks.slice";

interface SortableSessionDrawerProps {
  drawerOpened: boolean;
  closeDrawer: () => void;
}

export default function SortableOfflineDrawer({ drawerOpened, closeDrawer }: SortableSessionDrawerProps) {


  const dispatch = useAppDispatch();
  const { downloaded } = useAppSelector(s => s.offlineTracks);
  const theme = useMantineTheme();
  const { playlist, currentTrackIndex, isPlaying } = useAppSelector(s => s.player);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  if (!downloaded) return <div>No tracks saved for offline listening</div>;

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const downloaded = useAppSelector((state) => state.offlineTracks.downloaded);
    const dispatch = useAppDispatch();

    const oldIndex = downloaded.findIndex((t) => t.id === active.id);
    const newIndex = downloaded.findIndex((t) => t.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedTracks = arrayMove(downloaded, oldIndex, newIndex);
    dispatch(updateDownloadedOrder(reorderedTracks));
  };




  return (

    <Box p="0">
      {downloaded!==null && downloaded!==undefined && downloaded.length>0 ? <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}
        modifiers={[restrictToFirstScrollableAncestor, restrictToVerticalAxis]}>
        <SortableContext
          items={downloaded.map((track: { id: any; }) => track.id)}
          strategy={verticalListSortingStrategy}
        >
          <Box
            style={{
              overflowY: 'auto',
              overscrollBehavior: 'contain',
              touchAction: 'pan-y',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {downloaded.map((track: { id: any; type: any; }, index: any) => (
              <SortableSongBar key={track.id}
                id={track.id}
                song={track}
                type={track.type}
                isPlaying={isPlaying}
                isPlayingSongBar={true}
                albumType={'session'}
                playlistId={''}
                currentPlayingTrack={playlist[currentTrackIndex]}
                onClickOverride={() => {/* restart playback */ }} />
            ))}
          </Box>
        </SortableContext>
      </DndContext> : 
      <Text ta={'center'} size="sm" fw={500} c="dimmed">No Offline Tracks</Text>}
    </Box>
  );
}

