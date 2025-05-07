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
    useSortable,
    arrayMove,
  } from '@dnd-kit/sortable';
  import { CSS } from '@dnd-kit/utilities';
  import { useAppDispatch, useAppSelector } from '@/store/hooks';
  import { reorderPlaylist } from '@/store/slices/player.slice';
import { SortableSongBar } from './SortableSongBar';
  
  export const PlaylistDndList = () => {
    const dispatch = useAppDispatch();
    const { playlist, currentTrackIndex, isPlaying } = useAppSelector(s => s.player);
  
    const sensors = useSensors(useSensor(PointerSensor));
  
    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = playlist.findIndex(track => track.id === active.id);
        const newIndex = playlist.findIndex(track => track.id === over.id);
        dispatch(reorderPlaylist({ from: oldIndex, to: newIndex }));
      }
    };
  
    return (
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={playlist.map(track => track.id)} strategy={verticalListSortingStrategy}>
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
    );
  };