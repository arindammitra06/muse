import { SortableSongBar } from "@/components/SongBar/SortableSongBar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useSensors, useSensor, PointerSensor, DndContext, closestCenter, DragOverlay, TouchSensor } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Box, Drawer, rem, ActionIcon, Group, useMantineTheme } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { restrictToVerticalAxis, restrictToParentElement, restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers';

import { reorderPlaylist } from "@/store/slices/player.slice";
import { useState } from "react";

interface SortableSessionDrawerProps {
  drawerOpened: boolean;
  closeDrawer: () => void;
}

export default function SortableSessionDrawer({ drawerOpened, closeDrawer }: SortableSessionDrawerProps) {


  const dispatch = useAppDispatch();
  const { playlist, currentTrackIndex, isPlaying } = useAppSelector(s => s.player);
  const theme = useMantineTheme();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );
  
  if (!playlist) return <div>Playlist not found</div>;

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = playlist.findIndex(t => t.id === active.id);
    const newIndex = playlist.findIndex(t => t.id === over.id);
    dispatch(reorderPlaylist({ from: oldIndex, to: newIndex }));
  };




  return (

    <Box p="0">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}
        modifiers={[restrictToFirstScrollableAncestor, restrictToVerticalAxis]}>
        <SortableContext
          items={playlist.map(track => track.id)}
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
            {playlist.map((track, index) => (
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
      </DndContext>
    </Box>
  );
}
