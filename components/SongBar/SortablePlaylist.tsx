import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { reorderPlaylist } from '@/store/slices/player.slice';
import { SortableSongBar } from './SortableSongBar';
import { Box } from '@mantine/core';

export const PlaylistDndList = () => {
  const dispatch = useAppDispatch();
  const { playlist, currentTrackIndex, isPlaying } = useAppSelector(s => s.player);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // user must move 8px before drag starts
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = playlist.findIndex(track => track.id === active.id);
      const newIndex = playlist.findIndex(track => track.id === over.id);
      dispatch(reorderPlaylist({ from: oldIndex, to: newIndex }));
    }
  };

  return (
    <Box style={{ touchAction: 'none' }}> {/* prevents scroll during drag on mobile */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={playlist.map(track => track.id)}
          strategy={verticalListSortingStrategy}
        >
          {playlist.map((song, idx) => (
            <SortableSongBar
              key={song.id}
              idx={idx}
              song={song}
              type={song.type}
              isPlaying={isPlaying}
              currentPlayingTrack={playlist[currentTrackIndex]}
              onClickOverride={() => {/* restart playback */}}
            />
          ))}
        </SortableContext>
      </DndContext>
    </Box>
  );
};
